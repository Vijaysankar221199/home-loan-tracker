import { useState, useEffect, useMemo, useCallback } from 'react';
import { ApiService } from '../services/apiService';
import { calculateEmi, generateAmortizationSchedule } from '../utils/loanUtils';
import { LoanStore, LoanSettings, AmortizationEntry } from '../types';

/**
 * Custom hook for managing loan tracker data and operations.
 * @returns An object containing data, loading state, error, and handler functions.
 */
export const useLoanTracker = () => {
  const [data, setData] = useState<LoanStore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(()=>{
    let cancelled=false;
    setLoading(true);
    ApiService.load().then(d=>{ if(!cancelled){
      // ensure EMI
      if(!d.loanSettings.calculatedEmi){
        d.loanSettings.calculatedEmi = calculateEmi(d.loanSettings.principalAmount, d.loanSettings.annualInterestRate, d.loanSettings.tenureYears);
      }
      setData(d);
      setLoading(false);
    }}).catch(e=>{ if(!cancelled){ setError(e instanceof Error ? e : new Error(String(e))); setLoading(false); }});
    return ()=> { cancelled=true; };
  },[]);

  const saveSettings = useCallback(async (settings: Partial<LoanSettings>)=>{
    setLoading(true);
    try{
      const newStore = await ApiService.saveSettings(settings);
      newStore.loanSettings.calculatedEmi = calculateEmi(newStore.loanSettings.principalAmount, newStore.loanSettings.annualInterestRate, newStore.loanSettings.tenureYears);
      newStore.summary.remainingPrincipal = newStore.loanSettings.principalAmount;
      setData(newStore);
    }catch(err){setError(err instanceof Error ? err : new Error(String(err)));}finally{setLoading(false);}    
  },[]);

  const addMonthlyPayment = useCallback(async ({month, emiPaid, extraPaid}:{month:string,emiPaid:number,extraPaid:number})=>{
    if(!data) throw new Error('No data');
    const settings = data.loanSettings;
    const prevRemaining = data.summary.remainingPrincipal ?? settings.principalAmount;

    const monthlyRate = settings.annualInterestRate/100/12;

    // interest on remaining
    const interest = Math.round(prevRemaining * monthlyRate);
    const principalComponent = Math.round(emiPaid - interest);
    const extra = Number(extraPaid)||0;
    let remaining = Math.max(0, Math.round(prevRemaining - principalComponent - extra));

    const entry = {
      month,
      emiPaid: Number(emiPaid),
      extraPaid: Number(extra),
      interestComponent: interest,
      principalComponent: principalComponent + 0,
      remainingPrincipal: remaining
    };

    await ApiService.addMonthlyPayment(entry);
    // reload
    const newStore = await ApiService.load();
    newStore.loanSettings.calculatedEmi = calculateEmi(newStore.loanSettings.principalAmount, newStore.loanSettings.annualInterestRate, newStore.loanSettings.tenureYears);
    setData(newStore);
    return entry;
  },[data]);

  const editMonthlyPayment = useCallback(async ({oldMonth, month, emiPaid, extraPaid}:{oldMonth:string, month:string, emiPaid:number, extraPaid:number})=>{
    const newEntry = {
      month,
      emiPaid: Number(emiPaid),
      extraPaid: Number(extraPaid),
      interestComponent: 0, // dummy
      principalComponent: 0,
      remainingPrincipal: 0
    };
    await ApiService.editMonthlyPayment(oldMonth, newEntry);
    // reload
    const newStore = await ApiService.load();
    newStore.loanSettings.calculatedEmi = calculateEmi(newStore.loanSettings.principalAmount, newStore.loanSettings.annualInterestRate, newStore.loanSettings.tenureYears);
    setData(newStore);
  },[]);

  const deleteMonthlyPayment = useCallback(async (month: string)=>{
    await ApiService.deleteMonthlyPayment(month);
    // reload
    const newStore = await ApiService.load();
    newStore.loanSettings.calculatedEmi = calculateEmi(newStore.loanSettings.principalAmount, newStore.loanSettings.annualInterestRate, newStore.loanSettings.tenureYears);
    setData(newStore);
  },[]);

  const forecast = useMemo(()=>{
    if(!data) return null;
    const settings = data.loanSettings;
    const baseEmi = settings.calculatedEmi || calculateEmi(settings.principalAmount, settings.annualInterestRate, settings.tenureYears);
    // amortize two scenarios
    const baseSchedule = generateAmortizationSchedule(settings.principalAmount, settings.annualInterestRate, settings.tenureYears, baseEmi);
    const base: AmortizationEntry[] = baseSchedule.map(e => ({month: e.monthIndex, interest: e.interestPaid, principal: e.principalPaid, remaining: e.remainingPrincipal}));
    // incorporate extras from payments
    const extrasByMonth: Record<string, number> = {};
    const sortedPayments = [...data.monthlyPayments].sort((a,b)=> a.month.localeCompare(b.month));
    for(let i = 0; i < sortedPayments.length; i++){
      extrasByMonth[`m${i+1}`] = sortedPayments[i].extraPaid;
    }
    const withExtrasSchedule = generateAmortizationSchedule(settings.principalAmount, settings.annualInterestRate, settings.tenureYears, baseEmi, extrasByMonth);
    const withExtras: AmortizationEntry[] = withExtrasSchedule.map(e => ({month: e.monthIndex, interest: e.interestPaid, principal: e.principalPaid, remaining: e.remainingPrincipal}));

    // compute savings
    const monthsSaved = base.length - withExtras.length;
    const interestSaved = base.reduce((s:number,e: AmortizationEntry)=>s+e.interest,0) - withExtras.reduce((s:number,e: AmortizationEntry)=>s+e.interest,0);

    return {
      base,
      withExtras,
      monthsSaved,
      interestSaved: Math.round(interestSaved)
    };
  },[data]);

  return {
    data,
    loading,
    error,
    saveSettings,
    addMonthlyPayment,
    editMonthlyPayment,
    deleteMonthlyPayment,
    forecast
  };
};
