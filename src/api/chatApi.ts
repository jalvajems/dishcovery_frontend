import apiInstance from './apiInstance';
import type { Conversation, Message, CreateConversationPayload, SendMessagePayload } from '@/types/chat';

// Create or get existing conversation
export const createOrGetConversation = async (payload: CreateConversationPayload) => {
    const response = await apiInstance.post<{ success: boolean; conversation: Conversation }>('/chat/conversation', payload);
    return response.data;
};

// Get user's conversations with pagination
export const getUserConversations = async (page: number = 1, limit: number = 20) => {
    const response = await apiInstance.get<{
        success: boolean;
        conversations: Conversation[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>('/chat/conversations', {
        params: { page, limit }
    });
    return response.data;
};

// Send a message
export const sendMessage = async (payload: SendMessagePayload) => {
    const response = await apiInstance.post<{ success: boolean; message: Message }>('/chat/message', payload);
    return response.data;
};

// Get messages for a conversation with pagination
export const getMessages = async (conversationId: string, page: number = 1, limit: number = 50) => {
    const response = await apiInstance.get<{
        success: boolean;
        messages: Message[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>(`/chat/messages/${conversationId}`, {
        params: { page, limit }
    });
    return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string) => {
    const response = await apiInstance.put<{ success: boolean; message: string }>(`/chat/read/${conversationId}`);
    return response.data;
};

// Delete a message
export const deleteMessage = async (messageId: string, forEveryone: boolean) => {
    const response = await apiInstance.delete<{ success: boolean; message: string; data: Message }>(`/chat/message/${messageId}`, {
        data: { forEveryone }
    });
    return response.data;
};
