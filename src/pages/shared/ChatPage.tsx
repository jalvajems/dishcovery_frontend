import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import ChatList from '@/components/chat/ChatList';
import ChatBox from '@/components/chat/ChatBox';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/context/SocketProvider';

import type { Conversation } from "@/types/chat";

const ChatPage: React.FC = () => {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { conversations, activeConversation, setActiveConversation, loadConversations } = useChatStore();
    const { socket } = useSocket();
    const [isMobileView, setIsMobileView] = useState(false);

    const basePath = user?.role === 'chef' ? '/chef/chat' : '/foodie/chat';

    useEffect(() => {
        loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = () => {
            loadConversations();
        };

        socket.on('chat:conversation-update', handleMessage);

        return () => {
            socket.off('chat:conversation-update', handleMessage);
        };
    }, [socket, loadConversations]);

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 1024);
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find((c: Conversation) => c._id === conversationId);
            if (conversation) {
                setActiveConversation(conversation);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId, conversations]);

    const handleSelectConversation = (conversation: Conversation) => {
        setActiveConversation(conversation);
        navigate(`${basePath}/${conversation._id}`);
    };

    const handleBackToList = () => {
        setActiveConversation(null);
        navigate(basePath);
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Messages</h1>
                <button
                    onClick={() => navigate(user?.role === 'chef' ? '/chef/dashboard' : '/foodie/dashboard')}
                    className="text-sm bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl transition-all font-bold border border-gray-200 shadow-sm hover:shadow"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 p-4 md:p-8 overflow-hidden flex justify-center">
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex">
                    {/* Desktop: Always show both panels */}
                    {!isMobileView && (
                        <>
                            <div className="w-1/3 border-r border-gray-100 bg-gray-50/50">
                                <ChatList
                                    conversations={conversations}
                                    activeConversationId={activeConversation?._id || null}
                                    onSelectConversation={handleSelectConversation}
                                />
                            </div>
                            <div className="flex-1 bg-white">
                                {activeConversation ? (
                                    <ChatBox conversation={activeConversation} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white/50">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                            <MessageSquare className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">Your Messages</h3>
                                        <p className="text-gray-500">Select a conversation to start chatting</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Mobile: Show one panel at a time */}
                    {isMobileView && (
                        <>
                            {!activeConversation ? (
                                <div className="flex-1">
                                    <ChatList
                                        conversations={conversations}
                                        activeConversationId={null}
                                        onSelectConversation={handleSelectConversation}
                                    />
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <ChatBox conversation={activeConversation} onBack={handleBackToList} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
