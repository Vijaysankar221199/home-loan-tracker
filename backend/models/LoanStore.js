const mongoose = require('mongoose');

const loanSettingsSchema = new mongoose.Schema({
  principalAmount: { type: Number, required: true },
  annualInterestRate: { type: Number, required: true },
  tenureYears: { type: Number, required: true },
  calculatedEmi: { type: Number, default: null }
});

const monthlyPaymentSchema = new mongoose.Schema({
  month: { type: String, required: true },
  emiPaid: { type: Number, required: true },
  extraPaid: { type: Number, required: true },
  interestComponent: { type: Number, required: true },
  principalComponent: { type: Number, required: true },
  remainingPrincipal: { type: Number, required: true }
});

const summaryStatsSchema = new mongoose.Schema({
  totalPaid: { type: Number, required: true },
  totalInterestPaid: { type: Number, required: true },
  remainingPrincipal: { type: Number, required: true },
  monthsCompleted: { type: Number, required: true },
  forecastedEndDate: { type: String, default: null },
  interestSavedDueToExtra: { type: Number, required: true }
});

const loanStoreSchema = new mongoose.Schema({
  loanSettings: { type: loanSettingsSchema, required: true },
  monthlyPayments: [monthlyPaymentSchema],
  summary: { type: summaryStatsSchema, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LoanStore', loanStoreSchema);