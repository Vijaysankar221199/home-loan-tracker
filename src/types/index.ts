// Loan-related types
export interface LoanSettings {
  principalAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  calculatedEmi: number | null;
}

export interface MonthlyPayment {
  month: string;
  emiPaid: number;
  extraPaid: number;
  interestComponent: number;
  principalComponent: number;
  remainingPrincipal: number;
}

export interface SummaryStats {
  totalPaid: number;
  totalInterestPaid: number;
  remainingPrincipal: number;
  monthsCompleted: number;
  forecastedEndDate: string | null;
  interestSavedDueToExtra: number;
}

export interface LoanStore {
  loanSettings: LoanSettings;
  monthlyPayments: MonthlyPayment[];
  summary: SummaryStats;
}

// Component prop types
export interface PaymentFormProps {
  defaultEmi: number;
  onSubmit: (entry: { month: string; emiPaid: number; extraPaid: number }) => void;
}

export interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: LoanSettings | null;
  onSave: (settings: LoanSettings) => void;
}

export interface EditPaymentsProps {
  payments: MonthlyPayment[];
  onEdit: (data: { oldMonth: string; month: string; emiPaid: number; extraPaid: number }) => Promise<void>;
}

export interface ChartsProps {
  payments: MonthlyPayment[];
}

export interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  accent?: string;
}

export interface HeaderProps {
  onOpenSettings: () => void;
}

export interface AmortizationEntry {
  month: number;
  interest: number;
  principal: number;
  remaining: number;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
