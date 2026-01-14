import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WebSocket Connected");
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Error", frame);
      },
    });

    stompClient.activate();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  return (
    <SocketContext.Provider value={client}>
      {children}
    </SocketContext.Provider>
  );
};
