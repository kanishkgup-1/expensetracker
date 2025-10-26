"use client";
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ChartDataItem {
  name: string;
  value: number;
}

interface GraphCardProps {
  chartData?: ChartDataItem[];
}

const GraphCard: React.FC<GraphCardProps> = ({ chartData = [] }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Monthly Spending by Category</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No expense data available for this month</p>
            <p className="text-sm">Add some expenses to see charts</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for Chart.js
  const labels = chartData.map(item => item.name);
  const values = chartData.map(item => item.value);
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ];

  // Pie Chart Data
  const pieData = {
    labels: labels,
    datasets: [
      {
        label: 'Amount Spent',
        data: values,
        backgroundColor: colors.slice(0, chartData.length),
        borderColor: colors.slice(0, chartData.length).map(color => color + '80'),
        borderWidth: 2,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: labels,
    datasets: [
      {
        label: 'Amount ($)',
        data: values,
        backgroundColor: colors.slice(0, chartData.length).map(color => color + '80'),
        borderColor: colors.slice(0, chartData.length),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  // Chart Options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = values.reduce((sum, val) => sum + val, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: $${context.raw.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Amount: $${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
    },
  };

  const total = values.reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6">Monthly Spending Analysis</h3>
      
      {/* Total Amount Display */}
      <div className="text-center mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</div>
        <div className="text-gray-600">Total Monthly Spending</div>
      </div>

      {/* Pie Chart */}
      <div className="mb-8">
        <h4 className="text-md font-medium mb-4">Category Distribution</h4>
        <div className="h-64">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-4">Category Breakdown</h4>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xl font-bold text-gray-700">{chartData.length}</div>
            <div className="text-xs text-gray-500">Categories</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xl font-bold text-gray-700">
              ${Math.max(...values).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">Highest</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xl font-bold text-gray-700">
              ${(total / chartData.length).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">Average</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphCard;
