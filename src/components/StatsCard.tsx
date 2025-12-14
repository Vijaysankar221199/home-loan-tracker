import React from 'react';
import { StatsCardProps } from '../types';

const StatsCard: React.FC<StatsCardProps> = ({title, value, subtitle, accent}) => {
  return (
    <div className="card stat hov" style={{borderLeft:`4px solid ${accent||'transparent'}`}}>
      <div className="small">{title}</div>
      <div className="large">{value}</div>
      <div className="small" style={{color:'var(--muted)'}}>{subtitle}</div>
    </div>
  );
};

export default StatsCard;
