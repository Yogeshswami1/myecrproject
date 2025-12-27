import axios from "axios";
const URL = import.meta.env.VITE_API_URL

const API = `${URL}/api/expenses`;

export const fetchExpenses = () => axios.get(API);
export const addExpense = (data) => axios.post(API, data);
export const deleteExpense = (id) => axios.delete(`${API}/${id}`);
