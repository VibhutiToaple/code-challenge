import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { DARK, LIGHT, APP_THEME } from "@utils/constants";

import { ThemeMode, ThemeContextType, ThemeProviderProps } from "../types/types";
import "../../styles/theme.less";

const ThemeContext = createContext<ThemeContextType>({
  theme: LIGHT,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // 1️⃣ Try stored preference
    const stored = localStorage.getItem(APP_THEME);
    if (stored === DARK || stored === LIGHT) return stored as ThemeMode;

    // 2️⃣ Default to system theme
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === LIGHT ? DARK : LIGHT;
      localStorage.setItem(APP_THEME, newTheme);
      return newTheme;
    });
  };

  // Apply theme classes to <body>
  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Ant Design algorithm setup
  const antdAlgorithm = theme === DARK ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: antdAlgorithm,
          token: {
            colorPrimary: theme === DARK ? "#81C784" : "#4CAF50",
            colorBgBase: theme === DARK ? "#222" : "#F5F5F5",
            colorTextBase: theme === DARK ? "#F5F5F5" : "#333",
          },
        }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
