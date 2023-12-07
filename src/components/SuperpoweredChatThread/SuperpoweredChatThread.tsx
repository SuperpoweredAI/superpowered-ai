import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lucario } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { BiCopy } from 'react-icons/bi';
import { IconContext } from 'react-icons';

import ChatInput from '../general/ChatInput';
import LoadingSpinner from '../general/LoadingSpinner';

import { formatChatThread, breakResponseIntoChunks, formatSources } from '../../logic/chat';
import {
    getChatThreadResponse, pollChatResponse, createChatThread, getChatThreadInteractions
} from '../../services/chat';

import './SuperpoweredChatThread.css';
import '../../styles/generalStyles.css';

interface SuperpoweredChatThread {
    apiKey: string;
    apiSecret: string;
    darkMode: boolean;
    threadId: string | null;
    chatConfig: ChatConfig;
    initialMessage: string;
    placeholderText: string;
}

interface ChatConfig {
    model: string;
    knowledgeBaseIds: string[];
    systemMessage: string;
    targetSegmentLength: string;
    temperature: number;
    useRSE: boolean;
    responseLength: string;
}

interface Source {
    document: {
        title: string;
    };
    title: string;
}

interface ChatHistory {
    id: string;
    prefix: string;
    content: string;
    sources: Source[];
    searchQueries: string[];
    searchResults: string[];
}

interface ChatMessageObject {
    id: string;
}

