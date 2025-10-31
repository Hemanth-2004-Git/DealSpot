// src/components/Profile/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const { wishlistCount } = useWishlist();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // 🎮 EASTER EGG: Konami Code
  const [easterEggActive, setEasterEggActive] = useState(false);
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    let sequence = [];
    
    const handleKeyDown = (e) => {
      sequence = [...sequence, e.key].slice(-10);
      if (sequence.join(',') === KONAMI_CODE.join(',')) {
        setEasterEggActive(true);
        setTimeout(() => setEasterEggActive(false), 5000);
        sequence = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [KONAMI_CODE]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setPreferences(data.preferences || []);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to user data:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handlePreferenceToggle = async (preference) => {
    const newPreferences = preferences.includes(preference)
      ? preferences.filter(p => p !== preference)
      : [...preferences, preference];

    setPreferences(newPreferences);

    try {
      setUpdating(true);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        preferences: newPreferences
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const preferenceOptions = [
    { id: 'electronics', name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { id: 'fashion', name: 'Fashion', icon: '👗', color: 'from-pink-500 to-rose-500' },
    { id: 'home', name: 'Home & Kitchen', icon: '🏠', color: 'from-green-500 to-emerald-500' },
    { id: 'books', name: 'Books', icon: '📚', color: 'from-purple-500 to-indigo-500' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'from-orange-500 to-red-500' },
    { id: 'beauty', name: 'Beauty', icon: '💄', color: 'from-pink-500 to-purple-500' },
    { id: 'automotive', name: 'Automotive', icon: '🚗', color: 'from-gray-600 to-gray-800' },
    { id: 'toys', name: 'Toys', icon: '🧸', color: 'from-yellow-500 to-orange-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const userInitial = userData?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 🎮 EASTER EGG OVERLAY */}
      {easterEggActive && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-8xl mb-4 animate-bounce">🎮</div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse">
              KONAMI CODE ACTIVATED!
            </div>
            <div className="text-xl text-gray-600 mt-2">✨ +30 Lives & Bug Fixed! ✨</div>
          </div>
          {/* Confetti Effect */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '💫', '🌟'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Profile Header */}
        <div className={`bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-white transition-all duration-500 ${easterEggActive ? 'animate-pulse' : ''}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-2xl font-bold text-white">{userInitial}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData?.name || 'User'}</h1>
                <p className="text-blue-100 text-lg">{userData?.email}</p>
                <p className="text-blue-100 text-sm mt-2">
                  Member since{' '}
                  {userData?.createdAt?.toDate
                    ? userData.createdAt.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recently'}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="text-center">
                <div className="text-2xl font-bold">{wishlistCount}</div>
                <div className="text-blue-100 text-sm">Wishlist Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {[
              { id: 'profile', name: 'Profile', icon: '👤' },
              { id: 'preferences', name: 'Preferences', icon: '⚙️' },
              { id: 'security', name: 'Security', icon: '🔒' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
                      <span className="mr-2">👤</span> Personal Information
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        <span className="font-semibold">Name:</span> {userData?.name || 'Not set'}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {userData?.email}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">User ID:</span>{' '}
                        <span className="font-mono text-sm bg-white/50 px-2 py-1 rounded ml-2">
                          {currentUser?.uid.substring(0, 8)}...
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
                      <span className="mr-2">📊</span> Account Statistics
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        <span className="font-semibold">Wishlist Items:</span>{' '}
                        <span className="bg-white/50 px-3 py-1 rounded-full text-sm font-medium">
                          {wishlistCount}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Preferences:</span>{' '}
                        <span className="bg-white/50 px-3 py-1 rounded-full text-sm font-medium">
                          {preferences.length} categories
                        </span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Status:</span>{' '}
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Preferences</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Select your favorite categories to get personalized deal recommendations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {preferenceOptions.map((preference) => (
                  <button
                    key={preference.id}
                    onClick={() => handlePreferenceToggle(preference.name)}
                    disabled={updating}
                    className={`relative p-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 ${
                      preferences.includes(preference.name)
                        ? `bg-gradient-to-br ${preference.color} text-white shadow-lg`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border-2 border-gray-200'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-3xl mb-3">{preference.icon}</div>
                    <div className="font-semibold">{preference.name}</div>
                    {preferences.includes(preference.name) && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {preferences.length > 0 && (
                <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <div>
                      <h4 className="font-semibold text-green-900">Personalization Active</h4>
                      <p className="text-green-700 text-sm">
                        You'll see more deals from your selected categories on the home page.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-yellow-800">
                        Security Best Practices
                      </h3>
                      <div className="mt-2 text-yellow-700">
                        <p>
                          • Always sign out when using shared devices
                          <br />
                          • Use a strong, unique password
                          <br />
                          • Enable two-factor authentication if available
                          <br />
                          • Never share your login credentials
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign Out</span>
                  </button>

                  <button
                    onClick={() => navigate('/wishlist')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>View Wishlist</span>
                  </button>

                  <button
                    onClick={() => navigate('/home')}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>Back to Home</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;