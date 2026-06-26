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

    let cancelled = false;

    fetch("/api/auth/socket-token")
      .then((r) => r.json())
      .then(({ token }: { token?: string }) => {
        if (cancelled || !token) return;

        const socket = io(WS_URL, {
          path: "/api/socket",
          auth: { token },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
        });

        socket.on("disconnect", () => {
          setConnected(false);
        });

        socket.on("users:count", (count: number) => {
          setConnectedUsers(count);
        });

        socket.on("notification:receive", (data: { title: string; message: string; icon?: string }) => {
          toast(`${data.icon ?? "🔔"} ${data.title}: ${data.message}`, {
            duration: 5000,
          });
        });
      })
      .catch(() => {
        // Socket.IO unavailable (e.g., Vercel serverless) — silently skip
      });

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
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
