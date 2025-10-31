import React, { useState, useEffect, useContext } from 'react';
import expenseService from '../services/expenseService';
import { AuthContext } from '../context/AuthContext';

const ExpenseTracker = () => {
	const [category, setCategory] = useState('');
	const [amount, setAmount] = useState('');
	const [note, setNote] = useState('');
	const [expenses, setExpenses] = useState([]);
	const { user } = useContext(AuthContext);

	const fetch = async () => {
		try {
			const res = await expenseService.getExpenses();
			setExpenses(res);
		} catch (err) { console.error(err); }
	};

	useEffect(() => { if (user) fetch(); }, [user]);

	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			await expenseService.addExpense({ category, amount: Number(amount), note });
			setCategory(''); setAmount(''); setNote('');
			fetch();
		} catch (err) { console.error(err); }
	};

	return (
		<main className="container">
			<h2 className="page-title">Expense Tracker</h2>
			{!user ? <div className="muted">Please login to track expenses.</div> : (
				<>
					<form onSubmit={handleAdd} className="card">
						<div className="mb-2">
							<label>Category</label>
							<input value={category} onChange={e => setCategory(e.target.value)} />
						</div>
						<div className="mb-2">
							<label>Amount</label>
							<input value={amount} onChange={e => setAmount(e.target.value)} />
						</div>
						<div className="mb-2">
							<label>Note</label>
							<input value={note} onChange={e => setNote(e.target.value)} />
						</div>
						<button type="submit" className="btn btn-primary">Add</button>
					</form>
					<h3 className="mt-2">Your Expenses</h3>
					<ul className="card">
						{expenses.map(e => (
							<li key={e._id} className="mb-1">{e.category} - <strong>₹{e.amount}</strong> - {new Date(e.date).toLocaleString()} - {e.note}</li>
						))}
					</ul>
				</>
			)}
		</main>
	);
};

export default ExpenseTracker;

