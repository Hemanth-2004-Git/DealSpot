// Development utilities for DealSpot app
import { populateFirestore, checkFirestoreData } from './populateFirestore';

// Make functions available globally for development
if (process.env.NODE_ENV === 'development') {
  window.populateFirestore = populateFirestore;
  window.checkFirestoreData = checkFirestoreData;
  
  console.log('🔧 Development utilities loaded!');
  console.log('Available functions:');
  console.log('- window.populateFirestore() - Add sample data to Firestore');
  console.log('- window.checkFirestoreData() - Check current data in Firestore');
}

// Helper function to add sample data
export const addSampleData = async () => {
  try {
    console.log('🚀 Adding sample data to Firestore...');
    const success = await populateFirestore();
    
    if (success) {
      console.log('✅ Sample data added successfully!');
      console.log('You can now browse products in your app.');
    } else {
      console.log('❌ Failed to add sample data. Check console for errors.');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    return false;
  }
};

// Helper function to check data status
export const checkDataStatus = async () => {
  try {
    console.log('🔍 Checking Firestore data status...');
    const status = await checkFirestoreData();
    
    if (status) {
      console.log(`📊 Products: ${status.productsCount}`);
      console.log(`📊 Categories: ${status.categoriesCount}`);
      
      if (status.productsCount === 0) {
        console.log('💡 No products found. Run window.populateFirestore() to add sample data.');
      }
    } else {
      console.log('❌ Failed to check data status.');
    }
    
    return status;
  } catch (error) {
    console.error('❌ Error checking data status:', error);
    return null;
  }
};

// Auto-check data status on app load
export const initializeDevUtils = () => {
  if (process.env.NODE_ENV === 'development') {
    // Check data status after a short delay
    setTimeout(() => {
      checkDataStatus();
    }, 2000);
  }
};
