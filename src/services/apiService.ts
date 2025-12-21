// API service for loan tracker backend
import { LoanSettings, MonthlyPayment, LoanStore } from '../types';

const API_BASE = 'http://localhost:5000/api/loan';

/**
 * API service for loan tracker data operations.
 */
export const ApiService = {
  /**
   * Loads the loan store data.
   * @returns A promise that resolves to the loan store data.
   */
  async load(): Promise<LoanStore> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to load data');
    return response.json();
  },
  /**
   * Saves new loan settings and resets related data.
   * @param newSettings - Partial loan settings to update.
   * @returns A promise that resolves to the updated loan store.
   */
  async saveSettings(newSettings: Partial<LoanSettings>): Promise<LoanStore> {
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (!response.ok) throw new Error('Failed to save settings');
    return response.json();
  },
  /**
   * Adds or updates a monthly payment entry.
   * @param entry - The monthly payment entry to add or update.
   * @returns A promise that resolves to the added entry.
   */
  async addMonthlyPayment(entry: MonthlyPayment): Promise<MonthlyPayment> {
    const response = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!response.ok) throw new Error('Failed to add payment');
    return response.json();
  },
  /**
   * Edits a monthly payment entry.
   * @param oldMonth - The month of the entry to edit.
   * @param newEntry - The new entry data.
   * @returns A promise that resolves to the updated entry.
   */
  async editMonthlyPayment(oldMonth: string, newEntry: MonthlyPayment): Promise<MonthlyPayment> {
    const response = await fetch(`${API_BASE}/payments/${oldMonth}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    });
    if (!response.ok) throw new Error('Failed to edit payment');
    return response.json();
  }
};