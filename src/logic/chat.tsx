
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