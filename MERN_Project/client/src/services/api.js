import axios from 'axios';

const API = axios.create({
	baseURL: 'http://localhost:5000/api',
	headers: { 'Content-Type': 'application/json' }
});

// Attach token if present
API.interceptors.request.use(config => {
	const token = localStorage.getItem('pes_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
}, err => Promise.reject(err));

export default API;
