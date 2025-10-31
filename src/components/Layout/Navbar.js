// src/components/Layout/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from '../Search/SearchBar';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { HiOutlineMenuAlt2, HiOutlineHeart, HiOutlineLogout, HiOutlineCog, HiChevronDown } from 'react-icons/hi';

const Navbar = ({ onMenuClick, onLogout }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { wishlistCount } = useWishlist();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (term) => {
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Use Firestore name first, then fallback to Firebase Auth displayName
  const displayName = userData?.name || currentUser?.displayName || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Left: Menu + Logo */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150 mr-3"
              aria-label="Open sidebar"
            >
              <HiOutlineMenuAlt2 className="h-6 w-6" />
            </button>
            {/* Updated Logo to match Sidebar */}
            <Link to="/home" className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-2 -ml-2 transition-all duration-200 hover:scale-105 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DealSpot
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide -mt-1">
                  Smart Shopping
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl mx-4 lg:mx-8">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search deals..."
              buttonText="Search"
            />
          </div>

          {/* Right: Icons + User */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150 group"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <HiOutlineHeart className="w-6 h-6"/>
              {wishlistCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </div>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-slate-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                aria-haspopup="true"
                aria-expanded={isUserDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-medium text-xs">
                    {userInitial}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-800 truncate max-w-[100px]">
                    {displayName.split(' ')[0]}
                  </p>
                </div>
                <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                  </div>

                  <button
                    onClick={() => { navigate('/profile'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150 flex items-center space-x-2"
                  >
                    <HiOutlineCog className="w-4 h-4 text-slate-500"/>
                    <span>Profile Settings</span>
                  </button>

                  <button
                    onClick={() => { onLogout(); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center space-x-2"
                  >
                    <HiOutlineLogout className="w-4 h-4"/>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;