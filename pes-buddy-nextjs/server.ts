import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Track connected users: userId → socketId
const connectedUsers = new Map<string, string>();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);
    await handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.NEXTAUTH_URL ?? "http://localhost:3000",
        "http://localhost:3000",
      ],
      credentials: true,
      methods: ["GET", "POST"],
    },
    path: "/api/socket",
  });

  // Attach io instance to global for use in API routes
  (globalThis as Record<string, unknown>).__io = io;

  // Socket.IO JWT middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET ?? "secret"
      ) as { sub?: string; id?: string };
      socket.data.userId = decoded.sub ?? decoded.id;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    console.log(`[WS] User connected: ${userId} (${socket.id})`);

    connectedUsers.set(userId, socket.id);
    io.emit("users:count", connectedUsers.size);
    socket.join(`user:${userId}`);

    socket.on("order:update", (data: unknown) => {
      io.emit("order:status", data);
    });

    socket.on("scooter:update", (data: unknown) => {
      io.emit("scooter:availability", data);
    });

    socket.on(
      "notification:send",
      (data: { targetUserId?: string; [key: string]: unknown }) => {
        if (data.targetUserId) {
          io.to(`user:${data.targetUserId}`).emit("notification:receive", data);
        } else {
          io.emit("notification:receive", data);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`[WS] User disconnected: ${userId} (${socket.id})`);
      connectedUsers.delete(userId);
      io.emit("users:count", connectedUsers.size);
    });
  });

  httpServer.listen(port, () => {
    console.log(`\n🚀 PES Buddy ready on http://${hostname}:${port}`);
    console.log(`🔌 Socket.IO server running on /api/socket`);
    console.log(`📦 Environment: ${dev ? "development" : "production"}\n`);
  });
});

// Helper for API routes to get the io instance
export function getSocketIO(): Server | null {
  return ((globalThis as Record<string, unknown>).__io as Server) ?? null;
}
