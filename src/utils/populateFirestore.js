import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { sampleProducts, sampleCategories } from '../data/sampleData';

// Function to populate Firestore with sample data
export const populateFirestore = async () => {
  try {
    console.log('Starting to populate Firestore with sample data...');

    // Add sample products
    console.log('Adding sample products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
      console.log(`Added product: ${product.title}`);
    }

    // Add sample categories
    console.log('Adding sample categories...');
    for (const category of sampleCategories) {
      await setDoc(doc(db, 'categories', category.id), category);
      console.log(`Added category: ${category.name}`);
    }

    console.log('✅ Sample data added to Firestore successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    return false;
  }
};

// Function to clear all data from Firestore (use with caution!)
export const clearFirestore = async () => {
  try {
    console.log('⚠️  Clearing all data from Firestore...');
    
    // Note: In a real app, you'd want to implement batch deletes
    // This is just a placeholder for the clear function
    console.log('Clear function not implemented for safety reasons');
    console.log('To clear data, manually delete collections from Firebase Console');
    
    return true;
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return false;
  }
};

// Function to check if Firestore has data
export const checkFirestoreData = async () => {
  try {
    const { getDocs } = await import('firebase/firestore');
    
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    
    console.log(`Products in database: ${productsSnapshot.size}`);
    console.log(`Categories in database: ${categoriesSnapshot.size}`);
    
    return {
      productsCount: productsSnapshot.size,
      categoriesCount: categoriesSnapshot.size
    };
  } catch (error) {
    console.error('❌ Error checking data:', error);
    return null;
  }
};
