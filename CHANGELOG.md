# Changelog

All notable changes to the Expense Tracker project.

---

## [Latest Update] - 2025-11-19

### 🎉 Major Updates

#### **Backend Integration Complete**
- ✅ Flask backend successfully deployed on Render
- ✅ MongoDB Atlas connected and working
- ✅ All CRUD operations working through API
- ✅ Health check endpoint available at `/api/health`

#### **Currency Updated to INR**
- ✅ Changed all currency symbols from `$` to `₹` (Indian Rupee)
- ✅ Updated in Dashboard page
- ✅ Updated in Expenses page
- ✅ Updated in Categories page
- ✅ Updated in all charts and graphs
- ✅ Updated in tooltips and labels
- ✅ Updated in CSV exports

#### **Categories Page Fixed**
- ✅ Now fetches data from backend API instead of localStorage
- ✅ Real-time data from MongoDB database
- ✅ Proper error handling and loading states
- ✅ All currency symbols updated to ₹
- ✅ CSV export includes INR symbol

### 🛠️ Technical Changes

#### **Dashboard (`src/app/dashboard/page.tsx`)**
- Integrated with backend API using `fetchExpenses()`
- Added error handling and retry functionality
- Changed currency from USD to INR
- Improved loading states

#### **Expense Page (`src/app/expense/page.tsx`)**
- Integrated with backend API for all operations:
  - Create expenses
  - Fetch expenses
  - Delete expenses
- Changed currency from USD to INR
- Added proper error messages
- Added loading indicators

#### **Categories Page (`src/app/categories/page.tsx`)**
- Migrated from localStorage to backend API
- Updated all currency displays to INR
- Added error handling
- Updated CSV export headers

#### **GraphCard Component (`src/app/components/GraphCard.tsx`)**
- Updated all chart labels to use ₹
- Updated tooltips to show INR
- Updated Y-axis labels
- Updated summary statistics

### 💾 Backend Files

#### **Flask API (`backend/app.py`)**
- RESTful API with Express-like routing
- MongoDB integration with PyMongo
- CORS enabled for frontend access
- Health check endpoint
- Expense CRUD operations
- Category management
- Analytics endpoints

#### **Dependencies (`backend/requirements.txt`)**
- Flask 3.0.0
- flask-cors 4.0.0
- pymongo 4.6.1
- python-dotenv 1.0.0
- gunicorn 21.2.0

#### **Deployment Config (`render.yaml`)**
- Automated Render deployment
- Python runtime configuration
- Build and start commands
- Environment variable setup

### 🔗 API Integration

#### **API Utility (`src/lib/api.ts`)**
- Centralized API calls
- TypeScript interfaces for type safety
- Error handling
- Functions for:
  - `fetchExpenses()` - Get all expenses
  - `createExpense()` - Add new expense
  - `updateExpense()` - Update existing expense
  - `deleteExpense()` - Remove expense
  - `fetchCategories()` - Get categories
  - `createCategory()` - Add category
  - `fetchSummary()` - Get analytics

### 🎯 Environment Configuration

#### **Frontend Environment Variables**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- Set in Vercel dashboard
- Required for all API calls

#### **Backend Environment Variables**
- `MONGO_URI` - MongoDB Atlas connection string
- `PORT` - Server port (10000 for Render)
- Set in Render dashboard

### 📚 Documentation Added

- **DEPLOYMENT.md** - Complete deployment guide
- **QUICKSTART.md** - Post-deployment quick start
- **CHANGELOG.md** - This file
- Environment variable templates

---

## 🚀 Deployment Architecture

```
User Browser
    ↓
Next.js Frontend (Vercel)
    ↓ HTTPS API Calls
Flask Backend (Render)
    ↓ MongoDB Driver
MongoDB Atlas (Cloud)
```

---

## 📊 Current Features

- ✅ Add expenses with title, amount, category, date, description
- ✅ View all expenses in list format
- ✅ Delete expenses
- ✅ Dashboard with analytics
- ✅ Category-wise breakdown
- ✅ Pie and bar charts
- ✅ Monthly budget tracking
- ✅ Budget alerts (80% and 100% thresholds)
- ✅ CSV export for categories
- ✅ All-time vs monthly view toggle
- ✅ Responsive design
- ✅ INR currency throughout
- ✅ Real-time data sync with MongoDB

---

## 🔜 Todo / Future Enhancements

- [ ] User authentication (login/signup)
- [ ] Multi-user support
- [ ] Update/edit existing expenses
- [ ] Recurring expenses
- [ ] Income tracking
- [ ] Advanced filters (date range, amount range)
- [ ] Email notifications for budget alerts
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Export to PDF
- [ ] Custom categories with icons
- [ ] Expense search functionality
- [ ] Tags for expenses
- [ ] Spending trends and predictions

---

## 🐛 Bug Fixes

### Fixed
- ✅ Categories page not loading data (now uses backend API)
- ✅ Currency symbol inconsistency (all changed to ₹)
- ✅ Backend deployment path issues (fixed requirements.txt path)
- ✅ Environment variable configuration
- ✅ CORS errors between frontend and backend

---

## 📝 Notes

- Backend sleeps after 15 minutes of inactivity (Render free tier)
- First request after sleep takes 30-60 seconds to wake up
- All data is stored in MongoDB Atlas (persistent)
- Budget tracking is still using localStorage (can be migrated to backend)
- Free tier limits:
  - MongoDB: 512 MB storage
  - Render: 750 hours/month
  - Vercel: Unlimited personal projects

---

## 👥 Contributors

- Kanishk Gupta (@kanishkgup-1)

---

**Version:** 1.0.0  
**Status:** 🟢 Production Ready  
**Last Updated:** November 19, 2025
