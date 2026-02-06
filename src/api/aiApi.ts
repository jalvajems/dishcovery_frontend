import API from "./apiInstance";

export const askAiBot = async (message: string, role: string) => {
    try {
        const response = await API.post("/ai/chat", { message, role });
        return response.data;
    } catch (error) {
        console.error("Error asking AI bot:", error);
        throw error;
    }
};
