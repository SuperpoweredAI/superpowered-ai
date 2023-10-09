import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';

import { BiChat, BiMinus } from 'react-icons/bi';
import { IconContext } from 'react-icons';

import { getChatThreadResponse, createChatThread } from '../../services/chat';

import './SuperpoweredChatbot.css';


interface SuperpoweredChatbot {
    apiKey: string;
    apiSecret: string;
    style: any;
    headerLogo: any,
    headerText: string,
    placeholderText: string,
    initialMessage: string,
    chatConfig: any,
}

interface MessageInterace {
    aiOrUser: string;
    content: string;
}

const SuperpoweredChatbot: React.FC<SuperpoweredChatbot> = ({ apiKey, apiSecret, style, headerLogo, headerText, placeholderText, initialMessage, chatConfig }) => {

    let maxContainerHeight = "90vh"
    if (style.chatContainerStyle.maxHeight !== undefined) {
        maxContainerHeight = style.chatContainerStyle.maxHeight;
    }

    const messageRef = useRef<HTMLDivElement>(null);

    const authToken = btoa(unescape(encodeURIComponent(`${apiKey}:${apiSecret}`)));

    // Pull the isShown from session storage. If it doesn't exist, set it to false
    // This is used to determine whether or not the chatbot should be shown initially
    const savedIsShown = sessionStorage.getItem('superpoweredChatbotIsShown');
    const [isShown, setIsShown] = useState(savedIsShown == null ? false : savedIsShown === 'true');

    // Pull the messages from session storage
    const savedMessages = sessionStorage.getItem('superpoweredChatbotMessages');
    const savedMessagesArray = savedMessages == null ? [] : JSON.parse(savedMessages);
    const [messages, setMessages] = useState(savedMessagesArray);

    const [chatThreadId, setChatThreadId] = useState("");
    const [showThinkingDots, setShowThinkingDots] = useState(false);

    async function sendMessage(message: string) {

        const knowledgeBaseIds = chatConfig.knowledgeBaseIds == undefined ? [] : chatConfig.knowledgeBaseIds;
        const model = chatConfig.model == undefined ? "gpt-3.5-turbo" : chatConfig.model;
        const temperature = chatConfig.temperature == undefined ? 0 : chatConfig.temperature;
        const systemMessage = chatConfig.systemMessage == undefined ? "" : chatConfig.systemMessage;
        const useRSE = chatConfig.useRSE == undefined ? true : chatConfig.useRSE;
        const targetSegmentLength = chatConfig.targetSegmentLength == undefined ? "medium" : chatConfig.targetSegmentLength;

        setShowThinkingDots(true)
        // Add the message to the messages list
        let newMessages = [...(messages || []), { aiOrUser: "user", content: message }];
        setMessages(newMessages);
        sessionStorage.setItem('superpoweredChatbotMessages', JSON.stringify(newMessages));
        const [resData, status] = await getChatThreadResponse(
            authToken, chatThreadId, message, knowledgeBaseIds, model, temperature, systemMessage, useRSE, targetSegmentLength
        );
        setShowThinkingDots(false)
        if (status === 200) {
            // Add the response to the messages list
            let newMessagesWithAiResponse = [...newMessages, { aiOrUser: "ai", content: resData.interaction.model_response.content }];
            setMessages(newMessagesWithAiResponse);
            sessionStorage.setItem('superpoweredChatbotMessages', JSON.stringify(newMessagesWithAiResponse));
        } else {
            //TODO: Handle error
        }
    }

    async function createNewChatThread() {
        const knowledgeBaseIds = chatConfig.knowledgeBaseIds == undefined ? [] : chatConfig.knowledgeBaseIds;
        const [resData, status] = await createChatThread(authToken, knowledgeBaseIds)
        if (status === 200) {
            setChatThreadId(resData.id);
            sessionStorage.setItem('superpoweredChatbotChatThreadId', resData.id);
        } else {
            //TODO: Handle error
            // This probably means the api key and/or secret aren't valid
        }
    }

    function resetChat() {
        // Set the messages to an empty list
        setMessages([]);
        sessionStorage.setItem('superpoweredChatbotMessages', JSON.stringify([]));
        // Create a new chat thread
        createNewChatThread()
    }

    function toggleVisibility() {
        // Update the session storage (useful when going to a new page)
        sessionStorage.setItem('superpoweredChatbotIsShown', (!isShown).toString());
        setIsShown(!isShown)
    }

    useEffect(() => {
        // Pull the saved chat thread from storage
        const savedChatThreadId = sessionStorage.getItem('superpoweredChatbotChatThreadId');
        if (savedChatThreadId === null) {
            // Create a new chat thread
            createNewChatThread()
        } else {
            setChatThreadId(savedChatThreadId);
        }
    }, [])

    useEffect(() => {
        // Scroll to the bottom of the messages
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, messageRef, isShown])


    if (!isShown) {

        return (
            <div
                className="superpowered-chatbot-container-closed"
                onClick={() => toggleVisibility()}
                style={style.chatBubbleStyle}>
                <IconContext.Provider
                    value={{ ...{ className: 'superpowered-chat-icon' }, ...style.chatBubbleIconStyle }}>
                    <div>
                        <BiChat />
                    </div>
                </IconContext.Provider>
            </div>
        )
    } else {

        return (
            <div className="superpowered-chatbot-container" style={style.chatContainerStyle}>
                <div>
                    <div className="superpowered-chatbot-header-container" style={style.headerContainerStyle}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <img src={headerLogo} />
                            <p className="superpowered-chatbot-header-text" style={style.headerTextStyle}>
                                {headerText}
                            </p>
                        </div>

                        <div>
                            <IconContext.Provider
                                value={{ className: `minimize-icon` }}>
                                <div onClick={() => toggleVisibility()}>
                                    <BiMinus />
                                </div>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className="superpowered-chatbot-messages-container" style={{ maxHeight: `calc(${maxContainerHeight} - 170px)` }}>
                        <ChatMessage
                            aiOrUser={"ai"}
                            message={initialMessage}
                            customStyle={{
                                userMessageContainerStyle: style.userMessageContainerStyle,
                                userMessageTextStyle: style.userMessageTextStyle,
                                aiMessageContainerStyle: style.aiMessageContainerStyle,
                                aiMessageTextStyle: style.aiMessageTextStyle,

                            }}
                        />
                        {messages.map((message: MessageInterace, index: number) =>
                            <ChatMessage
                                key={index}
                                aiOrUser={message.aiOrUser}
                                message={message.content}
                                customStyle={{
                                    userMessageContainerStyle: style.userMessageContainerStyle,
                                    userMessageTextStyle: style.userMessageTextStyle,
                                    aiMessageContainerStyle: style.aiMessageContainerStyle,
                                    aiMessageTextStyle: style.aiMessageTextStyle,

                                }}
                            />
                        )}
                        {showThinkingDots &&
                            <div className={"ai-chat-message-container"}>
                                <ThinkingChatMessage isVisible={showThinkingDots} />
                            </div>
                        }
                        <div ref={messageRef}></div>
                    </div>
                </div>
                <div className="chatbot-send-message-container">
                    {messages.length > 0 && <div className="superpowered-reset-chat-container">
                        <p className="superpowered-reset-chat-text" onClick={() => resetChat()}>
                            Reset chat
                        </p>
                    </div>}
                    <ChatInput
                        sendMessage={(message) => sendMessage(message)}
                        placeholderText={placeholderText}
                    />
                </div>
            </div>
        )

    }

}

