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
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      "Short term": {
        type: "string",
      },
      "Long Term": {
        type: "string",
      },
      "Short term Total amount": {
        type: "string",
      },
      "Long Term Total amount": {
        type: "string",
      },
    },
    required: [
      "Short term",
      "Long Term",
      "Short term Total amount",
      "Long Term Total amount",
    ],
  },
};

async function getNumericalGoal(userData) {
  try {
    const prompt = `
      You are a financial advisor AI specializing in personalized investment guidance.
      
      IMPORTANT: Carefully analyze the provided user data including their financial background, 
      current savings, investments, income, expenses, and stated goals.
      
      Based on this analysis, provide:
      
      1. Percentage completion of Short-term goals (1-3 year goals) - Compare current savings/investments 
         against short-term targets mentioned in the data
      
      2. Percentage completion of Long-term goals (retirement/long-term wealth) - Evaluate progress toward 
         retirement or other long-term financial goals
      
      3. The estimated amount of money (in INR) still needed to complete their Short-term goals
      
      4. The estimated amount of money (in INR) still needed to complete their Long-term goals
         
      Consider factors like:
      - Current savings relative to stated goals
      - Investment portfolio alignment with goals
      - Income vs. expenses and saving rate
      - Debt levels and repayment progress
      - Age and time horizon
      
      Even if some data is missing, provide your best reasonable estimate based on available information.
      DO NOT return 0% unless the user truly has made no progress. Provide realistic percentages.
      For the monetary amounts, provide specific INR amounts (e.g., "Rs. 25,000").
      
      User Data: ${JSON.stringify(userData)}
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;

    if (response.candidates && response.candidates.length > 0) {
      console.log(response.candidates[0].content.parts[0].text);
      return response.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No response received");
    }
  } catch (error) {
    console.error("Error generating goal:", error);
    throw new Error("Failed to generate goal");
  }
}

module.exports = { getNumericalGoal };
