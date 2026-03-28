import React from 'react';
import type { Conversation } from '@/types/chat';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatListProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (conversation: Conversation) => void;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, activeConversationId, onSelectConversation }) => {

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'MMM dd');
        }
    };

    const truncateMessage = (text: string | undefined, maxLength: number = 40) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };
    console.log('--------', conversations);


    return (
        <div className="h-full flex flex-col bg-gray-50/50">
            <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Recent Chats</h2>
            </div>


            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p className="font-medium">No conversations yet</p>
                        <p className="text-xs mt-2 text-gray-400">Start chatting with chefs or foodies!</p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const otherUser = conversation.otherParticipant;
                        const isActive = conversation._id === activeConversationId;

                        return (
                            <div
                                key={conversation._id}
                                onClick={() => onSelectConversation(conversation)}
                                className={`p-4 cursor-pointer rounded-2xl transition-all duration-200 border border-transparent ${isActive
                                    ? 'bg-white shadow-md border-gray-100 scale-[1.02]'
                                    : 'hover:bg-white hover:shadow-sm hover:border-gray-100'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 relative">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm ${isActive ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                                            {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        {/* Online status indicator could go here */}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-bold truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {otherUser?.name || 'Unknown User'}
                                            </h3>
                                            {conversation.lastMessageAt && (
                                                <span className={`text-[10px] font-medium ml-2 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {formatTime(conversation.lastMessageAt)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm truncate font-medium ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {conversation.lastMessage
                                                    ? (() => {
                                                        const msg = conversation.lastMessage;
                                                        if (msg.isDeletedForEveryone) return '🚫 This message was deleted';
                                                        if (msg.messageType === 'image') return '📷 Image';
                                                        if (msg.messageType === 'video') return '🎥 Video';
                                                        if (msg.messageType === 'audio') return '🎵 Audio';
                                                        if (msg.messageType === 'file') return '📎 File';
                                                        return truncateMessage(msg.content);
                                                    })()
                                                    : 'No messages yet'}
                                            </p>

                                            {conversation.unreadCount > 0 && (
                                                <span className="ml-2 bg-green-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 shadow-sm shadow-green-200">
                                                    {conversation.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatList;
