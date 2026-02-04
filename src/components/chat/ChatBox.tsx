import React, { useEffect, useRef, useState } from 'react';
import type { Conversation } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';
import { useSocket } from '@/context/SocketProvider';
import { ArrowLeft, Send } from 'lucide-react';

interface ChatBoxProps {
    conversation: Conversation;
    onBack?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversation, onBack }) => {
    const { messages, loadMessages, sendMessage, addMessage, markAsRead, isTyping, setTyping } = useChatStore();
    const { socket } = useSocket();
    const [messageInput, setMessageInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const otherUser = conversation.otherParticipant;

    useEffect(() => {
        if (conversation._id) {
            loadMessages(conversation._id);
            markAsRead(conversation._id);

            // Join chat room via socket
            socket?.emit('chat:join', conversation._id);

            return () => {
                socket?.emit('chat:leave', conversation._id);
            };
        }
    }, [conversation._id]);

    useEffect(() => {
        // Listen for new messages
        const handleNewMessage = (data: any) => {
            if (data.conversationId === conversation._id) {
                addMessage(data.message);
                markAsRead(conversation._id);
            }
        };

        const handleTyping = (data: { userId: string; isTyping: boolean }) => {
            if (data.userId !== otherUser?._id) return;
            setTyping(data.isTyping, data.userId);
        };

        const handleMessageRead = (data: { conversationId: string, readBy: string }) => {
            if (data.conversationId === conversation._id) {
                // We could implement a bulk update store action but for now reloading messages or just ignoring if we don't have granular update
                loadMessages(conversation._id); // Simplest way to reflect read status
            }
        };

        const handleMessageDeleted = (data: { conversationId: string, messageId: string, isDeletedForEveryone: boolean }) => {
            if (data.conversationId === conversation._id) {
                if (data.isDeletedForEveryone) {
                    // Ideally we update the specific message
                    loadMessages(conversation._id);
                }
            }
        }

        socket?.on('chat:message', handleNewMessage);
        socket?.on('chat:typing', handleTyping);
        socket?.on('chat:messages-read', handleMessageRead);
        socket?.on('chat:message-deleted', handleMessageDeleted);

        return () => {
            socket?.off('chat:message', handleNewMessage);
            socket?.off('chat:typing', handleTyping);
            socket?.off('chat:messages-read', handleMessageRead);
            socket?.off('chat:message-deleted', handleMessageDeleted);
        };
    }, [socket, conversation._id, otherUser?._id, loadMessages]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendMessage(conversation._id, messageInput.trim());
            setMessageInput('');

            // Stop typing indicator
            socket?.emit('chat:typing', { conversationId: conversation._id, isTyping: false });
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);

        // Emit typing indicator
        socket?.emit('chat:typing', { conversationId: conversation._id, isTyping: true });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket?.emit('chat:typing', { conversationId: conversation._id, isTyping: false });
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{otherUser?.name || 'Unknown User'}</h3>
                    <p className="text-xs text-gray-500 capitalize">{otherUser?.role || ''}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble key={message._id} message={message} />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-200 rounded-2xl rounded-bl-none px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSending}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isSending}
                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
