// src/components/Product/ProductCard.js
import React, { useState } from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineHeart, HiHeart, HiOutlineStar, HiStar } from 'react-icons/hi';

const REQUIRED_PRODUCT_FIELDS = ['id', 'title', 'price', 'image', 'link', 'source'];

const ProductCard = ({ product }) => {
  const { currentUser } = useAuth();
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Debug: Check what data we're receiving
  console.log('🔄 ProductCard received:', {
    title: product?.title,
    price: product?.price,
    originalPrice: product?.originalPrice,
    priceText: product?.priceText,
    hasPriceText: !!product?.priceText
  });

  const getProductId = () => {
    if (product?.id) return String(product.id);
    const titlePart = product?.title ? product.title.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '_') : 'product';
    const sourcePart = product?.source ? product.source.replace(/[^a-zA-Z0-9]/g, '_') : 'unknown';
    const uniquePart = product?.price || Math.random().toString(36).substr(2, 5);
    return `${sourcePart}_${titlePart}_${uniquePart}`.toLowerCase().replace(/__/g, '_');
  };

  const productWithId = { ...product, id: getProductId() };
  const isProductDataComplete = REQUIRED_PRODUCT_FIELDS.every(
    field => productWithId[field] != null && productWithId[field] !== ''
  );

  const isInWishlist = isProductInWishlist(productWithId.id);

  // SIMPLE SOLUTION: Always format the price on the frontend
  const formatPrice = (price) => {
    if (!price && price !== 0) return null;
    
    let cleanPrice = price;
    if (typeof price === 'string') {
      cleanPrice = price.replace(/[^0-9.]/g, '');
    }
    
    const numPrice = parseFloat(cleanPrice);
    if (isNaN(numPrice)) return null;
    
    return numPrice.toLocaleString('en-IN');
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (productWithId.discountPercentage > 0) return productWithId.discountPercentage;
    
    const current = getNumericPrice(productWithId.price);
    const original = getNumericPrice(productWithId.originalPrice);
    
    if (original > current && original > 0) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  const getNumericPrice = (price) => {
    if (!price && price !== 0) return 0;
    let cleanPrice = price;
    if (typeof price === 'string') {
      cleanPrice = price.replace(/[^0-9.]/g, '');
    }
    return parseFloat(cleanPrice) || 0;
  };

  // MAIN PRICE DISPLAY FUNCTION
  const getPriceDisplay = () => {
    // If backend provides priceText, use it
    if (productWithId.priceText) {
      console.log('✅ Using backend priceText:', productWithId.priceText);
      return productWithId.priceText;
    }
    
    // Otherwise, format it ourselves
    const currentPrice = formatPrice(productWithId.price);
    const originalPrice = formatPrice(productWithId.originalPrice);
    const discount = calculateDiscount();
    
    if (currentPrice && originalPrice && discount > 0) {
      const priceText = `₹${currentPrice} M.R.P: ₹${originalPrice} (${discount}% off)`;
      console.log('🔄 Generated priceText:', priceText);
      return priceText;
    }
    
    if (currentPrice) {
      return `₹${currentPrice}`;
    }
    
    return 'Price not available';
  };

  // Get discount for badge
  const getDiscountDisplay = () => {
    if (productWithId.discountText) {
      return productWithId.discountText;
    }
    
    const discount = calculateDiscount();
    return discount > 0 ? `${discount}% OFF` : null;
  };

  // Wishlist toggle
  const toggleWishlist = async () => {
    if (!currentUser) return alert('Please sign in to save products to your wishlist');
    if (!isProductDataComplete) return alert('Cannot add incomplete product data to wishlist.');
    setWishlistLoading(true);
    try {
      if (isInWishlist) await removeFromWishlist(productWithId);
      else await addToWishlist(productWithId);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle Buy button
  const handleBuyNow = () => {
    if (productWithId.link)
      window.open(productWithId.link, '_blank', 'noopener,noreferrer');
    else alert('Product link is missing.');
  };

  // Product data
  const imageUrl = imageError
    ? 'https://via.placeholder.com/300x200?text=No+Image'
    : (productWithId.image || 'https://via.placeholder.com/300x200?text=Loading...');
  const title = productWithId.title || 'Product Title Unavailable';
  const source = productWithId.source || 'Unknown';
  const rating = productWithId.rating ? parseFloat(productWithId.rating).toFixed(1) : null;
  const reviewCount = productWithId.reviewCount || '';

  // Get display values
  const priceDisplay = getPriceDisplay();
  const discountDisplay = getDiscountDisplay();
  const additionalInfo = productWithId.additionalInfo || [];

  console.log('🎯 Final price display:', priceDisplay);

  return (
    <div className={`card overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      !isProductDataComplete ? 'opacity-70' : ''
    }`}>
      <div 
        className="relative overflow-hidden bg-slate-50 h-48 flex items-center justify-center flex-shrink-0 group"
      >
        <a href={productWithId.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0">
          {!imageError && imageLoaded ? (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/300x200?text=No+Image"
              alt=""
              className="absolute inset-0 w-full h-full object-contain p-2"
            />
          )}
        </a>

        {/* Wishlist Button - Top Right Corner */}
        <button
          onClick={toggleWishlist}
          disabled={wishlistLoading || !isProductDataComplete}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 z-30 ${
            isInWishlist
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/90 text-slate-700 hover:bg-white shadow-md'
          } ${!isProductDataComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {wishlistLoading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isInWishlist ? (
            <HiHeart className="w-5 h-5" />
          ) : (
            <HiOutlineHeart className="w-5 h-5" />
          )}
        </button>

        {/* Discount Badge */}
        {discountDisplay && isProductDataComplete && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
            {discountDisplay}
          </div>
        )}

        {/* Source Label */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium z-10 backdrop-blur-sm">
          {source}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Rating */}
        {rating && isProductDataComplete && (
          <div className="flex items-center mb-2">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) =>
                i < Math.floor(parseFloat(rating)) ? (
                  <HiStar key={i} className="w-4 h-4 fill-current" />
                ) : (
                  <HiOutlineStar key={i} className="w-4 h-4 text-amber-400" />
                )
              )}
            </div>
            <span className="ml-1 text-sm font-medium text-slate-700">{rating}</span>
            {reviewCount && (
              <span className="ml-1 text-xs text-slate-500">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Title */}
        <h3
          className="font-medium text-slate-800 mb-3 line-clamp-2 h-12 text-sm leading-snug hover:text-indigo-600 transition-colors"
          title={title}
        >
          <a href={productWithId.link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>

        {/* PRICE SECTION - UPDATED FONT STYLES */}
        <div className="mb-4 flex-grow">
          {isProductDataComplete ? (
            <div className="space-y-2">
              {/* Source Badge near Price */}
              <div className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                {source}
              </div>
              
              {/* Main Price Display - Professional Styling */}
              <div className="text-lg font-semibold text-gray-900 leading-tight tracking-tight">
                {priceDisplay.includes('M.R.P') ? (
                  <div className="space-y-1">
                    {/* Current Price - Bold and Prominent */}
                    <div className="text-xl font-bold text-gray-900">
                      ₹{formatPrice(productWithId.price)}
                    </div>
                    {/* Original Price and Discount - Professional styling */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 line-through font-medium">
                        M.R.P: ₹{formatPrice(productWithId.originalPrice)}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs">
                        {calculateDiscount()}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  // Single price display
                  <div className="text-xl font-bold text-gray-900">
                    {priceDisplay}
                  </div>
                )}
              </div>
              
              {/* Additional Information */}
              {additionalInfo.length > 0 && (
                <div className="space-y-0.5">
                  {additionalInfo.map((info, index) => (
                    <div 
                      key={index} 
                      className="text-xs text-green-600 font-medium leading-tight"
                    >
                      {info}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-slate-500">Price unavailable</span>
          )}
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={!productWithId.link}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white text-sm transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg ${
            !productWithId.link ? 'opacity-50 cursor-not-allowed grayscale' : ''
          }`}
        >
          {productWithId.link ? 'Buy Now' : 'Link Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;