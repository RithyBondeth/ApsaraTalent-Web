import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useThemeTransition } from "./use-theme-transition";
import { useThemeStore } from "@/stores/themes/theme-store";

const setNextTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: setNextTheme }),
}));
vi.mock("cookies-next/client", () => ({ setCookie: vi.fn() }));

// jsdom defines matchMedia as read-only, so it has to be redefined rather than
// assigned.
function stubMatchMedia(matches: Record<string, boolean>) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches[query] ?? false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

describe("useThemeTransition", () => {
  beforeEach(() => {
    setNextTheme.mockClear();
    document.documentElement.className = "";
    delete document.documentElement.dataset.themeTransition;
    stubMatchMedia({});
  });

  afterEach(() => vi.useRealTimers());

  // jsdom has no View Transitions API, so these exercise the cross-browser
  // fallback — the path every non-Chromium visitor takes.
  it("flips the theme and marks the document while the cross-fade runs", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useThemeTransition());

    act(() => result.current.toggleTheme());

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      document.documentElement.classList.contains("theme-fallback-transition"),
    ).toBe(true);
    expect(setNextTheme).toHaveBeenCalledWith("dark");

    act(() => vi.advanceTimersByTime(600));
    expect(
      document.documentElement.classList.contains("theme-fallback-transition"),
    ).toBe(false);
  });

  it("applies instantly and animates nothing under reduced motion", () => {
    stubMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    const { result } = renderHook(() => useThemeTransition());

    act(() => result.current.toggleTheme());

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      document.documentElement.classList.contains("theme-fallback-transition"),
    ).toBe(false);
  });

  it("stores 'system' as the preference but paints what the OS resolves to", () => {
    vi.useFakeTimers();
    stubMatchMedia({ "(prefers-color-scheme: dark)": true });
    const { result } = renderHook(() => useThemeTransition());

    act(() => result.current.setThemeWithReveal("system"));

    expect(setNextTheme).toHaveBeenCalledWith("system");
    expect(useThemeStore.getState().theme).toBe("system");
    // The class is the resolved value — the reveal paints the document itself
    // rather than waiting for next-themes to catch up.
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("does not animate when the choice changes nothing on screen", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useThemeTransition());

    // Already light; choosing light again is a preference write, not a reveal.
    act(() => result.current.setThemeWithReveal("light"));

    expect(
      document.documentElement.classList.contains("theme-fallback-transition"),
    ).toBe(false);
    expect(setNextTheme).toHaveBeenCalledWith("light");
  });
});
