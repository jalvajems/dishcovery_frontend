import { create } from 'zustand';
import type { Conversation, Message } from '@/types/chat';
import * as chatApi from '@/api/chatApi';
import { getErrorMessage } from '@/utils/errorHandler';

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
    sendMessage: (conversationId: string, content: string, fileUrl?: string, messageType?: 'text' | 'image' | 'video' | 'audio' | 'file') => Promise<void>;
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
        set((state) => {
            if (state.activeConversation?._id === conversation?._id) {
                return { activeConversation: conversation };
            }
            return { activeConversation: conversation, messages: [] };
        });
    },

    loadConversations: async () => {
        try {
            set({ loading: true, error: null });
            const data = await chatApi.getUserConversations();
            // Sort conversations by lastMessageAt descending
            const sortedConversations = [...data.conversations].sort((a, b) => {
                const dateA = new Date(a.lastMessageAt || 0).getTime();
                const dateB = new Date(b.lastMessageAt || 0).getTime();
                return dateB - dateA;
            });
            set({ conversations: sortedConversations, loading: false });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to load conversations'), loading: false });
        }
    },

    loadMessages: async (conversationId: string) => {
        try {
            set({ loading: true, error: null });
            const data = await chatApi.getMessages(conversationId);
            set({ messages: data.messages, loading: false });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to load messages'), loading: false });
        }
    },

    sendMessage: async (conversationId: string, content: string, fileUrl?: string, messageType?: 'text' | 'image' | 'video' | 'audio' | 'file') => {
        try {
            console.log('Sending message:', { conversationId, content, fileUrl, messageType });
            const data = await chatApi.sendMessage({ conversationId, content, fileUrl, messageType });
            console.log('Message sent successfully:', data);

            // Update messages list
            get().addMessage(data.message);

            // Update conversation list with new last message
            get().updateConversationLastMessage(conversationId, data.message);
        } catch (error: unknown) {
            console.error('Error sending message:', error);
            set({ error: getErrorMessage(error, 'Failed to send message') });
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
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to mark messages as read') });
        }
    },

    setTyping: (isTyping: boolean, userId?: string) => {
        set({ isTyping, typingUserId: userId || null });
    },

    updateConversationLastMessage: (conversationId: string, message: Message) => {
        set((state) => {
            const updatedConversations = state.conversations.map((conv) =>
                conv._id === conversationId
                    ? { ...conv, lastMessage: message, lastMessageAt: message.createdAt }
                    : conv
            );
            
            // Re-sort conversations
            const sortedConversations = [...updatedConversations].sort((a, b) => {
                const dateA = new Date(a.lastMessageAt || 0).getTime();
                const dateB = new Date(b.lastMessageAt || 0).getTime();
                return dateB - dateA;
            });
            
            return { conversations: sortedConversations };
        });
    },

    createOrGetConversation: async (otherUserId: string, otherUserRole: 'chef' | 'foodie') => {
        try {
            set({ loading: true, error: null });
            const data = await chatApi.createOrGetConversation({ otherUserId, otherUserRole });

            // Add to conversations or move to top if exists
            set((state) => {
                const otherConversations = state.conversations.filter(c => c._id !== data.conversation._id);
                return {
                    conversations: [data.conversation, ...otherConversations],
                    activeConversation: data.conversation
                };
            });

            set({ loading: false });
            return data.conversation;
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to create conversation'), loading: false });
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
        } catch (error: unknown) {
            console.error('Failed to delete message:', error);
            set({ error: getErrorMessage(error, 'Failed to delete message') });
        }
    }
}));
