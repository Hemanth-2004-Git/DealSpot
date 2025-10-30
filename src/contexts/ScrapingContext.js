import React, { createContext, useContext, useState, useCallback } from 'react';
import scrapingService from '../services/scrapingService';

const ScrapingContext = createContext();

export function useScraping() {
  const context = useContext(ScrapingContext);
  if (!context) {
    throw new Error('useScraping must be used within a ScrapingProvider');
  }
  return context;
}

export function ScrapingProvider({ children }) {
  const [scrapingStatus, setScrapingStatus] = useState({
    isScraping: false,
    progress: 0,
    currentPlatform: '',
    error: null
  });

  const searchProducts = useCallback(async (searchTerm, maxResults = 20) => {
    setScrapingStatus({
      isScraping: true,
      progress: 0,
      currentPlatform: 'Starting search...',
      error: null
    });

    try {
      const products = await scrapingService.searchProducts(searchTerm, maxResults);
      
      setScrapingStatus({
        isScraping: false,
        progress: 100,
        currentPlatform: 'Complete',
        error: null
      });

      return products;
    } catch (error) {
      setScrapingStatus({
        isScraping: false,
        progress: 0,
        currentPlatform: '',
        error: error.message
      });
      throw error;
    }
  }, []);

  const value = {
    scrapingStatus,
    searchProducts,
    clearError: () => setScrapingStatus(prev => ({ ...prev, error: null }))
  };

  return (
    <ScrapingContext.Provider value={value}>
      {children}
    </ScrapingContext.Provider>
  );
}