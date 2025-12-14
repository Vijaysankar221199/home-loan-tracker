import React, { useContext } from 'react';
import { ThemeContext } from '../themes/themeContext';

const Header: React.FC<{onOpenSettings: () => void}> = ({ onOpenSettings }) => {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <div className="header">
      <div className="brand">
        <div className="logo">HL</div>
        <div>
          <div style={{fontWeight:700}}>Home Loan Tracker</div>
          <div className="small">Track, forecast & optimize your mortgage</div>
        </div>
      </div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <button className="button" onClick={onOpenSettings}>Settings</button>
        <button className="button" onClick={toggle}>{theme==='light'?'Dark':'Light'} Mode</button>
      </div>
    </div>
  );
};

export default Header;
