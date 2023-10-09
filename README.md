## Pre-requisites
You must have a Superpowered AI account. You will need an `api key` and `api secret` in order to make requests. If you do not have an account, you can sign up for one for free here https://superpowered.ai


## Installation
`npm install superpowered-ai`


## Usage
```javascript
import { SuperpoweredChatbot } from 'superpowered-ai'

<SuperpoweredChatbot
    apiKey={"YOUR_API_KEY"}
    apiSecret={"YOUR_API_SECRET"}
    headerLogo=""
    headerText="Superpowered AI"
    placeholderText="Type a message..."
    chatConfig={{
        knowledgeBaseIds: [],
        systemMessage: "",
    }}
/>
```


## Props

| Prop | Required | Type | Default | Description |
| ---- | -------- | ---- | ------- | ----------- |
| apiKey | Yes | string | "" | Superpowered AI API key |
| apiSecret | Yes | string | "" | Superpowered AI API secret |
| headerLogo | No | React.node | null | The logo (if any) you want displayed next to the title |
| headerTitle | No | string | "" | The title you want displayed at the top of the chatbot |
| style | No | object | - | Style customization for the chatbot |
| style.chatContainerMaxHeight | No | string | Max height for the chatbot in the opened state |
| style.chatContainerWidth | No | string | Width for the chatbot in the opened state |
| style.chatBubbleStyle | No | React.CSSProperties | Custom style for the floating chat bubble (closed state) |
| style.chatBubbleIconStyle | No | React.CSSProperties | Custom style for the icon in the floating chat bubble (closed state) |
| style.userMessageContainerStyle | No | React.CSSProperties | Custom style for the user message container |
| style.userMessageTextStyle | No | React.CSSProperties | Custom style for the user message text |


## Support
If you have any questions, bug reports, or product enhancement requests, please email nick@superpowered.ai