const SuperpoweredChatThread: React.FC<SuperpoweredChatThread> = ({
    apiKey, apiSecret, darkMode, threadId, chatConfig, initialMessage, placeholderText
}) => {

    const theme = darkMode ? "dark" : "light";

    const chatContainerRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [showThinkingDots, setShowThinkingDots] = useState(false);
    const [disableAutoScroll, setDisableAutoScroll] = useState(false);

    const [chatMessages, setChatMessages] = useState([] as ChatHistory[]);
    const [topMessageId, setTopMessageId] = useState<string | null>(null);
    const [chatThreadId, setChatThreadId] = useState(threadId);
    const [nextPageToken, setNextPageToken] = useState("");

    const authToken = btoa(unescape(encodeURIComponent(`${apiKey}:${apiSecret}`)));

    type MessageRefs = Record<string, React.RefObject<HTMLElement>>;
    const messageRefs: MessageRefs = chatMessages.reduce((acc: MessageRefs, message: ChatMessageObject) => {
        acc[message.id] = React.createRef();
        return acc;
    }, {} as MessageRefs); // Cast the initial value to MessageRefs type

    async function requestChatInteractions(chatThreadId: string) {
        const [interactions, status] = await getChatThreadInteractions(authToken, chatThreadId);
        if (status === 200) {
            // Update the next page token
            setNextPageToken(interactions.next_page_token);

            // Set the chat messages to the current thread's messages
            let formattedChatMessages = formatChatThread(interactions);

            if (initialMessage !== undefined && initialMessage !== null && initialMessage !== "" && interactions.next_page_token == null) {
                // Set the initial message
                const initialMessages = {
                    prefix: "ai",
                    content: initialMessage,
                    sources: [],
                    searchQueries: [],
                    searchResults: [],
                    id: `ai_0000000000`
                };
                formattedChatMessages.unshift(initialMessages)
            }

            // Set the chat messages to the current thread's messages
            setChatMessages(formattedChatMessages);
        } else {
            alert("Error getting chat interactions");
        }
    }

    async function requestMoreChats() {
        setIsLoading(true);
        setDisableAutoScroll(true);
        // Request the next page of chat interactions
        const [interactions, status] = await getChatThreadInteractions(
            authToken, chatThreadId, nextPageToken
        );
        if (status === 200) {
            console.log("status", status)
            console.log("interactions", interactions)

            // Format the chat messages
            const newChatMessages = formatChatThread(interactions);
            console.log("newChatMessages", newChatMessages)
            console.log("all chat messages", newChatMessages.concat(chatMessages))

            // Update the chat messages. The new ones need to be added to the beginning of the array
            setChatMessages(newChatMessages.concat(chatMessages));

            let newNextPageToken = interactions.next_page_token;
            setNextPageToken(newNextPageToken);
            setDisableAutoScroll(true);
            setIsLoading(false);
        } else {
            setDisableAutoScroll(true);
            setIsLoading(false);
            alert("Error getting chat history");
        }

    }

    async function createNewChatThread() {
        setIsLoading(true);
        const knowledgeBaseIds = chatConfig.knowledgeBaseIds == undefined ? [] : chatConfig.knowledgeBaseIds;
        const [resData, status] = await createChatThread(authToken, knowledgeBaseIds)
        if (status === 200) {
            setChatThreadId(resData.id);
        } else {
            //TODO: Handle error
            // This probably means the api key and/or secret aren't valid
        }
        setIsLoading(false);
    }


    async function sendMessage(message: string) {

        const knowledgeBaseIds = chatConfig.knowledgeBaseIds == undefined ? [] : chatConfig.knowledgeBaseIds;
        const model = chatConfig.model == undefined ? "gpt-4" : chatConfig.model
        const temperature = chatConfig.temperature == undefined ? 0 : chatConfig.temperature;
        const systemMessage = chatConfig.systemMessage == undefined ? "" : chatConfig.systemMessage;
        const useRSE = chatConfig.useRSE == undefined ? true : chatConfig.useRSE;
        const targetSegmentLength = chatConfig.targetSegmentLength == undefined ? "medium" : chatConfig.targetSegmentLength;
        const responseLength = chatConfig.responseLength == undefined ? "short" : chatConfig.responseLength;

        setShowThinkingDots(true)

        // Update the redux store
        let maxID = "0000000000"
        if (chatMessages !== undefined && chatMessages.length > 0) {
            maxID = chatMessages[chatMessages.length - 1]["id"];
        }
        console.log("maxID", maxID)
        console.log("maxID+1", maxID + 1)
        const newID = (parseInt(maxID) + 1).toString().padStart(10, "0");

        // Update the chat messages in the state variable (only if the status is 200)
        let newMessages = [] as ChatHistory[];
        newMessages = [...(chatMessages || []), { prefix: "user", content: message, sources: [], id: `user_${newID}` }];

        console.log("newMessages", newMessages)
        setChatMessages(newMessages);
        const [resData, status] = await getChatThreadResponse(
            authToken, chatThreadId, message, knowledgeBaseIds, model, temperature,
            systemMessage, useRSE, targetSegmentLength, responseLength
        );

        console.log("resData", resData)
        console.log("status", status)

        if (status === 202) {

            let responseStatus = resData["status"];
            const pollURL = resData["status_url"];
            console.log("pollURL", pollURL)

            let pollCount = 0;
            let modelResponseText = "";
            while (responseStatus !== "COMPLETE" && pollCount < 200) {
                let [resData, status] = await pollChatResponse(
                    authToken, pollURL
                );
                responseStatus = resData["status"];

                // Check for a status of FAILED
                if (responseStatus === "FAILED") {
                    break;
                }
                pollCount += 1;
                console.log("pollCount", pollCount)

                let newChatMessagesWithAiResponse = [...newMessages];
                // Update the message if the status is IN_PROGRESS, and there is a model response
                if (resData["response"]["interaction"]["model_response"] !== null && resData["response"]["interaction"]["model_response"]["content"] !== null) {
                    const modelResponse = resData["response"]["interaction"]["model_response"]["content"];

                    let chunks = breakResponseIntoChunks(modelResponseText, modelResponse)
                    if (chunks.length > 0) {

                        const sleepTime = (model == 'gpt-4' ? 500 : 250) / chunks.length;

                        setShowThinkingDots(false);

                        for (let i = 0; i < chunks.length; i++) {

                            // update the chat thread with the AI response in the state variable
                            const newAiResponse = {
                                prefix: "ai",
                                content: modelResponseText + chunks[i],
                                sources: [], // Don't show the sources yet
                                searchResults: [],
                                searchQueries: [],
                            };
                            // newChatMessages won't get updated in this loop. It is a constant, not a state variable
                            const newChatMessagesWithAiResponse = [...newMessages, newAiResponse];
                            setChatMessages(newChatMessagesWithAiResponse);
                            modelResponseText += chunks[i];

                            await new Promise(r => setTimeout(r, sleepTime));
                        }

                    }

                }

                if (responseStatus === "COMPLETE") {

                    // Update the sources
                    const sources = formatSources(
                        resData["response"]["interaction"]["references"], resData["response"]["interaction"]["ranked_results"]
                    );

                    const newAiResponse = {
                        prefix: "ai",
                        content: resData["response"]["interaction"]["model_response"]["content"],
                        sources: sources,
                        searchResults: resData["response"]["interaction"]["ranked_results"],
                        searchQueries: resData["response"]["interaction"]["search_queries"],
                        id: `ai_${resData["response"]["interaction"]["id"]}`
                    };
                    newChatMessagesWithAiResponse = [...newMessages, newAiResponse];
                    //sessionStorage.setItem('superpoweredChatbotMessages', JSON.stringify(newChatMessagesWithAiResponse));
                    break;
                }
                // Sleep for 0.25 seconds
                if (resData["response"]["interaction"]["model_response"] == null || resData["response"]["interaction"]["model_response"]["content"] == null) {
                    await new Promise(r => setTimeout(r, 500));
                }
            }

        } else {
            //TODO: Handle error
            setShowThinkingDots(false)
        }
    }


    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const intersectingEntries = entries.filter(entry => entry.isIntersecting);

            if (intersectingEntries.length > 0) {
                const topEntry = intersectingEntries.reduce((top, entry) => (entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top));
                setTopMessageId(topEntry.target.id);
            }
        }, {
            root: chatContainerRef.current,
            threshold: 1.0
        });

        Object.values(messageRefs).forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            Object.values(messageRefs).forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [chatMessages]);


    useEffect(() => {
        setChatThreadId(chatThreadId);
        if (chatThreadId === null || chatThreadId === "") {
            createNewChatThread()
        } else {
            // When the chat thread changes, request the interactions for this thread
            requestChatInteractions(chatThreadId);
        }
    }, [chatThreadId])

    useEffect(() => {
        //console.log(chatContainerRef.current && !disableAutoScroll)
        if (chatContainerRef.current && !disableAutoScroll) {
            const { scrollHeight } = chatContainerRef.current;
            chatContainerRef.current.scrollTop = scrollHeight + 100;
        } else if (chatContainerRef.current && disableAutoScroll) {
            // This is the case when someone clicks View previous chats
            // We only want to scroll to the top of the previous chats
            chatContainerRef.current.scrollTop = messageRefs[topMessageId].current.offsetTop - 100;
        }
    }, [chatMessages, showThinkingDots, chatContainerRef])


    return (

        <div className={`chat-main-section-${theme}`}>
            {isLoading && <LoadingSpinner />}
            <div className={`chat-main-container`}>
                <div className="chat-messages-container" ref={chatContainerRef}>
                    {(nextPageToken !== null && nextPageToken !== "") &&
                        <div className="view-previous-chats-container">
                            <p className={`view-previous-chats-text-${theme}`} onClick={() => requestMoreChats()}>
                                View previous chats
                            </p>
                        </div>
                    }

                    {chatMessages.map((chatMessage, index) =>
                        <div id={chatMessage["id"]} key={index} ref={messageRefs[chatMessage.id]}>
                            <ChatBox
                                theme={theme}
                                aiOrUserMessage={chatMessage["prefix"]}
                                message={chatMessage["content"]}
                                sources={chatMessage["sources"]}
                                searchQueries={chatMessage["searchQueries"]}
                                onSourceClick={(source) => console.log(source)}
                                showQueriesAndResultsModal={(sources, source) => console.log("showQueriesAndResultsModal", sources, source)}
                            />
                        </div>
                    )}

                    {showThinkingDots && <div className={`chat-message-container-${theme} ai-chat-message-container-${theme}`}>
                        <div style={{ maxWidth: "850px", margin: "auto", width: "100%" }}>
                            <ThinkingChatMessage isVisible={showThinkingDots} />
                        </div>
                    </div>}

                </div>

                <div className={`chat-send-message-container`}>
                    <ChatInput
                        sendMessage={(message) => sendMessage(message)}
                        placeholderText={placeholderText}
                        theme={theme}
                        size={"large"}
                    />
                </div>

            </div>
        </div>
    )

}


