import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
};

export const createExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.status(201).json(expense);
};

export const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted" });
};
