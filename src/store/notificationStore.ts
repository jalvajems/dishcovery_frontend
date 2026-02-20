import { create } from 'zustand';
import {
    getUserNotificationsApi,
    markNotificationAsReadApi,
    markAllNotificationsAsReadApi,
    getUnreadNotificationCountApi,
    clearAllNotificationsApi
} from '../api/notificationApi';
import { logError } from '../utils/errorHandler';

import type { INotification } from '@/types/notification.types';

interface INotificationStore {
    notifications: INotification[];
    unreadCount: number;
    isLoading: boolean;
    filter: 'all' | 'unread' | 'read';

    fetchNotifications: (limit?: number, skip?: number) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    addNotification: (notification: INotification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    setFilter: (filter: 'all' | 'unread' | 'read') => void;
}

export const useNotificationStore = create<INotificationStore>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    filter: 'all',

    fetchNotifications: async (limit = 20, skip = 0) => {
        set({ isLoading: true });
        try {
            const { filter } = get();
            const response = await getUserNotificationsApi(limit, skip, filter);
            set({ notifications: response.data.data });
        } catch (error) {
            logError(error, "Failed to fetch notifications");
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const response = await getUnreadNotificationCountApi();
            set({ unreadCount: response.data.data.count });
        } catch (error) {
            logError(error, "Failed to fetch unread count");
        }
    },

    addNotification: (notification: INotification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    },

    markAsRead: async (id: string) => {
        try {
            // Optimistic update
            const notification = get().notifications.find(n => n._id === id);
            if (notification && !notification.isRead) {
                set((state) => ({
                    notifications: state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n),
                    unreadCount: Math.max(0, state.unreadCount - 1)
                }));
                await markNotificationAsReadApi(id);
            }
        } catch (error) {
            logError(error, "Failed to mark notification as read");
            // Revert on failure? For now simpler to just log
        }
    },

    markAllAsRead: async () => {
        try {
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
            await markAllNotificationsAsReadApi();
        } catch (error) {
            logError(error, "Failed to mark all as read");
        }
    },

    clearAll: async () => {
        try {
            set({ notifications: [], unreadCount: 0 });
            await clearAllNotificationsApi();
        } catch (error) {
            logError(error, "Failed to clear all notifications");
        }
    },

    setFilter: (filter: 'all' | 'unread' | 'read') => {
        set({ filter });
        get().fetchNotifications();
    }
}));
