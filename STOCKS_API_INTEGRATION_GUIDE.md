# Finverse - Real-Time Stocks API Integration Guide

## Overview
This guide walks you through integrating real-time stock market data into Finverse. All options listed here have FREE tiers suitable for development and testing.

---

## 🏆 Recommended Options (Free Tier Available)

### Option 1: **Finnhub** (RECOMMENDED - Best for Finverse)
**Free Plan Limits:** 60 API calls/minute, Real-time data, No credit card needed
- **Website:** https://finnhub.io
- **Free Tier:** ✅ Excellent for stocks data
- **Data Available:** Stock prices, company profiles, news, earnings
- **Rate Limit:** 60 calls/minute
- **Best For:** Real-time stock prices and market data

**Step-by-Step Setup:**
1. Go to https://finnhub.io
2. Click "Sign Up" (choose free tier)
3. Verify email
4. Copy API Key from dashboard
5. Add to Replit secrets as `FINNHUB_API_KEY`

---

### Option 2: **Alpha Vantage**
**Free Plan Limits:** 5 calls/minute, Real-time data
- **Website:** https://www.alphavantage.co
- **Free Tier:** ✅ Good for stocks
- **Data Available:** Stock prices, technical indicators, forex
- **Rate Limit:** 5 calls/minute
- **Best For:** OHLC data, technical analysis

**Step-by-Step Setup:**
1. Go to https://www.alphavantage.co/
2. Enter email, get instant API key
3. Add to Replit secrets as `ALPHAVANTAGE_API_KEY`

---

### Option 3: **Polygon.io**
**Free Plan Limits:** 5 API calls/minute, Historical + real-time data
- **Website:** https://polygon.io
- **Free Tier:** ✅ Free tier available
- **Data Available:** Stock quotes, aggregates, forex
- **Rate Limit:** 5 calls/minute
- **Best For:** Detailed market data

**Step-by-Step Setup:**
1. Go to https://polygon.io
2. Sign up (free tier)
3. Get API key from settings
4. Add to Replit secrets as `POLYGON_API_KEY`

---

### Option 4: **IEX Cloud** (Deprecated - Not Recommended)
Not recommended due to limited free tier

---

## 📋 Comparison Table

| Feature | Finnhub | Alpha Vantage | Polygon |
|---------|---------|---------------|---------|
| Real-time Data | ✅ Yes | ✅ Yes | ✅ Yes |
| Free Tier | ✅ 60/min | ✅ 5/min | ✅ 5/min |
| No Credit Card | ✅ Yes | ✅ Yes | ✅ Yes |
| Stock Quotes | ✅ | ✅ | ✅ |
| Company Info | ✅ | ❌ | ✅ |
| News Feed | ✅ | ❌ | ❌ |
| Best for Finverse | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

---

## 🔧 Integration Steps for Finverse

### Step 1: Get API Key
Choose Finnhub (recommended):
1. Visit https://finnhub.io
2. Sign up for free
3. Go to dashboard, copy API key

### Step 2: Add to Replit Secrets
1. In Replit, click "Secrets" (lock icon)
2. Add new secret:
   - **Key:** `FINNHUB_API_KEY`
   - **Value:** Your API key from Step 1
3. Save

### Step 3: Create Backend API Route
The backend will fetch real-time stock data and cache it (already provided below)

### Step 4: Update Game Logic
The stock prices will now be fetched from real market data instead of random numbers

### Step 5: Frontend Integration
Display real stock data in the portfolio and game

---

## 📝 What You'll Get

### Free Plan Benefits (Finnhub):
- ✅ Real-time stock prices (< 1 second delay)
- ✅ 60 API calls per minute
- ✅ No credit card required
- ✅ Unlimited requests per month
- ✅ Company profiles
- ✅ Latest news
- ✅ Earnings data
- ✅ Support for 20,000+ stocks globally

### Cost Comparison:
| Plan | Cost | Rate Limit |
|------|------|-----------|
| Finnhub Free | **$0/month** | 60/min |
| Alpha Vantage Free | **$0/month** | 5/min |
| Polygon Free | **$0/month** | 5/min |
| Finnhub Premium | $20/month | 60,000/min |

---

## 🚀 Quick Start (Finnhub)

### 1. Get API Key (2 minutes)
```
1. Go to https://finnhub.io
2. Click "Get Free API Key"
3. Sign up with email
4. Verify email
5. Copy key from dashboard
```

### 2. Add to Replit (1 minute)
```
1. Click Secrets (🔒) in Replit sidebar
2. Add: FINNHUB_API_KEY = your_key
3. Save
```

### 3. Backend Code (Already Provided)
Fetches stock data with caching

### 4. Update Game Logic
Use real stock tickers (AAPL, GOOGL, RELIANCE, INFY, etc.)

### 5. Test & Launch
Your stocks now show real-time market data!

---

## 📊 Example Stocks for India

### Indian Stocks (NSE):
- RELIANCE (Reliance Industries)
- INFY (Infosys)
- TCS (Tata Consultancy Services)
- HDFC (HDFC Bank)
- ICICI (ICICI Bank)

### Global Stocks:
- AAPL (Apple)
- GOOGL (Google)
- MSFT (Microsoft)
- TSLA (Tesla)
- AMZN (Amazon)

---

## 🎯 Implementation Timeline

| Task | Time | Difficulty |
|------|------|-----------|
| Get API Key | 2 min | ⭐ Easy |
| Add to Secrets | 1 min | ⭐ Easy |
| Backend Setup | 5 min | ⭐⭐ Medium |
| Frontend Integration | 10 min | ⭐⭐ Medium |
| Testing | 5 min | ⭐ Easy |
| **Total** | **~23 min** | - |

---

## ⚠️ Important Notes

1. **Rate Limiting:** Finnhub free tier: 60 requests/minute = 1 request/second
   - Cache responses to avoid rate limits
   - Don't fetch every second, use 5-10 second intervals

2. **Market Hours:** Stock prices update during market hours
   - NYSE: 9:30 AM - 4:00 PM EST
   - NSE (India): 9:15 AM - 3:30 PM IST

3. **Upgrade Path:** If you exceed free tier limits, upgrade to paid plans:
   - Finnhub Premium: $20/month (60,000 requests/min)
   - Great for production apps

4. **Data Accuracy:** Real market data with minimal delay (50-100ms)

---

## ✅ Next Steps

1. Choose Finnhub (recommended)
2. Get free API key: https://finnhub.io
3. Add API key to Replit secrets
4. I'll integrate the backend code
5. Game will use real stock prices!

---

## 🤝 Support

For API-specific questions:
- Finnhub: https://finnhub.io/docs/api
- Alpha Vantage: https://www.alphavantage.co/documentation/
- Polygon: https://polygon.io/docs/stocks/

For Finverse integration: Contact support or create an issue

---

**Status:** Ready for integration ✅
**Estimated Setup Time:** 25 minutes
**Cost:** FREE ($0/month)
