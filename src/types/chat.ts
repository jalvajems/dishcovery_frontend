export interface User {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    role: 'chef' | 'foodie';
}

export interface Message {
    _id: string;
    conversationId: string;
    senderId: string | User;
    senderRole: 'chef' | 'foodie';
    content: string;
    fileUrl?: string;
    messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
    status: 'sent' | 'delivered' | 'read';
    readBy: string[];
    deletedFor?: string[];
    isDeletedForEveryone?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    _id: string;
    participants: User[];
    otherParticipant?: User;
    lastMessage?: Message;
    lastMessageAt: string;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface SendMessagePayload {
    conversationId: string;
    content: string;
    fileUrl?: string;
    messageType?: 'text' | 'image' | 'video' | 'audio' | 'file';
}

export interface CreateConversationPayload {
    otherUserId: string;
    otherUserRole: 'chef' | 'foodie';
}

export interface ChatState {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: Message[];
    isTyping: boolean;
    typingUserId: string | null;
    loading: boolean;
    error: string | null;
}

export interface SocketMessagePayload {
    conversationId: string;
    message: Message;
}
