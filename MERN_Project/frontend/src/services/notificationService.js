import API from './api';

const getNotifications = async (limit = 50) => {
	const res = await API.get(`/notifications?limit=${limit}`);
	return res.data;
};

const getUnreadCount = async () => {
	const res = await API.get('/notifications/unread-count');
	return res.data;
};

const markAsRead = async (notificationId) => {
	const res = await API.patch(`/notifications/${notificationId}/read`);
	return res.data;
};

const markAllAsRead = async () => {
	const res = await API.patch('/notifications/mark-all-read');
	return res.data;
};

const deleteNotification = async (notificationId) => {
	const res = await API.delete(`/notifications/${notificationId}`);
	return res.data;
};

export default {
	getNotifications,
	getUnreadCount,
	markAsRead,
	markAllAsRead,
	deleteNotification
};
