import { describe, expect, it } from "vitest";
import { employeeFormSchema } from "./validation";

describe("employee profile validation", () => {
  it("allows an avatar save when persisted decimal salaries arrive as strings", () => {
    const avatar = new File([new Uint8Array([1, 2, 3])], "avatar.jpg", {
      type: "image/jpeg",
    });

    const result = employeeFormSchema.safeParse({
      basicInfo: { avatar },
      profession: {
        expectedSalaryMin: "500.00",
        expectedSalaryMax: "1000.00",
      },
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.profession?.expectedSalaryMin).toBe(500);
    expect(result.data.profession?.expectedSalaryMax).toBe(1000);
  });
});
