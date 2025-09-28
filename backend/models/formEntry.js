const mongoose = require("mongoose");

const formEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Personal Information
  age: Number,
  maritalStatus: String,
  dependents: String,
  employmentStatus: String,

  // Financial Information
  monthlyIncome: String,
  monthlyExpenses: String,
  annualIncome: String,
  extraIncome: String,

  // Assets
  primaryResidence: String,
  vehicles: String,
  investments: String,
  cashSavings: String,

  // Liabilities
  mortgage: String,
  carLoans: String,
  creditCardDebt: String,
  studentLoans: String,

  // Goals & Risk
  financialGoals: String,
  shortTermGoals: String,
  financialGoal: String,
  savings: String,
  contribution: String,
  riskTolerance: String,
  experience: String,

  // Debt & Insurance
  debtLiabilities: String,
  currentDebts: String,
  outstandingDebts: String,
  totalOutstandingDebts: String,
  insurance: String,
  insuranceCoverage: String,
  insurancePolicies: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
formEntrySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
formEntrySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("FormEntry", formEntrySchema);
