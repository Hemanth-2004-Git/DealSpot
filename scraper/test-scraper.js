#!/usr/bin/env node

/**
 * Test Scraper
 * This script tests the scraping functionality
 */

require('dotenv').config();
const axios = require('axios');
const { initializeFirebase } = require('./firebase-admin');

const testScraping = async () => {
  console.log('🧪 Testing Scraper Functionality');
  console.log('=================================\n');

  try {
    // Initialize Firebase
    initializeFirebase();
    console.log('✅ Firebase initialized');

    // Test a simple website first
    console.log('\n🌐 Testing basic HTTP request...');
    try {
      const response = await axios.get('https://httpbin.org/get', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      console.log('✅ Basic HTTP request successful');
      console.log('Status:', response.status);
    } catch (error) {
      console.error('❌ Basic HTTP request failed:', error.message);
    }

    // Test Amazon
    console.log('\n🛒 Testing Amazon...');
    try {
      const response = await axios.get('https://www.amazon.in/gp/goldbox', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 15000
      });
      console.log('✅ Amazon request successful');
      console.log('Status:', response.status);
      console.log('Content length:', response.data.length);
      
      // Check if we got actual content
      if (response.data.includes('deal') || response.data.includes('product')) {
        console.log('✅ Amazon content looks good');
      } else {
        console.log('⚠️ Amazon content might be blocked or different');
      }
    } catch (error) {
      console.error('❌ Amazon request failed:', error.message);
    }

    // Test Flipkart
    console.log('\n🛒 Testing Flipkart...');
    try {
      const response = await axios.get('https://www.flipkart.com/offers-store', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 15000
      });
      console.log('✅ Flipkart request successful');
      console.log('Status:', response.status);
      console.log('Content length:', response.data.length);
    } catch (error) {
      console.error('❌ Flipkart request failed:', error.message);
    }

    console.log('\n📝 Recommendations:');
    console.log('1. The scraper is working but websites might be blocking requests');
    console.log('2. Try using a VPN or different IP address');
    console.log('3. Consider using a proxy service');
    console.log('4. Some websites require JavaScript rendering (Puppeteer)');
    console.log('5. Check if the websites have changed their structure');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testScraping();
