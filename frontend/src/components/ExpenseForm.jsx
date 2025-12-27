import { useState } from "react";
import { addExpense } from "../api/expenseApi";
import "../styles/form.css";

export default function ExpenseForm({ refresh }) {
  const [data, setData] = useState({
    title: "",
    amount: "",
    category: ""
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    await addExpense(data);
    refresh();
    setData({ title: "", amount: "", category: "" });
  };

  return (
    <form className="form" onSubmit={submitHandler}>
      <input
        placeholder="Expense title"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount ₹"
        value={data.amount}
        onChange={(e) => setData({ ...data, amount: e.target.value })}
      />

      <input
        placeholder="Category (Food, Rent...)"
        value={data.category}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      />

      <button>Add Expense</button>
    </form>
  );
}
