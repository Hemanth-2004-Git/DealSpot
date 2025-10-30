// src/components/Categories/CategoriesMegaMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const categoriesData = {
  electronics: {
    name: 'Electronics',
    icon: '📱',
    color: 'from-blue-500 to-cyan-500',
    subcategories: {
      'MOBILE & COMPUTERS': ['Smartphones', 'Laptops', 'Tablets', 'Accessories'],
      'AUDIO & VIDEO': ['Headphones', 'Speakers', 'TVs'],
      'SMART DEVICES': ['Smart Home', 'Wearables', 'Cameras']
    }
  },
  fashion: {
    name: 'Fashion',
    icon: '👗',
    color: 'from-pink-500 to-rose-500',
    subcategories: {
      'CLOTHING': ["Men's", "Women's", 'Kids'],
      'FOOTWEAR': ['Sneakers', 'Formal', 'Casual'],
      'ACCESSORIES': ['Watches', 'Bags', 'Jewelry']
    }
  },
  home: {
    name: 'Home & Kitchen',
    icon: '🏠',
    color: 'from-green-500 to-emerald-500',
    subcategories: {
      'FURNITURE': ['Living Room', 'Bedroom', 'Kitchen'],
      'DECOR': ['Lighting', 'Wall Art', 'Plants'],
      'KITCHENWARE': ['Cookware', 'Appliances', 'Dining']
    }
  },
  books: {
    name: 'Books',
    icon: '📚',
    color: 'from-purple-500 to-indigo-500',
    subcategories: {
      'CATEGORIES': ['Fiction', 'Non-Fiction', 'Academic'],
      'POPULAR': ['Bestsellers', 'New Releases', 'Classics']
    }
  },
  sports: {
    name: 'Sports',
    icon: '⚽',
    color: 'from-orange-500 to-red-500',
    subcategories: {
      'FITNESS': ['Gym Equipment', 'Yoga', 'Running'],
      'OUTDOOR': ['Camping', 'Cycling', 'Team Sports']
    }
  },
  beauty: {
    name: 'Beauty',
    icon: '💄',
    color: 'from-pink-500 to-purple-500',
    subcategories: {
      'SKINCARE': ['Face Care', 'Body Care'],
      'MAKEUP': ['Cosmetics', 'Brushes'],
      'HAIR CARE': ['Shampoo', 'Styling']
    }
  },
  automotive: {
    name: 'Automotive',
    icon: '🚗',
    color: 'from-gray-600 to-gray-800',
    subcategories: {
      'PARTS': ['Engine', 'Brakes', 'Suspension'],
      'ACCESSORIES': ['Interior', 'Exterior', 'Audio']
    }
  },
  toys: {
    name: 'Toys',
    icon: '🧸',
    color: 'from-yellow-500 to-orange-500',
    subcategories: {
      'KIDS TOYS': ['Educational', 'Action Figures', 'Outdoor'],
      'BABY': ['Rattles', 'Soft Toys', 'Activity']
    }
  }
};

const CategoriesMegaMenu = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryKey) => {
    navigate(`/category/${categoryKey}`);
  };

  // ✅ UPDATED: Handle subcategory click to search for specific products
  const handleSubcategoryClick = (categoryKey, subcategoryItem) => {
    // Navigate to search with the specific subcategory as query
    navigate(`/search?q=${encodeURIComponent(subcategoryItem)}`);
  };

  return (
    <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm -mt-1">
      <div className="flex flex-wrap space-x-1 px-1 py-1">
        {Object.entries(categoriesData).map(([key, category]) => (
          <div
            key={key}
            className="relative flex-shrink-0 group mb-1"
          >
            {/* Category Button */}
            <button
              onClick={() => handleCategoryClick(key)}
              className={`flex items-center space-x-1.5 py-2 px-3 text-slate-700 group-hover:text-white font-medium transition-all duration-200 rounded-lg mx-0.5 whitespace-nowrap group-hover:bg-gradient-to-r ${category.color} group-hover:shadow-lg text-sm backdrop-blur-sm`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-semibold">{category.name}</span>
              <svg className="w-3 h-3 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-white"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mega Menu Dropdown */}
            <div 
              className="absolute top-full left-0 bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/60 rounded-b-lg z-50 cursor-default invisible group-hover:visible transition-all duration-75 min-w-[320px]"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${category.color} p-3 text-white rounded-t-lg`}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <h2 className="text-base font-bold">{category.name}</h2>
                    <p className="text-white/80 text-xs">Explore categories</p>
                  </div>
                </div>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-3">
                {category.subcategories && Object.entries(category.subcategories).map(([subCategoryTitle, subCategoryItems]) => (
                  <div key={subCategoryTitle} className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-tight border-l-2 border-blue-500 pl-1 mb-1">
                      {subCategoryTitle}
                    </h3>
                    <ul className="space-y-0.5">
                      {subCategoryItems.map((item, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleSubcategoryClick(key, item)}
                            className="text-xs text-slate-600 hover:text-blue-600 transition-colors duration-150 text-left w-full py-0.5 px-1 rounded hover:bg-blue-50/80 hover:font-medium"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {/* Featured Section */}
              <div className="border-t border-gray-200/60 bg-gray-50/50 p-2 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xs">Featured in {category.name}</h3>
                    <p className="text-slate-600 text-xs">Latest deals & products</p>
                  </div>
                  <button
                    onClick={() => handleCategoryClick(key)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMegaMenu;