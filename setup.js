#!/usr/bin/env node

/**
 * DealSpot Setup Script
 * This script helps set up the DealSpot deal aggregator app
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 DealSpot Setup Script');
console.log('========================\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.log('❌ package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

console.log('✅ Project structure detected');

// Check for required files
const requiredFiles = [
  'src/firebase/firebaseConfig.js',
  'src/App.js',
  'src/index.js',
  'tailwind.config.js',
  'firebase.json'
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
  console.log('\n❌ Some required files are missing. Please ensure all files are created.');
  process.exit(1);
}

console.log('\n🎉 Setup Complete!');
console.log('\nNext Steps:');
console.log('1. Update Firebase configuration in src/firebase/firebaseConfig.js');
console.log('2. Run: npm install');
console.log('3. Run: npm start');
console.log('4. Open browser console and run: window.populateFirestore()');
console.log('5. Start using your DealSpot app!');

console.log('\n📚 Documentation:');
console.log('- README.md contains detailed setup instructions');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Tailwind CSS: https://tailwindcss.com/');

console.log('\n🔧 Development Commands:');
console.log('- npm start: Start development server');
console.log('- npm run build: Build for production');
console.log('- firebase deploy: Deploy to Firebase Hosting');

console.log('\nHappy coding! 🎯');
