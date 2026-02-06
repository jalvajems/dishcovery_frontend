import React, { useState, useEffect, useRef } from 'react';
import { askAiBot } from '../../api/aiApi';
import { useAuthStore } from '../../store/authStore';
import { X, Send, Loader2, ChefHat, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'ai',
            text: "Hello! I'm Dishcovery AI. Ask me anything about food, cooking, or recipes!",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get current user role from store
    const { user } = useAuthStore();
    const userRole = user?.role || 'foodie';

    if (userRole === 'admin') return null;

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await askAiBot(userMessage.text, userRole);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: response.reply,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Failed to get AI response", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: "Sorry, I'm having trouble connecting to the kitchen right now. Please try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative z-50">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full shadow-lg transition-all duration-300 relative group ${isOpen
                    ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-emerald-500/30'
                    }`}
            >
                {isOpen ? (
                    <X size={22} strokeWidth={2.5} />
                ) : (
                    <>
                        <Bot size={24} strokeWidth={2} className="relative z-10" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-12 right-0 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-emerald-600 p-3 flex items-center justify-between text-white shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-full">
                                    <ChefHat size={16} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Dishcovery AI</h3>
                                    <p className="text-[10px] text-emerald-100 opacity-90 capitalize leading-tight">
                                        {userRole} Assistant
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-950">
                            <div className="flex flex-col gap-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-2 max-w-[90%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user'
                                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-200'
                                                }`}
                                        >
                                            {msg.sender === 'user' ? <User size={12} /> : <ChefHat size={12} />}
                                        </div>
                                        <div
                                            className={`p-2.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            {msg.sender === 'user' ? (
                                                msg.text
                                            ) : (
                                                <div className="prose prose-xs dark:prose-invert max-w-none prose-p:my-0.5 prose-headings:my-1 prose-ul:my-0.5 prose-li:my-0">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: (props: any) => <p className="mb-1 last:mb-0">{props.children}</p>,
                                                            ul: (props: any) => <ul className="list-disc ml-4 mb-2 space-y-1">{props.children}</ul>,
                                                            ol: (props: any) => <ol className="list-decimal ml-4 mb-2 space-y-1">{props.children}</ol>,
                                                            li: (props: any) => <li className="pl-1">{props.children}</li>,
                                                            h1: (props: any) => <h1 className="text-sm font-bold mb-1 mt-1">{props.children}</h1>,
                                                            h2: (props: any) => <h2 className="text-xs font-bold mb-1 mt-1">{props.children}</h2>,
                                                            h3: (props: any) => <h3 className="text-xs font-bold mb-1 mt-1">{props.children}</h3>,
                                                            code: (props: any) => <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-[10px] font-mono">{props.children}</code>,
                                                            blockquote: (props: any) => <blockquote className="border-l-2 border-emerald-500 pl-2 italic my-1 text-gray-600 dark:text-gray-400">{props.children}</blockquote>,
                                                            table: (props: any) => <div className="overflow-x-auto my-1"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-[10px] border border-gray-200 dark:border-gray-700 rounded-lg">{props.children}</table></div>,
                                                            th: (props: any) => <th className="px-1 py-0.5 bg-gray-50 dark:bg-gray-800 text-left font-semibold text-gray-900 dark:text-gray-200">{props.children}</th>,
                                                            td: (props: any) => <td className="px-1 py-0.5 border-t border-gray-200 dark:border-gray-700">{props.children}</td>,
                                                            strong: (props: any) => <strong className="font-semibold text-gray-900 dark:text-white">{props.children}</strong>,
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="self-start flex items-center gap-2 max-w-[85%]">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                            <ChefHat size={12} />
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-2.5 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin text-emerald-500" />
                                            <span className="text-[10px] text-gray-500">Cooking up a response...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask anything..."
                                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full pl-3 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all border border-transparent focus:border-emerald-500"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
