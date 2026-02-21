import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

const mockMatchMedia = (prefersDark: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const ThemeConsumer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  it("throws when useTheme is used outside ThemeProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
    consoleSpy.mockRestore();
  });

  it("defaults to light theme when OS prefers light and no localStorage", () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  });

  it("defaults to dark theme when OS prefers dark and no localStorage", () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });

  it("reads stored dark theme from localStorage, ignoring OS preference", () => {
    mockMatchMedia(false); // OS prefers light
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });

  it("reads stored light theme from localStorage, ignoring OS preference", () => {
    mockMatchMedia(true); // OS prefers dark
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  });

  it("sets data-theme attribute on <html> on mount", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("updates data-theme attribute when theme changes", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    act(() => {
      screen.getByText("Set Dark").click();
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("persists new theme to localStorage when theme changes", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    act(() => {
      screen.getByText("Set Dark").click();
    });
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("ignores invalid values in localStorage and falls back to OS preference", () => {
    mockMatchMedia(true); // OS prefers dark
    localStorage.setItem("theme", "invalid-value");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });
});
