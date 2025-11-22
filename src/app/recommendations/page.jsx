'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchExpenses } from '@/lib/api';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Food & Drinks', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Others'];

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const expensesData = await fetchExpenses();
      
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expenses: expensesData || []
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        setError('Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Error loading recommendations');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = selectedCategory === 'All'
    ? recommendations
    : recommendations.filter(rec => rec.category === selectedCategory);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Smart Recommendations</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recommendations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadRecommendations}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <p className="text-gray-600 mb-6">
              {filteredRecommendations.length} recommendations found
              {recommendations.length === 0 && " - Add some expenses to get personalized recommendations!"}
            </p>

            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No recommendations available
                </h3>
                <p className="text-gray-500">
                  {recommendations.length === 0 
                    ? "Start adding expenses to get personalized product recommendations!"
                    : "Try selecting a different category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        {product.category}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {product.name}
                    </h3>

                    {product.relatedTo && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">
                          💡 Related to your expense:
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {product.relatedTo.title}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Cheaper alternative available!
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
