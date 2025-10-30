#!/usr/bin/env node

/**
 * Test Browser Configuration
 * This script tests if Puppeteer can launch a browser
 */

require('dotenv').config();
const puppeteer = require('puppeteer');

console.log('🌐 Testing Browser Configuration');
console.log('=================================\n');

const testBrowser = async () => {
  try {
    console.log('🚀 Attempting to launch browser...');
    
    // Try with system Chrome first
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    console.log('✅ Browser launched successfully');
    
    const page = await browser.newPage();
    console.log('✅ Page created successfully');
    
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    console.log('✅ Navigation successful');
    
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    await browser.close();
    console.log('✅ Browser closed successfully');
    
    console.log('\n🎉 Browser test completed successfully!');
    console.log('Your scraper should work now.');
    
  } catch (error) {
    console.error('❌ Browser test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Install Chrome browser if not already installed');
    console.error('2. Try running: pnpm install puppeteer --force');
    console.error('3. Check if Chrome is in your PATH');
    console.error('4. Try setting CHROME_PATH environment variable');
    
    console.error('\n💡 Alternative solutions:');
    console.error('- Use a different scraping library (like axios + cheerio)');
    console.error('- Use a headless browser service');
    console.error('- Use a different approach for scraping');
  }
};

testBrowser();
