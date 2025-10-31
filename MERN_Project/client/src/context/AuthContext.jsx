import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem('pes_token'));

	useEffect(() => {
		if (token) {
			const stored = localStorage.getItem('pes_user');
			if (stored) setUser(JSON.parse(stored));
		}
	}, [token]);

	const login = async (srn, password) => {
		const res = await authService.login({ srn, password });
		if (res && res.token) {
			localStorage.setItem('pes_token', res.token);
			localStorage.setItem('pes_user', JSON.stringify(res.user));
			setToken(res.token);
			setUser(res.user);
		}
		return res;
	};

	const register = async (payload) => {
		const res = await authService.register(payload);
		if (res && res.token) {
			localStorage.setItem('pes_token', res.token);
			localStorage.setItem('pes_user', JSON.stringify(res.user));
			setToken(res.token);
			setUser(res.user);
		}
		return res;
	};

	const logout = () => {
		localStorage.removeItem('pes_token');
		localStorage.removeItem('pes_user');
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
