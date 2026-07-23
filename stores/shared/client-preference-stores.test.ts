import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("client preference stores", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => vi.restoreAllMocks());

  it("updates and persists the selected language", async () => {
    const { useLanguageStore } = await import("../languages/language-store");
    useLanguageStore.setState({ language: "en" });
    useLanguageStore.getState().setLanguage("km");
    expect(useLanguageStore.getState().language).toBe("km");
    expect(localStorage.getItem("language-storage")).toContain("km");
  });

  it("tracks hydration and toggles explicit and system themes", async () => {
    const { useThemeStore } = await import("../themes/theme-store");
    useThemeStore.setState({ theme: "dark", systemTheme: "light", isHydrated: false });
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
    useThemeStore.setState({ theme: "system", systemTheme: "light" });
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
    useThemeStore.getState().setTheme("system");
    useThemeStore.getState().setHydrated(true);
    expect(useThemeStore.getState()).toMatchObject({ theme: "system", isHydrated: true });
  });

  it("reacts to operating-system theme changes", async () => {
    let listener: (() => void) | undefined;
    let dark = false;
    vi.spyOn(window, "matchMedia").mockImplementation(
      () =>
        ({
          get matches() {
            return dark;
          },
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addEventListener: (_event: string, callback: EventListenerOrEventListenerObject) => {
            listener = callback as () => void;
          },
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );
    const { useThemeStore } = await import("../themes/theme-store");
    expect(useThemeStore.getState().systemTheme).toBe("light");
    dark = true;
    listener?.();
    expect(useThemeStore.getState().systemTheme).toBe("dark");
  });

  it("uses browser storage through the safe persistence adapter", async () => {
    const { safePersistStorage } = await import("./persist-storage");
    await safePersistStorage.setItem("preference", { state: { enabled: true }, version: 0 });
    expect(await safePersistStorage.getItem("preference")).toEqual({
      state: { enabled: true },
      version: 0,
    });
    await safePersistStorage.removeItem("preference");
    expect(await safePersistStorage.getItem("preference")).toBeNull();
  });
});
