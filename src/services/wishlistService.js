// src/services/wishlistService.js
const BACKEND_URL = "https://dealspot-1.onrender.com"; // change to your backend URL

export const wishlistService = {
  getWishlistProducts: async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/wishlist/products`, {
        headers: { Authorization: `Bearer ${userId}` },
      });
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      return await response.json();
    } catch (error) {
      console.error("Get wishlist error:", error);
      throw error;
    }
  },

  addToWishlist: async (userId, product) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({ product }),
      });
      if (!response.ok) throw new Error("Failed to add to wishlist");
      return await response.json();
    } catch (error) {
      console.error("Add to wishlist error:", error);
      throw error;
    }
  },

  removeFromWishlist: async (userId, product) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/wishlist/${product.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userId}` },
        }
      );
      if (!response.ok) throw new Error("Failed to remove from wishlist");
      return await response.json();
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      throw error;
    }
  },
};
