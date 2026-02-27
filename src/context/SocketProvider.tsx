/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { toast } from 'react-toastify';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}
const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, user } = useAuthStore();
    const { addNotification, fetchUnreadCount } = useNotificationStore();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = React.useState(false);

    useEffect(() => {
        if (!token || !user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        if (!socketRef.current) {
            socketRef.current = io('http://localhost:4000', {
                auth: { token },
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            socketRef.current.on('connect', () => {
                console.log('Global Socket Connected:', socketRef.current?.id);
                setIsConnected(true);
            });

            socketRef.current.on('disconnect', () => {
                console.log('Global Socket Disconnected');
                setIsConnected(false);
            });

            socketRef.current.on('notification:new', (notification) => {
                addNotification(notification);
                fetchUnreadCount();
                toast.info(notification.message, {
                    onClick: () => {
                    }
                });
            });
        }

        return () => {
        };
    }, [token, user]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
