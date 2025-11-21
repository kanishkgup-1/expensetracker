import numpy as np
from datetime import datetime, timedelta
from collections import defaultdict
from sklearn.linear_model import LinearRegression
import warnings
warnings.filterwarnings('ignore')

class ExpensePredictionModel:
    """
    Machine Learning model to predict next month's expenses
    Uses Linear Regression on historical monthly expense data
    """
    
    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False
    
    def prepare_data(self, expenses):
        """
        Prepare expense data for training
        Groups expenses by month and calculates monthly totals
        
        Args:
            expenses: List of expense documents from MongoDB
            
        Returns:
            X: Month indices (features)
            y: Total expenses per month (targets)
            monthly_data: Dictionary with month details
        """
        if not expenses or len(expenses) == 0:
            return None, None, None
        
        # Group expenses by month
        monthly_totals = defaultdict(float)
        for expense in expenses:
            date_str = expense.get('date', '')
            if date_str:
                try:
                    # Extract YYYY-MM from date
                    month_key = date_str[:7]  # Format: YYYY-MM
                    amount = float(expense.get('amount', 0))
                    monthly_totals[month_key] += amount
                except (ValueError, IndexError):
                    continue
        
        if len(monthly_totals) < 2:
            # Need at least 2 months of data for prediction
            return None, None, None
        
        # Sort months chronologically
        sorted_months = sorted(monthly_totals.keys())
        
        # Create feature matrix (X) and target vector (y)
        X = np.array(range(len(sorted_months))).reshape(-1, 1)
        y = np.array([monthly_totals[month] for month in sorted_months])
        
        monthly_data = {
            'months': sorted_months,
            'totals': y.tolist(),
            'count': len(sorted_months)
        }
        
        return X, y, monthly_data
    
    def train(self, expenses):
        """
        Train the model on historical expense data
        
        Args:
            expenses: List of expense documents from MongoDB
            
        Returns:
            bool: True if training successful, False otherwise
        """
        X, y, monthly_data = self.prepare_data(expenses)
        
        if X is None or len(X) < 2:
            self.is_trained = False
            return False
        
        # Train linear regression model
        self.model.fit(X, y)
        self.is_trained = True
        self.monthly_data = monthly_data
        
        return True
    
    def predict_next_month(self, expenses):
        """
        Predict total expenses for the next month
        
        Args:
            expenses: List of expense documents from MongoDB
            
        Returns:
            dict: Prediction results with amount, confidence, and trend
        """
        # Train model with current data
        success = self.train(expenses)
        
        if not success or not self.is_trained:
            return {
                'success': False,
                'message': 'Insufficient data. Need at least 2 months of expense history.',
                'prediction': 0,
                'confidence': 'low'
            }
        
        # Predict next month (index = number of months we have)
        next_month_index = len(self.monthly_data['months'])
        X_pred = np.array([[next_month_index]])
        predicted_amount = self.model.predict(X_pred)[0]
        
        # Ensure prediction is non-negative
        predicted_amount = max(0, predicted_amount)
        
        # Calculate trend
        slope = self.model.coef_[0]
        if slope > 100:
            trend = 'increasing'
        elif slope < -100:
            trend = 'decreasing'
        else:
            trend = 'stable'
        
        # Calculate confidence based on data points
        data_points = len(self.monthly_data['months'])
        if data_points >= 6:
            confidence = 'high'
        elif data_points >= 4:
            confidence = 'medium'
        else:
            confidence = 'low'
        
        # Calculate average monthly expense
        avg_monthly = np.mean(self.monthly_data['totals'])
        
        # Get last month's expense
        last_month_expense = self.monthly_data['totals'][-1]
        
        return {
            'success': True,
            'prediction': round(predicted_amount, 2),
            'confidence': confidence,
            'trend': trend,
            'slope': round(slope, 2),
            'average_monthly': round(avg_monthly, 2),
            'last_month': round(last_month_expense, 2),
            'data_points': data_points,
            'historical_months': self.monthly_data['months'][-3:],  # Last 3 months
            'historical_totals': [round(x, 2) for x in self.monthly_data['totals'][-3:]]
        }

# Singleton instance
_model_instance = None

def get_model():
    """Get or create the model instance"""
    global _model_instance
    if _model_instance is None:
        _model_instance = ExpensePredictionModel()
    return _model_instance

def predict_next_month_expense(expenses):
    """
    Convenience function to predict next month's expenses
    
    Args:
        expenses: List of expense documents from MongoDB
        
    Returns:
        dict: Prediction results
    """
    model = get_model()
    return model.predict_next_month(expenses)
