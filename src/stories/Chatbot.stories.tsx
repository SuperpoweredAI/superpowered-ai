import SuperpoweredChatbot from '../components/SuperpoweredChatbot/SuperpoweredChatbot';
import { messages } from './data/chatMessages';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'SuperpoweredChatbot',
    component: SuperpoweredChatbot,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    /*argTypes: {
        backgroundColor: { control: 'color' },
    },*/
};



export const Primary = {
    args: {
        headerText: 'Superpowered',
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}


export const Large = {
    args: {
        headerText: 'Superpowered',
        style:{
            chatContainerStyle: {
                width: "700px"
            }
        },
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}

export const Small = {
    args: {
        headerText: 'Superpowered',
        style: {
            chatContainerStyle: {
                width: "350px",
                maxHeight: "300px",
                minHeight: "300px"
            },
            headerContainerStyle: {
                backgroundColor: "white",
            }
        },
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}

export const NoMessages = {
    args: {
        headerText: 'Superpowered',
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify([]));
        }
    ],
}

export const FullProps = {
    args: {
        headerText: 'Superpowered',
        initialMessage: "Hello, how can I help you today?",
        placeholderText: "Type a message",
        style: {
            chatContainerStyle: {
                width: "500px",
                maxHeight: "90vh"
            },
            chatBubbleStyle: {
                backgroundColor: "#fafafa"
            },
            chatBubbleIconStyle: {
                color: "#383838"
            },
            headerContainerStyle: {
                backgroundColor: "white",
            }
        },
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}