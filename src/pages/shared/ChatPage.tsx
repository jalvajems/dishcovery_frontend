import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import ChatList from '@/components/chat/ChatList';
import ChatBox from '@/components/chat/ChatBox';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import type { Conversation } from '@/types/chat';

const ChatPage: React.FC = () => {
    const { conversationId } = useParams<{ conversationId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { 
        conversations, 
        activeConversation, 
        loadConversations, 
        setActiveConversation 
    } = useChatStore();

    const [isMobileView, setIsMobileView] = useState(false);

    const basePath = user?.role === 'chef' ? '/chef/chat' : '/foodie/chat';

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 1024);
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    useEffect(() => {
        console.log('ChatPage: Loading conversations...');
        loadConversations();
    }, [loadConversations]);

    useEffect(() => {
        console.log('ChatPage: Conversations loaded:', conversations.length);
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find((c: Conversation) => c._id === conversationId);
            if (conversation) {
                console.log('ChatPage: Setting active conversation:', conversationId);
                setActiveConversation(conversation);
            } else {
                console.warn('ChatPage: Conversation ID from URL not found in list:', conversationId);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId, conversations]);

    const handleSelectConversation = (conversation: Conversation) => {
        console.log('ChatPage: User selected conversation:', conversation._id);
        setActiveConversation(conversation);
        navigate(`${basePath}/${conversation._id}`);
    };

    const handleBackToList = useCallback(() => {
        console.log('ChatPage: User going back to list');
        setActiveConversation(null);
        navigate(basePath);
    }, [navigate, basePath, setActiveConversation]);

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
            {user?.role === 'chef' ? <ChefNavbar /> : <FoodieNavbar />}
            
            <div className="flex flex-1 overflow-hidden relative mt-16 lg:mt-20">
                {/* Chat List - Hidden on mobile when a chat is active */}
                <div className={`
                    ${isMobileView && activeConversation ? 'hidden' : 'flex'}
                    w-full lg:w-[380px] xl:w-[420px] bg-white border-r border-gray-100 flex-col shadow-sm z-20 transition-all duration-300
                `}>
                    <ChatList 
                        conversations={conversations}
                        activeConversationId={activeConversation?._id}
                        onSelectConversation={handleSelectConversation}
                    />
                </div>

                {/* Chat Box - Full screen on mobile when active */}
                <div className={`
                    ${isMobileView && !activeConversation ? 'hidden' : 'flex'}
                    flex-1 flex-col bg-white overflow-hidden z-10
                `}>
                    {activeConversation ? (
                        <ChatBox 
                            conversation={activeConversation}
                            onBack={isMobileView ? handleBackToList : undefined}
                        />
                    ) : (
                        <div className="hidden lg:flex flex-col items-center justify-center flex-1 space-y-6 bg-slate-50/30">
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-green-500 animate-bounce-slow">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Pick up where you left off</h2>
                                <p className="text-gray-400 font-medium">Select a conversation from the left to start chatting.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
