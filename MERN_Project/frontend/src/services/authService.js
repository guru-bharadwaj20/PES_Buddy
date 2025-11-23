import API from './api';

const register = async (payload) => {
	const res = await API.post('/auth/register', payload);
	return res.data;
};

const login = async (payload) => {
	const res = await API.post('/auth/login', payload);
	return res.data;
};

const forgotPassword = async (payload) => {
	const res = await API.post('/auth/forgot-password', payload);
	return res.data;
};

const updateProfile = async (payload) => {
	const res = await API.put('/auth/profile', payload);
	return res.data;
};

const resetPassword = async (payload) => {
	const res = await API.put('/auth/reset-password', payload);
	return res.data;
};

const deleteAccount = async () => {
	const res = await API.delete('/auth/account');
	return res.data;
};

export default { register, login, forgotPassword, updateProfile, resetPassword, deleteAccount };
