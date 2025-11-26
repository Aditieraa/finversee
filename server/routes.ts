import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getFinancialAdvice } from "./gemini";
import { sendEmail } from "./email";

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

  // Email notification endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      const { email, subject, title, message, type, icon } = req.body;

      if (!email || !subject || !title || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const success = await sendEmail({
        email,
        subject,
        title,
        message,
        type: type || 'budget-alert',
        icon,
      });

      res.json({ success, message: success ? 'Email sent successfully' : 'Failed to send email' });
    } catch (error) {
      console.error('Email endpoint error:', error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
