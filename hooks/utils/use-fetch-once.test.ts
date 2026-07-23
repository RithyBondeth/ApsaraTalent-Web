import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const userMocks = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/stores/apis/users/get-current-user.store", () => ({
  useGetCurrentUserStore: (selector: (state: { user: unknown }) => unknown) =>
    selector({ user: userMocks.current }),
}));

import { useFetchOnce } from "./use-fetch-once";

describe("useFetchOnce", () => {
  beforeEach(() => {
    userMocks.current = null;
  });

  it("fetches an employee once per cache key and returns role metadata", () => {
    const fetchEmployee = vi.fn();
    userMocks.current = {
      id: "user-1",
      role: "employee",
      employee: { id: "employee-1" },
      company: null,
    };
    const { result, rerender } = renderHook(() =>
      useFetchOnce({ onEmployeeFetch: fetchEmployee, cacheKey: "employee-test" }),
    );

    expect(fetchEmployee).toHaveBeenCalledOnce();
    expect(fetchEmployee).toHaveBeenCalledWith("employee-1");
    expect(result.current).toMatchObject({
      isEmployee: true,
      isCompany: false,
      employeeId: "employee-1",
      currentUserId: "employee-1",
    });
    rerender();
    expect(fetchEmployee).toHaveBeenCalledOnce();
  });

  it("fetches a company and respects the enabled flag", () => {
    const fetchCompany = vi.fn();
    userMocks.current = {
      id: "user-2",
      role: "company",
      employee: null,
      company: { id: "company-1" },
    };
    const disabled = renderHook(() =>
      useFetchOnce({ onCompanyFetch: fetchCompany, enabled: false, cacheKey: "company-disabled" }),
    );
    expect(fetchCompany).not.toHaveBeenCalled();
    expect(disabled.result.current).toMatchObject({ isCompany: true, companyId: "company-1" });

    renderHook(() =>
      useFetchOnce({ onCompanyFetch: fetchCompany, cacheKey: "company-enabled" }),
    );
    expect(fetchCompany).toHaveBeenCalledWith("company-1");
  });

  it("does not fetch without a role profile", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useFetchOnce({ onEmployeeFetch: callback, onCompanyFetch: callback, cacheKey: "empty-user" }),
    );
    expect(callback).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ isEmployee: false, isCompany: false });
  });
});
