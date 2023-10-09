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

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| apiKey | string | "" | Superpowered AI API key |
| apiSecret | string | "" | Superpowered AI API secret |
| headerLogo | React.node | null | The logo (if any) you want displayed next to the title |
| headerTitle | string | "" | The title you want displayed at the top of the chatbot |


## Support
If you have any questions, bug reports, or product enhancement requests, please email nick@superpowered.ai