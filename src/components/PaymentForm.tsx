import React, { useState, useEffect } from 'react';
import { formatYYYYMM } from '../utils/loanUtils';

const PaymentForm: React.FC<{defaultEmi:number,onSubmit:(entry:{month:string,emiPaid:number,extraPaid:number})=>void}> = ({defaultEmi, onSubmit}) => {
  const now = new Date();
  const [month, setMonth] = useState(formatYYYYMM(now));
  const [emi, setEmi] = useState(defaultEmi||0);
  const [extra, setExtra] = useState(0);

  useEffect(()=> setEmi(defaultEmi||0), [defaultEmi]);

  const submit = ()=>{
    const e = Number(emi);
    const ex = Number(extra)||0;
    if(!e || e<=0) return alert('EMI must be >0');
    onSubmit({month, emiPaid:e, extraPaid:ex});
    setExtra(0);
  };

  return (
    <div className="card">
      <div style={{fontWeight:700}}>Record Monthly Payment</div>
      <div style={{marginTop:10}}>
        <div className="label">Month (YYYY-MM)</div>
        <input className="input" type="month" value={month} onChange={e=>setMonth(e.target.value)} />
        <div className="label">EMI</div>
        <input className="input" type="number" min="0" value={emi} onChange={e=>setEmi(Number(e.target.value))} />
        <div className="label">Extra Payment (optional)</div>
        <input className="input" type="number" min="0" value={extra} onChange={e=>setExtra(Number(e.target.value))} />
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
        <button className="button" onClick={submit}>Submit Payment</button>
      </div>
    </div>
  );
};

export default PaymentForm;
