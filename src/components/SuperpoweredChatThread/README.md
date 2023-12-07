## Pre-requisites
You must have a Superpowered AI account. You will need an `api key` and `api secret` in order to make requests. If you do not have an account, you can sign up for one for free [here](https://superpowered.ai). 

API keys can be created in the `API Keys` tab in the UI. 

## Installation
`npm install superpowered-ai`


## Usage
```javascript
import { SuperpoweredChatThread } from 'superpowered-ai'

<SuperpoweredChatThread
    apiKey={"YOUR_API_KEY"}
    apiSecret={"YOUR_API_SECRET"}
    threadId={""}
    isDarkMode={false}
    initialMessage={"Welcome to Superpowered AI. How can I help you?"}
    placeholderText={"Type a message..."}
    chatConfig={{
        knowledgeBaseIds: [],
        systemMessage: "",
        responseLength: "medium",
        model: "gpt-4"
    }}
/>
```


## Security
**DO NOT** use a `server-side` api key. Please only use a `client-side` key.
Depending on your application, it could also be recommended to rotate your API key and secret. You can easily delete and create new keys in the Superpowered UI.


## Recommendations
While some of the parameters are not required, we highly recommend that you make use of the following in order to get the most out of your chatbot:

1. System message:
- We highly recommend creating a detailed system message specific to your use case. This will result in much more relevant responses for your users. Check out our documentation for an example of how we crafted a system message for our site.


## Props
For full detail about the chat configuration parameters, check out our documentation [here](https://superpoweredai.notion.site)

| Prop | Required | Type | Default | Description |
| ---- | -------- | ---- | ------- | ----------- |
| apiKey | Yes | string | "" | Superpowered AI API key |
| apiSecret | Yes | string | "" | Superpowered AI API secret |
| darkMode | No | boolean | false | Use our dark theme colors |
| initialMessage | No | string | "Hello, how can I help you?" | The welcome message that shows up when the chatbot is opened |
| placeholderText | No | string | "Type a message" | Placeholder text in the chat input |
| chatConfig | Yes | object | - | Configuration parameters for your chatbot. Learn more about chat configuration [here](https://superpoweredai.notion.site) |
| chatConfig.model | No | string | "gpt-4" | Model to use. This can either be "gpt-4" or "gpt-3.5-turbo" |
| chatConfig.knowledgeBaseIds | Yes | array | [] | List of Superpowered AI knowledge base ids to give the chatbot access to |
| chatConfig.systemMessage | No | string | "" | The system message lets you instruct the LLM to behave in a certain way. You can also use it to give the LLM context about what its role is. For example, “You are a customer service bot for Superpowered AI. Superpowered AI is a knowledge base as a service provider for LLM applications… You should ONLY discuss Superpowered AI’s products and politely refuse to answer unrelated questions.” Don’t be afraid to make this multiple paragraphs long with a lot of detail and examples. |
| chatConfig.targetSegmentLength | No | string | "medium" | This parameter controls the average length of the segments that get created. For more complex tasks it usually works better to use medium to long segments. Only used when RSE is set to Yes. |
| chatConfig.responseLength | No | string | "short" | Response length controls the average length of chat responses. Short is the default, which will keep responses to a few sentences or less. If you want the model to respond with as much detail as possible, which usually means using multiple paragraphs, use long. |
| chatConfig.temperature | No | number | 0.1 | This controls the creativity of responses. Set this close to 0 reduce the risk of hallucinations, and closer to 1 for more creative responses. |
| chatConfig.useRSE | No | boolean | true | Relevant Segment Extraction (RSE) is an optional (but strongly recommended) post-processing step that takes clusters of relevant chunks and intelligently combines them into longer sections of text that we call segments.​​ These segments provide better context to the LLM than any individual chunk can. |


## Support
If you have any questions, bug reports, or product enhancement requests, please email nick@superpowered.ai