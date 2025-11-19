"use client";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { fetchExpenses } from '@/lib/api';

interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface CategoryRow {
  category: string;
  total: number;
  count: number;
  average: number;
}

const CategoriesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [viewAllTime, setViewAllTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from backend API
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (e) {
      console.error("Failed to load expenses:", e);
      setError("Failed to load expenses. Please try again.");
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filtered = useMemo(() => {
    if (viewAllTime) return expenses;
    return expenses.filter((exp) => {
      const d = new Date(exp.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [expenses, viewAllTime, currentMonth, currentYear]);

  // Build category aggregation
  const rows: CategoryRow[] = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    filtered.forEach((e) => {
      const key = e.category || "Uncategorized";
      const prev = map.get(key) || { total: 0, count: 0 };
      map.set(key, { total: prev.total + e.amount, count: prev.count + 1 });
    });
    const arr = Array.from(map.entries()).map(([category, v]) => ({
      category,
      total: Math.round(v.total * 100) / 100,
      count: v.count,
      average: v.count ? Math.round((v.total / v.count) * 100) / 100 : 0,
    }));
    // Sort by total desc
    arr.sort((a, b) => b.total - a.total);
    return arr;
  }, [filtered]);

  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  const maxTotal = rows.length ? Math.max(...rows.map((r) => r.total)) : 1;

  // CSV download
  const downloadCSV = () => {
    const header = ["Category", "Total (₹)", "Count", "Average (₹)"];
    const data = rows.map((r) => [r.category, r.total, r.count, r.average]);
    const csv = [header, ...data]
      .map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const suffix = viewAllTime ? "all-time" : `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`;
    a.download = `category-summary-${suffix}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout>
        <Header title="Categories" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Header title="Categories" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold">{error}</p>
            <button 
              onClick={loadExpenses}
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
      <Header title="Categories" />

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-gray-600">
          View:{" "}
          <span className="font-semibold">
            {viewAllTime
              ? "All-time category totals"
              : `Current month (${now.toLocaleString("default", { month: "long" })} ${currentYear})`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewAllTime((v) => !v)}
            className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50"
          >
            {viewAllTime ? "Switch to This Month" : "View All-time"}
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            disabled={rows.length === 0}
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              ₹{grandTotal.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{rows.length}</div>
            <div className="text-xs text-gray-500">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {filtered.length}
            </div>
            <div className="text-xs text-gray-500">Transactions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              ₹{(filtered.length ? grandTotal / filtered.length : 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Avg/Transaction</div>
          </div>
        </div>
      </div>

      {/* Sheet-like Table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Total (₹)</th>
              <th className="px-3 py-2">Count</th>
              <th className="px-3 py-2">Average (₹)</th>
              <th className="px-3 py-2 w-56">Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  No expenses found for this period.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const pctOfMax = (r.total / maxTotal) * 100;
                const pctOfTotal = grandTotal ? (r.total / grandTotal) * 100 : 0;
                return (
                  <tr key={r.category} className="bg-gray-50">
                    <td className="px-3 py-3 font-medium">{r.category}</td>
                    <td className="px-3 py-3 font-semibold">₹{r.total.toFixed(2)}</td>
                    <td className="px-3 py-3">{r.count}</td>
                    <td className="px-3 py-3">₹{r.average.toFixed(2)}</td>
                    <td className="px-3 py-3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-blue-500"
                          style={{ width: `${pctOfMax}%` }}
                          title={`${pctOfTotal.toFixed(1)}% of total`}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {pctOfTotal.toFixed(1)}% of total
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="text-xs text-gray-500 mt-3">
        Tip: Use the Download CSV button to export this sheet and analyze in Excel/Sheets.
      </div>
    </Layout>
  );
};

export default CategoriesPage;
