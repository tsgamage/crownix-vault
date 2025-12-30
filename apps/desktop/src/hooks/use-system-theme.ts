import { useState, useEffect } from "react";

/**
 * A custom hook to detect the user's system color scheme (dark or light).
 * @returns {string} The current system theme ('dark' or 'light').
 */
const useSystemTheme = (): "dark" | "light" => {
  const getSystemTheme = (): "dark" | "light" => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(getSystemTheme());

  useEffect(() => {
    // Check for browser support
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Handler function to update the theme state when the system setting changes
      const handleChange = (event: MediaQueryListEvent) => {
        setSystemTheme(event.matches ? "dark" : "light");
      };

      // Add the event listener for changes
      mediaQuery.addEventListener("change", handleChange);

      // Clean up the event listener on component unmount
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, []);

  return systemTheme;
};

export default useSystemTheme;
