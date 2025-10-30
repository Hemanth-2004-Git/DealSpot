#!/usr/bin/env node

/**
 * Manual Scraper Runner
 * Run this script to manually trigger scraping
 */

require('dotenv').config();
const { scrapeAllSources } = require('./scraper-hybrid');
const { initializeFirebase } = require('./firebase-admin');

const runScraper = async () => {
  console.log('🚀 Starting manual scraping...');
  console.log('================================\n');

  try {
    // Initialize Firebase
    initializeFirebase();

    // Get source from command line argument
    const source = process.argv[2];
    
    if (source && !['amazon', 'flipkart', 'meesho', 'myntra'].includes(source)) {
      console.log('❌ Invalid source. Use: amazon, flipkart, meesho, myntra');
      process.exit(1);
    }

    // Run scraping
    const results = await scrapeAllSources(source);
    
    console.log('\n📊 Scraping Results:');
    console.log('====================');
    console.log(`Amazon: ${results.amazon} products`);
    console.log(`Flipkart: ${results.flipkart} products`);
    console.log(`Meesho: ${results.meesho} products`);
    console.log(`Myntra: ${results.myntra} products`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => {
        console.log(`${error.source}: ${error.error}`);
      });
    }
    
    const total = results.amazon + results.flipkart + results.meesho + results.myntra;
    console.log(`\n🎉 Total products scraped: ${total}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runScraper();
}

module.exports = runScraper;
