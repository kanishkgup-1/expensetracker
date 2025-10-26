"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";

interface Expense {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
}

const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Drinks");
  const [date, setDate] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const categories = [
    "Food & Drinks",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Others"
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('monthlyBudget');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedBudget) {
      setMonthlyBudget(parseFloat(savedBudget));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  // Add expense function
  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category || !date) {
      alert("Please fill all fields!");
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      category,
      date
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    
    // Reset form
    setName("");
    setAmount("");
    setDate("");
    setCategory("Food & Drinks");
    
    // Check budget alert
    checkBudgetAlert(updatedExpenses);
  };

  // Delete expense function
  const deleteExpense = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  // Set monthly budget
  const setBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget > 0) {
      setMonthlyBudget(budget);
      setBudgetInput("");
      setShowBudgetForm(false);
      alert(`Monthly budget set to $${budget}`);
    } else {
      alert("Please enter a valid budget amount");
    }
  };

  // Calculate monthly total
  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  // Budget alert system
  const checkBudgetAlert = (expenseList: Expense[] = expenses) => {
    if (monthlyBudget === 0) return;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTotal = expenseList
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    if (monthlyTotal > monthlyBudget) {
      alert(`🚨 Budget Alert! You've exceeded your monthly budget of $${monthlyBudget}. Current spending: $${monthlyTotal.toFixed(2)}`);
    } else if (monthlyTotal > monthlyBudget * 0.8) {
      alert(`⚠️ Warning! You've used 80% of your monthly budget. Current: $${monthlyTotal.toFixed(2)} / $${monthlyBudget}`);
    }
  };

  const monthlyTotal = getCurrentMonthTotal();
  const budgetRemaining = monthlyBudget - monthlyTotal;

  return (
    <Layout>
      <Header title="Manage Expenses" />
      
      {/* Budget Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Monthly Budget</h2>
          <button
            onClick={() => setShowBudgetForm(!showBudgetForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            {monthlyBudget > 0 ? "Update Budget" : "Set Budget"}
          </button>
        </div>

        {showBudgetForm && (
          <form onSubmit={setBudget} className="mb-4 flex gap-4">
            <input
              type="number"
              placeholder="Enter monthly budget"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="border p-2 rounded-md flex-1"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Budget
            </button>
          </form>
        )}

        {monthlyBudget > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Monthly Spending: ${monthlyTotal.toFixed(2)}</span>
              <span>Budget: ${monthlyBudget}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  monthlyTotal > monthlyBudget ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min((monthlyTotal / monthlyBudget) * 100, 100)}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {((monthlyTotal / monthlyBudget) * 100).toFixed(1)}% of budget used
              {budgetRemaining > 0 && ` | $${budgetRemaining.toFixed(2)} remaining`}
            </p>
          </div>
        )}
      </div>

      {/* Add Expense Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
        <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Expense name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded-md"
            step="0.01"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No expenses added yet.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{expense.name}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {expense.category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{expense.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">${expense.amount}</span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExpensePage;
