import { io } from 'socket.io-client';

class SocketService {
	constructor() {
		this.socket = null;
		this.connected = false;
	}

	connect(token) {
		if (this.socket && this.connected) {
			console.log('Socket already connected');
			return;
		}

		const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
		
		this.socket = io(WS_URL, {
			auth: { token },
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5
		});

		this.socket.on('connect', () => {
			this.connected = true;
			console.log('✅ WebSocket connected:', this.socket.id);
		});

		this.socket.on('disconnect', (reason) => {
			this.connected = false;
			console.log('❌ WebSocket disconnected:', reason);
		});

		this.socket.on('connect_error', (error) => {
			console.error('WebSocket connection error:', error.message);
		});

		this.socket.on('reconnect', (attemptNumber) => {
			console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
		});

		return this.socket;
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			this.connected = false;
			console.log('Socket disconnected manually');
		}
	}

	// Listen to user count updates
	onUserCountUpdate(callback) {
		if (this.socket) {
			this.socket.on('users:count', callback);
		}
	}

	// Listen to new orders
	onNewOrder(callback) {
		if (this.socket) {
			this.socket.on('order:new', callback);
		}
	}

	// Listen to order status updates
	onOrderStatus(callback) {
		if (this.socket) {
			this.socket.on('order:status', callback);
		}
	}

	// Listen to scooter bookings
	onScooterBooked(callback) {
		if (this.socket) {
			this.socket.on('scooter:booked', callback);
		}
	}

	// Listen to scooter availability updates
	onScooterAvailability(callback) {
		if (this.socket) {
			this.socket.on('scooter:availability', callback);
		}
	}

	// Listen to expense additions
	onExpenseAdded(callback) {
		if (this.socket) {
			this.socket.on('expense:added', callback);
		}
	}

	// Listen to new expense
	onNewExpense(callback) {
		if (this.socket) {
			this.socket.on('expense:new', callback);
		}
	}

	// Listen to notifications
	onNotification(callback) {
		if (this.socket) {
			this.socket.on('notification:receive', callback);
		}
	}

	// Emit order update
	emitOrderUpdate(data) {
		if (this.socket && this.connected) {
			this.socket.emit('order:update', data);
		}
	}

	// Emit scooter update
	emitScooterUpdate(data) {
		if (this.socket && this.connected) {
			this.socket.emit('scooter:update', data);
		}
	}

	// Emit expense addition
	emitExpenseAdd(data) {
		if (this.socket && this.connected) {
			this.socket.emit('expense:add', data);
		}
	}

	// Send notification
	sendNotification(data) {
		if (this.socket && this.connected) {
			this.socket.emit('notification:send', data);
		}
	}

	// Remove event listeners
	removeListener(event, callback) {
		if (this.socket) {
			this.socket.off(event, callback);
		}
	}

	isConnected() {
		return this.connected;
	}

	getSocket() {
		return this.socket;
	}
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
