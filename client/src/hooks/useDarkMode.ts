import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preference");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
    setIsLoaded(true);
  }, []);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  const toggleDarkMode = () => {
    const newState = !isDark;
    setIsDark(newState);
    localStorage.setItem("theme-preference", newState ? "dark" : "light");
    applyTheme(newState);
  };

  return {
    isDark,
    toggleDarkMode,
    isLoaded,
  };
};
