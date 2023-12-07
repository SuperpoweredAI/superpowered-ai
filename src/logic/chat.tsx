
export function breakResponseIntoChunks(
    currentText: string,
    newResponseText: string
    ): string[] {
    // For simulating streaming chat, we need to determine which words we need to display next

    // currentText will be the current text in the chat window
    // newResponseText will be the new response from the LLM, which will include the current text
    // We just care about the new text that needs to be added to the chat window
    const newTextAdded = newResponseText.slice(currentText.length);

    // Split the new text into words
    const newWords = newTextAdded.split(" ");

    const numWordsToAdd = newWords.length;

    // Randomly choose between 1 and 4 words to add to each chunk
    let chunks = [];
    let numWordsAdded = 0;
    while (numWordsAdded < numWordsToAdd) {
        let numWords = Math.floor(Math.random() * 4) + 1;
        let newString = newWords.slice(0, numWords).join(" ");
        newString += (numWordsAdded + numWords < numWordsToAdd ? " " : "")
        chunks.push(newString);
        newWords.splice(0, numWords);
        numWordsAdded += numWords;
    }

    return chunks;

}

interface Source {
    document: {
        title: string;
    };
    title: string;
}

interface ChatHistory {
    id: string;
    prefix: string;
    content: string;
    sources: Source[];
    searchQueries: string[];
    searchResults: string[];
}

export function formatSources(references = [], rankedResults = []) {

    // references is just an array of indices that correlates to the rankedResults array

    let sources: Source[] = [];
    let numReferencesPerDocument = {};
    let displayedTitle = "";
    let source = {};

    for (let i = 0; i < references.length; i++) {
        const index = references[i];
        const rankedResult = rankedResults[index]["metadata"];
        displayedTitle = rankedResult["document"]["title"];
        let count = 1
        if (numReferencesPerDocument[displayedTitle] !== undefined) {
            count = numReferencesPerDocument[displayedTitle] + 1;
        }
        numReferencesPerDocument[displayedTitle] = count;
        displayedTitle = (count > 1 ? displayedTitle + " (" + count + ")" : displayedTitle);
        // Cap the number of characters in the document title
        //let displayedTitle = documentTitle;
        if (displayedTitle.length > 35) {
            displayedTitle = displayedTitle.slice(0, 15) + "..." + displayedTitle.slice(-17);
        }
        source = rankedResult;
        source["document"]["title"] = rankedResult["document"]["title"];
        source["title"] = displayedTitle;
        sources.push(source);
    }

    return sources;
}


interface Interaction {
    id: string;
    prefix: string;
    content: string;
    sources: Source[];
    searchQueries: string[];
    searchResults: string[];
}

interface ChatThread {
    id: string;
    title: string;
    interactions: Interaction[];
}

export function formatChatThreadTitle(chatThread: ChatThread) {
    // First check if the title exists
    if (chatThread.title == undefined || chatThread.title === "") {
        return "New Chat"
    }
    const title = chatThread.title;
    // Strip extra "" from the title
    if (title[0] === '"' && title[title.length - 1] === '"') {
        return title.slice(1, -1);
    }
    return title;

}


export function formatChatThread(chatThread: ChatThread) {
    console.log("chatThread", chatThread)
    // Format the data into a more usable format for the frontend
    if (chatThread == undefined) {
        return [];
    }
    let chatHistory = chatThread.interactions;
    console.log("chatHistory", chatHistory)
    // Sort the chat history by id (increasing order)
    chatHistory.sort((a: string, b: string) => {
        return a.id - b.id;
    });
    let formattedChatHistory: ChatHistory[] = [];
    for (let i = 0; i < chatHistory.length; i++) {
        // Get the user message and AI response
        let userMessage = chatHistory[i]["user_input"]["content"];
        let aiResponse = chatHistory[i]["model_response"]["content"];
        const sources = formatSources(chatHistory[i]["references"], chatHistory[i]["ranked_results"]);
        const searchQueries = chatHistory[i]["search_queries"];
        const searchResults = chatHistory[i]["ranked_results"];
        const id = chatHistory[i]["id"];
        formattedChatHistory.push({ id: `user_${id}`, prefix: "user", content: userMessage, sources: [], searchQueries: [], searchResults: [] });
        formattedChatHistory.push({ id: `ai_${id}`, prefix: "ai", content: aiResponse, sources: sources, searchQueries: searchQueries, searchResults: searchResults });
    }
    return formattedChatHistory;
}


