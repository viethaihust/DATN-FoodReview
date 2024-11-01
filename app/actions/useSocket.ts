import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (userId: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000", {
      transports: ["websocket"], // Use websocket transport
    });

    setSocket(newSocket);

    newSocket.emit("join", userId);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useSocket;
