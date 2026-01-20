import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSocket } from './SocketContext';

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { client, isConnected } = useSocket() || {};

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

    // Subscribe to WebSocket notifications
    useEffect(() => {
        if (!client || !isConnected) {
            console.log('⏳ Waiting for WebSocket connection...');
            return;
        }

        console.log('✅ Subscribing to notifications...');

        try {
            const subscription = client.subscribe('/topic/notifications', (message) => {
                try {
                    const notification = JSON.parse(message.body);
                    console.log('📬 Received notification:', notification);
                    addNotification(notification.type, notification.title, notification.message);
                } catch (error) {
                    console.error('Error parsing notification:', error);
                }
            });

            console.log('✅ Successfully subscribed to notifications');

            return () => {
                console.log('🔌 Unsubscribing from notifications');
                subscription.unsubscribe();
            };
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
        }
    }, [client, isConnected, addNotification]);

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
