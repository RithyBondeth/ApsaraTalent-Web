import { act, renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RESUME_TEMPLATE_THEMES } from "@/utils/constants/resume-theme.constant";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";

import { useDownloadProgress } from "./use-download-progress";
import { useMediaQuery } from "./use-media-query";
import { useIsMobile } from "./use-mobile";
import { usePendingInterviewCount } from "./use-pending-interview-count";
import {
  ResumeTemplateThemeContext,
  useResumeTemplateTheme,
} from "../resume/use-resume-template-theme";

describe("UI utility hooks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useInterviewStore.setState({ interviews: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("reacts to media-query changes and removes its listener", () => {
    let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
    const remove = vi.fn();
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: (_event, listener) => {
        changeListener = listener as (event: MediaQueryListEvent) => void;
      },
      removeEventListener: remove,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { result, unmount } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(result.current).toBe(true);
    act(() => changeListener?.({ matches: false } as MediaQueryListEvent));
    expect(result.current).toBe(false);
    unmount();
    expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("tracks the mobile breakpoint when the viewport changes", () => {
    let changeListener: (() => void) | undefined;
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: (_event, listener) => {
        changeListener = listener as () => void;
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 500 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    act(() => changeListener?.());
    expect(result.current).toBe(false);
  });

  it("crawls download progress to a cap and snaps to its final value", () => {
    const { result } = renderHook(() => useDownloadProgress());

    act(() => result.current.start(10));
    act(() => vi.advanceTimersByTime(1_200));
    expect(result.current.progress).toBeGreaterThan(0);
    expect(result.current.progress).toBeLessThanOrEqual(10);

    act(() => result.current.stop(100));
    expect(result.current.progress).toBe(100);
  });

  it("derives the live pending interview count", () => {
    const { result } = renderHook(() => usePendingInterviewCount());
    act(() => {
      useInterviewStore.setState({
        interviews: [
          { id: "interview-1", status: "pending" },
          { id: "interview-2", status: "accepted" },
          { id: "interview-3", status: "pending" },
        ] as never,
      });
    });
    expect(result.current).toBe(2);
  });

  it("uses the default resume theme and permits a provider override", () => {
    const defaultTheme = renderHook(() => useResumeTemplateTheme());
    expect(defaultTheme.result.current).toBe(RESUME_TEMPLATE_THEMES.modern);

    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(
        ResumeTemplateThemeContext.Provider,
        { value: RESUME_TEMPLATE_THEMES.classic },
        children,
      );
    const overridden = renderHook(() => useResumeTemplateTheme(), { wrapper });
    expect(overridden.result.current).toBe(RESUME_TEMPLATE_THEMES.classic);
  });
});
