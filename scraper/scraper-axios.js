const axios = require('axios');
const cheerio = require('cheerio');
const { addProduct, checkProductExists } = require('./firebase-admin');

// Scraping configuration
const SCRAPING_CONFIG = {
  timeout: 30000,
  maxProducts: parseInt(process.env.MAX_PRODUCTS_PER_SOURCE) || 50,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Main scraping function using axios
const scrapeAllSources = async (specificSource = null) => {
  const results = {
    amazon: 0,
    flipkart: 0,
    meesho: 0,
    myntra: 0,
    errors: []
  };

  try {
    console.log('🚀 Starting web scraping with axios...');
    
    if (!specificSource || specificSource === 'amazon') {
      try {
        results.amazon = await scrapeAmazonAxios();
        console.log(`✅ Amazon: ${results.amazon} products scraped`);
      } catch (error) {
        console.error('❌ Amazon scraping failed:', error.message);
        results.errors.push({ source: 'amazon', error: error.message });
      }
    }

    if (!specificSource || specificSource === 'flipkart') {
      try {
        results.flipkart = await scrapeFlipkartAxios();
        console.log(`✅ Flipkart: ${results.flipkart} products scraped`);
      } catch (error) {
        console.error('❌ Flipkart scraping failed:', error.message);
        results.errors.push({ source: 'flipkart', error: error.message });
      }
    }

    if (!specificSource || specificSource === 'meesho') {
      try {
        results.meesho = await scrapeMeeshoAxios();
        console.log(`✅ Meesho: ${results.meesho} products scraped`);
      } catch (error) {
        console.error('❌ Meesho scraping failed:', error.message);
        results.errors.push({ source: 'meesho', error: error.message });
      }
    }

    if (!specificSource || specificSource === 'myntra') {
      try {
        results.myntra = await scrapeMyntraAxios();
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

// Amazon scraper using axios
const scrapeAmazonAxios = async () => {
  console.log('🛒 Scraping Amazon deals with axios...');
  
  try {
    const response = await axios.get('https://www.amazon.in/gp/goldbox', {
      headers: {
        'User-Agent': SCRAPING_CONFIG.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: SCRAPING_CONFIG.timeout
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Look for deal cards in the HTML
    $('[data-testid="deal-card"], .DealCard, .deal-card').each((index, element) => {
      if (index >= 20) return; // Limit to 20 products
      
      try {
        const $el = $(element);
        const title = $el.find('h3, h4, [data-testid="deal-title"], .deal-title').text().trim();
        const priceText = $el.find('[data-testid="deal-price"], .a-price-whole, .deal-price').text().trim();
        const originalPriceText = $el.find('[data-testid="deal-original-price"], .a-price-was, .deal-original-price').text().trim();
        const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
        const link = $el.find('a').attr('href');
        const discountText = $el.find('[data-testid="deal-discount"], .a-badge-text, .deal-discount').text().trim();
        
        if (title && priceText) {
          const price = parseFloat(priceText.replace(/[₹,]/g, ''));
          const originalPrice = originalPriceText ? parseFloat(originalPriceText.replace(/[₹,]/g, '')) : price;
          const discount = discountText ? parseInt(discountText.replace(/[%]/g, '')) : Math.round(((originalPrice - price) / originalPrice) * 100);
          
          if (price && link) {
            products.push({
              title,
              price,
              originalPrice,
              discountPercent: discount,
              image: image || 'https://via.placeholder.com/300x200?text=No+Image',
              link: link.startsWith('http') ? link : `https://amazon.in${link}`,
              source: 'Amazon',
              sourceId: `amazon_${Date.now()}_${index}`,
              category: 'electronics'
            });
          }
        }
      } catch (error) {
        console.error('Error parsing deal card:', error);
      }
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
  } catch (error) {
    console.error('Amazon scraping error:', error.message);
    return 0;
  }
};

// Flipkart scraper using axios
const scrapeFlipkartAxios = async () => {
  console.log('🛒 Scraping Flipkart deals with axios...');
  
  try {
    const response = await axios.get('https://www.flipkart.com/offers-store', {
      headers: {
        'User-Agent': SCRAPING_CONFIG.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: SCRAPING_CONFIG.timeout
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Look for product cards in the HTML
    $('[data-testid="product-card"], .product-card, ._1AtVbE').each((index, element) => {
      if (index >= 20) return; // Limit to 20 products
      
      try {
        const $el = $(element);
        const title = $el.find('[data-testid="product-title"], ._4rR01T, .product-title').text().trim();
        const priceText = $el.find('[data-testid="product-price"], ._30jeq3, .product-price').text().trim();
        const originalPriceText = $el.find('[data-testid="product-original-price"], ._3I9_wc, .product-original-price').text().trim();
        const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
        const link = $el.find('a').attr('href');
        const discountText = $el.find('[data-testid="product-discount"], ._3Ay6Sb, .product-discount').text().trim();
        
        if (title && priceText) {
          const price = parseFloat(priceText.replace(/[₹,]/g, ''));
          const originalPrice = originalPriceText ? parseFloat(originalPriceText.replace(/[₹,]/g, '')) : price;
          const discount = discountText ? parseInt(discountText.replace(/[%]/g, '')) : Math.round(((originalPrice - price) / originalPrice) * 100);
          
          if (price && link) {
            products.push({
              title,
              price,
              originalPrice,
              discountPercent: discount,
              image: image || 'https://via.placeholder.com/300x200?text=No+Image',
              link: link.startsWith('http') ? link : `https://flipkart.com${link}`,
              source: 'Flipkart',
              sourceId: `flipkart_${Date.now()}_${index}`,
              category: 'electronics'
            });
          }
        }
      } catch (error) {
        console.error('Error parsing product card:', error);
      }
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
  } catch (error) {
    console.error('Flipkart scraping error:', error.message);
    return 0;
  }
};

// Meesho scraper using axios
const scrapeMeeshoAxios = async () => {
  console.log('🛒 Scraping Meesho deals with axios...');
  
  try {
    const response = await axios.get('https://www.meesho.com/offers', {
      headers: {
        'User-Agent': SCRAPING_CONFIG.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: SCRAPING_CONFIG.timeout
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Look for product cards in the HTML
    $('[data-testid="product-card"], .product-card, ._3YxL_').each((index, element) => {
      if (index >= 20) return; // Limit to 20 products
      
      try {
        const $el = $(element);
        const title = $el.find('[data-testid="product-title"], ._3YxL_, .product-title').text().trim();
        const priceText = $el.find('[data-testid="product-price"], ._2I5kpP, .product-price').text().trim();
        const originalPriceText = $el.find('[data-testid="product-original-price"], ._3I9_wc, .product-original-price').text().trim();
        const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
        const link = $el.find('a').attr('href');
        const discountText = $el.find('[data-testid="product-discount"], ._3Ay6Sb, .product-discount').text().trim();
        
        if (title && priceText) {
          const price = parseFloat(priceText.replace(/[₹,]/g, ''));
          const originalPrice = originalPriceText ? parseFloat(originalPriceText.replace(/[₹,]/g, '')) : price;
          const discount = discountText ? parseInt(discountText.replace(/[%]/g, '')) : Math.round(((originalPrice - price) / originalPrice) * 100);
          
          if (price && link) {
            products.push({
              title,
              price,
              originalPrice,
              discountPercent: discount,
              image: image || 'https://via.placeholder.com/300x200?text=No+Image',
              link: link.startsWith('http') ? link : `https://meesho.com${link}`,
              source: 'Meesho',
              sourceId: `meesho_${Date.now()}_${index}`,
              category: 'fashion'
            });
          }
        }
      } catch (error) {
        console.error('Error parsing product card:', error);
      }
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
  } catch (error) {
    console.error('Meesho scraping error:', error.message);
    return 0;
  }
};

// Myntra scraper using axios
const scrapeMyntraAxios = async () => {
  console.log('🛒 Scraping Myntra deals with axios...');
  
  try {
    const response = await axios.get('https://www.myntra.com/offers', {
      headers: {
        'User-Agent': SCRAPING_CONFIG.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: SCRAPING_CONFIG.timeout
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Look for product cards in the HTML
    $('[data-testid="product-card"], .product-card, ._3YxL_').each((index, element) => {
      if (index >= 20) return; // Limit to 20 products
      
      try {
        const $el = $(element);
        const title = $el.find('[data-testid="product-title"], ._3YxL_, .product-title').text().trim();
        const priceText = $el.find('[data-testid="product-price"], ._2I5kpP, .product-price').text().trim();
        const originalPriceText = $el.find('[data-testid="product-original-price"], ._3I9_wc, .product-original-price').text().trim();
        const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
        const link = $el.find('a').attr('href');
        const discountText = $el.find('[data-testid="product-discount"], ._3Ay6Sb, .product-discount').text().trim();
        
        if (title && priceText) {
          const price = parseFloat(priceText.replace(/[₹,]/g, ''));
          const originalPrice = originalPriceText ? parseFloat(originalPriceText.replace(/[₹,]/g, '')) : price;
          const discount = discountText ? parseInt(discountText.replace(/[%]/g, '')) : Math.round(((originalPrice - price) / originalPrice) * 100);
          
          if (price && link) {
            products.push({
              title,
              price,
              originalPrice,
              discountPercent: discount,
              image: image || 'https://via.placeholder.com/300x200?text=No+Image',
              link: link.startsWith('http') ? link : `https://myntra.com${link}`,
              source: 'Myntra',
              sourceId: `myntra_${Date.now()}_${index}`,
              category: 'fashion'
            });
          }
        }
      } catch (error) {
        console.error('Error parsing product card:', error);
      }
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
  } catch (error) {
    console.error('Myntra scraping error:', error.message);
    return 0;
  }
};

module.exports = {
  scrapeAllSources,
  scrapeAmazonAxios,
  scrapeFlipkartAxios,
  scrapeMeeshoAxios,
  scrapeMyntraAxios
};
