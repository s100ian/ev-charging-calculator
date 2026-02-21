import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const storedTheme = localStorage.getItem("theme");
            if (storedTheme === "light" || storedTheme === "dark") {
                return storedTheme;
            }
        } catch {
            // localStorage unavailable (incognito, quota exceeded, disabled)
        }
        // Default to OS preference if no stored theme
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch {
            // localStorage unavailable (incognito, quota exceeded, disabled)
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
