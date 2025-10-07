import { useState, useEffect } from "react";
import { getInitialTheme } from "@utils/theme";
import { THEME_KEY, DARK, LIGHT } from "@utils/constants";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === DARK ? LIGHT : DARK;
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  return { theme, toggleTheme };
}
