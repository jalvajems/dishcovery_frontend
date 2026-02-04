import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import ChatList from '@/components/chat/ChatList';
import ChatBox from '@/components/chat/ChatBox';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ChatPage: React.FC = () => {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { conversations, activeConversation, setActiveConversation, loadConversations } = useChatStore();
    const [isMobileView, setIsMobileView] = useState(false);

    // Determine base path based on user role
    const basePath = user?.role === 'chef' ? '/chef/chat' : '/foodie/chat';

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        // Handle mobile view detection
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 1024);
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    useEffect(() => {
        // Set active conversation from URL parameter
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(c => c._id === conversationId);
            if (conversation) {
                setActiveConversation(conversation);
            }
        }
    }, [conversationId, conversations]);

    const handleSelectConversation = (conversation: any) => {
        setActiveConversation(conversation);
        navigate(`${basePath}/${conversation._id}`);
    };

    const handleBackToList = () => {
        setActiveConversation(null);
        navigate(basePath);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
                <button
                    onClick={() => navigate(user?.role === 'chef' ? '/chef/dashboard' : '/foodie/dashboard')}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium border border-gray-300"
                >
                    Go to Dashboard
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Desktop: Always show both panels */}
                {!isMobileView && (
                    <>
                        <div className="w-1/3 border-r border-gray-200">
                            <ChatList
                                conversations={conversations}
                                activeConversationId={activeConversation?._id || null}
                                onSelectConversation={handleSelectConversation}
                            />
                        </div>
                        <div className="flex-1">
                            {activeConversation ? (
                                <ChatBox conversation={activeConversation} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <MessageSquare className="w-20 h-20 mb-4 text-gray-300" />
                                    <p className="text-lg">Select a conversation to start chatting</p>
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
    );
};

export default ChatPage;
