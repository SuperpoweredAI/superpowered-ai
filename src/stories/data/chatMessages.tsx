interface MessageObject {
    aiOrUser: "ai" | "user";
    content: string;
    sources?: object;
}

const testSources = [
    {
        document: {
            link_to_source: "",
            title: "financial_modeling_tools.txt",
        }
    },
    {
        document: {
            link_to_source: "https://www.mendable.ai",
            title: "financial_modeling_tools_dev.txt",
        }
    },
]

export const messages: MessageObject[] = [
    /*{ aiOrUser: "user", content: "What is the capital of France" },
    { aiOrUser: "ai", content: "The capital of France is Paris" },*/
    { aiOrUser: "user", content: "What is the population of Paris" },
    { aiOrUser: "ai", content: "The population of Paris is 2.141 million", sources: testSources },
    { aiOrUser: "user", content: "What is Superpowered" },
    { aiOrUser: "ai", content: "Superpowered is a company that makes audio software. They specialize in something that I don't even know, I'm just rambling at this point to add in more text for testing purposes.", sources: testSources },
    /*{ aiOrUser: "user", content: "What is Superpowered" },
    { aiOrUser: "ai", content: "Superpowered is a company that makes audio software. They specialize in something that I don't even know, I'm just rambling at this point to add in more text for testing purposes." },*/
]