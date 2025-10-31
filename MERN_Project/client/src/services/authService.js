import API from './api';

const register = async (payload) => {
	const res = await API.post('/auth/register', payload);
	return res.data;
};

const login = async (payload) => {
	const res = await API.post('/auth/login', payload);
	return res.data;
};

export default { register, login };
