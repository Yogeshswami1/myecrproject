import { useEffect, useState } from "react";
import { fetchExpenses, deleteExpense } from "../api/expenseApi";
import ExpenseForm from "../components/ExpenseForm";
import Card from "../components/Card";
import "../styles/list.css";

export default function Home() {
  const [expenses, setExpenses] = useState([]);

  const loadData = async () => {
    const res = await fetchExpenses();
    setExpenses(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card>
      <h2 style={{ textAlign: "center", color: "white", marginBottom: "20px" }}>
        💸 Expense Tracker of Yogesh Kumar hello
      </h2>

      <ExpenseForm refresh={loadData} />

      <div className="list">
        {expenses.map((exp) => (
          <div className="item" key={exp._id}>
            <div>
              <strong>{exp.title}</strong>
              <div style={{ fontSize: "12px" }}>{exp.category}</div>
            </div>

            <div>
              <span className="amount">₹{exp.amount}</span>
              <button
                className="delete"
                onClick={() => deleteExpense(exp._id).then(loadData)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
