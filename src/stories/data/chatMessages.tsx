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
            title: "financial_modeling_tools_dev_testing_long_title.txt",
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


export const testInteractions = {
    interactions: [
      {
        id: "000000001",
        model_response: {
          content: `To create an API key, the specific steps will depend on the platform or service you are using. Generally, an API key is a unique identifier that allows you to access and use an API (Application Programming Interface) provided by a service or platform.

Here is a general outline of the steps to create an API key:

1. Identify the platform or service: Determine which platform or service you want to create an API key for. This could be a social media platform, a payment gateway, a mapping service, or any other service that provides an API.

2. Access the developer portal: Visit the developer portal or website of the platform or service. Look for a section related to API documentation or developer resources.

3. Sign up or log in: If you haven't already, sign up for an account or log in to your existing account on the developer portal. This is usually required to generate an API key.

4. Create a new project or application: In the developer portal, create a new project or application. This step may vary depending on the platform, but it typically involves providing some basic information about your project or application.

5. Generate an API key: Once you have created a project or application, you should be able to generate an API key. This is usually done by clicking on a button or following a specific process outlined in the developer portal.

6. Configure API key settings: Depending on the platform, you may have the option to configure certain settings for your API key. This could include setting permissions, specifying usage limits, or enabling additional features.

7. Securely store your API key: After generating the API key, it is important to securely store it. Treat your API key like a password and avoid sharing it publicly or exposing it in your code. Consider using environment variables or a secure key management system to store and access your API key.

Remember, these steps are general guidelines, and the actual process may vary depending on the platform or service you are using. It's always a good idea to consult the official documentation or support resources provided by the platform for detailed instructions on creating an API key.`},
        ranked_results: [],
        references: [],
        search_queries: [],
        user_input: { content: "How do I create an API key?" }
      }
    ]
  }