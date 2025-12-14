import React, { useState, useEffect } from 'react';

interface Settings {
  principalAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  calculatedEmi?: number;
}

const SettingsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  settings: Settings | null;
  onSave: (settings: Settings) => void;
}> = ({visible, onClose, settings, onSave}) => {
  const [form, setForm] = useState({principalAmount:'', annualInterestRate:'', tenureYears:''});
  useEffect(()=>{ if(settings){ setForm({ principalAmount:settings.principalAmount, annualInterestRate:settings.annualInterestRate, tenureYears:settings.tenureYears }); } },[settings]);
  if(!visible) return null;
  const update = (k:string,v:string)=> setForm(f=>({...f,[k]:v}));
  const submit = ()=>{
    const p = Number(form.principalAmount);
    const r = Number(form.annualInterestRate);
    const t = Number(form.tenureYears);
    if(!p || p<=0) return alert('Principal must be >0');
    if(!r || r<=0) return alert('Interest rate >0');
    if(!t || t<=0) return alert('Tenure >0');
    onSave({principalAmount:p, annualInterestRate:r, tenureYears:t});
    onClose();
  };
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.35)'}}>
      <div className="card" style={{width:420}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Loan Settings</div>
          <div style={{color:'var(--muted)'}}>{settings && `EMI: ${settings.calculatedEmi?.toFixed(2)||'...'}`}</div>
        </div>
        <div style={{marginTop:12}}>
          <div className="label">Principal Amount</div>
          <input className="input" value={form.principalAmount} onChange={e=>update('principalAmount', e.target.value)} />
          <div className="label">Annual Interest Rate (%)</div>
          <input className="input" value={form.annualInterestRate} onChange={e=>update('annualInterestRate', e.target.value)} />
          <div className="label">Tenure (years)</div>
          <input className="input" value={form.tenureYears} onChange={e=>update('tenureYears', e.target.value)} />
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button className="button ghost" onClick={onClose}>Cancel</button>
          <button className="button" onClick={submit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
