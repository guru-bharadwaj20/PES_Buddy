import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
	try {
		const user = req.user;
		const { category, amount, note, date } = req.body;
		if (!category || amount == null) return res.status(400).json({ message: "Category and amount required" });
		const expense = await Expense.create({ user: user._id, category, amount, note, date: date || Date.now() });
		
		// Emit real-time expense notification to user
		const io = req.app.get("io");
		if (io) {
			io.to(`user:${user._id}`).emit("expense:added", {
				expenseId: expense._id,
				category: expense.category,
				amount: expense.amount,
				timestamp: new Date()
			});
		}
		
		res.status(201).json(expense);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const getExpenses = async (req, res) => {
	try {
		const user = req.user;
		const expenses = await Expense.find({ user: user._id }).sort({ createdAt: -1 }).lean();
		res.json(expenses);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

