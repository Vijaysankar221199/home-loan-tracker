import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { ThemeContextType } from '../types';

/**
 * Context for theme management.
 */
export const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });

/**
 * Provider component for theme context.
 * @param children - The child components to render.
 */
export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} style={{transition:'background 300ms ease'}}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
