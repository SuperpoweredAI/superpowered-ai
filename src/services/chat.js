
const REACT_APP_SERVICE_BASE_URL = "https://api.superpowered.ai/v1";


export async function createChatThread(idToken, knowledgeBaseIds, model = "gpt-3.5-turbo", temperature = 0, systemMessage = "") {

    const payload = {
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
                supp_id: params.playgroundIdentifier
            })
        }
    )

    const resData = await response.json();
    console.log(resData)
    return [resData, response.status];

}


export async function getChatThreadById(idToken, threadId) {

    const response = await fetch(
        `${REACT_APP_SERVICE_BASE_URL}/chat/threads/${threadId}`,
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": idToken
            }
        }
    )

    const resData = await response.json();
    console.log(resData)
    return [resData, response.status];

}


export async function getChatThreadResponse(
    idToken, threadId, input, knowledge_base_ids, model, temperature, system_message, useRSE, targetSegmentLength
) {

    let formattedTemperature = temperature;
    if (typeof(temperature) === "string") {
        formattedTemperature = parseFloat(temperature);
    }
    if (formattedTemperature < 0.00001) {
        formattedTemperature = 0.00001;
    }
    if (temperature > 0.99999) {
        formattedTemperature = 0.99999;
    }

    const payload = {
        input: input,
        model: model,
        temperature: formattedTemperature,
        use_rse: useRSE,
        segment_length: targetSegmentLength,
        system_message: system_message,
    }
    payload.knowledge_base_ids = knowledge_base_ids

    console.log("payload", payload)

    const response = await fetch(
        `${REACT_APP_SERVICE_BASE_URL}/chat/threads/${threadId}/get_response`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": idToken
            },
            body: JSON.stringify(payload)
        }
    )

    const resData = await response.json();
    console.log(resData)
    return [resData, response.status];

}

