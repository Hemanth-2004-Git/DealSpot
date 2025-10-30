// Sample data for Firestore collections
// This file contains the data structure and sample data for the deal aggregator app

export const sampleProducts = [
  {
    id: "product_1",
    title: "iPhone 14 Pro Max 256GB",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    price: 99999,
    originalPrice: 129900,
    discountPercent: 23,
    source: "Amazon",
    category: "electronics",
    link: "https://amazon.in/iphone-14-pro-max",
    timestamp: new Date("2024-01-15T10:00:00Z")
  },
  {
    id: "product_2",
    title: "Samsung Galaxy S23 Ultra",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    price: 89999,
    originalPrice: 124999,
    discountPercent: 28,
    source: "Flipkart",
    category: "electronics",
    link: "https://flipkart.com/samsung-galaxy-s23-ultra",
    timestamp: new Date("2024-01-15T11:00:00Z")
  },
  {
    id: "product_3",
    title: "Nike Air Max 270",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    price: 8999,
    originalPrice: 12999,
    discountPercent: 31,
    source: "Myntra",
    category: "fashion",
    link: "https://myntra.com/nike-air-max-270",
    timestamp: new Date("2024-01-15T12:00:00Z")
  },
  {
    id: "product_4",
    title: "Adidas Ultraboost 22",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
    price: 12999,
    originalPrice: 18999,
    discountPercent: 32,
    source: "Meesho",
    category: "fashion",
    link: "https://meesho.com/adidas-ultraboost-22",
    timestamp: new Date("2024-01-15T13:00:00Z")
  },
  {
    id: "product_5",
    title: "MacBook Pro M2 14-inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    price: 159999,
    originalPrice: 199999,
    discountPercent: 20,
    source: "Amazon",
    category: "electronics",
    link: "https://amazon.in/macbook-pro-m2",
    timestamp: new Date("2024-01-15T14:00:00Z")
  },
  {
    id: "product_6",
    title: "Sony WH-1000XM4 Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    price: 19999,
    originalPrice: 29999,
    discountPercent: 33,
    source: "Flipkart",
    category: "electronics",
    link: "https://flipkart.com/sony-wh-1000xm4",
    timestamp: new Date("2024-01-15T15:00:00Z")
  },
  {
    id: "product_7",
    title: "Levi's 501 Original Jeans",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    price: 2999,
    originalPrice: 4999,
    discountPercent: 40,
    source: "Myntra",
    category: "fashion",
    link: "https://myntra.com/levis-501-jeans",
    timestamp: new Date("2024-01-15T16:00:00Z")
  },
  {
    id: "product_8",
    title: "Dyson V15 Detect Vacuum",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    price: 39999,
    originalPrice: 54999,
    discountPercent: 27,
    source: "Amazon",
    category: "home",
    link: "https://amazon.in/dyson-v15-detect",
    timestamp: new Date("2024-01-15T17:00:00Z")
  },
  {
    id: "product_9",
    title: "Instant Pot Duo 7-in-1",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    price: 8999,
    originalPrice: 12999,
    discountPercent: 31,
    source: "Flipkart",
    category: "home",
    link: "https://flipkart.com/instant-pot-duo",
    timestamp: new Date("2024-01-15T18:00:00Z")
  },
  {
    id: "product_10",
    title: "The Psychology of Money",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    price: 299,
    originalPrice: 599,
    discountPercent: 50,
    source: "Amazon",
    category: "books",
    link: "https://amazon.in/psychology-of-money",
    timestamp: new Date("2024-01-15T19:00:00Z")
  }
];

export const sampleCategories = [
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "home", name: "Home & Kitchen", icon: "🏠" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "beauty", name: "Beauty", icon: "💄" },
  { id: "automotive", name: "Automotive", icon: "🚗" },
  { id: "toys", name: "Toys & Games", icon: "🧸" }
];

// Firestore collection structure
export const firestoreSchema = {
  products: {
    id: "string (auto-generated)",
    title: "string",
    image: "string (URL)",
    price: "number",
    originalPrice: "number",
    discountPercent: "number",
    source: "string (Amazon, Flipkart, Meesho, Myntra)",
    category: "string",
    link: "string (URL)",
    timestamp: "timestamp"
  },
  users: {
    uid: "string",
    name: "string",
    email: "string",
    wishlist: "array of product IDs",
    preferences: "array of category names",
    createdAt: "timestamp"
  },
  categories: {
    id: "string",
    name: "string",
    icon: "string (emoji)"
  }
};

// Function to add sample data to Firestore
export const addSampleDataToFirestore = async (db) => {
  const { collection, addDoc, setDoc, doc } = await import('firebase/firestore');
  
  try {
    // Add sample products
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }
    
    // Add sample categories
    for (const category of sampleCategories) {
      await setDoc(doc(db, 'categories', category.id), category);
    }
    
    console.log('Sample data added to Firestore successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
};
