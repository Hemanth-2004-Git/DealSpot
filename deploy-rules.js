#!/usr/bin/env node

/**
 * Deploy Firestore Rules to Firebase
 * This script helps you deploy the updated Firestore rules
 */

const { exec } = require('child_process');

console.log('🔥 Deploying Firestore Rules...');
console.log('===============================\n');

// Check if Firebase CLI is installed
exec('firebase --version', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Firebase CLI not found!');
    console.log('\n📦 Install Firebase CLI first:');
    console.log('npm install -g firebase-tools');
    console.log('\nThen run: firebase login');
    console.log('Then run: firebase deploy --only firestore:rules');
    return;
  }

  console.log('✅ Firebase CLI found:', stdout.trim());
  
  // Deploy rules
  console.log('\n🚀 Deploying Firestore rules...');
  exec('firebase deploy --only firestore:rules', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error deploying rules:', error.message);
      console.log('\n🔧 Manual steps:');
      console.log('1. Go to Firebase Console → Firestore Database → Rules');
      console.log('2. Copy the rules from firestore.rules file');
      console.log('3. Paste and click "Publish"');
      return;
    }

    console.log('✅ Rules deployed successfully!');
    console.log('\n🎉 You can now run: window.populateFirestore()');
  });
});
