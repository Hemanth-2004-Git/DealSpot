# 🚀 DealSpot Complete Setup Guide

This guide will help you set up the complete DealSpot deal aggregator with web scraping functionality.

## 📋 Prerequisites

- Node.js (v16 or higher)
- Firebase account
- Git

## 🏗️ Project Structure

```
Discount-aggregator/
├── src/                    # React frontend
├── scraper/               # Web scraping backend
├── firebase.json          # Firebase configuration
├── package.json           # Frontend dependencies
└── README.md              # Main documentation
```

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it: `deal-spot-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication
1. Go to "Authentication" → "Get started"
2. Enable "Email/Password" → Toggle ON → Save
3. Enable "Google" → Toggle ON → Add email → Save

### 1.3 Create Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode"
3. Select location → Done

### 1.4 Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" → Click web icon (</>)
3. App name: `DealSpot Web App`
4. **Copy the configuration code**

### 1.5 Update Firebase Config
1. Open `src/firebase/firebaseConfig.js`
2. Replace placeholder values with your actual config
3. Save the file

### 1.6 Set Firestore Rules
1. Go to "Firestore Database" → "Rules"
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read, write: if request.auth != null;
    }
    match /categories/{categoryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Click "Publish"

## 🎨 Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
npm install
```

### 2.2 Start Development Server
```bash
npm start
```

### 2.3 Add Sample Data
1. Open browser console (F12)
2. Run: `window.populateFirestore()`
3. Wait for "Sample data added successfully!"

## 🕷️ Step 3: Web Scraper Setup

### 3.1 Navigate to Scraper Directory
```bash
cd scraper
```

### 3.2 Install Scraper Dependencies
```bash
npm install
```

### 3.3 Set Up Firebase Admin
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the values to your `.env` file

### 3.4 Configure Environment
```bash
cp env.example .env
```

Update `.env` with your Firebase Admin credentials:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
SCRAPING_INTERVAL=3600000
MAX_PRODUCTS_PER_SOURCE=50
HEADLESS_MODE=true
PORT=3001
API_KEY=your-secure-api-key
```

### 3.5 Test Scraper
```bash
# Test manual scraping
npm run scrape

# Test specific source
node run-scraper.js amazon
```

### 3.6 Start Scraper Server
```bash
npm start
```

## 🔧 Step 4: Integration Testing

### 4.1 Test Frontend
1. Go to http://localhost:3000
2. Sign up/Sign in
3. Browse products
4. Test wishlist functionality
5. Test search functionality

### 4.2 Test Scraper
1. Check scraper health: http://localhost:3001/health
2. Trigger manual scraping via API
3. Check Firestore for new products

### 4.3 Test Integration
1. Open browser console
2. Run: `window.checkScraperHealth()`
3. Run: `window.manualScraping.amazon()`
4. Check if new products appear in the app

## 🚀 Step 5: Deployment

### 5.1 Deploy Frontend to Firebase Hosting
```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy
```

### 5.2 Deploy Scraper (Optional)
- Use a VPS or cloud service
- Set up PM2 for process management
- Configure environment variables
- Set up monitoring

## 📊 Step 6: Monitoring

### 6.1 Frontend Monitoring
- Check browser console for errors
- Monitor Firebase usage
- Track user engagement

### 6.2 Scraper Monitoring
- Check scraper logs
- Monitor Firestore for new products
- Set up error alerts

## 🔧 Troubleshooting

### Common Issues

1. **"Firebase: No Firebase App '[DEFAULT]' has been created"**
   - Check your firebaseConfig.js file
   - Verify all values are correct

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Ensure user is authenticated

3. **Scraper not working**
   - Check Firebase Admin credentials
   - Verify scraper server is running
   - Check network connectivity

4. **No products showing**
   - Run `window.populateFirestore()` for sample data
   - Check if scraper is running
   - Verify Firestore has data

### Debug Commands

```bash
# Check scraper health
curl http://localhost:3001/health

# Manual scraping
node scraper/run-scraper.js

# Check Firebase data
# Go to Firebase Console → Firestore Database
```

## 📈 Step 7: Optimization

### 7.1 Performance
- Enable Firestore indexes
- Optimize queries
- Implement caching

### 7.2 Security
- Update Firestore rules for production
- Implement rate limiting
- Add authentication to scraper API

### 7.3 Monitoring
- Set up error tracking
- Monitor scraping success rates
- Track user behavior

## 🎯 Step 8: Advanced Features

### 8.1 Automated Scraping
- Set up cron jobs
- Implement retry logic
- Add error notifications

### 8.2 Data Analysis
- Track popular products
- Analyze discount trends
- Generate reports

### 8.3 User Features
- Email notifications for price drops
- Personalized recommendations
- Social sharing

## 📚 Documentation

- **Frontend**: `README.md`
- **Scraper**: `scraper/README.md`
- **Firebase**: `FIREBASE_SETUP_GUIDE.md`

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review the logs
3. Verify your configuration
4. Test each component separately

## 🎉 Success!

Once you complete all steps, you'll have:
- ✅ Working React frontend
- ✅ Firebase authentication
- ✅ Product database
- ✅ Web scraping system
- ✅ Automated data collection
- ✅ Responsive design
- ✅ User management

**Your DealSpot app is now ready to use!** 🚀

---

**Happy coding! 🎯**
