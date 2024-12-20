/*
 * @Author: "Zhipeng "zhipengmail@qq.com"
 * @Date: 2024-12-20 10:04:43
 * @LastEditors: “Zhipeng “zhipengmail@qq.com”
 * @LastEditTime: 2024-12-20 10:29:01
 * @FilePath: /django-react-website/frontend/src/hooks/useTheme.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

interface StoredTheme {
  value: Theme;
  expiry: number;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) {
      const storedTheme: StoredTheme = JSON.parse(stored);
      if (storedTheme.expiry > Date.now()) {
        return storedTheme.value;
      }
      localStorage.removeItem('theme'); // Clear expired theme
    }

    // Fall back to time-based default
    const hour = new Date().getHours();
    const isNightTime = hour >= 18 || hour < 6;
    return isNightTime ? "dark" : "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      // Store theme with 2-hour expiration
      const twoHours = 2 * 60 * 60 * 1000;
      localStorage.setItem('theme', JSON.stringify({
        value: newTheme,
        expiry: Date.now() + twoHours
      }));
      return newTheme;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return React.createElement(ThemeContext.Provider, 
    { value: { theme, toggleTheme } },
    children
  );
}; 