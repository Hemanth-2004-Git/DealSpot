# 🚀 DealSpot Scraper - Quick Start Guide

## 🔧 **Fix for Your Current Issues**

### Issue 1: Missing .env.example file
✅ **Fixed**: The file was named `env.example` instead of `.env.example`

### Issue 2: Firebase Admin configuration error
✅ **Fixed**: Added proper environment validation and error handling

## 📋 **Step-by-Step Setup**

### 1. **Check Current Status**
```bash
# You should already be in the scraper directory
pwd
# Should show: C:\Users\Hemanth\OneDrive\Desktop\Discount-aggregator\scraper
```

### 2. **Set Up Environment Variables**
```bash
# Test if .env file exists
dir .env

# If it doesn't exist, create it
copy env.example .env
```

### 3. **Configure Firebase Admin Credentials**

#### Option A: Interactive Setup (Recommended)
```bash
npm run setup
```
This will guide you through setting up your Firebase Admin credentials.

#### Option B: Manual Setup
1. **Get Firebase Admin Credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings (gear icon) → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Edit .env file:**
   ```bash
   notepad .env
   ```
   
3. **Update the values:**
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   ```

### 4. **Test Environment Configuration**
```bash
npm run test-env
```

### 5. **Start the Scraper**
```bash
npm start
```

## 🔍 **Troubleshooting**

### If you get "Service account object must contain a string 'project_id' property":
1. Check your `.env` file exists
2. Verify all Firebase Admin credentials are set
3. Make sure there are no extra spaces or quotes
4. Run `npm run test-env` to check

### If you get "Permission denied" errors:
1. Check your Firebase project has Firestore enabled
2. Verify your service account has the right permissions
3. Check Firestore security rules

### If you get "Module not found" errors:
1. Run `pnpm install` again
2. Check if all dependencies are installed

## 🧪 **Testing the Scraper**

### Test Manual Scraping
```bash
# Test scraping all sources
npm run scrape

# Test specific source
node run-scraper.js amazon
```

### Test API Endpoints
```bash
# Check health
curl http://localhost:3001/health

# Manual scraping via API
curl -X POST http://localhost:3001/scrape
```

## 📊 **Expected Output**

When everything is working correctly, you should see:
```
🚀 Scraper server running on port 3001
📊 Health check: http://localhost:3001/health
🔧 Manual scrape: POST http://localhost:3001/scrape
✅ Firebase Admin initialized successfully
```

## 🎯 **Next Steps**

1. **Verify scraper is working:**
   - Check http://localhost:3001/health
   - Test manual scraping

2. **Check Firestore:**
   - Go to Firebase Console → Firestore Database
   - Look for new products in the `products` collection

3. **Test integration with frontend:**
   - Start your React app
   - Check if new products appear

## 🆘 **Still Having Issues?**

1. **Check the logs** for specific error messages
2. **Verify Firebase credentials** are correct
3. **Test with a simple script** first
4. **Check network connectivity**

## 📚 **Additional Resources**

- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Puppeteer Documentation](https://pptr.dev/)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)

---

**Happy scraping! 🕷️**
