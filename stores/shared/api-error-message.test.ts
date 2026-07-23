import axios, { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";
import { extractApiErrorMessage } from "./api-error-message";

function axiosError(data?: unknown, message = "Request failed") {
  return new AxiosError(
    message,
    "ERR_BAD_RESPONSE",
    undefined,
    undefined,
    { data } as AxiosResponse,
  );
}

describe("extractApiErrorMessage", () => {
  it("joins validation message arrays", () => {
    expect(
      extractApiErrorMessage(
        axiosError({ message: ["Email is invalid", "Password is required"] }),
      ),
    ).toBe("Email is invalid, Password is required");
  });

  it("uses a non-empty API message before the transport message", () => {
    expect(
      extractApiErrorMessage(
        axiosError({ message: "Account is locked" }, "Bad Request"),
      ),
    ).toBe("Account is locked");
  });

  it("falls back to an Axios transport message", () => {
    expect(extractApiErrorMessage(axiosError({}, "Network Error"))).toBe(
      "Network Error",
    );
  });

  it("supports ordinary errors and unknown values", () => {
    expect(extractApiErrorMessage(new Error("Offline"))).toBe("Offline");
    expect(extractApiErrorMessage(null, "Please retry")).toBe("Please retry");
  });

  it("recognizes actual Axios errors", () => {
    expect(axios.isAxiosError(axiosError())).toBe(true);
  });
});
