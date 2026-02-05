import API from "./apiInstance";

export const askAiBot = async (message: string) => {
    try {
        const response = await API.post("/ai/chat", { message });
        return response.data;
    } catch (error) {
        console.error("Error asking AI bot:", error);
        throw error;
    }
};
