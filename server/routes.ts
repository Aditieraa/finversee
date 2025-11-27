import { type Express, type Request, Response } from "express";
import { createServer } from "node:http";

import { getStockPrice, getStockPrices, getCacheStats } from "./stocks-api";
import { getFinancialAdvice } from "./gemini";
import { storage } from "./storage";
import { dummyPaymentGateway } from "./dummy-payment-gateway";

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

  app.get("/api/stocks-cache/stats", (_req: Request, res: Response) => {
    const stats = getCacheStats();
    res.json(stats);
  });

  app.post("/api/stocks-cache/clear", (_req: Request, res: Response) => {
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

  // ===== PAYMENT & SUBSCRIPTION ROUTES =====

  // Create payment order
  app.post("/api/payment/create-order", async (req: Request, res: Response) => {
    try {
      const { userId, tier, amount, type, itemId } = req.body;

      if (!userId || !amount) {
        res.status(400).json({ error: "userId and amount required" });
        return;
      }

      const receipt = `receipt_${Date.now()}`;
      const order = dummyPaymentGateway.createOrder(userId, amount * 100, receipt, {
        type,
        tier,
        itemId,
      });

      res.json({
        success: true,
        orderId: order.orderId,
        amount: order.amount / 100,
        currency: order.currency,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Verify payment and complete transaction
  app.post("/api/payment/verify", async (req: Request, res: Response) => {
    try {
      const { userId, orderId, paymentId, signature, tier, type, itemId } = req.body;

      if (!userId || !orderId || !paymentId) {
        res.status(400).json({ error: "userId, orderId, paymentId required" });
        return;
      }

      const isValid = dummyPaymentGateway.verifyPaymentSignature(orderId, paymentId, signature);

      if (!isValid) {
        res.status(400).json({ error: "Payment verification failed" });
        return;
      }

      const order = dummyPaymentGateway.getOrder(orderId);
      if (!order || order.status !== "paid") {
        res.status(400).json({ error: "Order not paid" });
        return;
      }

      // Create transaction record
      await storage.createTransaction(userId, orderId, order.amount, type || "subscription", itemId);

      // Update subscription if it's a subscription purchase
      if (type === "subscription" && tier) {
        await storage.updateSubscription(userId, tier, "active");
      }

      // Create in-app purchase if it's an in-app item
      if (type === "inapp" && itemId) {
        await storage.createInAppPurchase(userId, itemId, itemId, "booster", order.amount);
      }

      // Enroll in course if it's a course purchase
      if (type === "course" && itemId) {
        await storage.enrollCourse(userId, itemId);
      }

      res.json({
        success: true,
        message: "Payment verified and processed",
        transactionId: orderId,
      });
    } catch (error) {
      res.status(500).json({ error: "Payment verification failed" });
    }
  });

  // Get user subscription
  app.get("/api/subscription/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const subscription = await storage.getSubscription(userId);

      if (!subscription) {
        res.status(404).json({ error: "Subscription not found" });
        return;
      }

      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Get all courses
  app.get("/api/courses", async (req: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  // Get single course
  app.get("/api/courses/:courseId", async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const course = await storage.getCourse(courseId);

      if (!course) {
        res.status(404).json({ error: "Course not found" });
        return;
      }

      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Get user's course enrollments
  app.get("/api/enrollments/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const enrollments = await storage.getUserCourses(userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  // Get user's in-app purchases
  app.get("/api/purchases/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const purchases = await storage.getUserPurchases(userId);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });

  // Get user's transaction history
  app.get("/api/transactions/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  return server;
}
