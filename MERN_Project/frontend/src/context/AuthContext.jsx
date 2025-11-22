import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import socketService from '../services/socketService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem('pes_token'));
	const [socketConnected, setSocketConnected] = useState(false);

	useEffect(() => {
		if (token) {
			const stored = localStorage.getItem('pes_user');
			if (stored) {
				setUser(JSON.parse(stored));
				// Connect to WebSocket when token is available
				connectWebSocket(token);
			}
		}
		
		return () => {
			// Cleanup WebSocket on unmount
			socketService.disconnect();
		};
	}, [token]);

	const connectWebSocket = (authToken) => {
		try {
			const socket = socketService.connect(authToken);
			if (socket) {
				socket.on('connect', () => {
					setSocketConnected(true);
					console.log('✅ Real-time connection established');
				});
				socket.on('disconnect', () => {
					setSocketConnected(false);
					console.log('❌ Real-time connection lost');
				});
			}
		} catch (error) {
			console.error('WebSocket connection error:', error);
		}
	};

	const login = async (srn, password) => {
		const res = await authService.login({ srn, password, isAdmin: false });
		if (res && res.token) {
			localStorage.setItem('pes_token', res.token);
			localStorage.setItem('pes_user', JSON.stringify(res.user));
			setToken(res.token);
			setUser(res.user);
			connectWebSocket(res.token);
		}
		return res;
	};

	const loginAdmin = async (srn, password) => {
		const res = await authService.login({ srn, password, isAdmin: true });
		if (res && res.token) {
			localStorage.setItem('pes_token', res.token);
			localStorage.setItem('pes_user', JSON.stringify(res.user));
			setToken(res.token);
			setUser(res.user);
			connectWebSocket(res.token);
		}
		return res;
	};

	const register = async (payload) => {
		const res = await authService.register({ ...payload, role: 'customer' });
		// Do NOT auto-login after registration
		// User must explicitly login after registering
		return res;
	};

	const registerAdmin = async (payload) => {
		const res = await authService.register({ ...payload, role: 'admin' });
		// Do NOT auto-login after registration
		// User must explicitly login after registering
		return res;
	};

	const logout = () => {
		// Clear all user-specific data from localStorage
		const userId = user?._id;
		localStorage.removeItem('pes_token');
		localStorage.removeItem('pes_user');
		if (userId) {
			localStorage.removeItem(`pesbuddy_cart_${userId}`);
		}
		setToken(null);
		setUser(null);
		socketService.disconnect();
		setSocketConnected(false);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, loginAdmin, logout, register, registerAdmin, socketConnected }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
