"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const shouldBeDark = savedTheme === "dark";

    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("darkMode", newIsDark ? "dark" : "light");

    document.documentElement.classList.toggle("dark");
  };

  return (
    <button className="cursor-pointer mx-3" onClick={toggleDarkMode}>
      {isDark ? <Moon /> : <Sun />}
    </button>
  );
}
