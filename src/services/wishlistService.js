// src/services/wishlistService.js
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Correct path to your firebaseConfig

export const wishlistService = {
  getWishlistProducts: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Return the wishlist array, which should contain product objects
        return userData.wishlist || [];
      } else {
        // No user document found
        return [];
      }
    } catch (error) {
      console.error('Get wishlist error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  },

  addToWishlist: async (userId, product) => {
    try {
      if (!userId || !product) {
        throw new Error('User ID and product are required');
      }

      const userDocRef = doc(db, 'users', userId);
      
      // Use arrayUnion to add the product object to the 'wishlist' array
      await updateDoc(userDocRef, {
        wishlist: arrayUnion(product)
      });
      
      return { success: true, product };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  },

  removeFromWishlist: async (userId, product) => {
    try {
      if (!userId || !product) {
        throw new Error('User ID and product are required');
      }

      const userDocRef = doc(db, 'users', userId);

      // Use arrayRemove to remove the product object from the 'wishlist' array
      await updateDoc(userDocRef, {
        wishlist: arrayRemove(product)
      });

      return { success: true, productId: product.id };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  }
};