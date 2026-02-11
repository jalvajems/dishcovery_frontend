import React, { useState } from 'react';
import type { Message as MessageType } from '@/types/chat';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { format, isToday, isYesterday } from 'date-fns';
import { MoreVertical, Trash2 } from 'lucide-react';
import ConfirmModal from '../shared/ConfirmModal';

interface MessageBubbleProps {
    message: MessageType;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { user } = useAuthStore();
    const { deleteMessage } = useChatStore();
    const [showOptions, setShowOptions] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ forEveryone: boolean } | null>(null);

    const getUserId = (u: any): string => {
        if (!u) return '';
        if (typeof u === 'string') return u;
        if (typeof u._id === 'string') return u._id;
        if (typeof u.id === 'string') return u.id;
        return String(u);
    };

    const senderIdStr = getUserId(message.senderId);
    const currentUserIdStr = getUserId(user);

    const isMine = senderIdStr === currentUserIdStr;
    const isDeletedForMe = message.deletedFor?.includes(currentUserIdStr);

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

        switch (message.messageType) {
            case 'image':
                return (
                    <div className="relative group">
                        <img
                            src={message.fileUrl}
                            alt="Shared image"
                            className="max-w-[250px] max-h-[250px] rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => window.open(message.fileUrl, '_blank')}
                        />
                        {message.content && <p className={`mt-2 text-sm ${isMine ? 'text-gray-800' : 'text-gray-800'}`}>{message.content}</p>}
                    </div>
                );
            case 'video':
                return (
                    <div className="max-w-[250px] bg-black rounded-lg overflow-hidden">
                        <video
                            src={message.fileUrl}
                            controls
                            className="w-full max-h-[300px]"
                        />
                        {message.content && <p className={`mt-2 text-sm p-1 ${isMine ? 'text-gray-800' : 'text-gray-800'}`}>{message.content}</p>}
                    </div>
                );
            case 'audio':
                return (
                    <div className="min-w-[200px] p-2">
                        <audio
                            src={message.fileUrl}
                            controls
                            className="w-full"
                        />
                        {message.content && <p className={`mt-2 text-sm ${isMine ? 'text-gray-800' : 'text-gray-800'}`}>{message.content}</p>}
                    </div>
                );
            case 'file':
                return (
                    <div className="flex items-center gap-3 p-3 bg-black/10 rounded-lg max-w-[250px] cursor-pointer hover:bg-black/20 transition-colors" onClick={() => window.open(message.fileUrl, '_blank')}>
                        <div className="p-2 bg-white/20 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate underline">
                                Download File
                            </p>
                        </div>
                    </div>
                );
            default:
                return <p className={`text-sm break-words leading-relaxed ${isMine ? 'text-gray-800' : 'text-gray-800'}`}>
                    {message.content}
                </p>;
        }
    };

    return (
        <>
            <div
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2 group relative`}
                onMouseLeave={() => setShowOptions(false)}
            >
                <div
                    className={`max-w-[70%] relative px-3 py-2 shadow-sm 
                    ${isMine
                            ? 'bg-[#dcf8c6] rounded-l-lg rounded-br-lg rounded-tr-none text-gray-800'
                            : 'bg-white rounded-r-lg rounded-bl-lg rounded-tl-none text-gray-800 border border-gray-200'
                        }
                    ${message.messageType !== 'text' && !message.content ? 'p-1' : ''}
                    `}
                >
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
                                    {isMine && (
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

                    {/* Message Content */}
                    <div
                        className={`
                            relative px-2 py-1 transition-all duration-200
                            ${isMine
                                ? 'text-gray-800'
                                : 'text-gray-800'
                            }
                        `}
                    >
                        {renderContent()}

                        <div className="flex items-center justify-end gap-1 mt-1 -mb-1 select-none">
                            <span className="text-[10px] text-gray-500 min-w-fit">
                                {formatTime(message.createdAt)}
                            </span>

                            {isMine && !message.isDeletedForEveryone && (
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
