import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Debug: Check if environment variables are loading
console.log('API Key from env:', process.env.REACT_APP_API_KEY);

const firebaseConfig = {
  apiKey: "AIzaSyCPVzSi8IRbJraunWfhQ6N8KiS7ZnUAtm4",
  authDomain: "discount-aggregator.firebaseapp.com",
  projectId: "discount-aggregator",
  storageBucket: "discount-aggregator.firebasestorage.app",
  messagingSenderId: "604288697049",
  appId: "1:604288697049:web:98f75ded5dcb5e8be274c8",
  measurementId: "G-QDF5M3ENJ4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };
export default app;