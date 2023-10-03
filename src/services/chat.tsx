
const REACT_APP_SERVICE_BASE_URL = "https://api.superpowered.ai/v1";


interface Payload {
    knowledge_base_ids: string[];
    model: string;
    temperature: number;
    system_message: string;
}

export async function createChatThread(
    idToken: string,
    knowledgeBaseIds: string[] = [],
    model = "gpt-3.5-turbo",
    temperature = 0,
    systemMessage = ""): Promise<[any, number]> {

    const payload: Payload = {
        knowledge_base_ids: knowledgeBaseIds,
        model: model,
        temperature: temperature,
        system_message: systemMessage,
    }

    const response = await fetch(
        `${REACT_APP_SERVICE_BASE_URL}/chat/threads`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": idToken
            },
            body: JSON.stringify({
                default_options: payload,
            })
        }
    )

    const resData = await response.json();
    console.log(resData)
    return [resData, response.status];

}


export async function getChatThreadResponse(
    authToken: string,
    threadId: string,
    input: string,
    knowledge_base_ids: string[] = [],
    model: string = "gpt-3.5-turbo",
    temperature: number = 0,
    system_message: string = "",
    useRSE: boolean = true,
    targetSegmentLength: string = "medium"
): Promise<[any, number]> {

    const payload = {
        input: input,
        model: model,
        temperature: temperature,
        use_rse: useRSE,
        segment_length: targetSegmentLength,
        system_message: system_message,
        knowledge_base_ids: knowledge_base_ids,
    }

    console.log("payload", payload)

    const response = await fetch(
        `${REACT_APP_SERVICE_BASE_URL}/chat/threads/${threadId}/get_response`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken
            },
            body: JSON.stringify(payload)
        }
    )

    const resData = await response.json();
    console.log(resData)
    return [resData, response.status];

}

