"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  connectedUsers: number;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  connectedUsers: 0,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    if (!session?.user) return;

    const WS_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3000";

    const socket = io(WS_URL, {
      path: "/api/socket",
      auth: { token: (session as { accessToken?: string }).accessToken ?? "" },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("[Socket] Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("[Socket] Disconnected");
    });

    socket.on("users:count", (count: number) => {
      setConnectedUsers(count);
    });

    socket.on("notification:receive", (data: { title: string; message: string; icon?: string }) => {
      toast(`${data.icon ?? "🔔"} ${data.title}: ${data.message}`, {
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, connectedUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
