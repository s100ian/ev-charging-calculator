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
            style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.5rem",
                lineHeight: 1,
            }}
        >
            {getIcon()}
        </button>
    );
};

export default ThemeToggle;
