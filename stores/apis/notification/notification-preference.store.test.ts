import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNotificationPreferenceStore } from "./notification-preference.store";
import type { TNotificationPreferences } from "@/utils/types/notification/preference.type";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

const preferences = (
  overrides: Partial<TNotificationPreferences> = {},
): TNotificationPreferences => ({
  emailEnabled: true,
  pushEnabled: true,
  categories: {
    application: { email: true, push: true },
    interview: { email: true, push: true },
    match: { email: true, push: true },
    message: { email: false, push: true },
    account: { email: true, push: true },
  },
  ...overrides,
});

describe("notification preference store", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useNotificationPreferenceStore.setState({
      preferences: null,
      loading: false,
      loaded: false,
      saving: false,
      error: null,
    });
  });

  it("loads preferences", async () => {
    axiosMocks.get.mockResolvedValue({ data: preferences() });

    await useNotificationPreferenceStore.getState().getPreferences();

    expect(useNotificationPreferenceStore.getState()).toMatchObject({
      loading: false,
      loaded: true,
      error: null,
    });
    expect(
      useNotificationPreferenceStore.getState().preferences?.emailEnabled,
    ).toBe(true);
  });

  it("marks itself loaded even when the request fails, so the page stops waiting", async () => {
    axiosMocks.get.mockRejectedValue(new Error("network"));

    await useNotificationPreferenceStore.getState().getPreferences();

    expect(useNotificationPreferenceStore.getState().loaded).toBe(true);
    expect(useNotificationPreferenceStore.getState().error).toBeTruthy();
  });

  it("applies a category toggle before the request resolves", async () => {
    useNotificationPreferenceStore.setState({ preferences: preferences() });
    let resolvePatch: (value: unknown) => void = () => undefined;
    axiosMocks.patch.mockReturnValue(
      new Promise((resolve) => (resolvePatch = resolve)),
    );

    const pending = useNotificationPreferenceStore
      .getState()
      .updatePreferences({ categories: { match: { email: false } } });

    // A switch that waits for a round trip before moving reads as broken.
    expect(
      useNotificationPreferenceStore.getState().preferences?.categories.match,
    ).toEqual({ email: false, push: true });

    resolvePatch({ data: preferences() });
    await pending;
  });

  it("rolls the toggle back when the save is rejected", async () => {
    useNotificationPreferenceStore.setState({ preferences: preferences() });
    axiosMocks.patch.mockRejectedValue(new Error("network"));

    const saved = await useNotificationPreferenceStore
      .getState()
      .updatePreferences({ emailEnabled: false });

    expect(saved).toBe(false);
    // The UI must never claim a setting the server does not hold.
    expect(
      useNotificationPreferenceStore.getState().preferences?.emailEnabled,
    ).toBe(true);
    expect(useNotificationPreferenceStore.getState().error).toBeTruthy();
  });

  it("replaces local state with whatever the server actually stored", async () => {
    useNotificationPreferenceStore.setState({ preferences: preferences() });
    axiosMocks.patch.mockResolvedValue({
      data: preferences({ emailEnabled: false }),
    });

    await useNotificationPreferenceStore
      .getState()
      .updatePreferences({ emailEnabled: false });

    expect(
      useNotificationPreferenceStore.getState().preferences?.emailEnabled,
    ).toBe(false);
  });

  it("posts the unsubscribe token rather than sending it in a URL", async () => {
    axiosMocks.post.mockResolvedValue({ data: { message: "done" } });

    await expect(
      useNotificationPreferenceStore.getState().unsubscribe("a".repeat(48)),
    ).resolves.toBe(true);
    expect(axiosMocks.post).toHaveBeenCalledWith(expect.any(String), {
      token: "a".repeat(48),
    });
  });
});
