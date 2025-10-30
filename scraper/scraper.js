require('dotenv').config();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const { addProduct, checkProductExists } = require('./firebase-admin');

// Scraping configuration
const SCRAPING_CONFIG = {
  headless: process.env.HEADLESS_MODE === 'true',
  timeout: 30000,
  maxProducts: parseInt(process.env.MAX_PRODUCTS_PER_SOURCE) || 50,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  // Use system Chrome if available
  executablePath: process.env.CHROME_PATH || undefined,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ]
};

// Main scraping function
const scrapeAllSources = async (specificSource = null) => {
  const results = {
    amazon: 0,
    flipkart: 0,
    meesho: 0,
    myntra: 0,
    errors: []
  };

  try {
    console.log('🚀 Starting web scraping...');
    
    if (!specificSource || specificSource === 'amazon') {
      try {
        results.amazon = await scrapeAmazon();
        console.log(`✅ Amazon: ${results.amazon} products scraped`);
      } catch (error) {
        console.error('❌ Amazon scraping failed:', error.message);
        results.errors.push({ source: 'amazon', error: error.message });
      }
    }

    if (!specificSource || specificSource === 'flipkart') {
      try {
        results.flipkart = await scrapeFlipkart();
        console.log(`✅ Flipkart: ${results.flipkart} products scraped`);
      } catch (error) {
        console.error('❌ Flipkart scraping failed:', error.message);
        results.errors.push({ source: 'flipkart', error: error.message });
      }
    }

    if (!specificSource || specificSource === 'meesho') {
      try {
        results.meesho = await scrapeMeesho();
        console.log(`✅ Meesho: ${results.meesho} products scraped`);
      } catch (error) {
        console.error('❌ Meesho scraping failed:', error.message);
        results.errors.push({ source: 'meesho', error: error.message });
      }
    }

    if (!specificSource || specificSource === 'myntra') {
      try {
        results.myntra = await scrapeMyntra();
        console.log(`✅ Myntra: ${results.myntra} products scraped`);
      } catch (error) {
        console.error('❌ Myntra scraping failed:', error.message);
        results.errors.push({ source: 'myntra', error: error.message });
      }
    }

    const totalProducts = results.amazon + results.flipkart + results.meesho + results.myntra;
    console.log(`🎉 Scraping completed! Total products: ${totalProducts}`);
    
    return results;
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw error;
  }
};

