import React, { useState, useEffect } from 'react';
import { SettingsModalProps } from '../types';

/**
 * SettingsModal component for editing loan settings.
 * @param visible - Whether the modal is visible.
 * @param onClose - Callback to close the modal.
 * @param settings - The current loan settings.
 * @param onSave - Callback to save the updated settings.
 */
const SettingsModal: React.FC<SettingsModalProps> = ({visible, onClose, settings, onSave}) => {
  const [form, setForm] = useState({principalAmount:'', annualInterestRate:'', tenureYears:''});
  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        principalAmount: settings.principalAmount.toString(),
        annualInterestRate: settings.annualInterestRate.toString(),
        tenureYears: settings.tenureYears.toString()
      });
    }
  }, [settings]);
  if(!visible) return null;

  /**
   * Updates the form state for a given key.
   * @param k - The key to update.
   * @param v - The new value.
   */
  const update = (k:string,v:string)=> setForm(f=>({...f,[k]:v}));

  /**
   * Handles form submission.
   */
  const submit = ()=>{
    const p = Number(form.principalAmount);
    const r = Number(form.annualInterestRate);
    const t = Number(form.tenureYears);
    if(!p || p<=0) return alert('Principal must be >0');
    if(!r || r<=0) return alert('Interest rate >0');
    if(!t || t<=0) return alert('Tenure >0');
    onSave({principalAmount:p, annualInterestRate:r, tenureYears:t, calculatedEmi: null});
    onClose();
  };
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.35)'}}>
      <div className="card" style={{width:420}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Loan Settings</div>
          <div style={{color:'var(--muted)'}}>{settings && `EMI: ${settings.calculatedEmi||'...'}`}</div>
        </div>
        <div style={{marginTop:12}}>
          <div className="label">Principal Amount</div>
          <input className="input" type="number" min="0" value={form.principalAmount} onChange={e=>update('principalAmount', e.target.value)} />
          <div className="label">Annual Interest Rate (%)</div>
          <input className="input" type="number" min="0" step="0.01" value={form.annualInterestRate} onChange={e=>update('annualInterestRate', e.target.value)} />
          <div className="label">Tenure (years)</div>
          <input className="input" type="number" min="1" value={form.tenureYears} onChange={e=>update('tenureYears', e.target.value)} />
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button className="button" onClick={onClose}>Cancel</button>
          <button className="button" onClick={submit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
