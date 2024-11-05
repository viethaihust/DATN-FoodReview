import { BACKEND_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (userId: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${BACKEND_URL}`, {
      transports: ["websocket"],
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
