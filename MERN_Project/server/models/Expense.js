import mongoose from "mongoose";
const { Schema } = mongoose;

const expenseSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	category: { type: String, required: true },
	amount: { type: Number, required: true },
	note: { type: String },
	date: { type: Date, default: Date.now }
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
