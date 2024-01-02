
const REACT_APP_SERVICE_BASE_URL = "https://api.superpowered.ai/v1";


interface Payload {
    knowledge_base_ids: string[];
    model: string;
    temperature: number;
    system_message: string;
}

export async function createChatThread(
    authToken: string,
    knowledgeBaseIds: string[] = [],
    model:string = "gpt-4",
    temperature:number = 0,
    systemMessage:string = ""): Promise<[any, number]> {

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
                "Authorization": authToken
            },
            body: JSON.stringify({
                default_options: payload,
            })
        }
    )

    const resData = await response.json();
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
    targetSegmentLength: string = "medium",
    responseLength: string = "short"
): Promise<[any, number, object]> {

    const payload = {
        async: true,
        input: input,
        model: model,
        temperature: temperature,
        use_rse: useRSE,
        segment_length: targetSegmentLength,
        system_message: system_message,
        knowledge_base_ids: knowledge_base_ids,
        response_length: responseLength
    }

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
    return [resData, response.status, payload];

}


export async function pollChatResponse(authToken: string, pollURL: string): Promise<[any, number]> {

    const response = await fetch(
        pollURL,
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken
            }
        }
    )

    const resData = await response.json();
    return [resData, response.status];

}


export async function getChatThreadInteractions(authToken: string, threadId: string, nextPageToken: string = "") {

    let url = `${REACT_APP_SERVICE_BASE_URL}/chat/threads/${threadId}/interactions?limit=10`;
    if (nextPageToken !== "") {
        url += `&next_page_token=${nextPageToken}`;
    }

    const response = await fetch(
        url,
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken
            }
        }
    )

    const resData = await response.json();
    return [resData, response.status];

}