// Amazon scraper
const scrapeAmazon = async () => {
  console.log('🛒 Scraping Amazon deals...');
  
  const browser = await puppeteer.launch({
    headless: SCRAPING_CONFIG.headless,
    executablePath: SCRAPING_CONFIG.executablePath,
    args: SCRAPING_CONFIG.args
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent(SCRAPING_CONFIG.userAgent);
    
    // Navigate to Amazon deals page
    await page.goto('https://www.amazon.in/gp/goldbox', { 
      waitUntil: 'networkidle2',
      timeout: SCRAPING_CONFIG.timeout 
    });
    
    // Wait for deals to load
    await page.waitForSelector('[data-testid="deal-card"]', { timeout: 10000 });
    
    const products = await page.evaluate(() => {
      const dealCards = document.querySelectorAll('[data-testid="deal-card"]');
      const products = [];
      
      dealCards.forEach((card, index) => {
        if (index >= 20) return; // Limit to 20 products
        
        try {
          const titleElement = card.querySelector('h3, h4, [data-testid="deal-title"]');
          const priceElement = card.querySelector('[data-testid="deal-price"], .a-price-whole');
          const originalPriceElement = card.querySelector('[data-testid="deal-original-price"], .a-price-was');
          const imageElement = card.querySelector('img');
          const linkElement = card.querySelector('a');
          const discountElement = card.querySelector('[data-testid="deal-discount"], .a-badge-text');
          
          if (titleElement && priceElement) {
            const title = titleElement.textContent.trim();
            const price = parseFloat(priceElement.textContent.replace(/[₹,]/g, ''));
            const originalPrice = originalPriceElement ? 
              parseFloat(originalPriceElement.textContent.replace(/[₹,]/g, '')) : price;
            const image = imageElement ? imageElement.src : '';
            const link = linkElement ? `https://amazon.in${linkElement.getAttribute('href')}` : '';
            const discount = discountElement ? 
              parseInt(discountElement.textContent.replace(/[%]/g, '')) : 
              Math.round(((originalPrice - price) / originalPrice) * 100);
            
            if (title && price && link) {
              products.push({
                title,
                price,
                originalPrice,
                discountPercent: discount,
                image,
                link,
                source: 'Amazon',
                sourceId: `amazon_${Date.now()}_${index}`,
                category: 'electronics' // Default category
              });
            }
          }
        } catch (error) {
          console.error('Error parsing deal card:', error);
        }
      });
      
      return products;
    });
    
    // Save products to Firestore
    let savedCount = 0;
    for (const product of products) {
      const exists = await checkProductExists('Amazon', product.sourceId);
      if (!exists) {
        const success = await addProduct(product);
        if (success) savedCount++;
      }
    }
    
    return savedCount;
  } finally {
    await browser.close();
  }
};

// Flipkart scraper
const scrapeFlipkart = async () => {
  console.log('🛒 Scraping Flipkart deals...');
  
  const browser = await puppeteer.launch({
    headless: SCRAPING_CONFIG.headless,
    executablePath: SCRAPING_CONFIG.executablePath,
    args: SCRAPING_CONFIG.args
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent(SCRAPING_CONFIG.userAgent);
    
    // Navigate to Flipkart deals page
    await page.goto('https://www.flipkart.com/offers-store', { 
      waitUntil: 'networkidle2',
      timeout: SCRAPING_CONFIG.timeout 
    });
    
    // Wait for deals to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    
    const products = await page.evaluate(() => {
      const productCards = document.querySelectorAll('[data-testid="product-card"]');
      const products = [];
      
      productCards.forEach((card, index) => {
        if (index >= 20) return; // Limit to 20 products
        
        try {
          const titleElement = card.querySelector('[data-testid="product-title"]');
          const priceElement = card.querySelector('[data-testid="product-price"]');
          const originalPriceElement = card.querySelector('[data-testid="product-original-price"]');
          const imageElement = card.querySelector('img');
          const linkElement = card.querySelector('a');
          const discountElement = card.querySelector('[data-testid="product-discount"]');
          
          if (titleElement && priceElement) {
            const title = titleElement.textContent.trim();
            const price = parseFloat(priceElement.textContent.replace(/[₹,]/g, ''));
            const originalPrice = originalPriceElement ? 
              parseFloat(originalPriceElement.textContent.replace(/[₹,]/g, '')) : price;
            const image = imageElement ? imageElement.src : '';
            const link = linkElement ? `https://flipkart.com${linkElement.getAttribute('href')}` : '';
            const discount = discountElement ? 
              parseInt(discountElement.textContent.replace(/[%]/g, '')) : 
              Math.round(((originalPrice - price) / originalPrice) * 100);
            
            if (title && price && link) {
              products.push({
                title,
                price,
                originalPrice,
                discountPercent: discount,
                image,
                link,
                source: 'Flipkart',
                sourceId: `flipkart_${Date.now()}_${index}`,
                category: 'electronics' // Default category
              });
            }
          }
        } catch (error) {
          console.error('Error parsing product card:', error);
        }
      });
      
      return products;
    });
    
    // Save products to Firestore
    let savedCount = 0;
    for (const product of products) {
      const exists = await checkProductExists('Flipkart', product.sourceId);
      if (!exists) {
        const success = await addProduct(product);
        if (success) savedCount++;
      }
    }
    
    return savedCount;
  } finally {
    await browser.close();
  }
};

// Meesho scraper
const scrapeMeesho = async () => {
  console.log('🛒 Scraping Meesho deals...');
  
  const browser = await puppeteer.launch({
    headless: SCRAPING_CONFIG.headless,
    executablePath: SCRAPING_CONFIG.executablePath,
    args: SCRAPING_CONFIG.args
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent(SCRAPING_CONFIG.userAgent);
    
    // Navigate to Meesho deals page
    await page.goto('https://www.meesho.com/offers', { 
      waitUntil: 'networkidle2',
      timeout: SCRAPING_CONFIG.timeout 
    });
    
    // Wait for deals to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    
    const products = await page.evaluate(() => {
      const productCards = document.querySelectorAll('[data-testid="product-card"]');
      const products = [];
      
      productCards.forEach((card, index) => {
        if (index >= 20) return; // Limit to 20 products
        
        try {
          const titleElement = card.querySelector('[data-testid="product-title"]');
          const priceElement = card.querySelector('[data-testid="product-price"]');
          const originalPriceElement = card.querySelector('[data-testid="product-original-price"]');
          const imageElement = card.querySelector('img');
          const linkElement = card.querySelector('a');
          const discountElement = card.querySelector('[data-testid="product-discount"]');
          
          if (titleElement && priceElement) {
            const title = titleElement.textContent.trim();
            const price = parseFloat(priceElement.textContent.replace(/[₹,]/g, ''));
            const originalPrice = originalPriceElement ? 
              parseFloat(originalPriceElement.textContent.replace(/[₹,]/g, '')) : price;
            const image = imageElement ? imageElement.src : '';
            const link = linkElement ? `https://meesho.com${linkElement.getAttribute('href')}` : '';
            const discount = discountElement ? 
              parseInt(discountElement.textContent.replace(/[%]/g, '')) : 
              Math.round(((originalPrice - price) / originalPrice) * 100);
            
            if (title && price && link) {
              products.push({
                title,
                price,
                originalPrice,
                discountPercent: discount,
                image,
                link,
                source: 'Meesho',
                sourceId: `meesho_${Date.now()}_${index}`,
                category: 'fashion' // Default category for Meesho
              });
            }
          }
        } catch (error) {
          console.error('Error parsing product card:', error);
        }
      });
      
      return products;
    });
    
    // Save products to Firestore
    let savedCount = 0;
    for (const product of products) {
      const exists = await checkProductExists('Meesho', product.sourceId);
      if (!exists) {
        const success = await addProduct(product);
        if (success) savedCount++;
      }
    }
    
    return savedCount;
  } finally {
    await browser.close();
  }
};

// Myntra scraper
const scrapeMyntra = async () => {
  console.log('🛒 Scraping Myntra deals...');
  
  const browser = await puppeteer.launch({
    headless: SCRAPING_CONFIG.headless,
    executablePath: SCRAPING_CONFIG.executablePath,
    args: SCRAPING_CONFIG.args
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent(SCRAPING_CONFIG.userAgent);
    
    // Navigate to Myntra deals page
    await page.goto('https://www.myntra.com/offers', { 
      waitUntil: 'networkidle2',
      timeout: SCRAPING_CONFIG.timeout 
    });
    
    // Wait for deals to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    
    const products = await page.evaluate(() => {
      const productCards = document.querySelectorAll('[data-testid="product-card"]');
      const products = [];
      
      productCards.forEach((card, index) => {
        if (index >= 20) return; // Limit to 20 products
        
        try {
          const titleElement = card.querySelector('[data-testid="product-title"]');
          const priceElement = card.querySelector('[data-testid="product-price"]');
          const originalPriceElement = card.querySelector('[data-testid="product-original-price"]');
          const imageElement = card.querySelector('img');
          const linkElement = card.querySelector('a');
          const discountElement = card.querySelector('[data-testid="product-discount"]');
          
          if (titleElement && priceElement) {
            const title = titleElement.textContent.trim();
            const price = parseFloat(priceElement.textContent.replace(/[₹,]/g, ''));
            const originalPrice = originalPriceElement ? 
              parseFloat(originalPriceElement.textContent.replace(/[₹,]/g, '')) : price;
            const image = imageElement ? imageElement.src : '';
            const link = linkElement ? `https://myntra.com${linkElement.getAttribute('href')}` : '';
            const discount = discountElement ? 
              parseInt(discountElement.textContent.replace(/[%]/g, '')) : 
              Math.round(((originalPrice - price) / originalPrice) * 100);
            
            if (title && price && link) {
              products.push({
                title,
                price,
                originalPrice,
                discountPercent: discount,
                image,
                link,
                source: 'Myntra',
                sourceId: `myntra_${Date.now()}_${index}`,
                category: 'fashion' // Default category for Myntra
              });
            }
          }
        } catch (error) {
          console.error('Error parsing product card:', error);
        }
      });
      
      return products;
    });
    
    // Save products to Firestore
    let savedCount = 0;
    for (const product of products) {
      const exists = await checkProductExists('Myntra', product.sourceId);
      if (!exists) {
        const success = await addProduct(product);
        if (success) savedCount++;
      }
    }
    
    return savedCount;
  } finally {
    await browser.close();
  }
};

module.exports = {
  scrapeAllSources,
  scrapeAmazon,
  scrapeFlipkart,
  scrapeMeesho,
  scrapeMyntra
};
