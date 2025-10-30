# DealSpot - Best Online Deals Aggregator

A React-based deal aggregator app that helps users discover the best discounts and offers from multiple e-commerce platforms like Amazon, Flipkart, Meesho, and Myntra.

## 🚀 Features

- **Authentication**: Google Sign-In and Email/Password authentication
- **Product Discovery**: Browse deals from multiple sources
- **Category Filtering**: Filter products by categories (Electronics, Fashion, Home, etc.)
- **Search Functionality**: Search for specific products
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Mobile-friendly interface
- **Real-time Data**: Firebase Firestore integration

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Discount-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Get your Firebase configuration

4. **Configure Firebase**
   - Update `src/firebase/firebaseConfig.js` with your Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

5. **Populate Firestore with sample data**
   - Open the browser console in your app
   - Run: `window.populateFirestore()` to add sample data

6. **Start the development server**
   ```bash
   npm start
   ```

## 🔥 Firebase Setup

### 1. Authentication Setup
- Go to Firebase Console → Authentication → Sign-in method
- Enable "Email/Password" provider
- Enable "Google" provider
- Add your domain to authorized domains

### 2. Firestore Database Setup
- Go to Firebase Console → Firestore Database
- Create database in production mode
- Set up security rules (see below)

### 3. Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all authenticated users
    match /products/{productId} {
      allow read: if request.auth != null;
    }
    
    // Categories are readable by all authenticated users
    match /categories/{categoryId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 📱 Pages Overview

### 🔑 Login/Signup Page
- Google Sign-In integration
- Email/Password authentication
- Beautiful gradient background
- Responsive design

### 🏠 Home Page
- Trending deals grid
- Filter by source (Amazon, Flipkart, etc.)
- Product cards with discount percentages
- "Buy Now" buttons with external links

### 📂 Category Page
- Dynamic category filtering
- Breadcrumb navigation
- Category-specific deals
- Source filtering within categories

### 🔍 Search Page
- Real-time search functionality
- Search results with filters
- "No results found" handling

### 💖 Wishlist Page
- User-specific wishlist
- Add/remove products
- Persistent across sessions

### ⚙️ Sidebar Navigation
- Collapsible sidebar
- Mobile-responsive hamburger menu
- Current page highlighting
- User profile section

## 🗄️ Firestore Collections

### Products Collection
```javascript
{
  id: "product_1",
  title: "iPhone 14 Pro Max 256GB",
  image: "https://example.com/image.jpg",
  price: 99999,
  originalPrice: 129900,
  discountPercent: 23,
  source: "Amazon",
  category: "electronics",
  link: "https://amazon.in/iphone-14-pro-max",
  timestamp: "2024-01-15T10:00:00Z"
}
```

### Users Collection
```javascript
{
  uid: "user_uid",
  name: "John Doe",
  email: "john@example.com",
  wishlist: ["product_1", "product_2"],
  preferences: ["electronics", "fashion"],
  createdAt: "2024-01-15T10:00:00Z"
}
```

### Categories Collection
```javascript
{
  id: "electronics",
  name: "Electronics",
  icon: "📱"
}
```

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Build your React app:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## 🔧 Development Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📝 Environment Variables

Create a `.env` file in the root directory:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the Firebase Console for errors
2. Verify your Firebase configuration
3. Check the browser console for JavaScript errors
4. Ensure Firestore security rules are properly configured

## 🎯 Future Enhancements

- [ ] Price tracking and alerts
- [ ] AI-based product recommendations
- [ ] Push notifications for new deals
- [ ] User reviews and ratings
- [ ] Deal comparison across platforms
- [ ] Mobile app (React Native)
- [ ] Advanced filtering options
- [ ] Deal expiration tracking
