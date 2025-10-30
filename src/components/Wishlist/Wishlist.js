// src/components/Wishlist/Wishlist.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../Product/ProductCard';
import { useWishlist } from '../../contexts/WishlistContext'; // <-- IMPORT

const Wishlist = () => {
  const { currentUser } = useAuth();
  const { wishlistProducts, loading, removeFromWishlist } = useWishlist(); // <-- USE CONTEXT

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">🔒</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Please Sign In</h3>
          <p className="text-gray-600 mb-8">
            You need to be signed in to view and manage your wishlist.
          </p>
          <a
            href="/login"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Sign In Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
     

      {/* Wishlist Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
          </div>
          <span className="mt-6 text-gray-600 font-medium">Loading your wishlist...</span>
        </div>
      ) : wishlistProducts.length > 0 ? (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {wishlistProducts.length} Saved Item{wishlistProducts.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-gray-600">
                  All your favorite products in one place
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => removeFromWishlist(product)} // <-- USE CONTEXT FUNCTION (pass full product)
                  className="absolute top-4 right-4 bg-white/95 hover:bg-red-500 text-gray-600 hover:text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 backdrop-blur-sm z-10"
                  title="Remove from wishlist"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-gray-400 text-5xl">💖</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            Start building your collection by adding products you love. Click the heart icon on any deal to save it here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse Deals
            </a>
            <a
              href="/search"
              className="inline-flex items-center bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              Search Products
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;