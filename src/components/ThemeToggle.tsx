import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const getIcon = () => {
        return theme === "light" ? "🌙" : "☀️";
    };

    return (
        <button
            onClick={cycleTheme}
            className="theme-toggle"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {getIcon()}
        </button>
    );
};

export default ThemeToggle;
