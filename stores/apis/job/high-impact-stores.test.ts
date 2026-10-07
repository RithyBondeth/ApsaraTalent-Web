import { beforeEach, describe, expect, it, vi } from "vitest";

import { useApplicationHistoryStore } from "./application-history.store";
import { useApplicationNotesStore } from "./application-notes.store";
import { useEmployerAnalyticsStore } from "./employer-analytics.store";
import { useSavedSearchesStore } from "./saved-searches.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

/*
  The four Zustand slices that back the high-impact-features PR share the
  same shape: fetch, mutate, keep loading/error flags. Test enough of each
  to protect the store contract the widgets rely on — a widget component
  will surface a shape mismatch as a runtime error, so a small unit test
  here is cheap insurance against a regression that would blow up a page.
*/

describe("high-impact features API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useSavedSearchesStore.getState().reset();
    useApplicationNotesStore.getState().reset();
    useApplicationHistoryStore.getState().reset();
    useEmployerAnalyticsStore.getState().reset();
  });

  /* ------------------------------ Saved searches --------------------------- */
  describe("saved-searches store", () => {
    it("loads the caller's saved searches", async () => {
      // Standard fetch path: axios returns a list, store settles with the
      // items in place and clears any prior error.
      axiosMocks.get.mockResolvedValue({
        data: [
          {
            id: "saved-1",
            name: "Senior Go",
            filters: { keyword: "go" },
            frequency: "daily",
            lastNotifiedAt: null,
            lastResultJobIds: [],
            createdAt: "2026-09-01T00:00:00.000Z",
            updatedAt: "2026-09-01T00:00:00.000Z",
          },
        ],
      });

      await useSavedSearchesStore.getState().fetchAll();

      expect(useSavedSearchesStore.getState().items).toHaveLength(1);
      expect(useSavedSearchesStore.getState().loaded).toBe(true);
      expect(useSavedSearchesStore.getState().error).toBeNull();
    });

    it("prepends a newly created saved search", async () => {
      // Newest-first ordering is what the UI expects — we prepend rather
      // than append so a fresh save shows up at the top without a re-fetch.
      useSavedSearchesStore.setState({
        items: [
          {
            id: "saved-1",
            name: "Older",
            filters: {},
            frequency: "daily",
            lastNotifiedAt: null,
            lastResultJobIds: [],
            createdAt: "2026-08-01T00:00:00.000Z",
            updatedAt: "2026-08-01T00:00:00.000Z",
          },
        ],
      });
      axiosMocks.post.mockResolvedValue({
        data: {
          id: "saved-2",
          name: "New",
          filters: { keyword: "rust" },
          frequency: "daily",
          lastNotifiedAt: null,
          lastResultJobIds: [],
          createdAt: "2026-09-08T00:00:00.000Z",
          updatedAt: "2026-09-08T00:00:00.000Z",
        },
      });

      const created = await useSavedSearchesStore.getState().create({
        name: "New",
        filters: { keyword: "rust" },
      });

      expect(created?.id).toBe("saved-2");
      const items = useSavedSearchesStore.getState().items;
      expect(items[0].id).toBe("saved-2");
      expect(items[1].id).toBe("saved-1");
    });

    it("updates a saved search in place", async () => {
      useSavedSearchesStore.setState({
        items: [
          {
            id: "saved-1",
            name: "Old name",
            filters: {},
            frequency: "daily",
            lastNotifiedAt: null,
            lastResultJobIds: [],
            createdAt: "2026-08-01T00:00:00.000Z",
            updatedAt: "2026-08-01T00:00:00.000Z",
          },
        ],
      });
      axiosMocks.patch.mockResolvedValue({
        data: {
          id: "saved-1",
          name: "New name",
          filters: {},
          frequency: "weekly",
          lastNotifiedAt: null,
          lastResultJobIds: [],
          createdAt: "2026-08-01T00:00:00.000Z",
          updatedAt: "2026-09-08T00:00:00.000Z",
        },
      });

      const ok = await useSavedSearchesStore
        .getState()
        .update("saved-1", { name: "New name", frequency: "weekly" });

      expect(ok).toBe(true);
      const item = useSavedSearchesStore.getState().items[0];
      expect(item.name).toBe("New name");
      expect(item.frequency).toBe("weekly");
    });

    it("removes a saved search on delete", async () => {
      useSavedSearchesStore.setState({
        items: [
          {
            id: "saved-1",
            name: "Doomed",
            filters: {},
            frequency: "daily",
            lastNotifiedAt: null,
            lastResultJobIds: [],
            createdAt: "2026-08-01T00:00:00.000Z",
            updatedAt: "2026-08-01T00:00:00.000Z",
          },
        ],
      });
      axiosMocks.delete.mockResolvedValue({ data: null });

      await useSavedSearchesStore.getState().remove("saved-1");

      expect(useSavedSearchesStore.getState().items).toHaveLength(0);
    });

    it("surfaces a fetch error without erasing loaded state", async () => {
      // `loaded` still flips to true — the initial fetch attempt has
      // happened, and the UI needs that flag to stop showing a spinner.
      axiosMocks.get.mockRejectedValue(new Error("down"));
      await useSavedSearchesStore.getState().fetchAll();
      expect(useSavedSearchesStore.getState().error).toBeTruthy();
      expect(useSavedSearchesStore.getState().loaded).toBe(true);
    });
  });

  /* ------------------------------ Application notes ------------------------ */
  describe("application-notes store", () => {
    it("stores notes under their application id", async () => {
      // The store is keyed by applicationId so opening a drawer for a
      // different candidate does not flash the previous list.
      axiosMocks.get.mockResolvedValue({
        data: [
          {
            id: "note-1",
            applicationId: "app-1",
            body: "Great fit",
            createdAt: "2026-09-01T00:00:00.000Z",
            authorId: "u1",
            authorName: "rita@acme.test",
          },
        ],
      });

      await useApplicationNotesStore.getState().fetchNotes("app-1");

      expect(
        useApplicationNotesStore.getState().notesByApplication["app-1"],
      ).toHaveLength(1);
    });

    it("prepends a newly created note (newest first)", async () => {
      useApplicationNotesStore.setState({
        notesByApplication: {
          "app-1": [
            {
              id: "note-1",
              applicationId: "app-1",
              body: "older",
              createdAt: "2026-08-01T00:00:00.000Z",
              authorId: "u1",
              authorName: "a@x",
            },
          ],
        },
      });
      axiosMocks.post.mockResolvedValue({
        data: {
          id: "note-2",
          applicationId: "app-1",
          body: "newer",
          createdAt: "2026-09-08T00:00:00.000Z",
          authorId: "u1",
          authorName: "a@x",
        },
      });

      const ok = await useApplicationNotesStore
        .getState()
        .createNote("app-1", "newer");

      expect(ok).toBe(true);
      const notes =
        useApplicationNotesStore.getState().notesByApplication["app-1"];
      expect(notes[0].id).toBe("note-2");
    });

    it("removes a note on delete", async () => {
      useApplicationNotesStore.setState({
        notesByApplication: {
          "app-1": [
            {
              id: "note-1",
              applicationId: "app-1",
              body: "x",
              createdAt: "2026-08-01T00:00:00.000Z",
              authorId: null,
              authorName: null,
            },
          ],
        },
      });
      axiosMocks.delete.mockResolvedValue({ data: null });

      await useApplicationNotesStore.getState().deleteNote("app-1", "note-1");

      expect(
        useApplicationNotesStore.getState().notesByApplication["app-1"],
      ).toHaveLength(0);
    });
  });

  /* ------------------------------ Application history ---------------------- */
  describe("application-history store", () => {
    it("loads the status trail for one application", async () => {
      axiosMocks.get.mockResolvedValue({
        data: [
          {
            id: "h1",
            applicationId: "app-1",
            from: null,
            to: "pending",
            note: null,
            createdAt: "2026-09-01T00:00:00.000Z",
            actorId: "u1",
            actorName: "candidate@x",
          },
        ],
      });

      await useApplicationHistoryStore.getState().fetchHistory("app-1");

      expect(
        useApplicationHistoryStore.getState().historyByApplication["app-1"],
      ).toHaveLength(1);
    });
  });

  /* ------------------------------ Employer analytics ----------------------- */
  describe("employer-analytics store", () => {
    it("loads the analytics payload and flips `loaded`", async () => {
      axiosMocks.get.mockResolvedValue({
        data: {
          openPositions: 3,
          activePipeline: 12,
          hired30d: 1,
          rejected30d: 4,
          applicationsDelta: { current: 40, previous: 30, delta: 10 },
          medianDaysToFirstMove: 1.5,
          funnel: [],
          topJobs: [],
        },
      });

      await useEmployerAnalyticsStore.getState().fetch();

      const state = useEmployerAnalyticsStore.getState();
      expect(state.data?.openPositions).toBe(3);
      expect(state.data?.applicationsDelta.delta).toBe(10);
      expect(state.loaded).toBe(true);
      expect(state.error).toBeNull();
    });

    it("keeps `loaded` true after a failed fetch so the widget stops spinning", async () => {
      axiosMocks.get.mockRejectedValue(new Error("down"));
      await useEmployerAnalyticsStore.getState().fetch();
      expect(useEmployerAnalyticsStore.getState().data).toBeNull();
      expect(useEmployerAnalyticsStore.getState().loaded).toBe(true);
      expect(useEmployerAnalyticsStore.getState().error).toBeTruthy();
    });
  });
});
