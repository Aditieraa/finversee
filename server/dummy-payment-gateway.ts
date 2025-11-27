import { randomUUID } from "crypto";

/**
 * Dummy Payment Gateway
 * Simulates Razorpay functionality for testing
 * All payments will succeed by default
 */

export interface DummyOrder {
  orderId: string;
  userId: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
  createdAt: number;
  status: "created" | "paid" | "failed";
  paymentId?: string;
}

export interface DummyPayment {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  status: "captured" | "failed";
  method: "card" | "upi" | "netbanking";
  timestamp: number;
  signature: string;
}

class DummyPaymentGateway {
  private orders: Map<string, DummyOrder> = new Map();
  private payments: Map<string, DummyPayment> = new Map();

  /**
   * Create a dummy order
   */
  createOrder(userId: string, amount: number, receipt: string, notes?: Record<string, string>): DummyOrder {
    const orderId = `order_${randomUUID().slice(0, 8)}`;
    
    const order: DummyOrder = {
      orderId,
      userId,
      amount,
      currency: "INR",
      receipt,
      notes,
      createdAt: Date.now(),
      status: "created",
    };

    this.orders.set(orderId, order);
    
    console.log(`✅ Dummy Order Created: ${orderId} for ₹${(amount / 100).toFixed(2)}`);
    
    return order;
  }

  /**
   * Simulate payment processing
   */
  capturePayment(orderId: string, success: boolean = true): DummyPayment | null {
    const order = this.orders.get(orderId);
    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return null;
    }

    const paymentId = `pay_${randomUUID().slice(0, 8)}`;
    const signature = this.generateSignature(orderId, paymentId);

    const payment: DummyPayment = {
      paymentId,
      orderId,
      userId: order.userId,
      amount: order.amount,
      status: success ? "captured" : "failed",
      method: ["card", "upi", "netbanking"][Math.floor(Math.random() * 3)] as "card" | "upi" | "netbanking",
      timestamp: Date.now(),
      signature,
    };

    this.payments.set(paymentId, payment);
    
    if (success) {
      order.status = "paid";
      order.paymentId = paymentId;
      console.log(`✅ Payment Captured: ${paymentId}`);
    } else {
      order.status = "failed";
      console.log(`❌ Payment Failed: ${paymentId}`);
    }

    return payment;
  }

  /**
   * Verify payment signature (dummy verification)
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const payment = this.payments.get(paymentId);
    
    if (!payment) {
      console.error(`❌ Payment not found: ${paymentId}`);
      return false;
    }

    const expectedSignature = this.generateSignature(orderId, paymentId);
    const isValid = signature === expectedSignature;
    
    console.log(`${isValid ? "✅" : "❌"} Signature Verification: ${isValid ? "Valid" : "Invalid"}`);
    
    return isValid;
  }

  /**
   * Generate a dummy signature for verification
   */
  private generateSignature(orderId: string, paymentId: string): string {
    return `sig_${orderId}_${paymentId}`.slice(0, 32);
  }

  /**
   * Get order details
   */
  getOrder(orderId: string): DummyOrder | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get payment details
   */
  getPayment(paymentId: string): DummyPayment | undefined {
    return this.payments.get(paymentId);
  }

  /**
   * Get all orders for a user
   */
  getUserOrders(userId: string): DummyOrder[] {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  /**
   * Get all payments for a user
   */
  getUserPayments(userId: string): DummyPayment[] {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }
}

export const dummyPaymentGateway = new DummyPaymentGateway();
