const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 0.3,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            category: {
                type: "string",
            },
            reason: {
                type: "string",
            },
            confidence: {
                type: "number",
            }
        },
        required: ["category", "reason", "confidence"],
    },
};

class GeminiCategorizationService {
    async categorizeTransaction(description, amount, date) {
        try {
            const prompt = `
        Categorize this financial transaction and provide a short human-readable reason.
        
        Transaction Details:
        - Description: ${description}
        - Amount: $${Math.abs(amount)}
        - Date: ${date}
        - Type: ${amount > 0 ? 'Credit/Income' : 'Debit/Expense'}
        
        Available Categories:
        - Food & Dining
        - Transportation
        - Shopping
        - Utilities
        - Housing
        - Healthcare
        - Entertainment
        - Income
        - Transfers
        - Fees & Charges
        - Education
        - Travel
        - Insurance
        - Investments
        - Other
        
        Provide:
        1. The most appropriate category
        2. A brief, human-readable reason (1-2 sentences max)
        3. Your confidence level (0-1)
      `;

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig,
            });

            const response = result.response;

            if (response.candidates && response.candidates.length > 0) {
                const analysisText = response.candidates[0].content.parts[0].text;
                return JSON.parse(analysisText);
            } else {
                throw new Error("No response received from Gemini");
            }
        } catch (error) {
            console.error("Error categorizing transaction:", error);
            return {
                category: 'Other',
                reason: 'Unable to categorize automatically',
                confidence: 0.1
            };
        }
    }

    async categorizeTransactionsBatch(transactions) {
        const categorizedTransactions = [];

        for (const transaction of transactions) {
            try {
                const analysis = await this.categorizeTransaction(
                    transaction.description,
                    transaction.amount,
                    transaction.date
                );

                categorizedTransactions.push({
                    ...transaction,
                    ai_category: analysis.category,
                    ai_reason: analysis.reason,
                    ai_confidence: analysis.confidence,
                    final_category: analysis.confidence > 0.7 ? analysis.category : transaction.category
                });

                // Add small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error categorizing transaction ${transaction.id}:`, error);
                categorizedTransactions.push({
                    ...transaction,
                    ai_category: 'Other',
                    ai_reason: 'Categorization failed',
                    ai_confidence: 0.1,
                    final_category: transaction.category
                });
            }
        }

        return categorizedTransactions;
    }
}

module.exports = new GeminiCategorizationService();
