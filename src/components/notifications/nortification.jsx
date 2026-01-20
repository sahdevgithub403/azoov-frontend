/* eslint-disable react-hooks/refs */
import { createContext, useContext, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ STOMP Connected");

        subscriptionRef.current = client.subscribe(
          "/topic/notifications",
          (msg) => {
            console.log("📩 Notification:", msg.body);
          }
        );
      },

      onDisconnect: () => {
        console.log("❌ STOMP Disconnected");
      },

      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
    };
  }, []);

  return (
    <NotificationContext.Provider value={clientRef.current}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);
