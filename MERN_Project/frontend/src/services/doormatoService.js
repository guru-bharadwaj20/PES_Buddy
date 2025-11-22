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

const getUserOrders = async () => {
	const res = await API.get('/doormato/orders');
	return res.data;
};

const getAllOrders = async () => {
	const res = await API.get('/admin/orders');
	return res.data;
};

const updateOrderStatus = async (orderId, status, rejectionReason = null) => {
	const payload = { status };
	if (rejectionReason) {
		payload.rejectionReason = rejectionReason;
	}
	const res = await API.patch(`/doormato/order/${orderId}/status`, payload);
	return res.data;
};

export default { getCanteens, getMenu, createOrder, getUserOrders, getAllOrders, updateOrderStatus };
