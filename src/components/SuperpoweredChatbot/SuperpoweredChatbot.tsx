import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';

import { BiChat, BiMinus } from 'react-icons/bi';
import { IconContext } from 'react-icons';

import { getChatThreadResponse, createChatThread } from '../../services/chat';
const superpoweredLogo = require('../../assets/superpowered-logo-blue.png')

import './SuperpoweredChatbot.css';


interface SuperpoweredChatbot {
    apiKey: string;
    apiSecret: string;
    style: Style;
    headerLogo: string,
    headerText: string,
    darkMode: boolean,
    placeholderText: string,
    initialMessage: string,
    chatConfig: ChatConfig,
}

interface ChatConfig {
    knowledgeBaseIds: string[];
    systemMessage: string;
    targetSegmentLength: string;
    temperature: number;
    useRSE: boolean;
}

interface Style {
    chatContainerMaxHeight: string;
    chatContainerWidth: string;
    chatBubbleStyle: React.CSSProperties;
    chatBubbleIconStyle: React.CSSProperties;
    userMessageContainerStyle: React.CSSProperties;
    userMessageTextStyle: React.CSSProperties;
    headerTextStyle: React.CSSProperties;
}

interface MessageInterace {
    aiOrUser: string;
    content: string;
}

const SuperpoweredChatbot: React.FC<SuperpoweredChatbot> = ({ apiKey, apiSecret, style, headerLogo, headerText, darkMode, placeholderText, initialMessage, chatConfig }) => {

    let maxContainerHeight = "90vh"
    if (style.chatContainerMaxHeight !== undefined) {
        maxContainerHeight = style.chatContainerMaxHeight;
    }

    const theme = darkMode ? "dark" : "light";

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
        const model = "gpt-3.5-turbo"// Only model supported at the moment
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
                className={`superpowered-chatbot-container-closed-${theme}`}
                onClick={() => toggleVisibility()}
                style={style.chatBubbleStyle}>
                <IconContext.Provider
                    value={{ ...{ className: `superpowered-chat-icon-${theme}` }, ...style.chatBubbleIconStyle }}>
                    <div>
                        <BiChat />
                    </div>
                </IconContext.Provider>
            </div>
        )
    } else {

        return (
            <div className={`superpowered-chatbot-container-${theme}`} style={{ width: style.chatContainerWidth }}>
                <div>
                    <div className={`superpowered-chatbot-header-container-${theme}`}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <img
                                className="superpowered-chatbot-header-logo"
                                src={headerLogo} />
                            <p className={`superpowered-chatbot-header-text-${theme}`} style={style.headerTextStyle}>
                                {headerText}
                            </p>
                        </div>

                        <div>
                            <IconContext.Provider
                                value={{ className: `minimize-icon-${theme}` }}>
                                <div onClick={() => toggleVisibility()}>
                                    <BiMinus />
                                </div>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className={`superpowered-chatbot-messages-container-${theme}`} style={{ maxHeight: `calc(${maxContainerHeight} - 170px)` }}>
                        <ChatMessage
                            aiOrUser={"ai"}
                            theme={theme}
                            message={initialMessage}
                            customStyle={{
                                userMessageContainerStyle: style.userMessageContainerStyle,
                                userMessageTextStyle: style.userMessageTextStyle,

                            }}
                        />
                        {messages.map((message: MessageInterace, index: number) =>
                            <ChatMessage
                                key={index}
                                theme={theme}
                                aiOrUser={message.aiOrUser}
                                message={message.content}
                                customStyle={{
                                    userMessageContainerStyle: style.userMessageContainerStyle,
                                    userMessageTextStyle: style.userMessageTextStyle,

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
                <div className={`chatbot-send-message-container-${theme}`}>

                    <ChatInput
                        sendMessage={(message) => sendMessage(message)}
                        placeholderText={placeholderText}
                        theme={theme}
                    />
                    <div style={{ display: "flex", flexDirection: "row", textAlign: "right" }}>
                        <p className={`powered-by-sp-promo-text-grey-${theme}`}>{"Powered by "}</p>
                        <p className="powered-by-sp-promo-text">{"superpowered.ai"}</p>
                    </div>
                </div>
            </div>
        )

    }

}

SuperpoweredChatbot.defaultProps = {
    apiKey: "",
    apiSecret: "",
    headerText: "",
    darkMode: false,
    initialMessage: "Hello, how can I help you?",
    placeholderText: "Type a message",
    headerLogo: superpoweredLogo,
    chatConfig: {
        knowledgeBaseIds: [],
        useRSE: true,
        temperature: 0.1,
        targetSegmentLength: "medium",
        systemMessage: ""
    },
    style: {
        chatBubbleStyle: {},
        chatBubbleIconStyle: {},
        chatContainerWidth: "575px",
        chatContainerMaxHeight: "90vh",
        userMessageContainerStyle: {},
        userMessageTextStyle: {},
        headerTextStyle: {}
    }
}


interface ChatMessageProps {
    message: string;
    aiOrUser: string;
    theme: string;
    customStyle: any;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, aiOrUser, theme, customStyle }) => {

    const customContainerStyle = aiOrUser === "ai" ? {} : customStyle.userMessageContainerStyle;
    const customTextStyle = aiOrUser === "ai" ? {} : customStyle.userMessageTextStyle;

    return (
        <div className={`chatbot-${aiOrUser}-chat-message-container-${theme}`} style={customContainerStyle}>
            <p className={`chatbot-${aiOrUser}-chat-message-${theme}`} style={customTextStyle}>
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