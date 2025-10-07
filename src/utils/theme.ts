/**
 * Gets the initial theme from localStorage or prompts the user.
 * @returns {'dark' | 'light'}
 */

import { THEME_KEY, DARK, LIGHT } from "@utils/constants";

export const getInitialTheme = (): "dark" | "light" => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === DARK || stored === LIGHT) return stored;
  const userPref = window.confirm("Use dark theme? OK = dark, Cancel = light.");
  const theme = userPref ? DARK : LIGHT;
  localStorage.setItem(THEME_KEY, theme);
  return theme;
};
