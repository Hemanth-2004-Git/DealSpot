#!/usr/bin/env node

/**
 * Scraper Setup Script
 * This script helps set up the web scraper
 */

const fs = require('fs');
const path = require('path');

console.log('🕷️  DealSpot Scraper Setup');
console.log('==========================\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.log('❌ package.json not found. Please run this script from the scraper directory.');
  process.exit(1);
}

console.log('✅ Scraper project detected');

// Check for required files
const requiredFiles = [
  'index.js',
  'scraper.js',
  'firebase-admin.js',
  'run-scraper.js',
  'env.example'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing.');
  process.exit(1);
}

console.log('\n🎉 Scraper setup complete!');
console.log('\nNext Steps:');
console.log('1. Copy env.example to .env');
console.log('2. Update .env with your Firebase Admin credentials');
console.log('3. Run: npm install');
console.log('4. Run: npm start (for server) or npm run scrape (for manual scraping)');

console.log('\n📚 Firebase Admin Setup:');
console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
console.log('2. Click "Generate new private key"');
console.log('3. Download the JSON file');
console.log('4. Copy the values to your .env file');

console.log('\n🔧 Commands:');
console.log('- npm start: Start scraper server');
console.log('- npm run scrape: Manual scraping');
console.log('- node run-scraper.js amazon: Scrape only Amazon');
console.log('- node run-scraper.js: Scrape all sources');

console.log('\n⚠️  Important Notes:');
console.log('- Make sure your Firebase project has Firestore enabled');
console.log('- The scraper will run every hour automatically');
console.log('- Check the logs for any errors');
console.log('- Some websites may block automated requests');

console.log('\nHappy scraping! 🕷️');
