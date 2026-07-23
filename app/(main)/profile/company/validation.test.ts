import { describe, expect, it } from "vitest";
import { companyFormSchema } from "./validation";

describe("company profile validation", () => {
  it("allows an avatar save when persisted job salaries arrive as strings", () => {
    const avatar = new File([new Uint8Array([1, 2, 3])], "avatar.jpg", {
      type: "image/jpeg",
    });

    const result = companyFormSchema.safeParse({
      basicInfo: { avatar },
      openPositions: [
        {
          salaryMin: "400.00",
          salaryMax: "900.00",
        },
      ],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.openPositions?.[0].salaryMin).toBe(400);
    expect(result.data.openPositions?.[0].salaryMax).toBe(900);
  });
});
