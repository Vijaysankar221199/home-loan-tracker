// Loan-related types

/**
 * Represents the settings for a loan calculation.
 */
export interface LoanSettings {
  /** The principal amount of the loan. */
  principalAmount: number;
  /** The annual interest rate in percentage. */
  annualInterestRate: number;
  /** The tenure of the loan in years. */
  tenureYears: number;
  /** The calculated Equated Monthly Installment (EMI), or null if not calculated. */
  calculatedEmi: number | null;
}

/**
 * Represents a monthly payment entry.
 */
export interface MonthlyPayment {
  /** The month in YYYY-MM format. */
  month: string;
  /** The EMI amount paid for the month. */
  emiPaid: number;
  /** The extra payment made for the month. */
  extraPaid: number;
  /** The interest component of the payment. */
  interestComponent: number;
  /** The principal component of the payment. */
  principalComponent: number;
  /** The remaining principal after the payment. */
  remainingPrincipal: number;
}

/**
 * Represents the summary statistics of the loan.
 */
export interface SummaryStats {
  /** The total amount paid so far. */
  totalPaid: number;
  /** The total interest paid so far. */
  totalInterestPaid: number;
  /** The remaining principal amount. */
  remainingPrincipal: number;
  /** The number of months completed. */
  monthsCompleted: number;
  /** The forecasted end date of the loan, or null if not applicable. */
  forecastedEndDate: string | null;
  /** The interest saved due to extra payments. */
  interestSavedDueToExtra: number;
}

/**
 * Represents the entire loan store data.
 */
export interface LoanStore {
  /** The loan settings. */
  loanSettings: LoanSettings;
  /** The list of monthly payments. */
  monthlyPayments: MonthlyPayment[];
  /** The summary statistics. */
  summary: SummaryStats;
}

// Component prop types

/**
 * Props for the PaymentForm component.
 */
export interface PaymentFormProps {
  /** The default EMI value to display. */
  defaultEmi: number;
  /** Callback function to handle form submission. */
  onSubmit: (entry: { month: string; emiPaid: number; extraPaid: number }) => void;
}

/**
 * Props for the SettingsModal component.
 */
export interface SettingsModalProps {
  /** Whether the modal is visible. */
  visible: boolean;
  /** Callback to close the modal. */
  onClose: () => void;
  /** The current loan settings, or null if not available. */
  settings: LoanSettings | null;
  /** Callback to save the updated settings. */
  onSave: (settings: LoanSettings) => void;
}

/**
 * Props for the EditPayments component.
 */
export interface EditPaymentsProps {
  /** The list of monthly payments to edit. */
  payments: MonthlyPayment[];
  /** Callback to handle editing a payment. */
  onEdit: (data: { oldMonth: string; month: string; emiPaid: number; extraPaid: number }) => Promise<void>;
}

/**
 * Props for the Charts component.
 */
export interface ChartsProps {
  /** The list of monthly payments for charting. */
  payments: MonthlyPayment[];
}

/**
 * Props for the StatsCard component.
 */
export interface StatsCardProps {
  /** The title of the stat card. */
  title: string;
  /** The value to display. */
  value: string;
  /** The subtitle for the stat. */
  subtitle: string;
  /** Optional accent color for the card. */
  accent?: string;
}

/**
 * Props for the Header component.
 */
export interface HeaderProps {
  /** Callback to open the settings modal. */
  onOpenSettings: () => void;
}

/**
 * Represents an entry in the amortization schedule.
 */
export interface AmortizationEntry {
  /** The month number. */
  month: number;
  /** The interest paid in this month. */
  interest: number;
  /** The principal paid in this month. */
  principal: number;
  /** The remaining principal after this month. */
  remaining: number;
}

/**
 * Type for the theme context.
 */
export interface ThemeContextType {
  /** The current theme, either 'light' or 'dark'. */
  theme: 'light' | 'dark';
  /** Function to toggle the theme. */
  toggleTheme: () => void;
}
