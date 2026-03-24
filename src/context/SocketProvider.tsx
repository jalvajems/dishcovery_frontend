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
                console.log('Disconnecting global socket...');
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        if (!socketRef.current) {
            const getSocketUrl = () => {
                if (import.meta.env.VITE_API_URL) {
                    try {
                        const url = new URL(import.meta.env.VITE_API_URL);
                        return url.origin;
                    } catch (e) {
                        console.error("Invalid VITE_API_URL:", e);
                    }
                }
                return import.meta.env.PROD ? window.location.origin : 'http://localhost:4000';
            };

            const socketUrl = getSocketUrl();
            console.log('Connecting to global socket server at:', socketUrl);

            socketRef.current = io(socketUrl, {
                auth: { token },
                transports: ['websocket'],
                path: '/socket.io',
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
                console.log('New notification received:', notification);
                addNotification(notification);
                fetchUnreadCount();
                toast.info(notification.message);
            });
            
            socketRef.current.on('connect_error', (error) => {
                console.error('Global Socket connection error:', error);
            });
        }

        return () => {
            // We usually want the socket to persist across page navigations if the user is still logged in
            // so we don't disconnect here unless we specifically want to.
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
