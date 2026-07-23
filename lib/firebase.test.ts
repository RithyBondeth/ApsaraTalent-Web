import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getApp: vi.fn(),
  getApps: vi.fn(),
  initializeApp: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  getApp: mocks.getApp,
  getApps: mocks.getApps,
  initializeApp: mocks.initializeApp,
}));

describe("Firebase app singleton", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("initializes Firebase once when no app exists", async () => {
    const app = { name: "created" };
    mocks.getApps.mockReturnValue([]);
    mocks.initializeApp.mockReturnValue(app);
    const { getFirebaseApp } = await import("./firebase");

    expect(getFirebaseApp()).toBe(app);
    expect(getFirebaseApp()).toBe(app);
    expect(mocks.initializeApp).toHaveBeenCalledOnce();
    expect(mocks.initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      }),
    );
    expect(mocks.getApp).not.toHaveBeenCalled();
  });

  it("reuses an app already registered by Firebase", async () => {
    const app = { name: "existing" };
    mocks.getApps.mockReturnValue([app]);
    mocks.getApp.mockReturnValue(app);
    const { getFirebaseApp } = await import("./firebase");

    expect(getFirebaseApp()).toBe(app);
    expect(mocks.getApp).toHaveBeenCalledOnce();
    expect(mocks.initializeApp).not.toHaveBeenCalled();
  });
});
