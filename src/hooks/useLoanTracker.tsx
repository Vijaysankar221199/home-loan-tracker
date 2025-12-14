import { useState, useEffect, useMemo, useCallback } from 'react';
import { MockBackend } from '../services/mockBackend';
import { calculateEmi, generateAmortizationSchedule, formatYYYYMM } from '../utils/loanUtils';

export const useLoanTracker = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(()=>{
    let cancelled=false;
    setLoading(true);
    MockBackend.load().then(d=>{ if(!cancelled){
      // ensure EMI
      if(!d.loanSettings.calculatedEmi){
        d.loanSettings.calculatedEmi = calculateEmi(d.loanSettings.principalAmount, d.loanSettings.annualInterestRate, d.loanSettings.tenureYears);
      }
      setData(d);
      setLoading(false);
    }}).catch(e=>{ if(!cancelled){ setError(e); setLoading(false); }});
    return ()=> { cancelled=true; };
  },[]);

  const saveSettings = useCallback(async (settings:any)=>{
    setLoading(true);
    try{
      const newStore = await MockBackend.saveSettings(settings);
      newStore.loanSettings.calculatedEmi = calculateEmi(newStore.loanSettings.principalAmount, newStore.loanSettings.annualInterestRate, newStore.loanSettings.tenureYears);
      newStore.summary.remainingPrincipal = newStore.loanSettings.principalAmount;
      setData(newStore);
    }catch(err){setError(err);}finally{setLoading(false);}    
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

    await MockBackend.addMonthlyPayment(entry);
    // reload
    const newStore = await MockBackend.load();
    newStore.loanSettings.calculatedEmi = calculateEmi(newStore.loanSettings.principalAmount, newStore.loanSettings.annualInterestRate, newStore.loanSettings.tenureYears);
    setData(newStore);
    return entry;
  },[data]);

  const forecast = useMemo(()=>{
    if(!data) return null;
    const settings = data.loanSettings;
    const baseEmi = settings.calculatedEmi || calculateEmi(settings.principalAmount, settings.annualInterestRate, settings.tenureYears);
    // amortize two scenarios
    const baseSchedule = generateAmortizationSchedule(settings.principalAmount, settings.annualInterestRate, settings.tenureYears, baseEmi);
    const base = baseSchedule.map(e => ({month: e.monthIndex, interest: e.interestPaid, principal: e.principalPaid, remaining: e.remainingPrincipal}));
    // incorporate extras from payments
    const extrasByMonth: Record<string, number> = {};
    const sortedPayments = [...data.monthlyPayments].sort((a,b)=> a.month.localeCompare(b.month));
    for(let i = 0; i < sortedPayments.length; i++){
      extrasByMonth[`m${i+1}`] = sortedPayments[i].extraPaid;
    }
    const withExtrasSchedule = generateAmortizationSchedule(settings.principalAmount, settings.annualInterestRate, settings.tenureYears, baseEmi, extrasByMonth);
    const withExtras = withExtrasSchedule.map(e => ({month: e.monthIndex, interest: e.interestPaid, principal: e.principalPaid, remaining: e.remainingPrincipal}));

    // compute savings
    const monthsSaved = base.length - withExtras.length;
    const interestSaved = base.reduce((s:number,e:any)=>s+e.interest,0) - withExtras.reduce((s:number,e:any)=>s+e.interest,0);

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
    forecast
  };
};
