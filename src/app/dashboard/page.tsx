"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import GraphCard from "../components/GraphCard";
import { fetchExpenses, fetchSummary } from '@/lib/api';

interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface ChartDataItem {
  name: string;
  value: number;
}

const DashboardPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch expenses from backend
      const fetchedExpenses = await fetchExpenses();
      setExpenses(fetchedExpenses);

      // Still get budget from localStorage (until you create a budget API endpoint)
      const savedBudget = localStorage.getItem('monthlyBudget');
      if (savedBudget) {
        const parsedBudget = parseFloat(savedBudget);
        setMonthlyBudget(isNaN(parsedBudget) ? 0 : parsedBudget);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load expenses. Please check your connection.');
      setExpenses([]);
      setMonthlyBudget(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoriesCount = new Set(expenses.map(exp => exp.category)).size;
  const remaining = monthlyBudget - monthlyTotal;

  // Generate Chart.js compatible data
  const getMonthlyChartData = (): ChartDataItem[] => {
    if (monthlyExpenses.length === 0) return [];

    const categoryTotals: Record<string, number> = {};
    
    monthlyExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: Math.round(amount * 100) / 100
    }));
  };

  const chartData = getMonthlyChartData();

  if (isLoading) {
    return (
      <Layout>
        <Header title="Dashboard" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Header title="Dashboard" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold">{error}</p>
            <button 
              onClick={loadData}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Expenses" value={`₹${totalExpenses.toFixed(2)}`} />
        <StatsCard title="Categories" value={categoriesCount} />
        <StatsCard title="Monthly Budget" value={monthlyBudget > 0 ? `₹${monthlyBudget.toFixed(2)}` : "Not Set"} />
        <StatsCard title="Remaining" value={monthlyBudget > 0 ? `₹${remaining.toFixed(2)}` : "N/A"} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <GraphCard chartData={chartData} />
        </div>
        
        {/* Budget Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Budget Progress</h3>
          {monthlyBudget > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Spent: ₹{monthlyTotal.toFixed(2)}</span>
                <span>Budget: ₹{monthlyBudget.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    monthlyTotal > monthlyBudget ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((monthlyTotal / monthlyBudget) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-center">
                {remaining >= 0 ? (
                  <p className="text-green-600">💰 ₹{remaining.toFixed(2)} remaining</p>
                ) : (
                  <p className="text-red-600">⚠️ Over budget by ₹{Math.abs(remaining).toFixed(2)}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Set a budget to track progress</p>
              <button 
                onClick={() => window.location.href = '/settings'}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Set Budget
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
