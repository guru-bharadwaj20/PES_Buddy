import API from './api';

const getCanteens = async () => {
	const res = await API.get('/doormato/canteens');
	return res.data;
};

const getMenu = async (canteenId) => {
	const res = await API.get(`/doormato/menu/${canteenId}`);
	return res.data;
};

const createOrder = async (payload) => {
	const res = await API.post('/doormato/order', payload);
	return res.data;
};

export default { getCanteens, getMenu, createOrder };
