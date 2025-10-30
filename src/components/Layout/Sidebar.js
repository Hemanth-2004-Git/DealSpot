// src/components/Layout/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineHeart, 
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineShoppingBag,
  HiOutlineFire,
  HiOutlineStar,
  HiOutlineCollection
} from 'react-icons/hi'; 

const Sidebar = ({ isOpen, onClose, onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Home', 
      path: '/home', 
      icon: <HiOutlineHome className="w-5 h-5"/>, 
      description: 'Discover deals',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Wishlist', 
      path: '/wishlist', 
      icon: <HiOutlineHeart className="w-5 h-5"/>, 
      description: 'Saved items',
      gradient: 'from-pink-500 to-rose-500',
      badge: 'wishlist'
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <HiOutlineUserCircle className="w-5 h-5"/>, 
      description: 'Account settings',
      gradient: 'from-purple-500 to-indigo-500'
    },
  ];

  const quickLinks = [
    {
      name: 'Trending',
      path: '/search?q=trending',
      icon: <HiOutlineFire className="w-4 h-4" />,
      color: 'text-orange-500'
    },
    {
      name: 'Top Deals',
      path: '/search?q=top deals',
      icon: <HiOutlineStar className="w-4 h-4" />,
      color: 'text-amber-500'
    },
    {
      name: 'New Arrivals',
      path: '/search?q=new arrivals',
      icon: <HiOutlineCollection className="w-4 h-4" />,
      color: 'text-green-500'
    },
    {
      name: 'Clearance',
      path: '/search?q=clearance sale',
      icon: <HiOutlineShoppingBag className="w-4 h-4" />,
      color: 'text-red-500'
    }
  ];

  const handleItemClick = (path) => {
    navigate(path);
    onClose(); 
  };

  const isActive = (path) => {
    if (path === '/home' && location.pathname === '/') return true; 
    const baseLocationPath = location.pathname.split('/')[1];
    const basePath = path.split('/')[1];
    return baseLocationPath === basePath && basePath !== ''; 
  };

  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || 
                     user?.email?.charAt(0)?.toUpperCase() || 'U';

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto h-full bg-gradient-to-b from-white via-white to-slate-50/80">
      {/* Enhanced Logo Section */}
      <div className="flex items-center flex-shrink-0 px-6 mb-8">
        <button 
          onClick={() => navigate('/home')} 
          className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-2 -ml-2 transition-all duration-200 hover:scale-105 group"
        >
          {/* Animated Logo Container */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
              </svg>
            </div>
            {/* Pulsing dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DealSpot
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-wide -mt-1">
              Smart Shopping
            </span>
          </div>
        </button>
      </div>
      
      {/* Main Navigation */}
      <div className="mt-2 flex-grow flex flex-col">
        <nav className="flex-1 px-4 space-y-1"> 
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleItemClick(item.path)}
              className={`group flex items-center w-full px-3 py-3 text-sm rounded-xl transition-all duration-300 ease-out ${
                isActive(item.path)
                  ? `bg-gradient-to-r ${item.gradient} text-white font-bold shadow-lg transform scale-105` 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-md font-medium border border-transparent hover:border-slate-200'
              }`}
            >
              <span className={`mr-3 flex-shrink-0 transition-transform duration-300 ${
                isActive(item.path) 
                  ? 'text-white transform scale-110' 
                  : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'
              }`}>
                {item.icon}
              </span>
              <div className="text-left flex-1 min-w-0">
                <div className={`truncate ${isActive(item.path) ? 'font-bold' : 'font-semibold'}`}>
                  {item.name}
                </div>
                <div className={`text-xs mt-0.5 truncate transition-all duration-300 ${
                  isActive(item.path) ? 'text-white/90' : 'text-slate-500'
                }`}>
                  {item.description}
                </div>
              </div>
              
              {/* Badge for Wishlist */}
              {item.badge === 'wishlist' && (
                <div className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white'
                    : 'bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white'
                }`}>
                  ♥
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Links Section */}
        <div className="mt-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Access
            </h3>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>
          
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleItemClick(link.path)}
                className="group flex items-center w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100"
              >
                <span className={`mr-3 flex-shrink-0 ${link.color} transition-transform duration-200 group-hover:scale-110`}>
                  {link.icon}
                </span>
                <span className="text-slate-600 font-medium group-hover:text-slate-900">
                  {link.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced User Section */}
      <div className="flex-shrink-0 border-t border-slate-200/60 mx-4 pt-5 pb-4"> 
        <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-100/60">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {userInitial}
              </span>
            </div>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {user?.displayName || 'Welcome Back!'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 bg-white text-slate-600 border border-slate-200 py-2.5 px-4 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-md transition-all duration-200 group"
        >
          <HiOutlineLogout className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"/>
          <span>Sign Out</span>
        </button>
        
        {/* Footer */}
        <div className="mt-4 text-center">
          <div className="text-xs text-slate-400 font-medium">
            DealSpot v2.0
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Smart shopping experience
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-40"> {/* Increased width */}
        <div className="bg-gradient-to-b from-white/95 via-white/90 to-slate-50/80 backdrop-blur-2xl border-r border-slate-200/60 h-full shadow-xl"> 
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-white/98 via-white/95 to-slate-50/90 backdrop-blur-2xl border-r border-slate-200/60 transform transition-transform duration-500 ease-out lg:hidden shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
        <button
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 text-slate-400 hover:bg-white hover:text-slate-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
          aria-label="Close sidebar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Enhanced Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn" 
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar; 