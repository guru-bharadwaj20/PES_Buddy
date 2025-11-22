import API from './api';

const getScooters = async () => {
	const res = await API.get('/scootigo/scooters');
	return res.data;
};

const book = async (payload) => {
	const res = await API.post('/scootigo/book', payload);
	return res.data;
};

const getUserBookings = async () => {
	const res = await API.get('/scootigo/bookings');
	return res.data;
};

const getAllBookings = async () => {
	const res = await API.get('/admin/bookings');
	return res.data;
};

export default { getScooters, book, getUserBookings, getAllBookings };
