// Simple in-memory JSON service that acts as single source of truth.
// Exposes async methods to load and update data.

type LoanSettings = {
  principalAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  calculatedEmi: number | null;
};

type MonthlyPayment = {
  month: string;
  emiPaid: number;
  extraPaid: number;
  interestComponent: number;
  principalComponent: number;
  remainingPrincipal: number;
};

type SummaryStats = {
  totalPaid: number;
  totalInterestPaid: number;
  remainingPrincipal: number;
  monthsCompleted: number;
  forecastedEndDate: string | null;
  interestSavedDueToExtra: number;
};

type Store = {
  loanSettings: LoanSettings;
  monthlyPayments: MonthlyPayment[];
  summary: SummaryStats;
};

const initialData: Store = {
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

let store: Store = JSON.parse(JSON.stringify(initialData));

const randomDelay = (min=120, max=400) => new Promise(res => setTimeout(res, Math.random()*(max-min)+min));

export const MockBackend = {
  async load(): Promise<Store> {
    await randomDelay();
    return JSON.parse(JSON.stringify(store));
  },
  async saveSettings(newSettings: Partial<LoanSettings>): Promise<Store> {
    await randomDelay();
    store.loanSettings = { ...store.loanSettings, ...newSettings };
    store.loanSettings.calculatedEmi = null;
    store.summary.remainingPrincipal = store.loanSettings.principalAmount;
    store.monthlyPayments = [];
    store.summary = { ...store.summary, totalPaid:0, totalInterestPaid:0, monthsCompleted:0, forecastedEndDate:null, interestSavedDueToExtra:0 };
    return JSON.parse(JSON.stringify(store));
  },
  async addMonthlyPayment(entry: MonthlyPayment): Promise<MonthlyPayment> {
    await randomDelay();
    const idx = store.monthlyPayments.findIndex(m => m.month === entry.month);
    if(idx>=0) store.monthlyPayments[idx]=entry; else store.monthlyPayments.push(entry);
    store.monthlyPayments.sort((a,b)=> a.month.localeCompare(b.month));
    let remaining = store.loanSettings.principalAmount;
    let totalPaid=0, totalInterest=0;
    for(const m of store.monthlyPayments){
      remaining = Math.max(0, remaining - m.principalComponent);
      totalPaid += m.emiPaid + (m.extraPaid||0);
      totalInterest += m.interestComponent;
    }
    store.summary.remainingPrincipal = remaining;
    store.summary.totalPaid = Math.round(totalPaid*100)/100;
    store.summary.totalInterestPaid = Math.round(totalInterest*100)/100;
    store.summary.monthsCompleted = store.monthlyPayments.length;
    if(remaining<=0){
      const last = store.monthlyPayments[store.monthlyPayments.length-1];
      store.summary.forecastedEndDate = last.month;
    }
    return JSON.parse(JSON.stringify(entry));
  },
  async loadFile(): Promise<Store> {
    await randomDelay();
    return JSON.parse(JSON.stringify(initialData));
  }
};
