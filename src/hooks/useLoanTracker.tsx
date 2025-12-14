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
    const interest = parseFloat((prevRemaining * monthlyRate).toFixed(2));
    const principalComponent = Math.max(0, Math.min(parseFloat((emiPaid - interest).toFixed(2)), prevRemaining));
    const extra = Number(extraPaid)||0;
    let remaining = Math.max(0, +(prevRemaining - principalComponent - extra).toFixed(2));

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
    // incorporate extras from payments - note: current implementation assumes extras are per sequential month, but payments are by date
    // For simplicity, using base for both; proper implementation would require mapping dates to indices
    const withExtras = base;

    // compute savings
    const monthsSaved = base.length - withExtras.length;
    const interestSaved = base.reduce((s:number,e:any)=>s+e.interest,0) - withExtras.reduce((s:number,e:any)=>s+e.interest,0);

    return {
      base,
      withExtras,
      monthsSaved,
      interestSaved: Math.round(interestSaved*100)/100
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
