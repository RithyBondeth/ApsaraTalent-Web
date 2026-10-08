import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSavedSearchesStore } from "./saved-searches.store";
import { ISavedSearch } from "@/utils/interfaces/saved-search/saved-search.interface";

const http = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  post: vi.fn(),
}));
vi.mock("@/lib/axios", () => ({ default: http }));
const row: ISavedSearch = {
  id: "search-1",
  name: "Developer",
  filters: {},
  frequency: "daily",
  lastNotifiedAt: null,
  lastResultJobIds: [],
  createdAt: "",
  updatedAt: "",
};
describe("saved search match previews", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useSavedSearchesStore.getState().reset();
  });
  it("loads counts through the shared preview endpoint", async () => {
    http.get
      .mockResolvedValueOnce({ data: [row] })
      .mockResolvedValueOnce({ data: { totalMatches: 8, newMatchCount: 3 } });
    await useSavedSearchesStore.getState().fetchAll();
    expect(http.get.mock.calls[1][0]).toContain(
      "/job/saved-search/search-1/preview",
    );
    expect(useSavedSearchesStore.getState().previews[row.id]).toEqual({
      totalMatches: 8,
      newMatchCount: 3,
    });
  });
  it("keeps saved searches usable when previews fail and allows retry", async () => {
    http.get
      .mockResolvedValueOnce({ data: [row] })
      .mockRejectedValueOnce(new Error("unavailable"));
    await useSavedSearchesStore.getState().fetchAll();
    expect(useSavedSearchesStore.getState().items).toEqual([row]);
    expect(useSavedSearchesStore.getState().error).toBeNull();
    expect(useSavedSearchesStore.getState().previewErrors[row.id]).toBe(true);
    http.get.mockResolvedValueOnce({
      data: { totalMatches: 0, newMatchCount: 0 },
    });
    await useSavedSearchesStore.getState().fetchPreview(row.id);
    expect(useSavedSearchesStore.getState().previewErrors[row.id]).toBe(false);
  });
  it("ignores a pending preview after account state resets", async () => {
    let resolve!: (value: unknown) => void;
    useSavedSearchesStore.setState({ items: [row] });
    http.get.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const pending = useSavedSearchesStore.getState().fetchPreview(row.id);
    useSavedSearchesStore.getState().reset();
    resolve({ data: { totalMatches: 8, newMatchCount: 3 } });
    await pending;
    expect(useSavedSearchesStore.getState().previews).toEqual({});
  });
  it("rejects malformed counts instead of displaying invented zeros", async () => {
    useSavedSearchesStore.setState({ items: [row] });
    http.get.mockResolvedValueOnce({ data: {} });
    await useSavedSearchesStore.getState().fetchPreview(row.id);
    expect(useSavedSearchesStore.getState().previews).toEqual({});
    expect(useSavedSearchesStore.getState().previewErrors[row.id]).toBe(true);
  });
});
