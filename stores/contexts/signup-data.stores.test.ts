import { beforeEach, describe, expect, it } from "vitest";

import { useBasicPhoneSignupDataStore } from "./basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "./basic-signup-data.store";

describe("signup data stores", () => {
  beforeEach(() => {
    useBasicPhoneSignupDataStore.setState({ basicPhoneSignupData: null });
    useBasicSignupDataStore.setState({ basicSignupData: null });
  });

  it("stores and clears phone signup data", () => {
    const data = { phone: "+85512345678", rememberMe: true, role: "employee" };

    useBasicPhoneSignupDataStore.getState().setBasicPhoneSignupData(data);
    expect(useBasicPhoneSignupDataStore.getState().basicPhoneSignupData).toEqual(data);

    useBasicPhoneSignupDataStore.getState().clearSetupBasicSignupData();
    expect(useBasicPhoneSignupDataStore.getState().basicPhoneSignupData).toBeNull();
  });

  it("stores and clears multi-step signup data", () => {
    const data = {
      firstName: "Sokha",
      lastName: "Chan",
      dob: "1995-05-15",
      username: "sokha",
      gender: "male",
      selectedRole: "employee",
      selectedLocation: "Phnom Penh",
      email: "sokha@example.com",
      password: "secure-password",
      confirmPassword: "secure-password",
    };

    useBasicSignupDataStore.getState().setBasicSignupData(data);
    expect(useBasicSignupDataStore.getState().basicSignupData).toEqual(data);

    useBasicSignupDataStore.getState().clearSignupData();
    expect(useBasicSignupDataStore.getState().basicSignupData).toBeNull();
  });

  it("replaces previous signup data instead of merging stale fields", () => {
    useBasicSignupDataStore.getState().setBasicSignupData({
      firstName: "Old",
      email: "old@example.com",
    });
    useBasicSignupDataStore.getState().setBasicSignupData({ firstName: "New" });

    expect(useBasicSignupDataStore.getState().basicSignupData).toEqual({ firstName: "New" });
  });
});
