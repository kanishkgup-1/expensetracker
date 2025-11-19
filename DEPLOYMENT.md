# Expense Tracker - Deployment Guide

This guide will help you set up MongoDB Atlas, deploy the Flask backend to Render, and deploy the Next.js frontend to Vercel.

## Architecture

- **Frontend**: Next.js (TypeScript) → Deployed on Vercel
- **Backend**: Flask (Python) → Deployed on Render
- **Database**: MongoDB Atlas (Cloud)

---

## 1. Setup MongoDB Atlas

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (select Free tier)

### Step 2: Configure Database Access
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create a username and strong password
5. Set user privileges to **Read and write to any database**
6. Click **Add User**

### Step 3: Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (or add specific IPs)
4. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Select **Python** as driver and version **3.6 or later**
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add `/expense_tracker` after `.net` to specify the database name:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
   ```

---

## 2. Deploy Backend to Render

### Step 1: Sign Up for Render
1. Go to [Render](https://render.com/)
2. Sign up using your GitHub account

### Step 2: Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select the `expensetracker` repository
4. Configure the service:
   - **Name**: `expense-tracker-api` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT backend.app:app`

### Step 3: Add Environment Variables
1. Scroll down to **Environment Variables**
2. Add the following:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB connection string from Step 1.4
3. Click **Add Environment Variable**
4. Add another variable:
   - **Key**: `PORT`
   - **Value**: `10000`

### Step 4: Deploy
1. Click **Create Web Service**
2. Wait for deployment (takes 2-3 minutes)
3. Once deployed, copy your backend URL (e.g., `https://expense-tracker-api.onrender.com`)

### Step 5: Test Backend
Visit `https://your-backend-url.onrender.com/api/health` in browser. You should see:
```json
{"status": "ok", "message": "Backend is running"}
```

---

## 3. Deploy Frontend to Vercel

### Step 1: Create Environment Variable File Locally
1. In your project root, create `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
   Replace with your actual Render backend URL

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Add Environment Variable
1. Go to **Environment Variables** section
2. Add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)
3. Click **Add**

### Step 4: Deploy
1. Click **Deploy**
2. Wait for deployment (1-2 minutes)
3. Visit your deployed site!

---

## 4. Local Development Setup

### Backend (Flask)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   
   # Activate on Windows
   venv\Scripts\activate
   
   # Activate on Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file** in backend directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

5. **Run Flask server**:
   ```bash
   python app.py
   ```
   Server will run on `http://localhost:5000`

### Frontend (Next.js)

1. **Navigate to project root**:
   ```bash
   cd ..
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env.local` file** in root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Run Next.js dev server**:
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:3000`

---

## 5. Using the API in Your Components

Example usage in a React component:

```typescript
import { useEffect, useState } from 'react';
import { fetchExpenses, createExpense, Expense } from '@/lib/api';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const addExpense = async () => {
    try {
      const newExpense = {
        title: 'Groceries',
        amount: 50.00,
        category: 'Food',
        date: new Date().toISOString(),
        description: 'Weekly shopping'
      };
      await createExpense(newExpense);
      loadExpenses(); // Refresh list
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  return (
    <div>
      <button onClick={addExpense}>Add Expense</button>
      <ul>
        {expenses.map(exp => (
          <li key={exp._id}>{exp.title}: ${exp.amount}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Analytics
- `GET /api/analytics/summary` - Get expense summary

---

## 7. Troubleshooting

### Backend Issues
- **Connection error**: Check MongoDB connection string and network access
- **Module not found**: Ensure all dependencies are installed (`pip install -r requirements.txt`)
- **CORS error**: Verify CORS is enabled in Flask app

### Frontend Issues
- **API connection failed**: Check `NEXT_PUBLIC_API_URL` environment variable
- **Build error**: Run `npm install` to ensure all dependencies are installed

### MongoDB Issues
- **Authentication failed**: Verify username/password in connection string
- **Network timeout**: Check Network Access settings in MongoDB Atlas

---

## 8. Free Tier Limits

- **MongoDB Atlas**: 512 MB storage (Free Forever)
- **Render**: 750 hours/month (Free tier, app sleeps after inactivity)
- **Vercel**: Unlimited deployments for personal projects

**Note**: Render free tier apps sleep after 15 minutes of inactivity. First request after sleep takes 30-60 seconds to wake up.

---

## Support

For issues, check:
- MongoDB Atlas: [Documentation](https://docs.atlas.mongodb.com/)
- Render: [Documentation](https://render.com/docs)
- Vercel: [Documentation](https://vercel.com/docs)

Good luck with your deployment! 🚀
