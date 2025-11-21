from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv
from ml_model import predict_next_month_expense

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Atlas Connection
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['expense_tracker']
expenses_collection = db['expenses']
categories_collection = db['categories']

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# ========== EXPENSE API ==========

# Get all expenses
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    expenses = list(expenses_collection.find())
    return jsonify([serialize_doc(exp) for exp in expenses]), 200

# Get single expense
@app.route('/api/expenses/<id>', methods=['GET'])
def get_expense(id):
    expense = expenses_collection.find_one({'_id': ObjectId(id)})
    if expense:
        return jsonify(serialize_doc(expense)), 200
    return jsonify({'error': 'Expense not found'}), 404

# Create expense
@app.route('/api/expenses', methods=['POST'])
def create_expense():
    data = request.json
    expense = {
        'title': data.get('title'),
        'amount': float(data.get('amount')),
        'category': data.get('category'),
        'date': data.get('date'),
        'description': data.get('description', ''),
        'createdAt': datetime.now().isoformat()
    }
    result = expenses_collection.insert_one(expense)
    return jsonify({'_id': str(result.inserted_id), **expense}), 201

# Update expense
@app.route('/api/expenses/<id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    update_data = {
        'title': data.get('title'),
        'amount': float(data.get('amount')),
        'category': data.get('category'),
        'date': data.get('date'),
        'description': data.get('description', ''),
        'updatedAt': datetime.now().isoformat()
    }
    expenses_collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    return jsonify({'message': 'Expense updated'}), 200

# Delete expense
@app.route('/api/expenses/<id>', methods=['DELETE'])
def delete_expense(id):
    expenses_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Expense deleted'}), 200

# ========== CATEGORY API ==========

# Get all categories
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = list(categories_collection.find())
    return jsonify([serialize_doc(cat) for cat in categories]), 200

# Create category
@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.json
    category = {
        'name': data.get('name'),
        'icon': data.get('icon', ''),
        'color': data.get('color', '#000000'),
        'createdAt': datetime.now().isoformat()
    }
    result = categories_collection.insert_one(category)
    return jsonify({'_id': str(result.inserted_id), **category}), 201

# ========== ANALYTICS API ==========

# Get summary statistics
@app.route('/api/analytics/summary', methods=['GET'])
def get_summary():
    expenses = list(expenses_collection.find())
    if not expenses:
        return jsonify({
            'totalExpenses': 0,
            'categoryBreakdown': {},
            'monthlyTrend': {}
        }), 200
    
    total = sum(exp.get('amount', 0) for exp in expenses)
    
    # Category breakdown
    category_breakdown = {}
    for exp in expenses:
        cat = exp.get('category', 'Other')
        category_breakdown[cat] = category_breakdown.get(cat, 0) + exp.get('amount', 0)
    
    # Monthly trend
    monthly_trend = {}
    for exp in expenses:
        date = exp.get('date', '')
        if date:
            month = date[:7]  # YYYY-MM
            monthly_trend[month] = monthly_trend.get(month, 0) + exp.get('amount', 0)
    
    return jsonify({
        'totalExpenses': total,
        'categoryBreakdown': category_breakdown,
        'monthlyTrend': monthly_trend,
        'expenseCount': len(expenses)
    }), 200

# Predict next month expenses
@app.route('/api/predict/next-month', methods=['GET'])
def predict_next_month():
    try:
        # Fetch all expenses from database
        expenses = list(expenses_collection.find())
        
        # Get prediction from ML model
        result = predict_next_month_expense(expenses)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Prediction error: {str(e)}',
            'prediction': 0
        }), 500

# ========== HEALTH CHECK ==========

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
