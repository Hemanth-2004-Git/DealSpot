// src/contexts/WishlistContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Make sure this path is correct
import { wishlistService } from '../services/wishlistService'; // Make sure this path is correct

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

  const fetchWishlist = useCallback(async () => {
    if (!currentUser) {
      setWishlistProducts([]);
      setWishlistProductIds(new Set());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const products = await wishlistService.getWishlistProducts(currentUser.uid);
      setWishlistProducts(products);
      setWishlistProductIds(new Set(products.map(p => p.id)));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
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
      return;
    }
    
    // Optimistic UI update
    setWishlistProducts(prev => [...prev, product]);
    setWishlistProductIds(prev => new Set(prev).add(product.id));

    try {
      await wishlistService.addToWishlist(currentUser.uid, product);
    } catch (error) {
      // Revert if error
      alert('Failed to add to wishlist. Please try again.');
      setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
      setWishlistProductIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  const removeFromWishlist = async (product) => {
    if (!currentUser) return;

    // Optimistic UI update
    setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
    setWishlistProductIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(product.id);
      return newSet;
    });

    try {
      // Pass the full product object for Firestore's arrayRemove
      await wishlistService.removeFromWishlist(currentUser.uid, product);
    } catch (error) {
      // Revert if error
      alert('Failed to remove from wishlist. Please try again.');
      setWishlistProducts(prev => [...prev, product]);
      setWishlistProductIds(prev => new Set(prev).add(product.id));
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistProductIds.has(productId);
  };

  const value = {
    wishlistProducts,
    wishlistCount: wishlistProducts.length,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}