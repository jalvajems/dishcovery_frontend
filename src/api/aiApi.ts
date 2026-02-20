import API from "./apiInstance";

interface AiChatResponse {
    reply: string;
}

export const askAiBot = async (message: string, role: string): Promise<AiChatResponse> => {
    try {
        const response = await API.post<AiChatResponse>("/ai/chat", { message, role });
        return response.data;
    } catch (error) {
        console.error("Error asking AI bot:", error);
        throw error;
    }
};
