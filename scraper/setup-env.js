#!/usr/bin/env node

/**
 * Environment Setup Script
 * This script helps you set up the .env file for the scraper
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupEnvironment = async () => {
  console.log('🔧 DealSpot Scraper Environment Setup');
  console.log('=====================================\n');

  console.log('This script will help you set up your .env file for the scraper.');
  console.log('You need to get your Firebase Admin credentials first.\n');

  console.log('📋 Steps to get Firebase Admin credentials:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project');
  console.log('3. Go to Project Settings (gear icon) → Service Accounts');
  console.log('4. Click "Generate new private key"');
  console.log('5. Download the JSON file');
  console.log('6. Copy the values from the JSON file\n');

  const projectId = await question('Enter your Firebase Project ID: ');
  const privateKey = await question('Enter your Firebase Private Key (with \\n for newlines): ');
  const clientEmail = await question('Enter your Firebase Client Email: ');

  const envContent = `# Firebase Admin Configuration
FIREBASE_PROJECT_ID=${projectId}
FIREBASE_PRIVATE_KEY="${privateKey}"
FIREBASE_CLIENT_EMAIL=${clientEmail}

# Scraping Configuration
SCRAPING_INTERVAL=3600000
MAX_PRODUCTS_PER_SOURCE=50
HEADLESS_MODE=true

# API Configuration
PORT=3001
API_KEY=your-secure-api-key
`;

  try {
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Review the .env file to make sure all values are correct');
    console.log('2. Run: npm start');
    console.log('3. Check the logs for any errors');
  } catch (error) {
    console.error('❌ Error creating .env file:', error);
  }

  rl.close();
};

setupEnvironment();
