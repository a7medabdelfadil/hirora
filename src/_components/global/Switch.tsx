import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

interface SwitchProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Switch: React.FC<SwitchProps> = ({ theme, setTheme }) => {
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    setTheme(isDark ? "dark" : "light");
  }, [isDark, setTheme]);

  return (
    <label dir="ltr" className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
      />
      <div
        className={`w-20 h-10 rounded-full transition-colors duration-200 flex items-center justify-between px-2 bg-bgSecondary`}
      >
        <FiSun
          size={18}
          className={` ${
            isDark ? "text-textSecondary" : "text-textPrimary"
          }`}
        />
        <FiMoon
          size={18}
          className={`transition-colors ${
            isDark ? "text-textSecondary" : "text-textPrimary"
          }`}
        />
        <div
          className={`absolute top-1 left-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
            isDark
              ? "translate-x-10 bg-black text-textPrimary"
              : "translate-x-0 bg-white text-textPrimary"
          }`}
        >
          {isDark ? <FiMoon size={18} /> : <FiSun size={18} />}
        </div>
      </div>
    </label>
  );
};

export default Switch;
