// Simple JSON-based service that persists data in localStorage.
// Exposes async methods to load and update data.

import { LoanSettings, MonthlyPayment, LoanStore } from '../types';

const initialData: LoanStore = {
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

const STORAGE_KEY = 'loanTrackerData';

/**
 * Loads the loan store data from localStorage.
 * @returns The loaded loan store data.
 */
const loadFromStorage = (): LoanStore => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(initialData));
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return JSON.parse(JSON.stringify(initialData));
  }
};

/**
 * Saves the loan store data to localStorage.
 * @param data - The data to save.
 */
const saveToStorage = (data: LoanStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Simulates a random delay for async operations.
 * @param min - Minimum delay in milliseconds (default 120).
 * @param max - Maximum delay in milliseconds (default 400).
 * @returns A promise that resolves after the delay.
 */
const randomDelay = (min = 120, max = 400) => new Promise(res => setTimeout(res, Math.random() * (max - min) + min));

/**
 * Mock backend service for loan tracker data operations.
 */
export const MockBackend = {
  /**
   * Loads the loan store data.
   * @returns A promise that resolves to the loan store data.
   */
  async load(): Promise<LoanStore> {
    await randomDelay();
    return loadFromStorage();
  },
  /**
   * Saves new loan settings and resets related data.
   * @param newSettings - Partial loan settings to update.
   * @returns A promise that resolves to the updated loan store.
   */
  async saveSettings(newSettings: Partial<LoanSettings>): Promise<LoanStore> {
    await randomDelay();
    const store = loadFromStorage();
    store.loanSettings = { ...store.loanSettings, ...newSettings };
    store.loanSettings.calculatedEmi = null;
    store.summary.remainingPrincipal = store.loanSettings.principalAmount;
    store.monthlyPayments = [];
    store.summary = { ...store.summary, totalPaid:0, totalInterestPaid:0, monthsCompleted:0, forecastedEndDate:null, interestSavedDueToExtra:0, principalPaidFromEmi:0, principalPaidFromExtra:0 };
    saveToStorage(store);
    return store;
  },
  /**
   * Adds or updates a monthly payment entry.
   * @param entry - The monthly payment entry to add or update.
   * @returns A promise that resolves to the added entry.
   */
  async addMonthlyPayment(entry: MonthlyPayment): Promise<MonthlyPayment> {
    await randomDelay();
    const store = loadFromStorage();
    const idx = store.monthlyPayments.findIndex(m => m.month === entry.month);
    if(idx>=0) store.monthlyPayments[idx]=entry; else store.monthlyPayments.push(entry);
    store.monthlyPayments.sort((a,b)=> a.month.localeCompare(b.month));
    let remaining = store.loanSettings.principalAmount;
    let totalPaid=0, totalInterest=0;
    for(const m of store.monthlyPayments){
      remaining = Math.max(0, remaining - m.principalComponent - m.extraPaid);
      totalPaid += m.emiPaid + (m.extraPaid||0);
      totalInterest += m.interestComponent;
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid);
    store.summary.totalInterestPaid = Math.round(totalInterest);
    store.summary.monthsCompleted = store.monthlyPayments.length;
    if(remaining<=0){
      const last = store.monthlyPayments[store.monthlyPayments.length-1];
      store.summary.forecastedEndDate = last.month;
    }
    saveToStorage(store);
    return entry;
  },
  /**
   * Edits a monthly payment entry.
   * @param oldMonth - The month of the entry to edit.
   * @param newEntry - The new entry data.
   * @returns A promise that resolves to the updated entry.
   */
  async editMonthlyPayment(oldMonth: string, newEntry: MonthlyPayment): Promise<MonthlyPayment> {
    await randomDelay();
    const store = loadFromStorage();
    // remove old
    store.monthlyPayments = store.monthlyPayments.filter(m => m.month !== oldMonth);
    // add new
    store.monthlyPayments.push(newEntry);
    store.monthlyPayments.sort((a,b)=> a.month.localeCompare(b.month));
    // recalculate all
    let remaining = store.loanSettings.principalAmount;
    let totalPaid = 0;
    let totalInterest = 0;
    for(const m of store.monthlyPayments){
      const monthlyRate = store.loanSettings.annualInterestRate / 100 / 12;
      const interest = Math.round(remaining * monthlyRate);
      const principalComponent = Math.round(m.emiPaid - interest);
      const extra = m.extraPaid || 0;
      remaining = Math.max(0, Math.round(remaining - principalComponent - extra));
      totalPaid += m.emiPaid + extra;
      totalInterest += interest;
      // update the entry
      m.interestComponent = interest;
      m.principalComponent = principalComponent;
      m.remainingPrincipal = remaining;
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid);
    store.summary.totalInterestPaid = Math.round(totalInterest);
    store.summary.monthsCompleted = store.monthlyPayments.length;
    if(remaining <= 0){
      const last = store.monthlyPayments[store.monthlyPayments.length-1];
      store.summary.forecastedEndDate = last.month;
    }
    saveToStorage(store);
    return newEntry;
  },
  /**
   * Loads the loan store data (alias for load).
   * @returns A promise that resolves to the loan store data.
   */
  async loadFile(): Promise<LoanStore> {
    await randomDelay();
    return loadFromStorage();
  }
};
