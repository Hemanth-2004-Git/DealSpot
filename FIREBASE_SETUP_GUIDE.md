# 🔥 Firebase Setup Guide - Step by Step

## Step 2: Configure Firebase (Detailed Instructions)

### 1. Create a Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Go to console" (top right)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: `deal-spot-app` (or any name you prefer)
   - Click "Continue"

3. **Configure Google Analytics (Optional)**
   - You can enable or disable Google Analytics
   - For this app, you can disable it for now
   - Click "Create project"

4. **Wait for Project Creation**
   - Firebase will set up your project (takes 1-2 minutes)
   - Click "Continue" when ready

### 2. Enable Authentication

1. **Go to Authentication**
   - In your Firebase project dashboard
   - Click "Authentication" in the left sidebar
   - Click "Get started"

2. **Enable Sign-in Methods**
   - Click on "Sign-in method" tab
   - **Enable Email/Password:**
     - Click on "Email/Password"
     - Toggle "Enable" to ON
     - Click "Save"
   
   - **Enable Google Sign-in:**
     - Click on "Google"
     - Toggle "Enable" to ON
     - Add your project support email
     - Click "Save"

### 3. Create Firestore Database

1. **Go to Firestore Database**
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Choose Security Rules**
   - Select "Start in test mode" (for development)
   - Click "Next"

3. **Choose Location**
   - Select a location closest to you (e.g., us-central1, asia-south1)
   - Click "Done"

### 4. Get Firebase Configuration

1. **Go to Project Settings**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"

2. **Get Web App Config*
   - Scroll down to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Enter app nickname: `DealSpot Web App`
   - **Don't check "Also set up Firebase Hosting"** (we'll do this later)
   - Click "Register app"

3. **Copy the Configuration**
   - You'll see a code block like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "deal-spot-app.firebaseapp.com",
     projectId: "deal-spot-app",
     storageBucket: "deal-spot-app.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef..."
   };
   ```

### 5. Update Your App Configuration

1. **Open the Firebase Config File**
   - Navigate to: `src/firebase/firebaseConfig.js`
   - Replace the placeholder values with your actual Firebase config:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

2. **Save the File**
   - Make sure to save the changes
   - Your app is now connected to Firebase!

### 6. Set Up Firestore Security Rules

1. **Go to Firestore Database**
   - In Firebase Console, click "Firestore Database"
   - Click on "Rules" tab

2. **Update Security Rules**
   - Replace the existing rules with:
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
         allow write: if false; // Only admins can write products
       }
       
       // Categories are readable by all authenticated users
       match /categories/{categoryId} {
         allow read: if request.auth != null;
         allow write: if false; // Only admins can write categories
       }
     }
   }
   ```

3. **Publish Rules**
   - Click "Publish" to save the rules

### 7. Add Sample Data (Optional)

1. **Start Your App**
   ```bash
   npm start
   ```

2. **Open Browser Console**
   - Press F12 or right-click → "Inspect"
   - Go to "Console" tab

3. **Add Sample Data**
   - Type: `window.populateFirestore()`
   - Press Enter
   - Wait for "Sample data added successfully!" message

### 8. Test Your Setup

1. **Test Authentication**
   - Go to your app (http://localhost:3000)
   - Try signing up with email/password
   - Try signing in with Google

2. **Test Firestore**
   - After login, you should see products on the home page
   - Try adding items to wishlist
   - Try searching for products

### 🔧 Troubleshooting

**Common Issues:**

1. **"Firebase: No Firebase App '[DEFAULT]' has been created"**
   - Check your firebaseConfig.js file
   - Make sure all values are correct

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Make sure user is authenticated

3. **Google Sign-in not working**
   - Check if Google provider is enabled in Authentication
   - Make sure your domain is authorized

4. **No products showing**
   - Run `window.populateFirestore()` in browser console
   - Check if Firestore has data in Firebase Console

### ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore database created
- [ ] Security rules updated
- [ ] firebaseConfig.js updated with real values
- [ ] App starts without errors
- [ ] Can sign up/sign in
- [ ] Sample data added
- [ ] Products visible on home page

### 🎉 You're Done!

Once you complete these steps, your DealSpot app will be fully connected to Firebase and ready to use!

**Next:** Run `npm start` and test your app!
