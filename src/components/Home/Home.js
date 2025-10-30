// src/components/Home/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import scrapingService from '../../services/scrapingService';
import ProductCard from '../Product/ProductCard';
import { HiCheckCircle, HiLightningBolt, HiShieldCheck, HiTag } from 'react-icons/hi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingProducts = async () => {
      setLoading(true);
      try {
        const products = await scrapingService.searchProducts('trending deals', 50);
        setFeaturedProducts(products || []);
      } catch (error) {
        console.error('Error loading trending products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadTrendingProducts();
  }, []);

  return (
    <div className="space-y-12">
      {/* Products Grid Section */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            🔥 Trending Deals Today
          </h2>
          <span className="text-sm text-slate-500">
            {featuredProducts.length} deals
          </span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="card p-3 animate-pulse opacity-0"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="bg-slate-100 h-40 rounded mb-3"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-slate-100 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id || `${product.source}-${index}`} 
                product={product} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card bg-slate-50 border-slate-200">
            <HiTag className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Trending Deals</h3>
            <p className="text-slate-500 text-sm mb-4">
              Check back later for new deals or try searching for specific products.
            </p>
            <Link to="/search" className="btn-primary text-sm inline-block">
              Search Products
            </Link>
          </div>
        )}
      </div>

      {/* Trust/Features Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Why Choose DealSpot?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <HiLightningBolt className="h-7 w-7 text-indigo-500 mx-auto mb-2"/>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">Instant Results</h4>
            <p className="text-xs text-slate-600">Real-time prices from multiple stores.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <HiShieldCheck className="h-7 w-7 text-green-500 mx-auto mb-2"/>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">Verified Deals</h4>
            <p className="text-xs text-slate-600">Accurate prices and genuine offers.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <HiCheckCircle className="h-7 w-7 text-purple-500 mx-auto mb-2"/>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">Simple & Fast</h4>
            <p className="text-xs text-slate-600">Find the best prices effortlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;