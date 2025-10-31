// src/contexts/WishlistContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/wishlistService';

const WishlistContext = createContext();

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!currentUser) {
      console.log('👤 No user, clearing wishlist');
      setWishlistProducts([]);
      setWishlistProductIds(new Set());
      setLoading(false);
      setError(null);
      return;
    }

    try {
      console.log('🔄 Fetching wishlist for user:', currentUser.uid);
      setLoading(true);
      setError(null);
      
      const products = await wishlistService.getWishlistProducts(currentUser.uid);
      setWishlistProducts(products);
      setWishlistProductIds(new Set(products.map(p => p.id)));
      
      console.log('✅ Wishlist fetched successfully, items:', products.length);
    } catch (error) {
      console.error('❌ Failed to fetch wishlist:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!currentUser) {
      alert('Please sign in to add to wishlist');
      return false;
    }
    
    if (!product.id || !product.title) {
      alert('Invalid product data');
      return false;
    }

    // Optimistic UI update
    setWishlistProducts(prev => [...prev, product]);
    setWishlistProductIds(prev => new Set(prev).add(product.id));

    try {
      await wishlistService.addToWishlist(currentUser.uid, product);
      return true;
    } catch (error) {
      // Revert if error
      console.error('❌ Add to wishlist failed:', error);
      setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
      setWishlistProductIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
      
      if (error.message.includes('already in wishlist')) {
        alert('This product is already in your wishlist');
      } else {
        alert('Failed to add to wishlist. Please try again.');
      }
      return false;
    }
  };

  const removeFromWishlist = async (product) => {
    if (!currentUser) return false;

    if (!product.id) {
      console.error('Invalid product data for removal');
      return false;
    }

    // Optimistic UI update
    setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
    setWishlistProductIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(product.id);
      return newSet;
    });

    try {
      await wishlistService.removeFromWishlist(currentUser.uid, product);
      return true;
    } catch (error) {
      // Revert if error
      console.error('❌ Remove from wishlist failed:', error);
      setWishlistProducts(prev => [...prev, product]);
      setWishlistProductIds(prev => new Set(prev).add(product.id));
      
      alert('Failed to remove from wishlist. Please try again.');
      return false;
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistProductIds.has(productId);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    wishlistProducts,
    wishlistCount: wishlistProducts.length,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
    clearError
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}