// src/components/Search/Search.js
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import scrapingService from '../../services/scrapingService';
import ProductCard from '../Product/ProductCard';
import FilterSidebar from './FilterSidebar';
import { HiOutlineSearchCircle, HiOutlineExclamation, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const location = useLocation();

  const performSearch = useCallback(async (query) => {
    if (!query || !query.trim()) return;
    const startTime = Date.now();
    setLoading(true);
    setSearchError(false);
    setProducts([]);
    setFilteredProducts([]);
    try {
      const searchResults = await scrapingService.searchProducts(query, 50);
      setProducts(searchResults || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(true);
      setProducts([]);
    } finally {
      setLoading(false);
      setSearchTime(Date.now() - startTime);
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    setSearchTerm(query);
    if (query) {
      performSearch(query);
    } else {
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
      setSearchError(false);
    }
  }, [location, performSearch]);

  useEffect(() => {
    let filtered = [...products];
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      filtered = filtered.filter(p => p.price && p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      filtered = filtered.filter(p => p.price && p.price <= parseFloat(filters.maxPrice));
    }
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => p.source && filters.brands.includes(p.source));
    }
    if (filters.rating && filters.rating !== '') {
      filtered = filtered.filter(p => p.rating && p.rating >= parseFloat(filters.rating));
    }
    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // ✅ NEW: Function to get search header text
  const getSearchHeaderText = () => {
    if (!searchTerm) return 'Search Products';
    
    // Check if this is a subcategory search by looking at common subcategory terms
    const subcategoryTerms = [
      'smartphones', 'laptops', 'tablets', 'accessories', 'headphones', 'speakers', 'tvs',
      'smart home', 'wearables', 'cameras', 'men', 'women', 'kids', 'sneakers', 'formal',
      'casual', 'watches', 'bags', 'jewelry', 'living room', 'bedroom', 'kitchen',
      'lighting', 'wall art', 'plants', 'cookware', 'appliances', 'dining', 'fiction',
      'non-fiction', 'academic', 'bestsellers', 'new releases', 'classics', 'gym equipment',
      'yoga', 'running', 'camping', 'cycling', 'team sports', 'face care', 'body care',
      'cosmetics', 'brushes', 'shampoo', 'styling', 'engine', 'brakes', 'suspension',
      'interior', 'exterior', 'audio', 'educational', 'action figures', 'outdoor',
      'rattles', 'soft toys', 'activity'
    ];
    
    const isSubcategorySearch = subcategoryTerms.includes(searchTerm.toLowerCase());
    
    if (isSubcategorySearch) {
      return `Best ${searchTerm} Deals`;
    }
    
    return `Results for "${searchTerm}"`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar - Sticky positioning */}
        {products.length > 0 && (
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                productsCount={filteredProducts.length}
                currentCategory={getSearchHeaderText()}
                availableBrands={Array.from(new Set(products.map(p => p.source).filter(Boolean)))}
              />
            </div>
          </div>
        )}

        {/* Products Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Toggle */}
          {products.length > 0 && (
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <span className="text-sm text-slate-600">
                {filteredProducts.length} deals
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary py-2 px-3 text-sm flex items-center"
              >
                <HiOutlineFilter className="w-4 h-4 mr-1"/>
                {showFilters ? 'Hide' : 'Filters'}
              </button>
            </div>
          )}

          {/* ✅ UPDATED: Search Results Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {getSearchHeaderText()}
            </h1>
            {searchTerm && (
              <p className="text-slate-600">
                Found {filteredProducts.length} deals in {searchTime > 0 ? `${searchTime}ms` : 'a moment'}
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="card p-3 animate-pulse">
                  <div className="bg-slate-100 h-40 rounded mb-3"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-slate-100 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {searchError && (
            <div className="text-center py-12 card bg-red-50 border-red-200">
              <HiOutlineExclamation className="mx-auto h-10 w-10 text-red-400 mb-3" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Search Failed</h3>
              <p className="text-red-600 text-sm mb-4">
                Sorry, we couldn't fetch deals. Please try again.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !searchError && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id || `${product.source}-${index}`}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* No Results State */}
          {!loading && !searchError && searchTerm && filteredProducts.length === 0 && (
            <div className="text-center py-12 card bg-slate-50 border-slate-200">
              <HiOutlineSearchCircle className="mx-auto h-10 w-10 text-slate-400 mb-3" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {products.length > 0 ? 'No Matching Deals' : 'No Deals Found'}
              </h3>
              <p className="text-slate-500 text-sm mb-4 max-w-md mx-auto">
                {products.length > 0
                  ? 'Try adjusting your filters to see more results.'
                  : `No deals found for "${searchTerm}". Try different keywords.`
                }
              </p>
              {products.length > 0 && (
                <button 
                  onClick={() => setFilters({})} 
                  className="btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Empty Search State */}
          {!loading && !searchTerm && (
            <div className="text-center py-12 text-slate-500">
              <HiOutlineSearch className="mx-auto h-12 w-12 mb-3"/>
              <p>Enter a search term to find deals</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;