const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Category {
  _id?: string;
  name: string;
  icon?: string;
  color?: string;
}

// ========== EXPENSE API ==========

export const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await fetch(`${API_BASE_URL}/api/expenses`);
  if (!response.ok) throw new Error('Failed to fetch expenses');
  return response.json();
};

export const fetchExpense = async (id: string): Promise<Expense> => {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`);
  if (!response.ok) throw new Error('Failed to fetch expense');
  return response.json();
};

export const createExpense = async (expense: Omit<Expense, '_id'>): Promise<Expense> => {
  const response = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error('Failed to create expense');
  return response.json();
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error('Failed to update expense');
};

export const deleteExpense = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete expense');
};

// ========== CATEGORY API ==========

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const createCategory = async (category: Omit<Category, '_id'>): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
};

// ========== ANALYTICS API ==========

export const fetchSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/summary`);
  if (!response.ok) throw new Error('Failed to fetch summary');
  return response.json();
};

// ========== PREDICTION API ==========
export interface PredictionResult {
  success: boolean;
  prediction: number;
  confidence: string;
  trend: string;
  average_monthly?: number;
  last_month?: number;
  data_points?: number;
  message?: string;
}

export const fetchPrediction = async (): Promise<PredictionResult> => {
  const response = await fetch(`${API_BASE_URL}/api/predict/next-month`);
  if (!response.ok) throw new Error('Failed to fetch prediction');
  return response.json();
};
