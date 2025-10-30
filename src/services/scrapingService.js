// src/services/scrapingService.js
// Removed unused imports from firebase
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';

class ScrapingService {
  constructor() {
    this.isScraping = false;
  }

  async searchProducts(searchTerm, maxResults = 20) {
    try {
      console.log(`🎯 Fast search for: ${searchTerm}`);
      
      // Direct backend call - no caching delays
      const scrapedProducts = await this.performBackendScraping(searchTerm, maxResults);
      
      console.log(`✅ Received ${scrapedProducts.length} products`);
      return scrapedProducts;
      
    } catch (error) {
      console.error('Search error:', error);
      return []; // Will be handled by backend fallbacks
    }
  }

  async performBackendScraping(searchTerm, maxResults) {
    try {
      const response = await fetch(`http://localhost:3001/api/scrape?query=${encodeURIComponent(searchTerm)}&maxResults=${maxResults}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      if (!response.ok) throw new Error('Backend error');
      
      return await response.json();
    } catch (error) {
      console.error('Backend error:', error);
      throw error; // Let the component handle fallback
    }
  }

  sortByDiscount(products) {
    return products.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  }
}

const scrapingService = new ScrapingService();
export default scrapingService;