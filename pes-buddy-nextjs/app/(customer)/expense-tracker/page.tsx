"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { addExpenseSchema, EXPENSE_CATEGORIES } from "@/lib/validations/expense";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/types";
import type { z } from "zod";

type FormData = z.infer<typeof addExpenseSchema>;

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍕", Transport: "🚌", Entertainment: "🎬", Shopping: "🛍️",
  Health: "💊", Education: "📚", Utilities: "💡", Other: "📝",
};

export default function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: { category: "Food", date: new Date().toISOString().split("T")[0] },
  });

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch("/api/expense");
      if (res.ok) setExpenses(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const onSubmit = async (data: FormData) => {
    setAdding(true);
    try {
      const res = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { toast.error("Failed to add expense"); return; }
      const newExpense = await res.json();
      setExpenses((prev) => [newExpense, ...prev]);
      toast.success("Expense added!");
      reset({ category: "Food", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/expense?id=${id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Failed to delete expense"); return; }
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Expense deleted");
    } catch {
      toast.error("Something went wrong");
    }
  };

  // Derived stats
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0];

  const filtered = filterCategory === "All"
    ? expenses
    : expenses.filter((e) => e.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-bold text-white">💰 Expense Tracker</h1>
          <p className="text-xl text-gray-300 mt-2">Monitor your campus spending</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Spent", value: formatCurrency(total), icon: "💸", color: "blue" },
          { label: "This Month", value: formatCurrency(thisMonth), icon: "📅", color: "green" },
          { label: "Top Category", value: topCategory ? `${CATEGORY_ICONS[topCategory[0]] ?? "📝"} ${topCategory[0]}` : "—", icon: "📊", color: "purple" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-white font-bold text-2xl">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Expense Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Expense</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <input {...register("description")} placeholder="e.g. Lunch at canteen" className="input-base" />
                  {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Amount (₹)</label>
                  <input {...register("amount", { valueAsNumber: true })} type="number" min="1" placeholder="0" className="input-base" />
                  {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Category</label>
                  <select {...register("category")} className="input-base">
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_ICONS[c] ?? "📝"} {c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Date</label>
                  <input {...register("date")} type="date" className="input-base" />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
                </div>
              </div>
              <button
                type="submit"
                disabled={adding}
                className="mt-6 w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {Object.entries(byCategory).sort(([, a], [, b]) => b - a).map(([cat, amt]) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm font-medium">
                    {CATEGORY_ICONS[cat] ?? "📝"} {cat}
                  </span>
                  <span className="text-white font-bold text-sm">{formatCurrency(amt)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(amt / total) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter + List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Expense History</h2>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-800 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 animate-skeleton">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-2">No expenses found</h3>
            <p className="text-gray-400">
              {expenses.length === 0 ? "Add your first expense to get started!" : "No expenses match the selected filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((expense, i) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                    {CATEGORY_ICONS[expense.category] ?? "📝"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{expense.description}</p>
                    <p className="text-gray-400 text-sm">{expense.category} • {formatDate(expense.date)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold text-lg">{formatCurrency(expense.amount)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors flex-shrink-0"
                    title="Delete expense"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
