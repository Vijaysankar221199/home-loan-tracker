import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from '../themes/themeContext';
import { ChartsProps } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const Charts: React.FC<ChartsProps> = ({payments}) => {
  const { theme } = useContext(ThemeContext);
  const colors = theme==='light' ? {
    primary:'#2563eb', accent:'#60a5fa', bg:'#fff', text:'#111827'
  } : { primary:'#60a5fa', accent:'#2563eb', bg:'#0f1724', text:'#e6eef8' };
  // prepare datasets
  const labels = payments.map(p=>p.month);
  const emi = payments.map(p=>p.emiPaid);
  const extra = payments.map(p=>p.extraPaid||0);

  return (
    <div style={{display:'grid'}}>
      <div className="card">
        <div style={{fontWeight:700,marginBottom:8}}>EMI vs Extra</div>
        <Bar data={{labels, datasets:[{label:'EMI',data:emi, backgroundColor:colors.primary},{label:'Extra',data:extra, backgroundColor:colors.accent}]}} options={{plugins:{legend:{position:'bottom'}},scales:{y:{beginAtZero:true}}}} />
      </div>
    </div>
  );
};

export default Charts;
