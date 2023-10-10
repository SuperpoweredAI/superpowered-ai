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
| headerTextStyle | No | React.CSSProperties | - | Custom style of the header text |
| style | No | object | - | Style customization for the chatbot |
| style.chatContainerMaxHeight | No | string | "90vh" | Max height for the chatbot in the opened state |
| style.chatContainerWidth | No | string | "575px" | Width for the chatbot in the opened state |
| style.chatBubbleStyle | No | React.CSSProperties | - | Custom style for the floating chat bubble (closed state) |
| style.chatBubbleIconStyle | No | React.CSSProperties | - | Custom style for the icon in the floating chat bubble (closed state) |
| style.userMessageContainerStyle | No | React.CSSProperties | - | Custom style for the user message container |
| style.userMessageTextStyle | No | React.CSSProperties | - | Custom style for the user message text |
| chatConfig | Yes | object | - | Configuration parameters for your chatbot. Learn more about chat configuration [here](https://superpoweredai.notion.site) |
| chatConfig.knowledgeBaseIds | Yes | array | [] | List of Superpowered AI knowledge base ids to give the chatbot access to |
| chatConfig.systemMessage | No | string | "" | The system message lets you instruct the LLM to behave in a certain way. |
| chatConfig.targetSegmentLength | No | string | "medium" | This parameter controls the average length of the segments that get created. For more complex tasks it usually works better to use medium to long segments. Only used when RSE is set to Yes. |
| chatConfig.temperature | No | number | 0.1 | This controls the creativity of responses. Set this close to 0 reduce the risk of hallucinations, and closer to 1 for more creative responses. |
| chatConfig.useRSE | No | boolean | true | Relevant Segment Extraction (RSE) is an optional (but strongly recommended) post-processing step that takes clusters of relevant chunks and intelligently combines them into longer sections of text that we call segments.​​ These segments provide better context to the LLM than any individual chunk can. |


## Recommendations
While some of the parameters are not required, we highly recommend that you make use of the following in order to get the most out of your chatbot:

1. Header logo and title
- Please use your own logo and title in order to customize it to match your site.

2. System message:
- A good system message is crucial for getting excellent responses. 


## Support
If you have any questions, bug reports, or product enhancement requests, please email nick@superpowered.ai