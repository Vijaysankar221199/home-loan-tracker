const express = require('express');
const router = express.Router();
const LoanStore = require('../models/LoanStore');

// Initial data
const initialData = {
  loanSettings: {
    principalAmount: 500000,
    annualInterestRate: 7.5,
    tenureYears: 20,
    calculatedEmi: null
  },
  monthlyPayments: [],
  summary: {
    totalPaid: 0,
    totalInterestPaid: 0,
    remainingPrincipal: 500000,
    monthsCompleted: 0,
    forecastedEndDate: null,
    interestSavedDueToExtra: 0,
    principalPaidFromEmi: 0,
    principalPaidFromExtra: 0
  }
};

/**
 * GET /api/loan
 * Retrieves the loan store data from the database.
 * If no data exists, initializes with default values.
 * @returns {Object} The loan store object containing settings, payments, and summary.
 */
router.get('/', async (req, res) => {
  try {
    let store = await LoanStore.findOne();
    if (!store) {
      store = new LoanStore(initialData);
      await store.save();
    }
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/loan/settings
 * Updates loan settings and resets payments and summary.
 * @param {Object} req.body - Partial loan settings (principalAmount, annualInterestRate, tenureYears)
 * @returns {Object} Updated loan store.
 */
router.put('/settings', async (req, res) => {
  try {
    let store = await LoanStore.findOne();
    if (!store) {
      store = new LoanStore(initialData);
    }
    store.loanSettings = { ...store.loanSettings, ...req.body };
    store.loanSettings.calculatedEmi = null;
    store.summary.remainingPrincipal = store.loanSettings.principalAmount;
    store.monthlyPayments = [];
    store.summary = { ...store.summary, totalPaid:0, totalInterestPaid:0, monthsCompleted:0, forecastedEndDate:null, interestSavedDueToExtra:0, principalPaidFromEmi:0, principalPaidFromExtra:0 };
    await store.save();
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/loan/payments
 * Adds or updates a monthly payment and recalculates the summary.
 * @param {Object} req.body - Payment data (month, emiPaid, extraPaid, etc.)
 * @returns {Object} The added/updated payment entry.
 */
router.post('/payments', async (req, res) => {
  try {
    let store = await LoanStore.findOne();
    if (!store) {
      store = new LoanStore(initialData);
    }
    const entry = req.body;
    const idx = store.monthlyPayments.findIndex(m => m.month === entry.month);
    if (idx >= 0) {
      store.monthlyPayments[idx] = entry;
    } else {
      store.monthlyPayments.push(entry);
    }
    store.monthlyPayments.sort((a, b) => a.month.localeCompare(b.month));

    // Recalculate summary
    let remaining = store.loanSettings.principalAmount;
    let totalPaid = 0, totalInterest = 0;
    let principalFromEmi = 0, principalFromExtra = 0;
    for (const m of store.monthlyPayments) {
      remaining = Math.max(0, remaining - m.principalComponent - m.extraPaid);
      totalPaid += m.emiPaid + (m.extraPaid || 0);
      totalInterest += m.interestComponent;
      principalFromEmi += m.principalComponent;
      principalFromExtra += m.extraPaid || 0;
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid);
    store.summary.totalInterestPaid = Math.round(totalInterest);
    store.summary.monthsCompleted = store.monthlyPayments.length;
    store.summary.principalPaidFromEmi = Math.round(principalFromEmi);
    store.summary.principalPaidFromExtra = Math.round(principalFromExtra);
    if (remaining <= 0) {
      const last = store.monthlyPayments[store.monthlyPayments.length - 1];
      store.summary.forecastedEndDate = last.month;
    }
    await store.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/loan/payments/:oldMonth
 * Edits a monthly payment by old month and recalculates all payments and summary.
 * @param {string} req.params.oldMonth - The original month of the payment to edit.
 * @param {Object} req.body - New payment data.
 * @returns {Object} The updated payment entry.
 */
router.put('/payments/:oldMonth', async (req, res) => {
  try {
    let store = await LoanStore.findOne();
    if (!store) {
      store = new LoanStore(initialData);
    }
    const { oldMonth } = req.params;
    const newEntry = req.body;

    // Remove old
    store.monthlyPayments = store.monthlyPayments.filter(m => m.month !== oldMonth);
    // Add new
    store.monthlyPayments.push(newEntry);
    store.monthlyPayments.sort((a, b) => a.month.localeCompare(b.month));

    // Recalculate all
    let remaining = store.loanSettings.principalAmount;
    let totalPaid = 0;
    let totalInterest = 0;
    let principalFromEmi = 0, principalFromExtra = 0;
    for (const m of store.monthlyPayments) {
      const monthlyRate = store.loanSettings.annualInterestRate / 100 / 12;
      const interest = Math.round(remaining * monthlyRate);
      const principalComponent = Math.round(m.emiPaid - interest);
      const extra = m.extraPaid || 0;
      remaining = Math.max(0, Math.round(remaining - principalComponent - extra));
      totalPaid += m.emiPaid + extra;
      totalInterest += interest;
      // Update the entry
      m.interestComponent = interest;
      m.principalComponent = principalComponent;
      m.remainingPrincipal = remaining;
      principalFromEmi += principalComponent;
      principalFromExtra += extra;
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid);
    store.summary.totalInterestPaid = Math.round(totalInterest);
    store.summary.monthsCompleted = store.monthlyPayments.length;
    store.summary.principalPaidFromEmi = Math.round(principalFromEmi);
    store.summary.principalPaidFromExtra = Math.round(principalFromExtra);
    if (remaining <= 0) {
      const last = store.monthlyPayments[store.monthlyPayments.length - 1];
      store.summary.forecastedEndDate = last.month;
    }
    await store.save();
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete monthly payment
/**
 * DELETE /api/loan/payments/:month
 * Deletes a monthly payment and recalculates the summary.
 * @param {string} req.params.month - The month of the payment to delete.
 * @returns {Object} Success message.
 */
router.delete('/payments/:month', async (req, res) => {
  try {
    let store = await LoanStore.findOne();
    if (!store) {
      return res.status(404).json({ message: 'No loan store found' });
    }
    const { month } = req.params;

    // Remove the payment
    const initialLength = store.monthlyPayments.length;
    store.monthlyPayments = store.monthlyPayments.filter(m => m.month !== month);
    if (store.monthlyPayments.length === initialLength) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Recalculate all
    let remaining = store.loanSettings.principalAmount;
    let totalPaid = 0;
    let totalInterest = 0;
    let principalFromEmi = 0, principalFromExtra = 0;
    for (const m of store.monthlyPayments) {
      const monthlyRate = store.loanSettings.annualInterestRate / 100 / 12;
      const interest = Math.round(remaining * monthlyRate);
      const principalComponent = Math.round(m.emiPaid - interest);
      const extra = m.extraPaid || 0;
      remaining = Math.max(0, Math.round(remaining - principalComponent - extra));
      totalPaid += m.emiPaid + extra;
      totalInterest += interest;
      // Update the entry
      m.interestComponent = interest;
      m.principalComponent = principalComponent;
      m.remainingPrincipal = remaining;
      principalFromEmi += principalComponent;
      principalFromExtra += extra;
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid);
    store.summary.totalInterestPaid = Math.round(totalInterest);
    store.summary.monthsCompleted = store.monthlyPayments.length;
    store.summary.principalPaidFromEmi = Math.round(principalFromEmi);
    store.summary.principalPaidFromExtra = Math.round(principalFromExtra);
    if (remaining <= 0) {
      const last = store.monthlyPayments[store.monthlyPayments.length - 1];
      store.summary.forecastedEndDate = last.month;
    } else {
      store.summary.forecastedEndDate = null;
    }
    await store.save();
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;