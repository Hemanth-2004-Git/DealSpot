// src/services/scrapingService.js

class ScrapingService {
  constructor() {
    this.isScraping = false;

    // ✅ Use correct backend base URL dynamically
    this.BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://dealspot-1.onrender.com" // 🔹 your backend Render URL
        : "http://localhost:3001";
  }

  async searchProducts(searchTerm, maxResults = 20) {
    try {
      console.log(`🎯 Fast search for: ${searchTerm}`);

      // Direct backend call - no caching delays
      const scrapedProducts = await this.performBackendScraping(searchTerm, maxResults);

      console.log(`✅ Received ${scrapedProducts.length} products`);
      return scrapedProducts;

    } catch (error) {
      console.error("Search error:", error);
      return []; // fallback
    }
  }

  async performBackendScraping(searchTerm, maxResults) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/api/scrape?query=${encodeURIComponent(searchTerm)}&maxResults=${maxResults}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Backend error");

      return await response.json();
    } catch (error) {
      console.error("Backend error:", error);
      throw error;
    }
  }

  sortByDiscount(products) {
    return products.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  }
}

const scrapingService = new ScrapingService();
export default scrapingService;
