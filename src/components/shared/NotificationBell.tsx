import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
    const {
        notifications,
        unreadCount,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        isLoading
    } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Initial fetch
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute as backup
        return () => clearInterval(interval);
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification: any) => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }

        // Navigation logic
        if (notification.type === 'SESSION_STARTED' && notification.workshopId) {
            // Check role to determine path? 
            // The bell allows generic navigation, but routes might differ.
            // Assuming current user role context matches notification.
            // But better safe:
            if (notification.recipientRole === 'chef') {
                navigate(`/chef/workshops/${notification.workshopId}`); // Or live session
            } else {
                navigate(`/foodie/live-session/${notification.workshopId}`);
            }
        } else if ((notification.type === 'WORKSHOP_APPROVED' || notification.type === 'WORKSHOP_REJECTED') && notification.workshopId) {
            navigate(`/chef/workshops`);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
                <Bell size={24} className="text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-[100] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoading && notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                                <Bell size={32} className="opacity-20" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                                    >
                                        {!notification.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                                        )}
                                        <div className="flex gap-3">
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-2">
                                                    {new Date(notification.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
