import React, { createContext, useState, useMemo, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggle: () => {} });

export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({ theme, toggle }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} style={{transition:'background 300ms ease'}}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
