// src/components/Category/Category.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import scrapingService from '../../services/scrapingService';
import ProductCard from '../Product/ProductCard';
import FilterSidebar from '../Search/FilterSidebar';
import { HiOutlineCubeTransparent, HiOutlineFilter } from 'react-icons/hi';

const Category = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const { categoryName } = useParams();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setFilters({});
      try {
        const productsData = await scrapingService.searchProducts(categoryName, 50);
        setProducts(productsData || []);
        setFilteredProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

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

  const categoryTitles = {
    electronics: 'Electronics',
    fashion: 'Fashion',
    home: 'Home & Kitchen', // Corrected name
    books: 'Books',
    sports: 'Sports',
    beauty: 'Beauty', // Corrected name
    automotive: 'Automotive',
    toys: 'Toys' // Corrected name
  };
  const categoryTitle = categoryTitles[categoryName] || categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">{categoryTitle} Deals</h1>
        <p className="page-subtitle max-w-3xl">
            Explore the latest live deals for {categoryTitle.toLowerCase()}.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
           <div className="w-full flex justify-between items-center lg:hidden mb-4">
              <span className="text-sm font-medium text-slate-700">
                  {filteredProducts.length} deals shown
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary py-2 px-4 text-sm"
              >
                <HiOutlineFilter className="w-4 h-4 mr-1.5"/>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
           </div>

          <div className={`${showFilters ? 'block w-full mb-6' : 'hidden'} lg:block lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-36`}>
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                productsCount={filteredProducts.length}
                currentCategory={categoryTitle}
                availableBrands={Array.from(new Set(products.map(p => p.source).filter(Boolean)))}
              />
          </div>

          <div className="flex-1 w-full min-w-0">
             {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> {/* Adjust columns */}
                 {/* --- Corrected Comment Syntax --- */}
                 {Array(9).fill(0).map((_, index) => (
                   <div key={index} className="card p-3 animate-pulse">
                      <div className="bg-slate-100 h-48 rounded mb-3"></div>
                      <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-slate-100 rounded w-1/2 mb-3"></div>
                      <div className="h-9 bg-slate-100 rounded"></div>
                   </div>
                 ))}
                 {/* ------------------------------- */}
               </div>
             ) : filteredProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> {/* Adjust columns */}
                 {filteredProducts.map((product, index) => (
                   <ProductCard key={product.id || `${product.source}-${index}`} product={product} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-16 card bg-slate-50/50 border-slate-100">
                 <HiOutlineCubeTransparent className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                 <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {products.length > 0 ? 'No Deals Match Filters' : 'No Deals Found'}
                 </h3>
                 <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                    {products.length > 0
                        ? 'Try adjusting your filters.'
                        : `We couldn't find live deals for ${categoryTitle.toLowerCase()} right now. Try searching.`
                    }
                 </p>
                 <div className="flex justify-center gap-4">
                     {products.length > 0 && (
                         <button onClick={() => setFilters({})} className="btn-secondary text-sm">
                            Clear Filters
                         </button>
                     )}
                     <Link to="/search" className="btn-primary text-sm">
                        Go to Search
                     </Link>
                 </div>
               </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default Category;