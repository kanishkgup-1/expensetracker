'use client';

import { useEffect, useState } from 'react';
import { fetchPrediction, PredictionResult } from '@/lib/api';

export default function PredictionCard() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPrediction();
      setPrediction(data);
    } catch (err) {
      setError('Failed to load prediction');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return '📈';
    if (trend === 'decreasing') return '📉';
    return '➡️';
  };

  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'high') return 'text-green-600';
    if (confidence === 'medium') return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !prediction?.success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Next Month Prediction</h3>
        <p className="text-gray-600 text-sm">
          {prediction?.message || 'Add more expense data to see predictions'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">💡 AI Prediction</h3>
        <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
          {prediction.confidence.toUpperCase()} confidence
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Next Month Estimated Expenses</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-purple-700">
            ₹{prediction.prediction.toLocaleString('en-IN')}
          </span>
          <span className="text-2xl">{getTrendIcon(prediction.trend)}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {prediction.average_monthly !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Average Monthly:</span>
            <span className="font-medium text-gray-800">
              ₹{prediction.average_monthly.toLocaleString('en-IN')}
            </span>
          </div>
        )}
        {prediction.last_month !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Last Month:</span>
            <span className="font-medium text-gray-800">
              ₹{prediction.last_month.toLocaleString('en-IN')}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Trend:</span>
          <span className="font-medium text-gray-800 capitalize">{prediction.trend}</span>
        </div>
        {prediction.data_points !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Data Points:</span>
            <span className="font-medium text-gray-800">{prediction.data_points} months</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-purple-200">
        <button
          onClick={loadPrediction}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          🔄 Refresh Prediction
        </button>
      </div>
    </div>
  );
}
