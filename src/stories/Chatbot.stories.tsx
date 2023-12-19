import SuperpoweredChatbot from '../components/SuperpoweredChatbot/SuperpoweredChatbot';
import { messages } from './data/chatMessages';
import superpoweredLogo from './assets/superpowered-logo-blue.png';

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
        headerLogo: superpoweredLogo,
        initialMessage: "Hello, how can I help you today?",
        placeholderText: "Type a message",
        style: {
            chatContainerWidth: "550px",
            chatContainerMaxHeight: "90vh",
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
        displaySources: "all"
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}


export const LinkToSourceOnly = {
    args: {
        headerText: 'Superpowered',
        headerLogo: superpoweredLogo,
        initialMessage: "Hello, how can I help you today?",
        placeholderText: "Type a message",
        style: {
            chatContainerWidth: "550px",
            chatContainerMaxHeight: "90vh",
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
        displaySources: "link_to_source_only"
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}


export const NoSources = {
    args: {
        headerText: 'Superpowered',
        headerLogo: superpoweredLogo,
        initialMessage: "Hello, how can I help you today?",
        placeholderText: "Type a message",
        style: {
            chatContainerWidth: "550px",
            chatContainerMaxHeight: "90vh",
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
        displaySources: "none"
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}


export const DarkMode = {
    args: {
        headerText: 'Superpowered',
        headerLogo: superpoweredLogo,
        initialMessage: "Hello, how can I help you today?",
        placeholderText: "Type a message",
        darkMode: true,
    },
    loaders: [
        () => {
            window.sessionStorage.setItem("superpoweredChatbotChatThreadId", "testId");
            window.sessionStorage.setItem("superpoweredChatbotMessages", JSON.stringify(messages));
        }
    ],
}