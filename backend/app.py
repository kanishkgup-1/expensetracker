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
budgets_collection = db['budgets']  # NEW: for budgets

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# --- Existing routes here (omitted for brevity) ---

# ========== BUDGET ROUTES ==========

# Get budget for current month/year (default if not specified)
@app.route('/api/budget', methods=['GET'])
def get_budget():
    year = int(request.args.get('year', datetime.now().year))
    month = int(request.args.get('month', datetime.now().month))
    budget = budgets_collection.find_one({'year': year, 'month': month})
    if budget:
        return jsonify(serialize_doc(budget)), 200
    return jsonify({'year': year, 'month': month, 'budget': 0}), 200

# Set budget for current month/year (creates or updates)
@app.route('/api/budget', methods=['POST'])
def set_budget():
    data = request.json
    year = int(data.get('year', datetime.now().year))
    month = int(data.get('month', datetime.now().month))
    amount = float(data.get('budget'))
    budgets_collection.update_one(
        {'year': year, 'month': month},
        {'$set': {'budget': amount, 'updatedAt': datetime.now().isoformat()}},
        upsert=True
    )
    return jsonify({'year': year, 'month': month, 'budget': amount, 'message': 'Budget saved'}), 200

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200

# ========== EXPENSE ROUTES ==========
# ... REST OF FILE SAME ...

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
