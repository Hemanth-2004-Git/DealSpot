// src/services/wishlistService.js
const BACKEND_URL = "https://dealspot-1.onrender.com";

export const wishlistService = {
  getWishlistProducts: async (userId) => {
    try {
      console.log('🔍 Fetching wishlist from backend for user:', userId);
      
      const response = await fetch(`${BACKEND_URL}/api/wishlist/products`, {
        headers: { 
          Authorization: `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }
      
      const products = await response.json();
      console.log(`✅ Backend returned ${products.length} wishlist items for user ${userId}`);
      return products;
    } catch (error) {
      console.error("❌ Get wishlist error:", error);
      throw error;
    }
  },

  addToWishlist: async (userId, product) => {
    try {
      console.log('➕ Adding to wishlist via backend for user:', userId);
      
      const response = await fetch(`${BACKEND_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({ product }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add to wishlist: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Backend added to wishlist:', result);
      return result;
    } catch (error) {
      console.error("❌ Add to wishlist error:", error);
      throw error;
    }
  },

  removeFromWishlist: async (userId, product) => {
    try {
      console.log('➖ Removing from wishlist via backend for user:', userId);
      
      const response = await fetch(
        `${BACKEND_URL}/api/wishlist/${product.id}`,
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${userId}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove from wishlist: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Backend removed from wishlist:', result);
      return result;
    } catch (error) {
      console.error("❌ Remove from wishlist error:", error);
      throw error;
    }
  },
};