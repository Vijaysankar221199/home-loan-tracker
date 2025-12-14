import React from 'react';
import { StatsCardProps } from '../types';

/**
 * StatsCard component for displaying statistical information.
 * @param title - The title of the stat.
 * @param value - The value to display.
 * @param subtitle - The subtitle for additional context.
 * @param accent - Optional accent color for the card border.
 */
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
