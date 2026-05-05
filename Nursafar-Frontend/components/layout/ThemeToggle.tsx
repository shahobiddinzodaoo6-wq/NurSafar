"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  scrolled?: boolean;
}

export function ThemeToggle({ scrolled = true }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`relative h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
        !scrolled
          ? "text-white hover:bg-white/10"
          : "hover:bg-accent text-foreground"
      }`}
    >
      <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
      <Moon className="h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
    </motion.button>
  );
}
