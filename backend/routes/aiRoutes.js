const express = require("express");
const router = express.Router();
const { getInvestmentAdvice } = require("../services/geminiAdv");
const { getNumericalGoal } = require("../services/geminiGoal");
// --- New imports ---
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Lightweight auth (duplicate to avoid changing server.js)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// Rule-based categorization
function ruleCategorize(desc) {
  const d = desc.toUpperCase();
  if (/(GROC|SUPERMARKET|WALMART|KROGER|FOOD|MARKET)/.test(d)) return "Groceries";
  if (/(RENT|MORTG|APARTMENT)/.test(d)) return "Housing";
  if (/(UBER|LYFT|CAB|TAXI|GAS|FUEL)/.test(d)) return "Transport";
  if (/(COFFEE|STARBUCKS|CAFE|RESTAURANT|DINING)/.test(d)) return "Food & Beverage";
  if (/(GYM|FITNESS|HEALTH)/.test(d)) return "Health & Fitness";
  if (/(INSUR|INSURANCE)/.test(d)) return "Insurance";
  if (/(SALARY|PAYROLL|INCOME|DEPOSIT)/.test(d)) return "Income";
  if (/(UTIL|ELECTRIC|WATER|INTERNET)/.test(d)) return "Utilities";
  if (/(SHOP|AMAZON|TARGET|STORE)/.test(d)) return "Shopping";
  if (/(ENTERTAIN|MOVIE|NETFLIX)/.test(d)) return "Entertainment";
  return null;
}

