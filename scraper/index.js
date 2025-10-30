require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { scrapeAllSources } = require('./scraper-hybrid');
const { initializeFirebase } = require('./firebase-admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin
initializeFirebase();

// Middleware
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/scrape', async (req, res) => {
  try {
    const { source } = req.body;
    const results = await scrapeAllSources(source);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Schedule scraping every hour
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Running scheduled scraping...');
  try {
    await scrapeAllSources();
    console.log('✅ Scheduled scraping completed');
  } catch (error) {
    console.error('❌ Scheduled scraping failed:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Scraper server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Manual scrape: POST http://localhost:${PORT}/scrape`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down scraper server...');
  process.exit(0);
});
