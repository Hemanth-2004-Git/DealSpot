// Scraper Integration Utilities
// This file provides utilities to integrate with the web scraper

const SCRAPER_API_URL = process.env.REACT_APP_SCRAPER_API_URL || 'http://localhost:3001';

// Trigger manual scraping
export const triggerScraping = async (source = null) => {
  try {
    const response = await fetch(`${SCRAPER_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source }),
    });

    if (!response.ok) {
      throw new Error(`Scraper API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error triggering scraping:', error);
    throw error;
  }
};

// Check scraper health
export const checkScraperHealth = async () => {
  try {
    const response = await fetch(`${SCRAPER_API_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Scraper health check failed: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking scraper health:', error);
    return { status: 'ERROR', error: error.message };
  }
};

// Get scraping statistics
export const getScrapingStats = async () => {
  try {
    const response = await fetch(`${SCRAPER_API_URL}/stats`);
    
    if (!response.ok) {
      throw new Error(`Stats API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting scraping stats:', error);
    return null;
  }
};

// Manual scraping functions for development
export const manualScraping = {
  // Scrape Amazon
  amazon: () => triggerScraping('amazon'),
  
  // Scrape Flipkart
  flipkart: () => triggerScraping('flipkart'),
  
  // Scrape Meesho
  meesho: () => triggerScraping('meesho'),
  
  // Scrape Myntra
  myntra: () => triggerScraping('myntra'),
  
  // Scrape all sources
  all: () => triggerScraping(),
};

// Development utilities
if (process.env.NODE_ENV === 'development') {
  window.triggerScraping = triggerScraping;
  window.checkScraperHealth = checkScraperHealth;
  window.manualScraping = manualScraping;
  
  console.log('🔧 Scraper integration utilities loaded!');
  console.log('Available functions:');
  console.log('- window.triggerScraping(source) - Trigger scraping for specific source');
  console.log('- window.checkScraperHealth() - Check scraper server health');
  console.log('- window.manualScraping.amazon() - Scrape Amazon');
  console.log('- window.manualScraping.flipkart() - Scrape Flipkart');
  console.log('- window.manualScraping.meesho() - Scrape Meesho');
  console.log('- window.manualScraping.myntra() - Scrape Myntra');
  console.log('- window.manualScraping.all() - Scrape all sources');
}
