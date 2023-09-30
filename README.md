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
    chatConfig={{knowledgeBaseIds: []}}
/>
```