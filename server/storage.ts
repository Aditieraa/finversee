import { type User, type InsertUser, type Subscription, type Transaction, type InAppPurchase, type Course, type CourseEnrollment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Subscriptions
  getSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(userId: string, tier: string): Promise<Subscription>;
  updateSubscription(userId: string, tier: string, status: string): Promise<Subscription | undefined>;
  
  // Transactions
  createTransaction(userId: string, orderId: string, amount: number, type: string, itemId?: string): Promise<Transaction>;
  getTransaction(orderId: string): Promise<Transaction | undefined>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  
  // In-app Purchases
  createInAppPurchase(userId: string, itemId: string, itemName: string, category: string, amount: number): Promise<InAppPurchase>;
  getUserPurchases(userId: string): Promise<InAppPurchase[]>;
  
  // Courses
  getAllCourses(): Promise<Course[]>;
  getCourse(courseId: string): Promise<Course | undefined>;
  
  // Course Enrollments
  enrollCourse(userId: string, courseId: string): Promise<CourseEnrollment>;
  getUserCourses(userId: string): Promise<CourseEnrollment[]>;
  getCourseProgress(userId: string, courseId: string): Promise<CourseEnrollment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscriptions: Map<string, Subscription>;
  private transactions: Map<string, Transaction>;
  private inAppPurchases: Map<string, InAppPurchase>;
  private courses: Map<string, Course>;
  private courseEnrollments: Map<string, CourseEnrollment>;

  constructor() {
    this.users = new Map();
    this.subscriptions = new Map();
    this.transactions = new Map();
    this.inAppPurchases = new Map();
    this.courses = new Map();
    this.courseEnrollments = new Map();
    
    this.initializeDummyData();
  }

  // ===== INITIALIZATION =====
  private initializeDummyData() {
    // Dummy courses
    const dummyCourses: Course[] = [
      {
        id: randomUUID(),
        courseId: "course_tax_101",
        title: "Tax Optimization Masterclass",
        description: "Learn how to save taxes with smart financial planning",
        price: 39900, // ₹399
        duration: 30,
        category: "Taxes",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        courseId: "course_stock_101",
        title: "Stock Market 101",
        description: "Beginner's guide to investing in stocks",
        price: 29900, // ₹299
        duration: 21,
        category: "Investing",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        courseId: "course_real_estate",
        title: "Real Estate Investment Secrets",
        description: "How to build wealth through property investment",
        price: 49900, // ₹499
        duration: 45,
        category: "Real Estate",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        courseId: "course_passive_income",
        title: "Passive Income Systems",
        description: "Build multiple revenue streams that work for you",
        price: 44900, // ₹449
        duration: 35,
        category: "Income",
        createdAt: new Date(),
      },
    ];

    dummyCourses.forEach((course) => {
      this.courses.set(course.courseId, course);
    });

    console.log("✅ Dummy data initialized: 4 courses created");
  }

  // ===== USER METHODS =====
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create default free subscription
    await this.createSubscription(id, "free");
    
    return user;
  }

  // ===== SUBSCRIPTION METHODS =====
  async getSubscription(userId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find((sub) => sub.userId === userId);
  }

  async createSubscription(userId: string, tier: string): Promise<Subscription> {
    const id = randomUUID();
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const subscription: Subscription = {
      id,
      userId,
      tier,
      status: "active",
      startDate: now,
      endDate: tier === "free" ? null : endDate,
      renewalDate: tier === "free" ? null : endDate,
      createdAt: now,
    };

    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(userId: string, tier: string, status: string): Promise<Subscription | undefined> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) return undefined;

    subscription.tier = tier;
    subscription.status = status;
    subscription.renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  // ===== TRANSACTION METHODS =====
  async createTransaction(userId: string, orderId: string, amount: number, type: string, itemId?: string): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      id,
      userId,
      orderId,
      amount,
      type,
      itemId,
      paymentMethod: "dummy",
      status: "success",
      createdAt: new Date(),
    };

    this.transactions.set(orderId, transaction);
    return transaction;
  }

  async getTransaction(orderId: string): Promise<Transaction | undefined> {
    return this.transactions.get(orderId);
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter((t) => t.userId === userId);
  }

  // ===== IN-APP PURCHASE METHODS =====
  async createInAppPurchase(userId: string, itemId: string, itemName: string, category: string, amount: number): Promise<InAppPurchase> {
    const id = randomUUID();
    const purchase: InAppPurchase = {
      id,
      userId,
      itemId,
      itemName,
      category,
      amount,
      purchasedAt: new Date(),
    };

    this.inAppPurchases.set(id, purchase);
    return purchase;
  }

  async getUserPurchases(userId: string): Promise<InAppPurchase[]> {
    return Array.from(this.inAppPurchases.values()).filter((p) => p.userId === userId);
  }

  // ===== COURSE METHODS =====
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(courseId: string): Promise<Course | undefined> {
    return this.courses.get(courseId);
  }

  // ===== COURSE ENROLLMENT METHODS =====
  async enrollCourse(userId: string, courseId: string): Promise<CourseEnrollment> {
    const id = randomUUID();
    const enrollment: CourseEnrollment = {
      id,
      userId,
      courseId,
      enrolledAt: new Date(),
      completedAt: null,
      progress: 0,
    };

    this.courseEnrollments.set(id, enrollment);
    return enrollment;
  }

  async getUserCourses(userId: string): Promise<CourseEnrollment[]> {
    return Array.from(this.courseEnrollments.values()).filter((e) => e.userId === userId);
  }

  async getCourseProgress(userId: string, courseId: string): Promise<CourseEnrollment | undefined> {
    return Array.from(this.courseEnrollments.values()).find((e) => e.userId === userId && e.courseId === courseId);
  }
}

export const storage = new MemStorage();