// Gemini fallback for a single uncategorized transaction
async function aiCategorize(tx) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Categorize this bank transaction into a concise spending category (one or two words) and give a very short reason (<=12 words).
Return JSON: {"category": "...", "reason": "..."}.
Transaction: ${JSON.stringify({
    description: tx.description,
    amount: tx.amount,
    type: tx.type,
  })}`;
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 200 },
    });
    const raw = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(raw);
    return {
      category: parsed.category || "Uncategorized",
      reason: parsed.reason || "AI classification",
    };
  } catch {
    return { category: "Uncategorized", reason: "Fallback classification" };
  }
}

async function categorizeArray(transactions) {
  for (const tx of transactions) {
    if (!tx.category) {
      const rule = ruleCategorize(tx.description || "");
      if (rule) {
        tx.category = rule;
        tx.reason = "Rule-based match";
      } else {
        const ai = await aiCategorize(tx);
        tx.category = ai.category;
        tx.reason = ai.reason;
      }
    }
  }
  return transactions;
}

// Mock transactions data for when Nessie API fails or returns empty
function getMockTransactions() {
  const mockData = [
    { description: "Walmart Grocery Store", amount: 85.43, type: "debit", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { description: "Salary Direct Deposit", amount: 3500.00, type: "credit", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { description: "Starbucks Coffee", amount: 5.75, type: "debit", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { description: "Uber Ride", amount: 18.25, type: "debit", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { description: "Electric Utility Bill", amount: 125.00, type: "debit", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { description: "Amazon Purchase", amount: 67.99, type: "debit", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
    { description: "Rent Payment", amount: 1200.00, type: "debit", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { description: "Netflix Subscription", amount: 15.99, type: "debit", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
    { description: "Gas Station Fill-up", amount: 45.00, type: "debit", date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
    { description: "Kroger Supermarket", amount: 72.18, type: "debit", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { description: "Planet Fitness Gym", amount: 29.99, type: "debit", date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) },
    { description: "McDonald's Restaurant", amount: 12.45, type: "debit", date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
    { description: "Target Shopping", amount: 94.32, type: "debit", date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) },
    { description: "Internet Bill Verizon", amount: 79.99, type: "debit", date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    { description: "Movie Theater AMC", amount: 24.00, type: "debit", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    { description: "Insurance Premium", amount: 156.00, type: "debit", date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000) },
    { description: "Freelance Income", amount: 850.00, type: "credit", date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000) },
    { description: "Home Depot Hardware", target: 43.67, type: "debit", date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
    { description: "Chipotle Mexican Grill", amount: 11.85, type: "debit", date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000) },
    { description: "Shell Gas Station", amount: 52.30, type: "debit", date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
    { description: "CVS Pharmacy", amount: 28.76, type: "debit", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
    { description: "Apple iCloud Storage", amount: 2.99, type: "debit", date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) },
    { description: "Whole Foods Market", amount: 89.45, type: "debit", date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000) },
    { description: "Spotify Premium", amount: 9.99, type: "debit", date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000) },
    { description: "Bank Interest", amount: 2.50, type: "credit", date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
    { description: "Best Buy Electronics", amount: 199.99, type: "debit", date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000) },
    { description: "Pizza Hut Delivery", amount: 19.75, type: "debit", date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000) },
    { description: "Water Utility Bill", amount: 45.00, type: "debit", date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
    { description: "ATM Cash Withdrawal", amount: 100.00, type: "debit", date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) },
    { description: "Cashback Reward", amount: 25.00, type: "credit", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  ];

  // Fix typo in Home Depot entry
  mockData[17].amount = 43.67;
  delete mockData[17].target;

  return mockData.map(tx => ({
    ...tx,
    source: "bank",
    raw: { mock: true, original: tx }
  }));
}

// Helper: simple HTTP GET (avoid extra deps)
const https = require("https");
function getJSON(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Request timeout')), 5000);
    https
      .get(url, (resp) => {
        clearTimeout(timeout);
        let data = "";
        resp.on("data", (chunk) => (data += chunk));
        resp.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
  });
}

// Fetch Nessie demo accounts + transactions with fallback to mock data
async function fetchNessieTransactions() {
  const key = process.env.NESSIE_API_KEY;
  if (!key) {
    console.log("No NESSIE_API_KEY found, using mock data");
    return getMockTransactions();
  }

  const base = "https://api.nessieisreal.com";

  try {
    const accounts = await getJSON(`${base}/accounts?key=${key}`);
    const selected = (accounts || []).slice(0, 2); // limit
    let all = [];

    for (const acc of selected) {
      try {
        const txs = await getJSON(`${base}/accounts/${acc._id}/transactions?key=${key}`);
        (txs || []).forEach((t) =>
          all.push({
            date: t.transaction_date || t.purchase_date || new Date(),
            description: t.description || t.payee || "Transaction",
            amount: Number(t.amount) || 0,
            type: t.transaction_type === "deposit" ? "credit" : "debit",
            source: "bank",
            raw: t,
          })
        );
      } catch (error) {
        console.log(`Error fetching transactions for account ${acc._id}:`, error.message);
      }
    }

    // If no transactions from API, use mock data
    if (all.length === 0) {
      console.log("No transactions from Nessie API, using mock data");
      return getMockTransactions();
    }

    return all;
  } catch (error) {
    console.log("Error with Nessie API, using mock data:", error.message);
    return getMockTransactions();
  }
}

// ================= Existing routes (Investment & Goal) =================
router.post("/investment-advice", async (req, res) => {
  try {
    const userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ error: "User data is required" });
    }
    const advice = await getInvestmentAdvice(userData);
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Goal analysis route
router.post("/goal-analysis", async (req, res) => {
  try {
    const formData = req.body;
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ error: "Form data is required" });
    }
    const goalAnalysis = await getNumericalGoal(formData);
    res.json({ analysis: goalAnalysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= New Transaction Routes =================

// Import from Bank (Nessie or Mock)
router.post("/transactions/import", authenticateToken, async (req, res) => {
  try {
    // Check if user already has transactions to avoid duplicates
    const existingCount = await Transaction.countDocuments({ userId: req.user.id });
    if (existingCount > 0) {
      return res.json({ imported: 0, message: "Transactions already imported. Use refresh to reload." });
    }

    let records = await fetchNessieTransactions();
    records = await categorizeArray(records);
    const docs = await Transaction.insertMany(
      records.map((r) => ({ ...r, userId: req.user.id }))
    );
    res.json({ imported: docs.length, message: `Successfully imported ${docs.length} transactions` });
  } catch (e) {
    console.error("Error importing transactions:", e);
    res.status(500).json({ error: e.message });
  }
});

// Upload CSV parsed client-side -> unify + categorize
router.post("/transactions/upload", authenticateToken, async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!Array.isArray(transactions))
      return res.status(400).json({ error: "transactions array required" });

    let unified = transactions.map((t) => ({
      date: t.date ? new Date(t.date) : new Date(),
      description: t.description || t.desc || "Transaction",
      amount: Number(t.amount) || 0,
      type: (t.type || "debit").toLowerCase() === "credit" ? "credit" : "debit",
      source: "csv",
      raw: t,
    }));

    unified = await categorizeArray(unified);
    const docs = await Transaction.insertMany(
      unified.map((r) => ({ ...r, userId: req.user.id }))
    );
    res.json({ uploaded: docs.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List transactions
router.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const list = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(500);
    res.json({ transactions: list });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// AI Spending Analysis (replaces auto-chart)
router.post("/transactions/spending-analysis", authenticateToken, async (req, res) => {
  try {
    const list = await Transaction.find({ userId: req.user.id }).limit(500);
    if (!list.length) return res.json({ analysis: null, message: "No transactions available for analysis" });

    // Aggregate spending data
    const categoryTotals = {};
    const monthlySpending = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    list.forEach((t) => {
      const category = t.category || "Uncategorized";
      const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM

      if (t.type === "credit") {
        totalIncome += t.amount;
      } else {
        totalExpenses += t.amount;
        categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
        monthlySpending[month] = (monthlySpending[month] || 0) + t.amount;
      }
    });

    // Prepare data for AI analysis
    const analysisData = {
      totalTransactions: list.length,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netBalance: Math.round((totalIncome - totalExpenses) * 100) / 100,
      topSpendingCategories: Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 })),
      averageMonthlySpending: Math.round((totalExpenses / Math.max(1, Object.keys(monthlySpending).length)) * 100) / 100,
      transactionTimeframe: `${Math.max(1, Object.keys(monthlySpending).length)} months`
    };

    // Generate AI analysis using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `As a financial advisor, analyze this spending data and provide insights:

