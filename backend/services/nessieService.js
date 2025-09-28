const axios = require("axios");

const NESSIE_API_KEY = process.env.NESSIE_API_KEY;
const NESSIE_BASE_URL = "http://api.nessieisreal.com";

// This is a demo customer ID. In a real app, you'd create customers.
const DEMO_CUSTOMER_ID = "669e9a6a968a435433e13936";

async function getDemoTransactions() {
    try {
        // 1. Get customer accounts
        const accountsResponse = await axios.get(
            `${NESSIE_BASE_URL}/customers/${DEMO_CUSTOMER_ID}/accounts?key=${NESSIE_API_KEY}`
        );
        const accounts = accountsResponse.data;

        if (!accounts || accounts.length === 0) {
            return [];
        }

        // 2. Get transactions for the first account
        const accountId = accounts[0]._id;
        const transactionsResponse = await axios.get(
            `${NESSIE_BASE_URL}/accounts/${accountId}/purchases?key=${NESSIE_API_KEY}`
        );

        // 3. Unify schema
        return transactionsResponse.data.map(tx => ({
            date: tx.purchase_date,
            description: tx.description,
            amount: tx.amount,
            source: 'nessie'
        }));

    } catch (error) {
        console.error("Error fetching from Nessie API:", error.response ? error.response.data : error.message);
        throw new Error("Could not fetch demo bank data.");
    }
}

module.exports = { getDemoTransactions };
