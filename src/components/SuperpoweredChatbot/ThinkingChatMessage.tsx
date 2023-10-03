import React, { useState, useEffect } from 'react';

interface ThinkingChatMessageProps {
    isVisible: boolean;
}

const ThinkingChatMessage: React.FC<ThinkingChatMessageProps> = ({ isVisible }) => {
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

export default ThinkingChatMessage;
