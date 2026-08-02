import { describe, expect, it } from "vitest";
import { POST } from "./route";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

describe("POST /api/auth/logout", () => {
  it("returns a successful JSON response", async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: "Logged out successfully",
      success: true,
    });
  });

  it("expires both authentication cookies as HTTP-only", async () => {
    const response = await POST();
    const cookies = response.headers.get("set-cookie") ?? "";

    expect(cookies).toContain(`${COOKIE_CONFIG.AUTH_TOKEN}=`);
    expect(cookies).toContain(`${COOKIE_CONFIG.REFRESH_TOKEN}=`);
    expect(cookies.match(/HttpOnly/gi)).toHaveLength(2);
    expect(cookies).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    expect(cookies).toContain("SameSite=strict");
  });
});
