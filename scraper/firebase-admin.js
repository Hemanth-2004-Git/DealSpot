require('dotenv').config();
const admin = require('firebase-admin');

let db;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      db = admin.firestore();
      console.log('✅ Firebase Admin already initialized');
      return;
    }

    // Initialize Firebase Admin SDK
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

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

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });

    db = admin.firestore();
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    console.error('Please check your .env file and ensure all Firebase Admin credentials are set correctly.');
    throw error;
  }
};

const addProduct = async (productData) => {
  try {
    const productRef = db.collection('products');
    await productRef.add({
      ...productData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date(),
    });
    console.log(`✅ Product added: ${productData.title}`);
    return true;
  } catch (error) {
    console.error('❌ Error adding product:', error);
    return false;
  }
};

const updateProduct = async (productId, productData) => {
  try {
    const productRef = db.collection('products').doc(productId);
    await productRef.update({
      ...productData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ Product updated: ${productData.title}`);
    return true;
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return false;
  }
};

const checkProductExists = async (source, productId) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef
      .where('source', '==', source)
      .where('sourceId', '==', productId)
      .limit(1)
      .get();
    
    return !snapshot.empty;
  } catch (error) {
    console.error('❌ Error checking product existence:', error);
    return false;
  }
};

const getExistingProducts = async (source) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef
      .where('source', '==', source)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error getting existing products:', error);
    return [];
  }
};

module.exports = {
  initializeFirebase,
  addProduct,
  updateProduct,
  checkProductExists,
  getExistingProducts,
  db: () => db
};
