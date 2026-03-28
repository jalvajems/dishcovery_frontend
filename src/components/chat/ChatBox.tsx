import React, { useEffect, useRef, useState } from 'react';
import type { Conversation, SocketMessagePayload } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import MessageBubble from './MessageBubble';
import { useSocket } from '@/context/SocketProvider';
import { ArrowLeft, Send, Paperclip, Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { getSignedUrlApi } from '@/api/fileApi';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ChatBoxProps {
    conversation: Conversation;
    onBack?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversation, onBack }) => {
    const { messages, loadMessages, sendMessage, addMessage, markAsRead, isTyping, setTyping } = useChatStore();
    const { user } = useAuthStore();
    const { socket } = useSocket();
    const [messageInput, setMessageInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const otherUser = conversation.otherParticipant;

    useEffect(() => {
        if (conversation._id) {
            console.log('ChatBox: Loading messages for conversation:', conversation._id);
            loadMessages(conversation._id);
            // Only mark as read if there are unread messages from the other user
            markAsRead(conversation._id);

            console.log('ChatBox: Emitting chat:join for:', conversation._id);
            socket?.emit('chat:join', conversation._id);

            return () => {
                console.log('ChatBox: Emitting chat:leave for:', conversation._id);
                socket?.emit('chat:leave', conversation._id);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation._id, socket]);

    useEffect(() => {
        const handleNewMessage = (data: SocketMessagePayload) => {
            console.log('ChatBox: Received chat:message', data);
            
            // Update conversation list last message regardless of whether it's the active one
            // this ensures the list is updated and sorted
            useChatStore.getState().updateConversationLastMessage(data.conversationId, data.message);

            if (data.conversationId === conversation._id) {
                addMessage(data.message);

                // Only mark as read if the message is NOT from me
                const senderId = typeof data.message.senderId === 'string'
                    ? data.message.senderId
                    : data.message.senderId._id;

                if (senderId && user?.id && String(senderId) !== user.id) {
                    markAsRead(conversation._id);
                }
            }
        };

        const handleTyping = (data: { userId: string; isTyping: boolean }) => {
            if (data.userId !== otherUser?._id) return;
            setTyping(data.isTyping, data.userId);
        };

        const handleMessageRead = (data: { conversationId: string, readBy: string }) => {
            if (data.conversationId === conversation._id) {
                // Optimistically update messages to read only if they were read by the other person
                useChatStore.setState((state) => ({
                    messages: state.messages.map(msg => {
                        const senderId = typeof msg.senderId === 'string'
                            ? msg.senderId
                            : msg.senderId?._id;

                        if (senderId !== data.readBy && msg.status !== 'read') {
                            return { ...msg, status: 'read' };
                        }
                        return msg;
                    })
                }));
            }
        };

        const handleMessageDeleted = (data: { conversationId: string, messageId: string, isDeletedForEveryone: boolean }) => {
            if (data.conversationId === conversation._id) {
                if (data.isDeletedForEveryone) {
                    loadMessages(conversation._id);
                }
            }
        }

        console.log('ChatBox: Setting up socket listeners');
        socket?.on('chat:message', handleNewMessage);
        socket?.on('chat:typing', handleTyping);
        socket?.on('chat:messages-read', handleMessageRead);
        socket?.on('chat:message-deleted', handleMessageDeleted);

        return () => {
            console.log('ChatBox: Cleaning up socket listeners');
            socket?.off('chat:message', handleNewMessage);
            socket?.off('chat:typing', handleTyping);
            socket?.off('chat:messages-read', handleMessageRead);
            socket?.off('chat:message-deleted', handleMessageDeleted);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, conversation._id, otherUser?._id, loadMessages, user?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || isSending) return;

        setIsSending(true);
        console.log('ChatBox: Sending message...');
        try {
            await sendMessage(conversation._id, messageInput.trim());
            setMessageInput('');

            socket?.emit('chat:typing', { conversationId: conversation._id, isTyping: false });
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);

        socket?.emit('chat:typing', { conversationId: conversation._id, isTyping: true });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

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

    const onEmojiClick = (emojiObject: { emoji: string }) => {
        setMessageInput((prevInput) => prevInput + emojiObject.emoji);
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset input
        event.target.value = '';

        setIsUploading(true);
        try {
            // 1. Get Signed URL
            const { data } = await getSignedUrlApi(file.name, file.type);
            const { uploadUrl, fileUrl } = data.data;

            // 2. Upload to S3
            // The signed URL allows PUT request with specific Content-Type
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type
                }
            });

            // 4. Determine Message Type
            let messageType: 'image' | 'video' | 'audio' | 'file' = 'file';
            if (file.type.startsWith('image/')) messageType = 'image';
            else if (file.type.startsWith('video/')) messageType = 'video';
            else if (file.type.startsWith('audio/')) messageType = 'audio';

            // 5. Send Message
            await sendMessage(conversation._id, '', fileUrl, messageType);

        } catch (error) {
            console.error('File upload failed:', error);
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
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
                {(!messages || messages.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-60">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
                            <Send className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="font-medium">No messages yet.</p>
                        <p className="text-sm">Say hello to start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {(messages || []).map((message) => (
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
            <div className="bg-white border-t border-gray-100 p-4 md:p-6 relative">
                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-full left-6 mb-2 z-50 shadow-2xl rounded-xl border border-gray-100">
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(false)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all z-10"
                            >
                                <X size={14} />
                            </button>
                            <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 bg-gray-50 p-2 pr-2 rounded-[2rem] border border-gray-200 focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition-all shadow-inner">
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-all"
                    >
                        <Smile size={20} />
                    </button>

                    <button
                        onClick={handleFileSelect}
                        disabled={isUploading}
                        className={`p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all ${isUploading ? 'animate-pulse opacity-50' : ''}`}
                    >
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    <input
                        type="text"
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder={isUploading ? "Uploading file..." : "Type your message..."}
                        className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 font-medium"
                        disabled={isSending || isUploading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isSending || isUploading}
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
