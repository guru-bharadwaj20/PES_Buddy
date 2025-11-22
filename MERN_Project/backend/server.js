import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doormatoRoutes from "./routes/doormatoRoutes.js";
import scootigoRoutes from "./routes/scootigoRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
	cors: {
		origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
		credentials: true,
		methods: ["GET", "POST"]
	}
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO authentication middleware
io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	if (!token) {
		return next(new Error("Authentication error"));
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		socket.userId = decoded.id;
		next();
	} catch (err) {
		next(new Error("Authentication error"));
	}
});

// Socket.IO connection handling
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.userId} (${socket.id})`);
	
	// Add user to connected users
	connectedUsers.set(socket.userId, socket.id);
	
	// Broadcast updated user count
	io.emit("users:count", connectedUsers.size);
	
	// Join user-specific room
	socket.join(`user:${socket.userId}`);
	
	// Handle order status updates
	socket.on("order:update", (data) => {
		io.emit("order:status", data);
	});
	
	// Handle scooter availability updates
	socket.on("scooter:update", (data) => {
		io.emit("scooter:availability", data);
	});
	
	// Handle expense updates
	socket.on("expense:add", (data) => {
		socket.to(`user:${socket.userId}`).emit("expense:new", data);
	});
	
	// Handle real-time notifications
	socket.on("notification:send", (data) => {
		if (data.targetUserId) {
			io.to(`user:${data.targetUserId}`).emit("notification:receive", data);
		} else {
			io.emit("notification:receive", data);
		}
	});
	
	// Handle disconnection
	socket.on("disconnect", () => {
		console.log(`User disconnected: ${socket.userId} (${socket.id})`);
		connectedUsers.delete(socket.userId);
		io.emit("users:count", connectedUsers.size);
	});
});

// Make io available to routes
app.set("io", io);

// middleware
app.use(cors({
	origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/doormato", doormatoRoutes);
app.use("/api/scootigo", scootigoRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// health
app.get("/", (req, res) => res.json({ 
	ok: true, 
	message: "PES Buddy API",
	websocket: "enabled",
	connectedUsers: connectedUsers.size
}));

// start
const start = async () => {
	try {
		await connectDB();
		httpServer.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
			console.log(`🔌 WebSocket server is ready`);
			console.log(`🌐 CORS enabled for ${CLIENT_URL}`);
		});
	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
};

start();

export { io };
