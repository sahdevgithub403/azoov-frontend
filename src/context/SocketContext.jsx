import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },

      onConnect: () => {
        console.log("✅ WebSocket Connected");
        setIsConnected(true);
      },

      onDisconnect: () => {
        console.log("❌ WebSocket Disconnected");
        setIsConnected(false);
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Error", frame);
        setIsConnected(false);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ client, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
