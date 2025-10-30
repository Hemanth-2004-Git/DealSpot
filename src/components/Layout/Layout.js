// src/components/Layout/Layout.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CategoriesMegaMenu from '../Categories/CategoriesMegaMenu';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, navigate]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    // Base background color applied via index.css
    <div className="min-h-screen bg-slate-50"> 
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onLogout={handleLogout}
        user={currentUser}
      />

      {/* Main content area */}
      <div className="lg:pl-64"> {/* Sidebar width */}
        <Navbar 
          onMenuClick={toggleSidebar}
          user={currentUser}
          onLogout={handleLogout}
        />
        
        <CategoriesMegaMenu />

        {/* Consistent Padding & Centering */}
        <main className="py-8 px-4 sm:px-6 lg:px-8"> 
          <div className="max-w-7xl mx-auto"> {/* Max width container */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;