${JSON.stringify(analysisData, null, 2)}

Provide a comprehensive analysis in JSON format with these sections:
{
  "overview": "Brief 2-3 sentence summary of overall financial health",
  "strengths": ["2-3 positive spending habits observed"],
  "concerns": ["2-3 areas needing attention"],
  "topSpendingInsights": "Analysis of top spending categories and their reasonableness",
  "recommendations": ["3-4 specific actionable recommendations"],
  "futureGuidance": "Advice for future spending and saving goals",
  "budgetSuggestion": "Suggested monthly budget breakdown based on current patterns"
}

Be concise, practical, and encouraging. Focus on actionable advice.`;

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000,
          responseMimeType: "application/json"
        },
      });

      const aiResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const analysis = JSON.parse(aiResponse);

      res.json({
        analysis: {
          overview: typeof analysis.overview === 'string' ? analysis.overview : `You have ${analysisData.totalTransactions} transactions with a net balance of $${analysisData.netBalance}.`,
          strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ["Regular transaction tracking", "Diverse spending categories"],
          concerns: Array.isArray(analysis.concerns) ? analysis.concerns : ["Consider reviewing spending patterns", "Monitor monthly expenses"],
          topSpendingInsights: typeof analysis.topSpendingInsights === 'string' ? analysis.topSpendingInsights : `Your top spending category is ${analysisData.topSpendingCategories[0]?.category || 'Unknown'} at $${analysisData.topSpendingCategories[0]?.amount || 0}.`,
          recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [
            "Track spending in high-expense categories",
            "Set monthly budgets for each category",
            "Consider automating savings",
            "Review and optimize recurring expenses"
          ],
          futureGuidance: typeof analysis.futureGuidance === 'string' ? analysis.futureGuidance : "Focus on maintaining a positive balance while building emergency savings.",
          budgetSuggestion: typeof analysis.budgetSuggestion === 'string' ? analysis.budgetSuggestion : `Based on your average monthly spending of $${analysisData.averageMonthlySpending}, consider allocating funds across categories.`,
          data: analysisData
        }
      });
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
      // Fallback analysis
      res.json({
        analysis: {
          overview: `You have ${analysisData.totalTransactions} transactions with a net balance of $${analysisData.netBalance}.`,
          strengths: ["Regular transaction tracking", "Diverse spending categories"],
          concerns: ["Consider reviewing spending patterns", "Monitor monthly expenses"],
          topSpendingInsights: `Your top spending category is ${analysisData.topSpendingCategories[0]?.category || 'Unknown'} at $${analysisData.topSpendingCategories[0]?.amount || 0}.`,
          recommendations: [
            "Track spending in high-expense categories",
            "Set monthly budgets for each category",
            "Consider automating savings",
            "Review and optimize recurring expenses"
          ],
          futureGuidance: "Focus on maintaining a positive balance while building emergency savings.",
          budgetSuggestion: `Based on your average monthly spending of $${analysisData.averageMonthlySpending}, consider allocating funds across categories.`,
          data: analysisData
        }
      });
    }
  } catch (e) {
    console.error("Spending analysis error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Manual transaction entry
router.post("/transactions/manual", authenticateToken, async (req, res) => {
  try {
    const { date, description, amount, type, category } = req.body;

    if (!date || !description || !amount || !type) {
      return res.status(400).json({ error: "Date, description, amount, and type are required" });
    }

    let transaction = {
      date: new Date(date),
      description: description.trim(),
      amount: Number(amount),
      type: type.toLowerCase() === "credit" ? "credit" : "debit",
      source: "manual",
      category: category || null,
      raw: { manual: true, userInput: { date, description, amount, type, category } }
    };

    // Categorize if category not provided
    if (!transaction.category) {
      const rule = ruleCategorize(transaction.description);
      if (rule) {
        transaction.category = rule;
        transaction.reason = "Rule-based match";
      } else {
        const ai = await aiCategorize(transaction);
        transaction.category = ai.category;
        transaction.reason = ai.reason;
      }
    } else {
      transaction.reason = "User specified";
    }

    const doc = await Transaction.create({
      ...transaction,
      userId: req.user.id
    });

    res.json({
      success: true,
      transaction: doc,
      message: "Transaction added successfully"
    });
  } catch (e) {
    console.error("Error adding manual transaction:", e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
