import { afterEach, describe, expect, it } from "vitest";
import { GET } from "./route";

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

afterEach(() => {
  process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
});

describe("GET /health", () => {
  it("reports a configured API without exposing its URL", async () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "ok",
      service: "apsaratalent-web",
      apiBaseUrlConfigured: true,
    });
    expect(body).not.toHaveProperty("apiBaseUrl");
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it("reports when the API URL is absent or blank", async () => {
    process.env.NEXT_PUBLIC_API_URL = "   ";

    await expect((await GET()).json()).resolves.toMatchObject({
      status: "ok",
      apiBaseUrlConfigured: false,
    });
  });
});
