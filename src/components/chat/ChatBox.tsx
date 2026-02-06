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
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center gap-4 z-10 shadow-sm">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-green-100">
                    {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 leading-tight">{otherUser?.name || 'Unknown User'}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <p className="text-xs text-gray-500 font-medium capitalize">{otherUser?.role || 'User'}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-60">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
                            <Send className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="font-medium">No messages yet.</p>
                        <p className="text-sm">Say hello to start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble key={message._id} message={message} />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4 animate-fade-in">
                                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-inner">
                                    <div className="flex gap-1.5 items-center h-full">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-4 md:p-6">
                <div className="flex items-center gap-3 bg-gray-50 p-2 pr-2 rounded-[2rem] border border-gray-200 focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition-all shadow-inner">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 font-medium"
                        disabled={isSending}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isSending}
                        className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
