"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { fetchExpenses, createExpense, deleteExpense as deleteExpenseAPI } from '@/lib/api';

interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Drinks");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  // Load data on component mount
  useEffect(() => {
    loadExpenses();
    loadBudget();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      alert('Failed to load expenses. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBudget = () => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      setMonthlyBudget(parseFloat(savedBudget));
    }
  };

  // Add expense function
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setIsSaving(true);
      const newExpense = {
        title,
        amount: parseFloat(amount),
        category,
        date,
        description
      };

      await createExpense(newExpense);
      
      // Reset form
      setTitle("");
      setAmount("");
      setDate("");
      setDescription("");
      setCategory("Food & Drinks");
      
      // Reload expenses
      await loadExpenses();
      
      // Check budget alert
      checkBudgetAlert();
      
      alert('✅ Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete expense function
  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await deleteExpenseAPI(id);
      await loadExpenses();
      alert('✅ Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  // Set monthly budget
  const setBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget > 0) {
      setMonthlyBudget(budget);
      localStorage.setItem('monthlyBudget', budget.toString());
      setBudgetInput("");
      setShowBudgetForm(false);
      alert(`Monthly budget set to ₹${budget}`);
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
  const checkBudgetAlert = () => {
    if (monthlyBudget === 0) return;
    
    const monthlyTotal = getCurrentMonthTotal();

    if (monthlyTotal > monthlyBudget) {
      alert(`🚨 Budget Alert! You've exceeded your monthly budget of ₹${monthlyBudget}. Current spending: ₹${monthlyTotal.toFixed(2)}`);
    } else if (monthlyTotal > monthlyBudget * 0.8) {
      alert(`⚠️ Warning! You've used 80% of your monthly budget. Current: ₹${monthlyTotal.toFixed(2)} / ₹${monthlyBudget}`);
    }
  };

  const monthlyTotal = getCurrentMonthTotal();
  const budgetRemaining = monthlyBudget - monthlyTotal;

  if (isLoading) {
    return (
      <Layout>
        <Header title="Manage Expenses" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
              <span>Monthly Spending: ₹{monthlyTotal.toFixed(2)}</span>
              <span>Budget: ₹{monthlyBudget}</span>
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
              {budgetRemaining > 0 && ` | ₹${budgetRemaining.toFixed(2)} remaining`}
            </p>
          </div>
        )}
      </div>

      {/* Add Expense Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
        <form onSubmit={addExpense} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Expense title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Amount *"
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
          </div>
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 w-full md:w-auto"
          >
            {isSaving ? 'Adding...' : 'Add Expense'}
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
                  key={expense._id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{expense.title}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {expense.category}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-gray-600 text-sm mt-1">{expense.description}</p>
                    )}
                    <p className="text-gray-500 text-sm">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">₹{expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => expense._id && handleDeleteExpense(expense._id)}
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
