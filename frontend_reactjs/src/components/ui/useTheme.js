import { useEffect, useMemo, useState } from "react";

const THEME_KEY = "msm.theme.v1";

function getInitialTheme() {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  // Prefer OS if never set
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Hook to manage light/dark theme and persist preference. */
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // Apply to <html> so CSS variables can scope properly.
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const api = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return api;
}
