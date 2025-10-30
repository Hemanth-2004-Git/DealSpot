// src/components/Search/FilterSidebar.js
import React, { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineChevronUp, HiStar, HiOutlineFilter, HiOutlineRefresh } from 'react-icons/hi';

const FilterSection = ({ title, children, defaultOpen = false, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100/60 py-3 last:border-b-0"> {/* Reduced padding */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center w-full group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          {icon && <span className="text-indigo-500 text-sm">{icon}</span>} {/* Smaller icon */}
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{title}</h3> {/* Smaller text */}
        </div>
        <div className={`p-1 rounded transition-all duration-200 ${
          isOpen 
            ? 'bg-indigo-100 text-indigo-600 rotate-180' 
            : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
        }`}>
          <HiOutlineChevronUp className="w-3 h-3" /> {/* Smaller chevron */}
        </div>
      </button>
      {isOpen && (
        <div className="mt-3 space-y-2 animate-fadeIn"> {/* Reduced margin and spacing */}
          {children}
        </div>
      )}
    </div>
  );
};

const CheckboxFilter = ({ label, id, checked, onChange, count, popular }) => (
  <label htmlFor={id} className="flex items-center justify-between cursor-pointer group py-1 px-1 rounded transition-all duration-150 hover:bg-indigo-50/30"> {/* Reduced padding */}
    <div className="flex items-center space-x-2"> {/* Reduced spacing */}
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:ring-offset-0 transition-all duration-150" /* Smaller checkbox */
        />
        {checked && (
          <div className="absolute inset-0 bg-indigo-600 rounded border border-white shadow-xs animate-pulse"></div> /* Smaller pulse */
        )}
      </div>
      <span className={`text-xs transition-all duration-150 ${
        checked ? 'text-indigo-700 font-medium' : 'text-slate-600 group-hover:text-slate-800'
      }`}> {/* Smaller text */}
        {label}
      </span>
      {popular && (
        <span className="px-1 py-0.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] rounded font-medium"> {/* Smaller badge */}
          Popular
        </span>
      )}
    </div>
    {count !== undefined && (
      <span className={`text-[10px] px-1.5 py-0.5 rounded transition-all duration-150 ${
        checked ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-slate-100 text-slate-500'
      }`}> {/* Smaller count badge */}
        {count}
      </span>
    )}
  </label>
);

