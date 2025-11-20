import React, { useState, useEffect, useContext } from 'react';
import expenseService from '../services/expenseService';
import socketService from '../services/socketService';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = [
	{ name: 'Food', icon: '🍔', color: 'bg-orange-500' },
	{ name: 'Travel', icon: '🚗', color: 'bg-blue-500' },
	{ name: 'Study Materials', icon: '📚', color: 'bg-green-500' },
	{ name: 'Miscellaneous', icon: '🛍️', color: 'bg-purple-500' }
];

const ExpenseTracker = () => {
	const [category, setCategory] = useState('Food');
	const [amount, setAmount] = useState('');
	const [note, setNote] = useState('');
	const [expenses, setExpenses] = useState([]);
	const [weeklyLimit, setWeeklyLimit] = useState(localStorage.getItem('weeklyLimit') || '1000');
	const [showLimitSetting, setShowLimitSetting] = useState(false);
	const [message, setMessage] = useState({ type: '', text: '' });
	const { user } = useContext(AuthContext);

	const fetch = async () => {
		try {
			const res = await expenseService.getExpenses();
			setExpenses(res);
		} catch (err) { console.error(err); }
	};

	useEffect(() => { 
		if (user) {
			fetch();
			socketService.onExpenseAdded((data) => {
				fetch();
			});
		}
	}, [user]);

	const handleAdd = async (e) => {
		e.preventDefault();
		if (!amount || Number(amount) <= 0) {
			setMessage({ type: 'error', text: 'Please enter a valid amount' });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
			return;
		}
		try {
			await expenseService.addExpense({ category, amount: Number(amount), note });
			setCategory('Food');
			setAmount('');
			setNote('');
			setMessage({ type: 'success', text: `Expense of ₹${amount} added successfully!` });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
			fetch();
		} catch (err) { 
			console.error(err);
			setMessage({ type: 'error', text: 'Failed to add expense' });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
		}
	};

	const handleSetLimit = () => {
		if (Number(weeklyLimit) > 0) {
			localStorage.setItem('weeklyLimit', weeklyLimit);
			setShowLimitSetting(false);
			setMessage({ type: 'success', text: 'Weekly limit updated successfully!' });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
		} else {
			setMessage({ type: 'error', text: 'Please enter a valid limit' });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
		}
	};

	const getCategorySums = () => {
		const sums = {};
		CATEGORIES.forEach(cat => sums[cat.name] = 0);
		expenses.forEach(exp => {
			if (sums[exp.category] !== undefined) {
				sums[exp.category] += exp.amount;
			}
		});
		return sums;
	};

	const getWeeklySums = () => {
		const now = new Date();
		const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const weeklyExpenses = expenses.filter(exp => new Date(exp.date) >= oneWeekAgo);
		return weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
	};

	const getTotalExpenses = () => {
		return expenses.reduce((sum, exp) => sum + exp.amount, 0);
	};

	const categorySums = getCategorySums();
	const weeklyTotal = getWeeklySums();
	const totalExpenses = getTotalExpenses();
	const limit = Number(weeklyLimit);
	const percentageUsed = limit > 0 ? (weeklyTotal / limit) * 100 : 0;
	const exceeded = weeklyTotal > limit * 1.003;
	const percentageExceeded = exceeded ? ((weeklyTotal - limit) / limit) * 100 : 0;

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-10">
				<h1 className="text-5xl font-bold text-white mb-4">💰 Expense Tracker</h1>
				<p className="text-xl text-gray-300">Monitor your weekly spending across different categories</p>
			</div>

			{/* Message Alert */}
			{message.text && (
				<div className={`mb-6 p-4 rounded-xl ${
					message.type === 'success' 
						? 'bg-green-500/10 border-2 border-green-500 text-green-500' 
						: 'bg-light-red/10 border-2 border-light-red text-light-red'
				} flex items-center space-x-3`}>
					{message.type === 'success' ? (
						<svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
					) : (
						<svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
					)}
					<span className="font-bold">{message.text}</span>
				</div>
			)}

			{!user ? (
				<div className="glass rounded-2xl p-12 text-center">
					<div className="text-6xl mb-4">🔒</div>
					<h3 className="text-2xl font-bold text-white mb-2">Authentication Required</h3>
					<p className="text-gray-400">Please login to track your expenses</p>
				</div>
			) : (
				<>
					{/* Weekly Budget Overview */}
					<div className="glass rounded-2xl p-8 mb-8">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-3xl font-bold text-white">Weekly Budget Overview</h2>
							<button 
								onClick={() => setShowLimitSetting(!showLimitSetting)}
								className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all shadow-lg"
							>
								{showLimitSetting ? 'Cancel' : 'Change Limit'}
							</button>
						</div>

						{showLimitSetting && (
							<div className="mb-6 p-6 bg-light-blue/10 border-2 border-light-blue/30 rounded-xl">
								<label className="block text-white font-semibold mb-3">Set Weekly Spending Limit (₹)</label>
								<div className="flex space-x-3">
									<input 
										type="number" 
										value={weeklyLimit} 
										onChange={e => setWeeklyLimit(e.target.value)}
										min="1"
										className="grow px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
										placeholder="Enter amount"
									/>
									<button 
										onClick={handleSetLimit} 
										className="px-8 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg"
									>
										Set Limit
									</button>
								</div>
							</div>
						)}

						<div className="grid md:grid-cols-3 gap-6 mb-6">
							<div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700">
								<p className="text-gray-400 text-sm mb-2">Weekly Limit</p>
								<p className="text-3xl font-bold text-white">₹{limit.toFixed(2)}</p>
							</div>
							<div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700">
								<p className="text-gray-400 text-sm mb-2">This Week's Spending</p>
								<p className="text-3xl font-bold text-light-blue">₹{weeklyTotal.toFixed(2)}</p>
							</div>
							<div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700">
								<p className="text-gray-400 text-sm mb-2">Remaining Budget</p>
								<p className={`text-3xl font-bold ${exceeded ? 'text-light-red' : 'text-green-500'}`}>
									₹{Math.max(0, limit - weeklyTotal).toFixed(2)}
								</p>
							</div>
						</div>

						{/* Progress Bar */}
						<div className="mb-4">
							<div className="flex items-center justify-between mb-2">
								<span className="text-white font-semibold">Budget Usage</span>
								<span className={`font-bold ${exceeded ? 'text-light-red' : percentageUsed > 80 ? 'text-yellow-500' : 'text-green-500'}`}>
									{percentageUsed.toFixed(1)}%
								</span>
							</div>
							<div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
								<div 
									className={`h-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold ${
										exceeded ? 'bg-light-red' : percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
									}`}
									style={{ width: `${Math.min(percentageUsed, 100)}%` }}
								>
									{percentageUsed > 10 && `${percentageUsed.toFixed(0)}%`}
								</div>
							</div>
						</div>

						{/* Warning Messages */}
						{exceeded && (
							<div className="p-4 bg-light-red/10 border-2 border-light-red rounded-xl flex items-center space-x-3">
								<svg className="w-8 h-8 text-light-red shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								<div>
									<p className="text-light-red font-bold text-lg">⚠️ Warning! Budget Exceeded</p>
									<p className="text-light-red">You have exceeded your weekly limit by {percentageExceeded.toFixed(2)}%</p>
								</div>
							</div>
						)}
						{!exceeded && percentageUsed > 80 && (
							<div className="p-4 bg-yellow-500/10 border-2 border-yellow-500 rounded-xl flex items-center space-x-3">
								<svg className="w-8 h-8 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								<div>
									<p className="text-yellow-500 font-bold text-lg">⚡ Caution!</p>
									<p className="text-yellow-500">You're approaching your weekly limit. Consider reducing expenses.</p>
								</div>
							</div>
						)}
					</div>

					{/* Add Expense & Category Summary */}
					<div className="grid lg:grid-cols-3 gap-8 mb-8">
						{/* Add Expense Form */}
						<div className="lg:col-span-1">
							<div className="glass rounded-2xl p-8">
								<h3 className="text-2xl font-bold text-white mb-6">Add New Expense</h3>
								<form onSubmit={handleAdd} className="space-y-5">
									<div>
										<label className="block text-white font-semibold mb-3">Category</label>
										<div className="grid grid-cols-2 gap-3">
											{CATEGORIES.map(cat => (
												<button
													key={cat.name}
													type="button"
													onClick={() => setCategory(cat.name)}
													className={`p-4 rounded-xl border-2 transition-all ${
														category === cat.name
															? 'border-light-blue bg-light-blue/20'
															: 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
													}`}
												>
													<div className="text-3xl mb-2">{cat.icon}</div>
													<div className={`text-sm font-semibold ${category === cat.name ? 'text-light-blue' : 'text-gray-300'}`}>
														{cat.name}
													</div>
												</button>
											))}
										</div>
									</div>
									
									<div>
										<label className="block text-white font-semibold mb-2">Amount (₹)</label>
										<input 
											type="number" 
											value={amount} 
											onChange={e => setAmount(e.target.value)} 
											placeholder="Enter amount"
											required
											min="1"
											step="0.01"
											className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none text-lg"
										/>
									</div>
									
									<div>
										<label className="block text-white font-semibold mb-2">Note (Optional)</label>
										<input 
											value={note} 
											onChange={e => setNote(e.target.value)} 
											placeholder="What did you spend on?"
											className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
										/>
									</div>
									
									<button 
										type="submit" 
										className="w-full py-4 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg text-lg"
									>
										Add Expense
									</button>
								</form>
							</div>
						</div>

						{/* Category Summary */}
						<div className="lg:col-span-2">
							<div className="glass rounded-2xl p-8">
								<h3 className="text-2xl font-bold text-white mb-6">Category-wise Expense Summary</h3>
								<div className="grid md:grid-cols-2 gap-6">
									{CATEGORIES.map(cat => {
										const catSum = categorySums[cat.name] || 0;
										const catPercentage = totalExpenses > 0 ? (catSum / totalExpenses) * 100 : 0;
										return (
											<div key={cat.name} className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700 hover:border-light-blue/50 transition-all">
												<div className="flex items-center justify-between mb-4">
													<div className="flex items-center space-x-3">
														<div className="text-4xl">{cat.icon}</div>
														<div>
															<p className="text-white font-bold text-lg">{cat.name}</p>
															<p className="text-gray-400 text-sm">{catPercentage.toFixed(1)}% of total</p>
														</div>
													</div>
												</div>
												<div className="flex items-end justify-between">
													<div>
														<p className="text-gray-400 text-sm mb-1">Total Spent</p>
														<p className="text-3xl font-bold text-white">₹{catSum.toFixed(2)}</p>
													</div>
													<div className="w-20 h-20">
														<svg viewBox="0 0 36 36" className="transform -rotate-90">
															<circle cx="18" cy="18" r="16" fill="none" stroke="#374151" strokeWidth="3" />
															<circle 
																cx="18" cy="18" r="16" fill="none" 
																stroke="#3b82f6" 
																strokeWidth="3"
																strokeDasharray={`${catPercentage} 100`}
																strokeLinecap="round"
															/>
														</svg>
													</div>
												</div>
											</div>
										);
									})}
								</div>
								<div className="mt-6 p-6 bg-light-blue/10 border-2 border-light-blue/30 rounded-xl">
									<div className="flex items-center justify-between">
										<span className="text-white font-bold text-xl">Total Expenses (All Time)</span>
										<span className="text-4xl font-bold text-light-blue">₹{totalExpenses.toFixed(2)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Recent Expenses Table */}
					<div className="glass rounded-2xl p-8">
						<h3 className="text-2xl font-bold text-white mb-6">Recent Expenses</h3>
						{expenses.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">📊</div>
								<p className="text-xl text-gray-400">No expenses recorded yet</p>
								<p className="text-gray-500 mt-2">Start adding your expenses using the form above!</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-700">
											<th className="text-left py-4 px-4 text-gray-400 font-semibold">Date & Time</th>
											<th className="text-left py-4 px-4 text-gray-400 font-semibold">Category</th>
											<th className="text-left py-4 px-4 text-gray-400 font-semibold">Note</th>
											<th className="text-right py-4 px-4 text-gray-400 font-semibold">Amount</th>
										</tr>
									</thead>
									<tbody>
										{expenses.slice().reverse().map((exp, idx) => {
											const cat = CATEGORIES.find(c => c.name === exp.category);
											const date = new Date(exp.date);
											return (
												<tr key={exp._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-all">
													<td className="py-4 px-4">
														<div className="text-white font-semibold">{date.toLocaleDateString()}</div>
														<div className="text-gray-500 text-sm">{date.toLocaleTimeString()}</div>
													</td>
													<td className="py-4 px-4">
														<div className="flex items-center space-x-3">
															<span className="text-2xl">{cat?.icon}</span>
															<span className="text-white font-semibold">{exp.category}</span>
														</div>
													</td>
													<td className="py-4 px-4 text-gray-400">{exp.note || '-'}</td>
													<td className="py-4 px-4 text-right">
														<span className="text-xl font-bold text-white">₹{exp.amount.toFixed(2)}</span>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</>
			)}
		</main>
	);
};

export default ExpenseTracker;

