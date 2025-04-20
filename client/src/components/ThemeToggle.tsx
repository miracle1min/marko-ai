import { useState, useEffect } from "react";
import { Moon } from "lucide-react";

type Theme = "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Always set dark mode as default
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add('dark');
  }, []);

  // Theme is always dark, no toggle functionality needed
  const toggleTheme = (_newTheme: Theme) => {
    // Dark mode is always active
    localStorage.setItem("theme", "dark");
    setTheme("dark");
    document.documentElement.classList.add('dark');
  };

  return (
    <div>
      <Moon className="h-5 w-5 text-blue-400" />
    </div>
  );
}