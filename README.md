## Pre-requisites
You must have a Superpowered AI account. You will need an `api key` and `api secret` in order to make requests. If you do not have an account, you can sign up for one for free [here](https://superpowered.ai). 

API keys can be created in the `API Keys` tab in the UI. 

## Installation
`npm install superpowered-ai`


## Usage
```javascript
import { SuperpoweredChatbot } from 'superpowered-ai'

<SuperpoweredChatbot
    apiKey={"YOUR_API_KEY"}
    apiSecret={"YOUR_API_SECRET"}
    headerLogo={YOUR_LOGO}
    headerText={"Superpowered AI"}
    darkMode={true}
    initialMessage={"Welcome to Superpowered AI. How can I help you?"}
    placeholderText={"Type a message..."}
    chatConfig={{
        model: "gpt-4",
        knowledgeBaseIds: [],
        systemMessage: "",
        autoQueryGuidance: "",
        targetSegmentLength: "medium",
        useRSE: true,
        responseLength: "medium",
        temperature: 0.2,
    }}
    style={{
        chatContainerMaxHeight: "90vh",
        chatContainerWidth: "575px",
        chatBubbleStyle: {backgroundColor: "#5D24D8"},
        chatBubbleIconStyle: {color: "white"},
        userMessageContainerStyle: {backgroundColor: "#5D24D8"},
        userMessageTextStyle: {fontFamily: "Inter", fontSize: "14px"}
    }}
    onMessageSendCallback={(payload, response, status) => console.log(payload, response, status)}
    displaySources={"link_to_source_only"}
/>
```


## Security
**DO NOT** use a `server-side` api key. Please only use a `client-side` key.
Depending on your application, it could also be recommended to rotate your API key and secret. You can easily delete and create new keys in the Superpowered UI.


## Recommendations
While some of the parameters are not required, we highly recommend that you make use of the following in order to get the most out of your chatbot:

1. Header logo and title
- Please use your own logo and title in order to customize the chatbot to match your site.

2. System message:
- We highly recommend creating a detailed system message specific to your use case. This will result in much more relevant responses for your users. Check out our documentation for an example of how we crafted a system message for our site.


## Props
For full detail about the chat configuration parameters, check out our documentation [here](https://superpoweredai.notion.site)

| Prop | Required | Type | Default | Description |
| ---- | -------- | ---- | ------- | ----------- |
| apiKey | Yes | string | "" | Superpowered AI API key |
| apiSecret | Yes | string | "" | Superpowered AI API secret |
| headerLogo | No | React.node | null | The logo (if any) you want displayed next to the title. This gets sized to 25px by 25px. We highly recommend using a suqare or circular logo. |
| headerTitle | No | string | "" | The title you want displayed at the top of the chatbot |
| darkMode | No | boolean | false | Use our dark theme colors |
| initialMessage | No | string | "Hello, how can I help you?" | The welcome message that shows up when the chatbot is opened |
| placeholderText | No | string | "Type a message" | Placeholder text in the chat input |
| onMessageSendCallback | No | Function | null | Callback function for detail about the payload sent, the response from the API, and the status. This is primarily for debugging purposes, we do not recommend exposing this to your users |
| displaySources | No | string | "link_to_source_only" | Options for displaying sources. This can be "all", "link_to_source_only", or "none". "all" will display sources even if they do not contain a "link_to_source", but these will not be clickable. Any source with a "link_to_source" will be clickable, and it will open that source in a new tab |
| style | No | object | - | Style customization for the chatbot |
| style.chatContainerMaxHeight | No | string | "90vh" | Max height for the chatbot in the opened state. Beyond this height the message container will scroll vertically. |
| style.chatContainerWidth | No | string | "575px" | Width for the chatbot in the opened state |
| style.chatBubbleStyle | No | React.CSSProperties | - | Custom style for the floating chat bubble (closed state) |
| style.chatBubbleIconStyle | No | React.CSSProperties | - | Custom style for the icon in the floating chat bubble (closed state) |
| style.headerTextStyle | No | React.CSSProperties | - | Custom style of the header text |
| style.userMessageContainerStyle | No | React.CSSProperties | - | Custom style for the user message container |
| style.userMessageTextStyle | No | React.CSSProperties | - | Custom style for the user message text |
| chatConfig | Yes | object | - | Configuration parameters for your chatbot. Learn more about chat configuration [here](https://superpoweredai.notion.site) |
| chatConfig.model | No | string | "gpt-4" | Model to use. This can either be "gpt-4" or "gpt-3.5-turbo" |
| chatConfig.knowledgeBaseIds | Yes | array | [] | List of Superpowered AI knowledge base ids to give the chatbot access to |
| chatConfig.systemMessage | No | string | "" | The system message lets you instruct the LLM to behave in a certain way. You can also use it to give the LLM context about what its role is. For example, “You are a customer service bot for Superpowered AI. Superpowered AI is a knowledge base as a service provider for LLM applications… You should ONLY discuss Superpowered AI’s products and politely refuse to answer unrelated questions.” Don’t be afraid to make this multiple paragraphs long with a lot of detail and examples. |
| chatConfig.autoQueryGuidance | No | string | "" | When we automatically generate queries based on user input, you may want to provide some additional guidance and/or context to the system. For example, you may have some information that may not be input directly as query input, but you want the information present when generating search queries in the retrieval step. |
| chatConfig.targetSegmentLength | No | string | "medium" | This parameter controls the average length of the segments that get created. For more complex tasks it usually works better to use medium to long segments. Only used when RSE is set to Yes. |
| chatConfig.responseLength | No | string | "short" | Response length controls the average length of chat responses. Short is the default, which will keep responses to a few sentences or less. If you want the model to respond with as much detail as possible, which usually means using multiple paragraphs, use long. |
| chatConfig.temperature | No | number | 0.1 | This controls the creativity of responses. Set this close to 0 reduce the risk of hallucinations, and closer to 1 for more creative responses. |
| chatConfig.useRSE | No | boolean | true | Relevant Segment Extraction (RSE) is an optional (but strongly recommended) post-processing step that takes clusters of relevant chunks and intelligently combines them into longer sections of text that we call segments.​​ These segments provide better context to the LLM than any individual chunk can. |


## Support
If you have any questions, bug reports, or product enhancement requests, please email nick@superpowered.ai