import { create } from 'zustand';
import type { Conversation, Message } from '@/types/chat';
import * as chatApi from '@/api/chatApi';

interface ChatStore {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: Message[];
    isTyping: boolean;
    typingUserId: string | null;
    loading: boolean;
    error: string | null;

    // Actions
    setActiveConversation: (conversation: Conversation | null) => void;
    loadConversations: () => Promise<void>;
    loadMessages: (conversationId: string) => Promise<void>;
    sendMessage: (conversationId: string, content: string) => Promise<void>;
    addMessage: (message: Message) => void;
    updateMessageStatus: (messageId: string, status: 'sent' | 'delivered' | 'read') => void;
    updateMessage: (message: Message) => void;
    markAsRead: (conversationId: string) => Promise<void>;
    deleteMessage: (messageId: string, forEveryone: boolean) => Promise<void>;
    setTyping: (isTyping: boolean, userId?: string) => void;
    updateConversationLastMessage: (conversationId: string, message: Message) => void;
    createOrGetConversation: (otherUserId: string, otherUserRole: 'chef' | 'foodie') => Promise<Conversation | null>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    conversations: [],
    activeConversation: null,
    messages: [],
    isTyping: false,
    typingUserId: null,
    loading: false,
    error: null,

    setActiveConversation: (conversation) => {
        set({ activeConversation: conversation, messages: [] });
    },

    loadConversations: async () => {
        try {
            set({ loading: true, error: null });
            const data = await chatApi.getUserConversations();
            set({ conversations: data.conversations, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to load conversations', loading: false });
        }
    },

    loadMessages: async (conversationId: string) => {
        try {
            set({ loading: true, error: null });
            const data = await chatApi.getMessages(conversationId);
            set({ messages: data.messages, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to load messages', loading: false });
        }
    },

    sendMessage: async (conversationId: string, content: string) => {
        try {
            console.log('Sending message:', { conversationId, content });
            const data = await chatApi.sendMessage({ conversationId, content });
            console.log('Message sent successfully:', data);
            // Message will be added via socket event or we can add it optimistically
            get().addMessage(data.message);
        } catch (error: any) {
            console.error('Error sending message:', error);
            console.error('Error response:', error.response?.data);
            set({ error: error.message || 'Failed to send message' });
        }
    },

    addMessage: (message: Message) => {
        set((state) => {
            // Prevent duplicates
            if (state.messages.some(m => m._id === message._id)) {
                return state;
            }
            return {
                messages: [...state.messages, message]
            };
        });
    },

    updateMessageStatus: (messageId: string, status: 'sent' | 'delivered' | 'read') => {
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg._id === messageId ? { ...msg, status } : msg
            )
        }));
    },

    markAsRead: async (conversationId: string) => {
        try {
            await chatApi.markMessagesAsRead(conversationId);
            // Update unread count in conversations
            set((state) => ({
                conversations: state.conversations.map((conv) =>
                    conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
                )
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to mark messages as read' });
        }
    },

    setTyping: (isTyping: boolean, userId?: string) => {
        set({ isTyping, typingUserId: userId || null });
    },

    updateConversationLastMessage: (conversationId: string, message: Message) => {
        set((state) => ({
            conversations: state.conversations.map((conv) =>
                conv._id === conversationId
                    ? { ...conv, lastMessage: message, lastMessageAt: message.createdAt }
                    : conv
            )
        }));
    },

    createOrGetConversation: async (otherUserId: string, otherUserRole: 'chef' | 'foodie') => {
        try {
            set({ loading: true, error: null });
            const data = await chatApi.createOrGetConversation({ otherUserId, otherUserRole });

            // Add to conversations if not already there
            const exists = get().conversations.find(c => c._id === data.conversation._id);
            if (!exists) {
                set((state) => ({
                    conversations: [data.conversation, ...state.conversations]
                }));
            }

            set({ loading: false });
            return data.conversation;
        } catch (error: any) {
            set({ error: error.message || 'Failed to create conversation', loading: false });
            return null;
        }
    },

    updateMessage: (message: Message) => {
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg._id === message._id ? message : msg
            )
        }));
    },

    deleteMessage: async (messageId: string, forEveryone: boolean) => {
        try {
            const data = await chatApi.deleteMessage(messageId, forEveryone);
            // Update local state immediately
            get().updateMessage(data.data);
        } catch (error: any) {
            console.error('Failed to delete message:', error);
            set({ error: error.message || 'Failed to delete message' });
        }
    }
}));
