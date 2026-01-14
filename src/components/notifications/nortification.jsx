import { useEffect } from "react";
import { useSocket } from "./SocketContext";

export const Notifications = () => {
  const stompClient = useSocket();

  useEffect(() => {
    if (!stompClient) return;

    const subscription = stompClient.subscribe(
      "/topic/notifications",
      (msg) => {
        console.log("📩 Notification:", msg.body);
      }
    );

    return () => subscription.unsubscribe();
  }, [stompClient]);

  const sendMessage = () => {
    stompClient.publish({
      destination: "/app/notifications",
      body: "Hello from React 🚀",
    });
  };

  return (
    <div>
      <h1>WebSocket Test</h1>
      <button onClick={sendMessage}>Send Notification</button>
    </div>
  );
}

export default Notification;
