import { describe, expect, it } from "vitest";
import { employeeFormSchema } from "./validation";

describe("employee profile validation", () => {
  it("allows an avatar save when the profession section is present", () => {
    const avatar = new File([new Uint8Array([1, 2, 3])], "avatar.jpg", {
      type: "image/jpeg",
    });

    const result = employeeFormSchema.safeParse({
      basicInfo: { avatar },
      profession: {
        job: "Software Engineer",
        workMode: "hybrid",
        languages: ["Khmer", "English"],
      },
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.profession?.workMode).toBe("hybrid");
  });

  // Expected salary was removed from the employee experience. A stale draft in
  // localStorage can still carry the old keys, and dropping them has to be
  // silent — a parse failure here would block the user's whole profile save.
  it("ignores expected-salary keys left over in a persisted draft", () => {
    const result = employeeFormSchema.safeParse({
      profession: {
        job: "Software Engineer",
        expectedSalaryMin: "500.00",
        expectedSalaryMax: "1000.00",
        salaryCurrency: "USD",
      },
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.profession).not.toHaveProperty("expectedSalaryMin");
    expect(result.data.profession).not.toHaveProperty("expectedSalaryMax");
  });

  it("rejects a work mode outside the four supported values", () => {
    const result = employeeFormSchema.safeParse({
      profession: { workMode: "work from anywhere" },
    });

    expect(result.success).toBe(false);
  });
});
