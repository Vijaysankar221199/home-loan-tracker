/**
 * Calculates the Equated Monthly Installment (EMI) using the standard formula.
 * @param principal - The loan principal amount
 * @param annualInterestRate - The annual interest rate in percentage
 * @param tenureYears - The loan tenure in years
 * @returns The EMI amount rounded to 2 decimal places
 */
export const calculateEmi = (principal: number, annualInterestRate: number, tenureYears: number): number => {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    return Math.round(principal / numberOfMonths);
  }

  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
  return Math.round(emi);
};

/**
 * Calculates the amortization for a single month.
 * @param remainingPrincipal - The remaining principal at the start of the month
 * @param emi - The fixed EMI amount
 * @param annualInterestRate - The annual interest rate in percentage
 * @param extraPayment - The extra payment made this month
 * @returns An object containing the month's amortization details
 */
export const calculateMonthlyAmortization = (
  remainingPrincipal: number,
  emi: number,
  annualInterestRate: number,
  extraPayment: number
): {
  interestForMonth: number;
  principalFromEmi: number;
  extraPaid: number;
  totalPrincipalReduction: number;
  newRemainingPrincipal: number;
} => {
  const monthlyRate = annualInterestRate / 100 / 12;

  // Calculate interest for the month on remaining principal
  const interestForMonth = Math.round(remainingPrincipal * monthlyRate);

  // Principal component from EMI
  const principalFromEmi = Math.round(emi - interestForMonth);

  // Extra payment
  const extraPaid = extraPayment;

  // Total principal reduction
  const totalPrincipalReduction = principalFromEmi + extraPaid;

  // New remaining principal, ensuring it doesn't go negative
  const newRemainingPrincipal = Math.max(0, remainingPrincipal - totalPrincipalReduction);

  return {
    interestForMonth,
    principalFromEmi,
    extraPaid,
    totalPrincipalReduction,
    newRemainingPrincipal
  };
};

/**
 * Generates the full amortization schedule for the loan.
 * @param principal - The initial loan principal
 * @param annualInterestRate - The annual interest rate in percentage
 * @param tenureYears - The loan tenure in years
 * @param emi - The fixed EMI amount
 * @param extrasByMonth - Optional record of extra payments by month (e.g., { 'm1': 1000 })
 * @returns An array of monthly amortization details
 */
export const generateAmortizationSchedule = (
  principal: number,
  annualInterestRate: number,
  tenureYears: number,
  emi: number,
  extrasByMonth?: Record<string, number>
): Array<{
  monthIndex: number;
  interestPaid: number;
  principalPaid: number;
  extraPaid: number;
  remainingPrincipal: number;
}> => {
  const schedule: Array<{
    monthIndex: number;
    interestPaid: number;
    principalPaid: number;
    extraPaid: number;
    remainingPrincipal: number;
  }> = [];

  let remainingPrincipal = principal;
  let monthIndex = 0;

  while (remainingPrincipal > 0 && monthIndex < tenureYears * 12 * 2) { // Safety limit
    monthIndex++;

    const extraPayment = extrasByMonth ? (extrasByMonth[`m${monthIndex}`] || 0) : 0;

    const amortization = calculateMonthlyAmortization(
      remainingPrincipal,
      emi,
      annualInterestRate,
      extraPayment
    );

    schedule.push({
      monthIndex,
      interestPaid: amortization.interestForMonth,
      principalPaid: amortization.principalFromEmi,
      extraPaid: amortization.extraPaid,
      remainingPrincipal: amortization.newRemainingPrincipal
    });

    remainingPrincipal = amortization.newRemainingPrincipal;
  }

  return schedule;
};

export const formatYYYYMM = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};
