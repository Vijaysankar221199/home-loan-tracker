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
    interestSavedDueToExtra: 0
  }
};

// Get loan store
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

// Update settings
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
    store.summary = { ...store.summary, totalPaid: 0, totalInterestPaid: 0, monthsCompleted: 0, forecastedEndDate: null, interestSavedDueToExtra: 0 };
    await store.save();
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add monthly payment
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
    for (const m of store.monthlyPayments) {
      remaining = Math.max(0, remaining - m.principalComponent - m.extraPaid);
      totalPaid += m.emiPaid + (m.extraPaid || 0);
      totalInterest += m.interestComponent;
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid);
    store.summary.totalInterestPaid = Math.round(totalInterest);
    store.summary.monthsCompleted = store.monthlyPayments.length;
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

// Edit monthly payment
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
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid);
    store.summary.totalInterestPaid = Math.round(totalInterest);
    store.summary.monthsCompleted = store.monthlyPayments.length;
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

module.exports = router;