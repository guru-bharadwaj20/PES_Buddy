import API from './api';

const getScooters = async () => {
	const res = await API.get('/scootigo/scooters');
	return res.data;
};

const book = async (payload) => {
	const res = await API.post('/scootigo/book', payload);
	return res.data;
};

export default { getScooters, book };
