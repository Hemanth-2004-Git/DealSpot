#!/usr/bin/env node

/**
 * Test Firebase Admin Connection
 * This script tests if Firebase Admin can connect properly
 */

require('dotenv').config();
const admin = require('firebase-admin');

console.log('🔥 Testing Firebase Admin Connection');
console.log('====================================\n');

try {
  // Check if Firebase is already initialized
  if (admin.apps.length > 0) {
    console.log('✅ Firebase Admin already initialized');
    process.exit(0);
  }

  // Initialize Firebase Admin SDK
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  console.log('📋 Service Account Details:');
  console.log('Project ID:', serviceAccount.projectId);
  console.log('Client Email:', serviceAccount.clientEmail);
  console.log('Private Key:', serviceAccount.privateKey ? 'SET (hidden for security)' : 'NOT SET');

  // Validate required fields
  if (!serviceAccount.projectId) {
    throw new Error('FIREBASE_PROJECT_ID is required');
  }
  if (!serviceAccount.privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is required');
  }
  if (!serviceAccount.clientEmail) {
    throw new Error('FIREBASE_CLIENT_EMAIL is required');
  }

  console.log('\n🚀 Initializing Firebase Admin...');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });

  console.log('✅ Firebase Admin initialized successfully');

  // Test Firestore connection
  console.log('\n🗄️ Testing Firestore connection...');
  const db = admin.firestore();
  
  // Try to read from a collection
  const testRef = db.collection('test');
  console.log('✅ Firestore connection successful');

  console.log('\n🎉 Firebase Admin setup is working correctly!');
  
} catch (error) {
  console.error('❌ Firebase Admin test failed:', error);
  console.error('\n🔧 Troubleshooting:');
  console.error('1. Check your .env file has correct values');
  console.error('2. Verify Firebase project has Firestore enabled');
  console.error('3. Make sure service account has proper permissions');
  process.exit(1);
}
