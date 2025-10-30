// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Home/Home';
// Removed import for CategoriesPage
import Category from './components/Category/Category';
import Search from './components/Search/Search';
import Wishlist from './components/Wishlist/Wishlist';
import Profile from './components/Profile/Profile';
import Layout from './components/Layout/Layout';
import { initializeDevUtils } from './utils/devUtils';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return ( // Simple loading spinner for route protection
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50/80 z-[100]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />; 
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) { // Consistent loading state
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50/80 z-[100]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  return currentUser ? <Navigate to="/home" replace /> : children; 
};

function App() {
  React.useEffect(() => {
    initializeDevUtils();
  }, []);

  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <div className="App"> {/* Keep this wrapper if needed for global styles */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Navigate to="/home" replace /></ProtectedRoute>} /> 
              
              <Route path="/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
              
              {/* Removed '/categories' route */}
              
              <Route path="/category/:categoryName" element={<ProtectedRoute><Layout><Category /></Layout></ProtectedRoute>} />
              
              <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
              
              <Route path="/wishlist" element={<ProtectedRoute><Layout><Wishlist /></Layout></ProtectedRoute>} />
              
              <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

              {/* Optional: Add a 404 Not Found route */}
              <Route path="*" element={<Navigate to="/home" replace />} /> 
              {/* Or create a dedicated 404 component */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;