SuperpoweredChatbot.defaultProps = {
    apiKey: "",
    apiSecret: "",
    headerText: "",
    initialMessage: "Hello, how can I help you",
    placeholderText: "Type a message...",
    headerLogo: "",
    chatConfig: {
        knowledgeBaseIds: [],
        model: ["gpt-3.5-turbo"],
        useRSE: true,
        temperature: 0.1,
        targetSegmentLength: "short",
        system_message: ""
    },
    style: {
        chatBubbleStyle: {},
        chatBubbleIconStyle: {},
        userMessageContainerStyle: {},
        userMessageTextStyle: {},
        aiMessageContainerStyle: {},
        aiMessageTextStyle: {},
        chatContainerStyle: {
            maxHeight: "500px",
        },
        headerContainerStyle: {},
        headerTextStyle: {}
    }
}



interface ChatMessageProps {
    message: string;
    aiOrUser: string;
    customStyle: any;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, aiOrUser, customStyle }) => {

    const customContainerStyle = aiOrUser === "ai" ? customStyle.aiMessageContainerStyle : customStyle.userMessageContainerStyle;
    const customTextStyle = aiOrUser === "ai" ? customStyle.aiMessageTextStyle : customStyle.userMessageTextStyle;

    return (
        <div className={`${aiOrUser}-chat-message-container`} style={customContainerStyle}>
            <p className={`${aiOrUser}-chat-message`} style={customTextStyle}>
                {message}
            </p>
        </div>
    )

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

export default SuperpoweredChatbot;