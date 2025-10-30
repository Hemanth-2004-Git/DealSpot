// src/components/Search/SearchBar.js
import React, { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const SearchBar = ({ searchTerm, onSearchChange, onSearchSubmit, placeholder, buttonText }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(localSearchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <input
          type="text"
          value={localSearchTerm}
          onChange={handleChange}
          placeholder={placeholder || "Search for products..."}
          className="flex-1 min-w-0 px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-r-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
        >
          <HiOutlineSearch className="w-5 h-5" />
          {buttonText || "Search"}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;