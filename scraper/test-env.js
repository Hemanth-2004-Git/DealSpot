#!/usr/bin/env node

/**
 * Environment Test Script
 * This script tests if your .env file is configured correctly
 */

require('dotenv').config();

const testEnvironment = () => {
  console.log('🧪 Testing Environment Configuration');
  console.log('=====================================\n');

  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];

  let allGood = true;

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName} is not set`);
      allGood = false;
    } else {
      console.log(`✅ ${varName} is set`);
    }
  });

  if (allGood) {
    console.log('\n🎉 All required environment variables are set!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm start');
    console.log('2. Check the logs for any errors');
    console.log('3. Test with: node run-scraper.js');
  } else {
    console.log('\n❌ Some environment variables are missing.');
    console.log('\n🔧 To fix this:');
    console.log('1. Run: node setup-env.js');
    console.log('2. Or manually edit the .env file');
    console.log('3. Make sure to get Firebase Admin credentials from Firebase Console');
  }

  console.log('\n📚 Firebase Admin Setup Guide:');
  console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Download the JSON file');
  console.log('4. Copy the values to your .env file');
};

testEnvironment();
