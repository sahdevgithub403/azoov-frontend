import { createContext, useContext, useState, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useEffect } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const socket = useSocket();

    // Subscribe to WebSocket notifications
    useEffect(() => {
        if (!socket) return;

        const subscription = socket.subscribe('/topic/notifications', (message) => {
            const notification = JSON.parse(message.body);
            addNotification(notification.type, notification.title, notification.message);
        });

        return () => subscription.unsubscribe();
    }, [socket]);

    const addNotification = useCallback((type, title, message) => {
        const id = Date.now();
        const newNotification = { id, type, title, message };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const showSuccess = useCallback((title, message) => {
        addNotification('success', title, message);
    }, [addNotification]);

    const showError = useCallback((title, message) => {
        addNotification('error', title, message);
    }, [addNotification]);

    const showWarning = useCallback((title, message) => {
        addNotification('warning', title, message);
    }, [addNotification]);

    const showInfo = useCallback((title, message) => {
        addNotification('info', title, message);
    }, [addNotification]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                showSuccess,
                showError,
                showWarning,
                showInfo,
                removeNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
