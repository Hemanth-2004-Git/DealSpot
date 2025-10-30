// src/utils/filterUtils.js
export const filterProducts = (products, filters) => {
  return products.filter(product => {
    // Price filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // In stock filter
    if (filters.inStock && product.inStock === false) {
      return false;
    }

    // Free shipping filter
    if (filters.freeShipping && product.freeShipping !== true) {
      return false;
    }

    return true;
  });
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price_low':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price_high':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'discount':
      return sorted.sort((a, b) => {
        const discountA = a.discountPercentage || 
          (a.originalPrice && a.price ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0);
        const discountB = b.discountPercentage || 
          (b.originalPrice && b.price ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0);
        return discountB - discountA;
      });
    default:
      return sorted;
  }
};