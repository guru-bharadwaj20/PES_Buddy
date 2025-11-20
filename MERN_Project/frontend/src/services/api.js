import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
	baseURL: API_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});

// Attach token if present
API.interceptors.request.use(config => {
	const token = localStorage.getItem('pes_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
}, err => Promise.reject(err));

// Add response interceptor for better error handling
API.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			localStorage.removeItem('pes_token');
			localStorage.removeItem('pes_user');
			window.location.href = '/auth/login';
		}
		return Promise.reject(error);
	}
);

export default API;
