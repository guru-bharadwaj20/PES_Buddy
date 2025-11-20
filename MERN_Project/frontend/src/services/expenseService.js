import API from './api';

const addExpense = async (payload) => {
	const res = await API.post('/expense', payload);
	return res.data;
};

const getExpenses = async () => {
	const res = await API.get('/expense');
	return res.data;
};

export default { addExpense, getExpenses };
