import { beforeEach, describe, expect, it, vi } from "vitest";

import { useProfileAnalyticsStore } from "./profile-analytics.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("profile-analytics store", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useProfileAnalyticsStore.getState().reset();
  });

  it("loads the profile analytics payload", async () => {
    axiosMocks.get.mockResolvedValue({
      data: {
        profileViews7d: 3,
        profileViews30d: 11,
        searchAppearances30d: 42,
        recentViewers: [],
        browsePrivately: false,
      },
    });

    await useProfileAnalyticsStore.getState().fetch();

    expect(useProfileAnalyticsStore.getState().data?.profileViews30d).toBe(11);
    expect(useProfileAnalyticsStore.getState().loaded).toBe(true);
    expect(useProfileAnalyticsStore.getState().error).toBeNull();
  });

  it("folds the privacy toggle back into `data` without a re-fetch", async () => {
    // The widget's "browsing privately" chip reads `data.browsePrivately`.
    // Flipping the switch has to update that value in place, otherwise the
    // chip stays stale until the next mount.
    useProfileAnalyticsStore.setState({
      data: {
        profileViews7d: 0,
        profileViews30d: 0,
        searchAppearances30d: 0,
        recentViewers: [],
        browsePrivately: false,
      },
      loaded: true,
    });
    axiosMocks.patch.mockResolvedValue({ data: { browsePrivately: true } });

    const ok = await useProfileAnalyticsStore
      .getState()
      .updatePrivacy({ browsePrivately: true });

    expect(ok).toBe(true);
    expect(useProfileAnalyticsStore.getState().data?.browsePrivately).toBe(
      true,
    );
  });

  it("surfaces a privacy-update failure without corrupting local state", async () => {
    useProfileAnalyticsStore.setState({
      data: {
        profileViews7d: 0,
        profileViews30d: 0,
        searchAppearances30d: 0,
        recentViewers: [],
        browsePrivately: false,
      },
      loaded: true,
    });
    axiosMocks.patch.mockRejectedValue(new Error("down"));

    const ok = await useProfileAnalyticsStore
      .getState()
      .updatePrivacy({ browsePrivately: true });

    expect(ok).toBe(false);
    // Local state stays where it was — the user's next attempt starts from
    // the same value, not a phantom "true".
    expect(useProfileAnalyticsStore.getState().data?.browsePrivately).toBe(
      false,
    );
    expect(useProfileAnalyticsStore.getState().error).toBeTruthy();
  });
});
