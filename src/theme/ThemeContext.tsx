import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, ThemeConfig } from 'antd';
import { darkThemeConfig, lightThemeConfig } from './themeConfig';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  isDarkMode: boolean;
  isDark: boolean;
  theme: ThemeMode;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  isDark: true,
  theme: 'dark',
  themeMode: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark',
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app_theme') as ThemeMode;
    return saved === 'light' || saved === 'dark' ? saved : defaultTheme;
  });

  const isDarkMode = themeMode === 'dark';

  useEffect(() => {
    localStorage.setItem('app_theme', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [themeMode, isDarkMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const currentThemeConfig: ThemeConfig = isDarkMode ? darkThemeConfig : lightThemeConfig;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        isDark: isDarkMode,
        theme: themeMode,
        themeMode,
        toggleTheme,
        setTheme,
      }}
    >
      <ConfigProvider theme={currentThemeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
