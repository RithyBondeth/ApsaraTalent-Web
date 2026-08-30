import { describe, expect, it } from "vitest";
import { isNumberPhoneInput } from "./check-phone-input";
import {
  dateValidation,
  emailValidation,
  khmerPhoneNumberValidation,
  optionalFileValidation,
  optionalImageValidation,
  positiveNumberValidation,
  selectedValidation,
  textValidation,
} from "./form-schemas";

describe("shared form validations", () => {
  it("distinguishes phone-like input", () => {
    expect(isNumberPhoneInput("012345678")).toBe(true);
    expect(isNumberPhoneInput("")).toBe(false);
    expect(isNumberPhoneInput("012a")).toBe(false);
  });

  it("validates text, selections, numbers, and email", () => {
    expect(textValidation("Name", 4).safeParse("").success).toBe(false);
    expect(textValidation("Name", 4).safeParse("hello").success).toBe(false);
    expect(textValidation().safeParse("").success).toBe(true);
    expect(selectedValidation("role").safeParse("").success).toBe(false);
    expect(selectedValidation().safeParse("employee").success).toBe(true);
    expect(positiveNumberValidation("Salary").safeParse(0).success).toBe(false);
    expect(positiveNumberValidation().safeParse("5").success).toBe(true);
    expect(emailValidation.safeParse("bad").success).toBe(false);
    expect(emailValidation.safeParse("person@example.com").success).toBe(true);
  });

  it("validates optional Khmer phone numbers and dates", () => {
    expect(khmerPhoneNumberValidation().safeParse("").success).toBe(true);
    expect(khmerPhoneNumberValidation().safeParse(" 012345678 ").success).toBe(
      true,
    );
    expect(khmerPhoneNumberValidation().safeParse("123").success).toBe(false);
    expect(dateValidation("Birthday").safeParse("").success).toBe(false);
    expect(dateValidation("Birthday").safeParse("2024-01-02").success).toBe(
      true,
    );
    expect(dateValidation().safeParse(new Date()).success).toBe(true);
  });

  it("validates optional documents and images", () => {
    const pdf = new File(["ok"], "resume.pdf", { type: "application/pdf" });
    const text = new File(["no"], "resume.txt", { type: "text/plain" });
    const image = new File(["ok"], "avatar.png", { type: "image/png" });
    expect(optionalFileValidation("Resume").safeParse(undefined).success).toBe(
      true,
    );
    expect(optionalFileValidation("Resume").safeParse(pdf).success).toBe(true);
    expect(optionalFileValidation("Resume").safeParse(text).success).toBe(
      false,
    );
    expect(optionalFileValidation("Resume").safeParse("file").success).toBe(
      false,
    );
    expect(optionalImageValidation("Avatar").safeParse(image).success).toBe(
      true,
    );
    expect(
      optionalImageValidation("Avatar").safeParse("existing-url").success,
    ).toBe(true);
    expect(optionalImageValidation("Avatar").safeParse(text).success).toBe(
      false,
    );
  });
});
