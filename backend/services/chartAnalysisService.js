const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 0.4,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            recommendedChart: {
                type: "string",
            },
            chartConfig: {
                type: "object",
            },
            explanation: {
                type: "string",
            },
            insights: {
                type: "array",
                items: {
                    type: "string",
                },
            }
        },
        required: ["recommendedChart", "chartConfig", "explanation"],
    },
};

class ChartAnalysisService {
    async analyzeDataForChart(transactions, dataType = 'transactions') {
        try {
            // Prepare data summary for analysis
            const dataSummary = this.prepareDataSummary(transactions);

            const prompt = `
        You are a data visualization expert. Analyze this financial data and recommend the best chart type and configuration.
        
        Data Summary:
        ${JSON.stringify(dataSummary, null, 2)}
        
        Data Type: ${dataType}
        
        Available Chart Types:
        - pie (for categorical breakdowns)
        - bar (for comparisons)
        - line (for trends over time)
        - area (for cumulative trends)
        - donut (for proportional data)
        - scatter (for correlations)
        
        Consider:
        1. The nature of the data (categorical, temporal, numerical)
        2. What insights would be most valuable to the user
        3. The best way to visualize patterns and trends
        
        Provide:
        1. The recommended chart type
        2. Chart configuration (labels, data keys, colors, etc.)
        3. A clear explanation of why this chart type is best for this data
        4. Key insights that can be drawn from the visualization
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
            console.error("Error analyzing data for chart:", error);
            return this.getDefaultChartRecommendation(transactions);
        }
    }

    prepareDataSummary(transactions) {
        const summary = {
            totalTransactions: transactions.length,
            dateRange: {
                start: transactions.length > 0 ? Math.min(...transactions.map(t => new Date(t.date))) : null,
                end: transactions.length > 0 ? Math.max(...transactions.map(t => new Date(t.date))) : null
            },
            categories: {},
            totalAmount: 0,
            positiveTransactions: 0,
            negativeTransactions: 0,
            averageAmount: 0
        };

        transactions.forEach(transaction => {
            const category = transaction.final_category || transaction.category || 'Other';
            summary.categories[category] = (summary.categories[category] || 0) + Math.abs(transaction.amount);
            summary.totalAmount += Math.abs(transaction.amount);

            if (transaction.amount > 0) {
                summary.positiveTransactions++;
            } else {
                summary.negativeTransactions++;
            }
        });

        summary.averageAmount = summary.totalAmount / transactions.length || 0;
        summary.topCategories = Object.entries(summary.categories)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category, amount]) => ({ category, amount }));

        return summary;
    }

    getDefaultChartRecommendation(transactions) {
        const summary = this.prepareDataSummary(transactions);

        return {
            recommendedChart: 'pie',
            chartConfig: {
                data: summary.topCategories.map(item => ({
                    name: item.category,
                    value: item.amount
                })),
                dataKey: 'value',
                nameKey: 'name',
                colors: ['#1E88E5', '#FF8F00', '#10B981', '#EF4444', '#6366F1']
            },
            explanation: 'A pie chart is recommended to show the distribution of spending across different categories, making it easy to identify where most of your money is going.',
            insights: [
                'This visualization helps identify your largest expense categories',
                'You can quickly see spending patterns and areas for potential savings'
            ]
        };
    }
}

module.exports = new ChartAnalysisService();
