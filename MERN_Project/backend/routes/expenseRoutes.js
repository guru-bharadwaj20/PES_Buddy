import express from "express";
import { addExpense, getExpenses } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateExpense } from "../middleware/validateInput.js";

const router = express.Router();

router.post("/", protect, validateExpense, addExpense);
router.get("/", protect, getExpenses);

export default router;
