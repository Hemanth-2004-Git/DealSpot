#!/usr/bin/env node

/**
 * Debug Environment Variables
 * This script helps debug environment variable issues
 */

require('dotenv').config();

console.log('🔍 Debug Environment Variables');
console.log('==============================\n');

console.log('Environment variables loaded:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'NOT SET');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT SET');

console.log('\nActual values:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET (hidden for security)' : 'NOT SET');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);

console.log('\nFile check:');
const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('📄 .env file content:');
  console.log(envContent);
} else {
  console.log('❌ .env file does not exist');
}

console.log('\nCurrent working directory:', process.cwd());
console.log('Files in current directory:', fs.readdirSync('.'));


