import React, { useContext } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from '../themes/themeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const Charts: React.FC<{payments:any[],forecast:any}> = ({payments, forecast}) => {
  const { theme } = useContext(ThemeContext);
  const colors = theme==='light' ? {
    primary:'#2563eb', accent:'#60a5fa', bg:'#fff', text:'#111827'
  } : { primary:'#60a5fa', accent:'#2563eb', bg:'#0f1724', text:'#e6eef8' };
  // prepare datasets
  const labels = payments.map(p=>p.month);
  const remaining = payments.map(p=>p.remainingPrincipal);
  const emi = payments.map(p=>p.emiPaid);
  const extra = payments.map(p=>p.extraPaid||0);
  const pieLabels = ['Principal paid','Interest paid'];
  const principalPaid = payments.reduce((s,p)=>s+(p.principalComponent||0),0);
  const interestPaid = payments.reduce((s,p)=>s+(p.interestComponent||0),0);

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
      <div className="card">
        <div style={{fontWeight:700,marginBottom:8}}>Remaining Principal</div>
        <Line data={{labels, datasets:[{label:'Remaining',data:remaining, borderColor:colors.primary, backgroundColor:colors.accent, tension:0.3}]}} options={{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true},x:{ticks:{color:colors.text}}}}} />
      </div>
      <div className="card">
        <div style={{fontWeight:700,marginBottom:8}}>EMI vs Extra</div>
        <Bar data={{labels, datasets:[{label:'EMI',data:emi, backgroundColor:colors.primary},{label:'Extra',data:extra, backgroundColor:colors.accent}]}} options={{plugins:{legend:{position:'bottom'}},scales:{y:{beginAtZero:true}}}} />
      </div>
      <div className="card" style={{gridColumn:'1/-1'}}>
        <div style={{fontWeight:700,marginBottom:8}}>Principal vs Interest Paid</div>
        <Pie data={{labels:pieLabels, datasets:[{data:[principalPaid, interestPaid], backgroundColor:[colors.primary, colors.accent]}]}} />
      </div>
    </div>
  );
};

export default Charts;