SuperpoweredChatThread.defaultProps = {
    apiKey: "",
    apiSecret: "",
    darkMode: false,
    initialMessage: "Hello, how can I help you?",
    placeholderText: "Type a message",
    chatConfig: {
        model: "gpt-4",
        knowledgeBaseIds: [],
        useRSE: true,
        temperature: 0.1,
        targetSegmentLength: "medium",
        systemMessage: "",
        responseLength: "medium",
    },
}


interface ThinkingChatMessageProps {
    isVisible: boolean;
}

export const ThinkingChatMessage: React.FC<ThinkingChatMessageProps> = ({ isVisible }) => {
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        let dots = 0;
        const intervalId = setInterval(() => {
            dots = (dots + 1) % 4;
            const newMessage = `${'.'.repeat(dots)}`;
            setMessage(newMessage)
        }, 250);
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [])

    if (!isVisible) {
        return (
            <div></div>
        )
    } else {
        return (
            <div className="superpowered-thinking-chat-message">
                <p className="superpowered-thinking-dots">{message}</p>
            </div>
        )
    }
}


const ChatBox = ({ aiOrUserMessage, message, onSourceClick, sources, searchQueries, showQueriesAndResultsModal, theme }) => {
    // aiOrUserMessage is either "ai" or "user"

    const [showCopiedText, setShowCopiedText] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [copyText, setCopyText] = useState("");

    function copyMessageText() {
        // Copy the text to clipboard
        navigator.clipboard.writeText(message);

        // Show the copied text for 3 seconds
        setShowCopiedMessage(true);
        setTimeout(() => {
            setShowCopiedMessage(false);
        }, 3000);
    }

    function getMarkdownText(children) {

        navigator.clipboard.writeText(children[0]);
        setCopyText(children[0])

        // Show the copied text for 2 seconds
        setShowCopiedText(true);
        setTimeout(() => {
            setShowCopiedText(false);
        }, 3000);

    }

    return (

        <div className={`chat-message-container-${theme} ${aiOrUserMessage}-chat-message-container-${theme}`}>
            <div className="chat-message-header-container">
                <p className="chat-message-header-text">
                    {aiOrUserMessage === "ai" ? "AI" : "USER"}
                </p>
                <div onClick={() => copyMessageText()}>
                    {showCopiedMessage && <p className={`medium-font-${theme}`}>copied</p>}
                    {(!showCopiedMessage && aiOrUserMessage === "ai") &&
                        <IconContext.Provider
                            value={{ className: `copy-text-icon-${theme}` }}>
                            <div>
                                <BiCopy />
                            </div>
                        </IconContext.Provider>
                    }
                </div>
            </div>

            <div className="chat-message-content-container">

                <ReactMarkdown
                    children={message}
                    className={`chat-message-text-${theme}`}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <div>

                                    <div className={`copy-markdown-icon`}
                                        onClick={() => getMarkdownText(children)}>

                                        {(showCopiedText && copyText === children[0]) ?
                                            <p className="copied-text">copied</p>
                                            :
                                            <IconContext.Provider
                                                value={{
                                                    size: "20px",
                                                    color: "#e8e8e8",
                                                }}>
                                                <div>
                                                    <BiCopy />
                                                </div>
                                            </IconContext.Provider>
                                        }
                                    </div>
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                        style={lucario}
                                        customStyle={{ fontSize: "14px" }}
                                        PreTag="div"
                                        {...props}
                                    />
                                </div>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                />

                {sources.length > 0 &&
                    <div className="sources-container">
                        <div className="sources-col">
                            <p className={`semi-bold-font-${theme}`} style={{ fontSize: "16px" }}>
                                Sources
                            </p>
                        </div>
                        <div className="sources-col">
                            {sources.map((source, index) =>
                                <div key={index} className="source-row" onClick={() => showQueriesAndResultsModal(sources, source)}>
                                    <p className={`source-text-${theme}`}>{source["title"]}</p>
                                </div>
                            )}
                        </div>
                    </div>
                }

            </div>

        </div>
    )

}



export default SuperpoweredChatThread;