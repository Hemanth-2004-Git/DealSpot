# 🕷️ DealSpot Web Scraper

Automated web scraper for DealSpot deal aggregator that fetches discounted products from Amazon, Flipkart, Meesho, and Myntra.

## 🚀 Features

- **Multi-source scraping**: Amazon, Flipkart, Meesho, Myntra
- **Automated scheduling**: Runs every hour
- **Firebase integration**: Saves products to Firestore
- **Duplicate prevention**: Checks for existing products
- **Error handling**: Robust error management
- **REST API**: Manual triggering via API

## 📦 Installation

1. **Navigate to scraper directory**
   ```bash
   cd scraper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

4. **Configure Firebase Admin**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Copy the values to your `.env` file

## ⚙️ Configuration

Update your `.env` file with:

```env
# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# Scraping Configuration
SCRAPING_INTERVAL=3600000
MAX_PRODUCTS_PER_SOURCE=50
HEADLESS_MODE=true

# API Configuration
PORT=3001
API_KEY=your-secure-api-key
```

## 🚀 Usage

### 1. Start the Scraper Server
```bash
npm start
```
This starts the server with automatic scheduling (runs every hour).

### 2. Manual Scraping
```bash
# Scrape all sources
npm run scrape

# Scrape specific source
node run-scraper.js amazon
node run-scraper.js flipkart
node run-scraper.js meesho
node run-scraper.js myntra
```

### 3. API Endpoints

#### Health Check
```bash
GET http://localhost:3001/health
```

#### Manual Scraping
```bash
POST http://localhost:3001/scrape
Content-Type: application/json

{
  "source": "amazon"  // Optional: amazon, flipkart, meesho, myntra
}
```

## 🏗️ Architecture

```
scraper/
├── index.js              # Main server with scheduling
├── scraper.js            # Core scraping logic
├── firebase-admin.js     # Firebase Admin SDK integration
├── run-scraper.js        # Manual scraping script
├── package.json          # Dependencies
└── README.md            # This file
```

## 🔧 Scraping Logic

### Amazon
- **URL**: https://www.amazon.in/gp/goldbox
- **Selectors**: `[data-testid="deal-card"]`
- **Data**: Title, price, original price, discount, image, link

### Flipkart
- **URL**: https://www.flipkart.com/offers-store
- **Selectors**: `[data-testid="product-card"]`
- **Data**: Title, price, original price, discount, image, link

### Meesho
- **URL**: https://www.meesho.com/offers
- **Selectors**: `[data-testid="product-card"]`
- **Data**: Title, price, original price, discount, image, link

### Myntra
- **URL**: https://www.myntra.com/offers
- **Selectors**: `[data-testid="product-card"]`
- **Data**: Title, price, original price, discount, image, link

## 📊 Data Structure

Each scraped product is saved to Firestore with:

```javascript
{
  title: "Product Name",
  price: 999,
  originalPrice: 1299,
  discountPercent: 23,
  image: "https://example.com/image.jpg",
  link: "https://example.com/product",
  source: "Amazon",
  sourceId: "amazon_1234567890_1",
  category: "electronics",
  timestamp: "2024-01-15T10:00:00Z",
  createdAt: "2024-01-15T10:00:00Z"
}
```

## 🛡️ Error Handling

- **Network timeouts**: 30-second timeout per page
- **Selector failures**: Graceful fallbacks
- **Duplicate prevention**: Checks existing products
- **Rate limiting**: Respects website policies
- **User agent rotation**: Mimics real browsers

## 📈 Monitoring

### Logs
The scraper provides detailed logging:
- ✅ Success messages
- ❌ Error messages
- 📊 Statistics
- 🔍 Debug information

### Health Check
```bash
curl http://localhost:3001/health
```

## ⚠️ Important Notes

### Legal Considerations
- **Respect robots.txt**: Check each website's robots.txt
- **Rate limiting**: Don't overwhelm servers
- **Terms of service**: Review each platform's ToS
- **Data usage**: Use scraped data responsibly

### Technical Limitations
- **Dynamic content**: Some content may not load
- **Anti-bot measures**: Websites may block automated requests
- **Selector changes**: Website updates may break selectors
- **Network issues**: Internet connectivity affects scraping

### Best Practices
- **Run during off-peak hours**: Reduce server load
- **Monitor logs**: Check for errors regularly
- **Update selectors**: Keep up with website changes
- **Respect rate limits**: Don't scrape too frequently

## 🔧 Troubleshooting

### Common Issues

1. **"Firebase Admin not initialized"**
   - Check your `.env` file
   - Verify Firebase credentials
   - Ensure Firestore is enabled

2. **"Selector not found"**
   - Website may have changed
   - Update selectors in scraper.js
   - Check if page loaded correctly

3. **"Permission denied"**
   - Check Firestore security rules
   - Ensure Firebase Admin has write access

4. **"Timeout errors"**
   - Increase timeout values
   - Check network connectivity
   - Try running with headless: false

### Debug Mode
```bash
# Run with visible browser
HEADLESS_MODE=false npm run scrape
```

## 🚀 Deployment

### Local Development
```bash
npm run dev  # With nodemon for auto-restart
```

### Production
```bash
npm start  # With PM2 or similar process manager
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

## 📝 License

This scraper is part of the DealSpot project and follows the same license terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

If you encounter issues:
1. Check the logs for error messages
2. Verify your Firebase configuration
3. Test with a single source first
4. Check website accessibility
5. Review the troubleshooting section

---

**Happy scraping! 🕷️**
