from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

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

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200

# ========== EXPENSE ROUTES ==========

# Get all expenses
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    try:
        expenses = list(expenses_collection.find().sort('date', -1))
        return jsonify([serialize_doc(exp) for exp in expenses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get single expense
@app.route('/api/expenses/<expense_id>', methods=['GET'])
def get_expense(expense_id):
    try:
        expense = expenses_collection.find_one({'_id': ObjectId(expense_id)})
        if expense:
            return jsonify(serialize_doc(expense)), 200
        return jsonify({'error': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create expense
@app.route('/api/expenses', methods=['POST'])
def create_expense():
    try:
        data = request.json
        expense = {
            'title': data.get('title'),
            'amount': float(data.get('amount')),
            'category': data.get('category'),
            'date': data.get('date', datetime.now().isoformat()),
            'description': data.get('description', ''),
            'createdAt': datetime.now().isoformat()
        }
        result = expenses_collection.insert_one(expense)
        expense['_id'] = str(result.inserted_id)
        return jsonify(expense), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update expense
@app.route('/api/expenses/<expense_id>', methods=['PUT'])
def update_expense(expense_id):
    try:
        data = request.json
        update_data = {
            'title': data.get('title'),
            'amount': float(data.get('amount')),
            'category': data.get('category'),
            'date': data.get('date'),
            'description': data.get('description', ''),
            'updatedAt': datetime.now().isoformat()
        }
        result = expenses_collection.update_one(
            {'_id': ObjectId(expense_id)},
            {'$set': update_data}
        )
        if result.modified_count > 0:
            return jsonify({'message': 'Expense updated successfully'}), 200
        return jsonify({'error': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete expense
@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    try:
        result = expenses_collection.delete_one({'_id': ObjectId(expense_id)})
        if result.deleted_count > 0:
            return jsonify({'message': 'Expense deleted successfully'}), 200
        return jsonify({'error': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== CATEGORY ROUTES ==========

# Get all categories
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = list(categories_collection.find())
        return jsonify([serialize_doc(cat) for cat in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create category
@app.route('/api/categories', methods=['POST'])
def create_category():
    try:
        data = request.json
        category = {
            'name': data.get('name'),
            'icon': data.get('icon', '📁'),
            'color': data.get('color', '#000000'),
            'createdAt': datetime.now().isoformat()
        }
        result = categories_collection.insert_one(category)
        category['_id'] = str(result.inserted_id)
        return jsonify(category), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== ANALYTICS ROUTES ==========

# Get expense summary
@app.route('/api/analytics/summary', methods=['GET'])
def get_summary():
    try:
        total_expenses = expenses_collection.count_documents({})
        
        pipeline = [
            {'$group': {
                '_id': None,
                'total_amount': {'$sum': '$amount'}
            }}
        ]
        result = list(expenses_collection.aggregate(pipeline))
        total_amount = result[0]['total_amount'] if result else 0
        
        # Category-wise breakdown
        category_pipeline = [
            {'$group': {
                '_id': '$category',
                'total': {'$sum': '$amount'},
                'count': {'$sum': 1}
            }}
        ]
        category_data = list(expenses_collection.aggregate(category_pipeline))
        
        return jsonify({
            'total_expenses': total_expenses,
            'total_amount': total_amount,
            'by_category': category_data
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
