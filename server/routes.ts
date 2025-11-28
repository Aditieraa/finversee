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

  // ===== GAME STATE UPDATE ROUTES =====
  app.post("/api/game/add-income", (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Valid amount required" });
        return;
      }
      res.json({ success: true, amount, message: `Added ₹${amount.toLocaleString('en-IN')} income` });
    } catch (error) {
      res.status(500).json({ error: "Failed to add income" });
    }
  });

  app.post("/api/game/add-expense", (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Valid amount required" });
        return;
      }
      res.json({ success: true, amount, message: `Added ₹${amount.toLocaleString('en-IN')} expense` });
    } catch (error) {
      res.status(500).json({ error: "Failed to add expense" });
    }
  });

  app.post("/api/game/invest", (req: Request, res: Response) => {
    try {
      const { type, amount } = req.body;
      if (!type || !amount || amount <= 0) {
        res.status(400).json({ error: "Valid type and amount required" });
        return;
      }
      res.json({ success: true, type, amount, message: `Invested ₹${amount.toLocaleString('en-IN')} in ${type}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to invest" });
    }
  });

  // ===== AI INVESTMENT RECOMMENDATIONS ROUTE =====
  app.post("/api/ai-recommendations", async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Prompt required" });
        return;
      }

      console.log('🤖 Generating investment recommendations...');
      const advice = await getFinancialAdvice(prompt, {
        netWorth: 0,
        portfolio: {},
        level: 1,
        career: "Investor"
      });

      // Parse recommendations from Gemini response
      // Try to extract JSON array from response
      let recommendations = [];
      try {
        // Look for JSON array in the response
        const jsonMatch = advice.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: Create mock recommendations from advice
          recommendations = [
            {
              title: "📈 Recommended Strategy",
              description: advice.substring(0, 200),
              expectedReturn: "8-12%",
              riskLevel: "Medium",
              minimumInvestment: 5000,
              reason: "AI-generated recommendation based on your profile"
            }
          ];
        }
      } catch (parseErr) {
        console.log('ℹ️ Could not parse JSON from response, using fallback');
        recommendations = [
          {
            title: "💡 Financial Strategy",
            description: advice.substring(0, 250),
            expectedReturn: "10-15%",
            riskLevel: "Medium",
            minimumInvestment: 5000,
            reason: "Personalized based on your financial metrics"
          }
        ];
      }

      console.log('✅ Recommendations generated:', recommendations.length);
      res.json({ recommendations });
    } catch (error) {
      console.error('❌ Recommendations error:', error);
      res.status(500).json({
        error: "Failed to generate recommendations",
        recommendations: []
      });
    }
  });

  return server;
}
