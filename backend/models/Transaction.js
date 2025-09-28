const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["debit", "credit"], required: true },
    source: { type: String, enum: ["bank", "csv"], required: true },
    category: { type: String },
    reason: { type: String }, // short human-readable why this category
    raw: { type: Object },    // original provider/raw record
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
