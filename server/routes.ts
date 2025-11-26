import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getFinancialAdvice } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, gameState } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await getFinancialAdvice(message, {
        netWorth: gameState?.netWorth || 0,
        portfolio: gameState?.portfolio || {},
        level: gameState?.level || 1,
        career: gameState?.career,
      });

      res.json({ response });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
