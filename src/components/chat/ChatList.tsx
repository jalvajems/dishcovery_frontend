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

    const truncateMessage = (text: string, maxLength: number = 40) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            </div>

            <div className="divide-y divide-gray-100">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No conversations yet</p>
                        <p className="text-sm mt-2">Start chatting with chefs or foodies!</p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const otherUser = conversation.otherParticipant;
                        const isActive = conversation._id === activeConversationId;

                        return (
                            <div
                                key={conversation._id}
                                onClick={() => onSelectConversation(conversation)}
                                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${isActive ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                            {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {otherUser?.name || 'Unknown User'}
                                            </h3>
                                            {conversation.lastMessageAt && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {formatTime(conversation.lastMessageAt)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600 truncate">
                                                {conversation.lastMessage
                                                    ? truncateMessage(conversation.lastMessage.content)
                                                    : 'No messages yet'}
                                            </p>

                                            {conversation.unreadCount > 0 && (
                                                <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
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
