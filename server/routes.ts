import { type Express, type Request, Response } from "express";
import { createServer } from "node:http";
import { v4 as uuidv4 } from "uuid";

import { getStorage } from "./storage";
import { getStockPrice, getStockPrices, getCacheStats } from "./stocks-api";

const storage = getStorage();

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Stock API Routes
  app.get("/api/stocks/:symbol", async (req: Request, res: Response) => {
    const { symbol } = req.params;
    
    if (!symbol || typeof symbol !== "string") {
      res.status(400).json({ error: "Symbol parameter required" });
      return;
    }

    const stockData = await getStockPrice(symbol.toUpperCase());
    res.json(stockData);
  });

  // Get multiple stock prices
  app.post("/api/stocks", async (req: Request, res: Response) => {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols) || symbols.length === 0) {
      res.status(400).json({ error: "symbols array required" });
      return;
    }

    const stocks = await getStockPrices(
      symbols.map((s: string) => s.toUpperCase())
    );
    res.json(stocks);
  });

  // Get cache statistics
  app.get("/api/stocks-cache/stats", (_req: Request, res: Response) => {
    const stats = getCacheStats();
    res.json(stats);
  });

  // Clear stock cache
  app.post("/api/stocks-cache/clear", (_req: Request, res: Response) => {
    // Commented out for now - uncomment if you have admin auth
    // clearStockCache();
    res.json({ message: "Cache clear endpoint (admin only)" });
  });

  return server;
}
