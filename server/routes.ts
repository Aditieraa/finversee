import { type Express, type Request, Response } from "express";
import { createServer } from "node:http";

import { getStockPrice, getStockPrices, getCacheStats } from "./stocks-api";
import { getFinancialAdvice } from "./gemini";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // ===== AI CHAT ROUTE =====
  app.post("/api/ai/chat", async (req: Request, res: Response) => {
    try {
      const { message, context } = req.body;

      console.log('📨 Received chat request:', { message, context });

      if (!message || typeof message !== "string") {
        console.error('❌ Invalid message format');
        res.status(400).json({ error: "Message required" });
        return;
      }

      if (!context || typeof context !== "object") {
        console.error('❌ Invalid context format');
        res.status(400).json({ error: "Context required" });
        return;
      }

      console.log('🤖 Getting financial advice from Gemini...');
      const advice = await getFinancialAdvice(message, context);

      console.log('✅ Chat endpoint responding with:', advice.substring(0, 50) + '...');
      res.json({ response: advice });
    } catch (error) {
      console.error('❌ Chat route error:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res.status(500).json({
        error: "Chat service error",
        response: "I'm having trouble connecting right now, but I'm here to support you! Keep making smart financial decisions. Your future self will thank you!"
      });
    }
  });

  // ===== STOCK API ROUTES =====
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

  // ===== QUICK ACTIONS ROUTES =====
  // Add Income
  app.post("/api/actions/add-income", (req: Request, res: Response) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Valid amount required" });
      return;
    }
    res.json({ success: true, message: `Income added: ₹${amount}` });
  });

  // Add Expense
  app.post("/api/actions/add-expense", (req: Request, res: Response) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Valid amount required" });
      return;
    }
    res.json({ success: true, message: `Expense added: ₹${amount}` });
  });

  return server;
}
