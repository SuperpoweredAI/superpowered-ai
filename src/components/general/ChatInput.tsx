import React, { useState, useEffect, useRef } from 'react';

import { IconContext } from 'react-icons';
import { RiSendPlaneFill } from 'react-icons/ri';

import './ChatInput.css';

interface ChatInputProps {
    sendMessage: (message: string) => void;
    sendMessageDisabled?: boolean;
    placeholderText?: string;
    theme?: "light" | "dark";
    size?: "small" | "large";
}

const ChatInput: React.FC<ChatInputProps> = ({ sendMessage, sendMessageDisabled, placeholderText, theme, size }) => {
    // This will be the input field for the user to type in
    // This will also contain a button for the user to send the message

    const [message, setMessage] = useState("");
    const textAreaRef = useRef(null);
    const [messageLength, setMessageLength] = useState(0);

    const handleChange = (evt: any) => {
        const val = evt.target?.value;
        if (messageLength < 2000) {
            setMessage(val.slice(0, 2000));
        }
    };

    const handleKeyDown = (evt: any) => {
        if (evt.keyCode === 8 && messageLength >= 2000) {
            setMessage(message.slice(0, -1));
        }
    }

    const useAutosizeTextArea = (textAreaRef: any, message: string) => {
        useEffect(() => {
            if (textAreaRef) {
                // We need to reset the height momentarily to get the correct scrollHeight for the textarea
                textAreaRef.style.height = "0px";
                const scrollHeight = textAreaRef.scrollHeight;

                // We then set the height directly, outside of the render loop
                // Trying to set this with state or a ref will product an incorrect value.
                textAreaRef.style.height = Math.min(scrollHeight, 80) + "px";
            }
        }, [textAreaRef, message]);
    };

    useAutosizeTextArea(textAreaRef.current, message);

    useEffect(() => {
        const keyDownHandler = (event: any) => {
            if (event.key === 'Enter' && !event.shiftKey && message.length > 0 && !sendMessageDisabled) {
                event.preventDefault();
                sendMessage(message);
                setMessage("");
            } else if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
            }
        };

        // If the send message button is disabled, we don't want to add the event listener
        // Having the event listener prevents a user from being able to use the enter key to create a new line
        // when a modal is open on the screen
        if (!sendMessageDisabled) {
            document.addEventListener('keydown', keyDownHandler);
        } else {
            document.removeEventListener('keydown', keyDownHandler);
        }
        
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [message, sendMessageDisabled]);

    useEffect(() => {
        // Get the message length
        setMessageLength(message.length);
    }, [message])

    return (
        <div className={`chatbot-chat-input-container`}>
            <div className={`chatbot-input-row-${theme}`}>
                <textarea
                    className={`chatbot-input-${theme}-${size}`}
                    onChange={handleChange}
                    onKeyDown={(event) => handleKeyDown(event)}
                    placeholder={placeholderText == undefined ? "Send a message" : placeholderText}
                    ref={textAreaRef}
                    rows={1}
                    value={message}
                />
                <div className="chatbot-send-icon-container" onClick={() => { sendMessage(message); setMessage("") }}>
                    <IconContext.Provider
                        value={{className: `chatbot-send-icon-${theme}`}}>
                        <div>
                            <RiSendPlaneFill />
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
            
        </div>
    )

}


ChatInput.defaultProps = {
    sendMessageDisabled: false,
    placeholderText: "",
    theme: "light",
    size: "large"
}

export default ChatInput;
