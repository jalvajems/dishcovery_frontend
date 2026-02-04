import React, { useState } from 'react';
import type { Message as MessageType } from '@/types/chat';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore'; // Import chat store
import { format, isToday, isYesterday } from 'date-fns';
import { MoreVertical, Trash2 } from 'lucide-react';

interface MessageBubbleProps {
    message: MessageType;
}

import ConfirmModal from '../shared/ConfirmModal';

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { user } = useAuthStore();
    const { deleteMessage } = useChatStore();
    const [showOptions, setShowOptions] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ forEveryone: boolean } | null>(null);

    // Safe ID extraction
    const getUserId = (u: any): string => {
        if (!u) return '';
        if (typeof u === 'string') return u;
        if (typeof u._id === 'string') return u._id;
        if (typeof u.id === 'string') return u.id;
        return String(u);
    };

    const senderIdStr = getUserId(message.senderId);
    const currentUserIdStr = getUserId(user);

    const isSender = senderIdStr === currentUserIdStr;
    const isDeletedForMe = message.deletedFor?.includes(currentUserIdStr);

    // If deleted for me, don't render anything
    if (isDeletedForMe) return null;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'h:mm a');
        } else if (isYesterday(date)) {
            return `Yesterday ${format(date, 'h:mm a')}`;
        } else {
            return format(date, 'MMM dd, h:mm a');
        }
    };

    const handleDeleteClick = (forEveryone: boolean) => {
        setConfirmAction({ forEveryone });
        setShowConfirm(true);
        setShowOptions(false);
    };

    const handleConfirmDelete = async () => {
        if (confirmAction) {
            await deleteMessage(message._id, confirmAction.forEveryone);
            setShowConfirm(false);
            setConfirmAction(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setConfirmAction(null);
    };

    // Message Content
    const renderContent = () => {
        if (message.isDeletedForEveryone) {
            return (
                <p className="italic text-gray-500 text-sm flex items-center gap-2">
                    <span className="block w-4 h-4 rounded-full border border-gray-400 opacity-50 slash-icon">🚫</span>
                    This message was deleted
                </p>
            );
        }
        return <p className="text-sm rounded-lg whitespace-pre-wrap leading-relaxed">{message.content}</p>;
    };

    return (
        <>
            <div
                className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2 group relative`}
                onMouseLeave={() => setShowOptions(false)}
            >


                <div
                    className={`max-w-[70%] relative px-3 py-2 shadow-sm 
                    ${isSender
                            ? 'bg-[#dcf8c6] rounded-l-lg rounded-br-lg rounded-tr-none text-gray-800'
                            : 'bg-white rounded-r-lg rounded-bl-lg rounded-tl-none text-gray-800 border border-gray-200'
                        }`}
                >
                    {/* Sender Name in Group Chat */}
                    {!isSender && !message.isDeletedForEveryone && (
                        <p className="text-[10px] font-bold text-orange-600 mb-1 leading-none">
                        </p>
                    )}

                    {/* Options Button (Inside Bubble) */}
                    {!message.isDeletedForEveryone && (
                        <div className={`opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 p-1 z-10`}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowOptions(!showOptions);
                                }}
                                className="p-1 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 backdrop-blur-sm transition-colors"
                            >
                                <MoreVertical size={14} className="text-gray-600" />
                            </button>

                            {/* Context Menu */}
                            {showOptions && (
                                <div className="absolute z-50 top-6 right-0 w-40 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-1 text-left origin-top-right">
                                    <button
                                        onClick={() => handleDeleteClick(false)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={14} className="text-red-500" /> Delete for me
                                    </button>
                                    {isSender && (
                                        <button
                                            onClick={() => handleDeleteClick(true)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-t border-gray-50"
                                        >
                                            <Trash2 size={14} className="text-red-500" /> Delete for everyone
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {renderContent()}

                    <div className="flex items-center justify-end gap-1 mt-1 -mb-1 select-none">
                        <span className="text-[10px] text-gray-500 min-w-fit">
                            {formatTime(message.createdAt)}
                        </span>

                        {isSender && !message.isDeletedForEveryone && (
                            <span className="flex items-center">
                                {message.status === 'read' ? (
                                    <div className="flex -space-x-1">
                                        <span className="text-[#34B7F1] text-xs font-bold">✓</span>
                                        <span className="text-[#34B7F1] text-xs font-bold">✓</span>
                                    </div>
                                ) : message.status === 'delivered' ? (
                                    <div className="flex -space-x-1">
                                        <span className="text-gray-400 text-xs font-bold">✓</span>
                                        <span className="text-gray-400 text-xs font-bold">✓</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs font-bold">✓</span>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={confirmAction?.forEveryone ? "Delete for Everyone?" : "Delete for Me?"}
                message={confirmAction?.forEveryone
                    ? "This message will be deleted for everyone in this chat. This action cannot be undone."
                    : "This message will be removed from your device. Other participants will still see it."
                }
                confirmText="Delete"
                confirmVariant="danger"
            />
        </>
    );
};

export default MessageBubble;