const RadioFilter = ({ label, id, name, value, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer group py-1.5 px-1 rounded transition-all duration-150 hover:bg-amber-50/30"> {/* Reduced padding */}
    <div className="relative">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 text-amber-500 border-slate-300 focus:ring-1 focus:ring-amber-500 focus:ring-offset-0 transition-all duration-150" /* Smaller radio */
      />
      {checked && (
        <div className="absolute inset-0 bg-amber-500 rounded-full border border-white shadow-xs animate-pulse"></div> /* Smaller pulse */
      )}
    </div>
    <span className={`text-xs transition-all duration-150 ${
      checked ? 'text-amber-700 font-medium' : 'text-slate-600 group-hover:text-slate-800'
    }`}> {/* Smaller text */}
      {label}
    </span>
  </label>
);

const PriceInput = ({ value, onChange, onBlur, placeholder, name }) => (
  <div className="relative flex-1 group">
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium transition-colors duration-150 group-focus-within:text-indigo-600"> {/* Smaller rupee symbol */}
      ₹
    </span>
    <input 
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full pl-6 pr-2 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 bg-white/80 backdrop-blur-sm group-hover:border-slate-400" /* Smaller input */
      inputMode="decimal"
    />
  </div>
);

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  productsCount, 
  currentCategory = "Results", 
  availableBrands = []
}) => {
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice || '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice || '');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    setMinPriceInput(filters.minPrice || '');
    setMaxPriceInput(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setPriceError('');
    
    if (name === 'min') {
      setMinPriceInput(sanitizedValue);
    } else {
      setMaxPriceInput(sanitizedValue);
    }
  };

  const applyPriceFilters = () => {
    const min = minPriceInput !== '' ? parseFloat(minPriceInput) : undefined;
    const max = maxPriceInput !== '' ? parseFloat(maxPriceInput) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      setPriceError('Minimum price cannot be greater than maximum');
      return;
    }

    if (min !== undefined && min < 0) {
      setPriceError('Price cannot be negative');
      return;
    }

    setPriceError('');
    onFiltersChange({ 
      ...filters, 
      minPrice: min,
      maxPrice: max
    });
  };

  const handlePriceKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyPriceFilters();
    }
  };

  const handleBrandToggle = (brandName) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brandName)
      ? currentBrands.filter(b => b !== brandName)
      : [...currentBrands, brandName];
    
    onFiltersChange({ ...filters, brands: newBrands.length > 0 ? newBrands : undefined });
  };
  
  const handleRatingChange = (ratingValue) => {
    const newRating = filters.rating === ratingValue ? undefined : ratingValue;
    onFiltersChange({ ...filters, rating: newRating });
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setPriceError('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
  );

  // Popular brands detection
  const isPopularBrand = (brand) => {
    const popularBrands = ['Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'Ajio'];
    return popularBrands.includes(brand);
  };

  // Get brand counts
  const getBrandCount = (brand) => {
    const mockCounts = {
      'Amazon': 42,
      'Flipkart': 38,
      'Myntra': 25,
      'Nykaa': 18,
      'Ajio': 15,
      'Meesho': 12,
      'Snapdeal': 8
    };
    return mockCounts[brand] || Math.floor(Math.random() * 20) + 1;
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-slate-200/60 shadow-lg p-4 space-y-1 sticky top-24"> {/* Reduced padding and spacing */}
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-1 border-b border-slate-100/60"> {/* Reduced padding */}
        <div className="flex items-center space-x-2"> {/* Reduced spacing */}
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md"> {/* Smaller icon container */}
            <HiOutlineFilter className="w-3.5 h-3.5 text-white" /> {/* Smaller icon */}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Filters</h2> {/* Smaller text */}
            <p className="text-[10px] text-slate-500 mt-0.5"> {/* Smaller text */}
              {productsCount} products
            </p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 px-2 py-1 text-[10px] font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-150 group" /* Smaller button */
          >
            <HiOutlineRefresh className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" /> {/* Smaller icon */}
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-2 mb-3"> {/* Reduced padding */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-indigo-700">Active</span> {/* Smaller text */}
            <div className="flex space-x-1">
              {filters.minPrice !== undefined && (
                <span className="px-1.5 py-0.5 bg-white text-indigo-600 text-[10px] rounded border border-indigo-200"> {/* Smaller badge */}
                  Min: ₹{filters.minPrice}
                </span>
              )}
              {filters.maxPrice !== undefined && (
                <span className="px-1.5 py-0.5 bg-white text-indigo-600 text-[10px] rounded border border-indigo-200"> {/* Smaller badge */}
                  Max: ₹{filters.maxPrice}
                </span>
              )}
              {filters.brands && filters.brands.length > 0 && (
                <span className="px-1.5 py-0.5 bg-white text-indigo-600 text-[10px] rounded border border-indigo-200"> {/* Smaller badge */}
                  {filters.brands.length} stores
                </span>
              )}
              {filters.rating && (
                <span className="px-1.5 py-0.5 bg-white text-indigo-600 text-[10px] rounded border border-indigo-200"> {/* Smaller badge */}
                  {filters.rating}★ & up
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Range Section */}
      <FilterSection title="Price Range" defaultOpen={true} icon="💰">
        <div className="space-y-3"> {/* Reduced spacing */}
          <div className="flex items-center gap-2"> {/* Reduced gap */}
            <PriceInput
              name="min"
              value={minPriceInput}
              onChange={handlePriceInputChange}
              onBlur={applyPriceFilters}
              onKeyPress={handlePriceKeyPress}
              placeholder="Min"
            />
            <span className="text-slate-400 text-xs font-medium">to</span> {/* Smaller text */}
            <PriceInput
              name="max"
              value={maxPriceInput}
              onChange={handlePriceInputChange}
              onBlur={applyPriceFilters}
              onKeyPress={handlePriceKeyPress}
              placeholder="Max"
            />
          </div>
          
          {priceError && (
            <div className="text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 animate-shake"> {/* Smaller error */}
              ⚠️ {priceError}
            </div>
          )}
          
          <div className="flex space-x-1.5"> {/* Reduced spacing */}
            {[1000, 5000, 10000].map((price) => (
              <button
                key={price}
                onClick={() => {
                  setMinPriceInput('');
                  setMaxPriceInput(price.toString());
                  setTimeout(applyPriceFilters, 100);
                }}
                className="flex-1 text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 py-1 rounded transition-all duration-150" /* Smaller button */
              >
                Under ₹{(price/1000)}K
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Brand/Source Section */}
      {availableBrands.length > 0 && (
        <FilterSection title="Stores & Brands" defaultOpen={true} icon="🏪">
          <div className="max-h-32 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin"> {/* Reduced height and spacing */}
            {availableBrands.sort().map((brand) => (
              <CheckboxFilter
                key={brand}
                id={`brand-${brand}`}
                label={brand}
                checked={(filters.brands || []).includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                count={getBrandCount(brand)}
                popular={isPopularBrand(brand)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Rating Section */}
      <FilterSection title="Ratings" defaultOpen={true} icon="⭐"> {/* Shorter title */}
        <div className="space-y-1"> {/* Reduced spacing */}
          {[4, 3, 2, 1].map((rating) => (
            <RadioFilter 
              key={`rating-${rating}`}
              id={`rating-${rating}`}
              name="ratingFilter"
              label={
                <div className="flex items-center space-x-1.5"> {/* Reduced spacing */}
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <HiStar 
                        key={i}
                        className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-slate-300'}`} /* Smaller stars */
                      />
                    ))}
                  </div>
                  <span className="text-slate-600 text-xs">& above</span> {/* Smaller text */}
                </div>
              }
              value={rating.toString()}
              checked={filters.rating === rating.toString()}
              onChange={() => handleRatingChange(rating.toString())}
            />
          ))}
        </div>
      </FilterSection>

      {/* Quick Actions Footer */}
      <div className="pt-3 border-t border-slate-100/60"> {/* Reduced padding */}
        <div className="flex space-x-1.5"> {/* Reduced spacing */}
          <button
            onClick={clearAllFilters}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-150 flex items-center justify-center space-x-1" /* Smaller button */
          >
            <HiOutlineX className="w-3 h-3" /> {/* Smaller icon */}
            <span>Reset</span>
          </button>
          <button
            onClick={applyPriceFilters}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-md hover:shadow transition-all duration-150" /* Smaller button */
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;