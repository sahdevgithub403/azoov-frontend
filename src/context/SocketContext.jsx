import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket Connected");
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error", frame);
      }
    });

    client.activate();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <SocketContext.Provider value={stompClient}>
      {children}
    </SocketContext.Provider>
  );
};
