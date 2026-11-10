import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import en from "@/language/en.json";
import { useAdminStore } from "@/stores/apis/admin/admin.store";
import AdminOverviewPage from "./page";

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

/* ---------------------------------------------------------------------------
 * The overview must survive an API that does not send every count.
 *
 * The web and the API deploy separately, so the web can run ahead of it. When
 * it did, `overview.liveJobs` was undefined, `.toLocaleString()` threw, and the
 * error boundary replaced the entire page with "Something went wrong" — the
 * panel's landing page, so every other admin screen became unreachable behind
 * it. Typecheck could not catch it: the type declared the field as required
 * while the API on the other end simply omitted it.
 * ------------------------------------------------------------------------- */
const renderOverview = () =>
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <AdminOverviewPage />
    </NextIntlClientProvider>,
  );

function setOverview(overview: Record<string, number>) {
  useAdminStore.setState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overview: overview as any,
    loadingOverview: false,
    error: null,
    getOverview: vi.fn(),
  });
}

const FULL = {
  totalUsers: 27,
  employees: 16,
  companies: 10,
  suspendedUsers: 0,
  bannedUsers: 0,
  pendingReports: 0,
  newUsersLast7Days: 1,
  liveJobs: 17,
  hiddenJobs: 2,
};

describe("admin overview resilience", () => {
  it("renders every count when the API sends them all", () => {
    setOverview(FULL);
    renderOverview();

    expect(screen.getByText("Platform overview")).toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();
  });

  it("survives an API that omits the job counts", () => {
    // Exactly the payload an API without job moderation returns.
    const { liveJobs, hiddenJobs, ...withoutJobs } = FULL;
    void liveJobs;
    void hiddenJobs;
    setOverview(withoutJobs);

    expect(() => renderOverview()).not.toThrow();
    // The page still renders, and the missing counts degrade to a dash.
    expect(screen.getByText("Platform overview")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
  });
});
