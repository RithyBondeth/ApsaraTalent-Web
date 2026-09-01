import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

/* ---------------------------------------------------------------------------
 * Career scopes must not narrow the feed unless the user asks.
 *
 * They used to be appended to every request from the profile, with no control
 * and no indication they were applied — the only escape was the backend's
 * zero-result fallback, which meant a query matching one job showed one job
 * while a query matching none showed everything. These tests pin the default
 * (search the whole board) and the opt-in path.
 * ------------------------------------------------------------------------- */

const querySearchJobs = vi.fn();
const loadMoreJobs = vi.fn();
const resetSearch = vi.fn();
const routerReplace = vi.fn();

let searchParams = new URLSearchParams();
let careerScopes: { name: string }[] = [{ name: "Software Development" }];

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: routerReplace }),
  usePathname: () => "/search/employee",
  useSearchParams: () => searchParams,
}));

// Run the debounced search synchronously so assertions do not race a timer.
vi.mock("lodash.debounce", () => ({
  default: (fn: (...args: unknown[]) => unknown) => {
    const wrapped = (...args: unknown[]) => fn(...args);
    wrapped.cancel = () => undefined;
    return wrapped;
  },
}));

vi.mock("@/stores/apis/job/search-job.store", () => ({
  useSearchJobStore: () => ({
    jobs: [],
    total: 0,
    page: 1,
    pageSize: 20,
    isUsingFallback: false,
    error: null,
    loading: false,
    loadingMore: false,
    querySearchJobs,
    loadMoreJobs,
    resetSearch,
  }),
}));

vi.mock("@/stores/apis/users/get-current-user.store", () => ({
  useGetCurrentUserStore: () => ({
    user: {
      id: "user-1",
      role: "employee",
      employee: { id: "emp-1", location: "all", careerScopes },
    },
  }),
}));

vi.mock("@/stores/apis/matching/get-current-employee-liked.store", () => ({
  useGetCurrentEmployeeLikedStore: () => ({
    currentEmployeeLiked: [],
    queryCurrentEmployeeLiked: vi.fn(),
  }),
}));

vi.mock("@/stores/apis/moderation/moderation.store", () => ({
  useModerationStore: () => ({
    blockedUsers: [],
    blockedLoaded: true,
    getBlockedUsers: vi.fn(),
  }),
}));

// Presentation-only children; the filter panel is what these tests drive.
vi.mock("@/components/search/search-bar", () => ({ default: () => null }));
vi.mock("@/components/search/search-company-card", () => ({
  default: () => null,
}));
vi.mock("@/components/search/search-page-hero", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/search/search-error-card", () => ({
  SearchErrorCard: () => null,
}));
vi.mock("@/components/search/skeleton", () => ({
  SearchCompanyCardSkeleton: () => null,
}));

// Radix Select needs pointer APIs jsdom lacks; the scope toggle is a checkbox.
vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  SelectValue: () => null,
}));

import EmployeeSearchPage from "./page";

/** The careerScopes field of the most recent querySearchJobs call. */
function lastScopes() {
  const calls = querySearchJobs.mock.calls;
  return (calls[calls.length - 1]?.[0] as { careerScopes?: string[] })
    ?.careerScopes;
}

describe("job search — career scope filter", () => {
  beforeEach(() => {
    searchParams = new URLSearchParams();
    careerScopes = [{ name: "Software Development" }];
    querySearchJobs.mockClear();
    routerReplace.mockClear();
  });

  it("searches every job by default, ignoring the profile's career scopes", async () => {
    render(<EmployeeSearchPage />);

    await waitFor(() => expect(querySearchJobs).toHaveBeenCalled());
    expect(lastScopes()).toBeUndefined();
  });

  it("applies the scopes when the URL opts in with scope=1", async () => {
    searchParams = new URLSearchParams("scope=1");

    render(<EmployeeSearchPage />);

    await waitFor(() => expect(querySearchJobs).toHaveBeenCalled());
    expect(lastScopes()).toEqual(["Software Development"]);
  });

  it("narrows to the scopes once the user ticks the box, and records it in the URL", async () => {
    const user = userEvent.setup();
    render(<EmployeeSearchPage />);
    await waitFor(() => expect(querySearchJobs).toHaveBeenCalled());
    expect(lastScopes()).toBeUndefined();

    await user.click(screen.getByRole("checkbox", { name: /career/i }));

    await waitFor(() => expect(lastScopes()).toEqual(["Software Development"]));
    expect(routerReplace).toHaveBeenLastCalledWith("/search/employee?scope=1", {
      scroll: false,
    });
  });

  it("asks the API to rank by relevance, not post date", async () => {
    // The API defaults to relevance, but the form always sends an explicit
    // sortBy — so if this reverts to "createdAt" the ranking silently stops
    // being used and nothing else fails.
    render(<EmployeeSearchPage />);

    await waitFor(() => expect(querySearchJobs).toHaveBeenCalled());
    const query = querySearchJobs.mock.calls[0]?.[0] as { sortBy?: string };
    expect(query.sortBy).toBe("relevance");
  });

  it("passes the work mode filter through to the API", async () => {
    // workMode was declared on the DTO and validated for months while no query
    // ever read it and no control ever sent it.
    searchParams = new URLSearchParams("wm=remote");

    render(<EmployeeSearchPage />);

    await waitFor(() => expect(querySearchJobs).toHaveBeenCalled());
    const query = querySearchJobs.mock.calls[0]?.[0] as { workMode?: string };
    expect(query.workMode).toBe("remote");
  });

  it("hides the toggle when the profile has no career scopes", async () => {
    careerScopes = [];

    render(<EmployeeSearchPage />);

    await waitFor(() => expect(querySearchJobs).toHaveBeenCalled());
    expect(
      screen.queryByRole("checkbox", { name: /career/i }),
    ).not.toBeInTheDocument();
    expect(lastScopes()).toBeUndefined();
  });
});
