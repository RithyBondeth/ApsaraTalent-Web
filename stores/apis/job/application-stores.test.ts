import { beforeEach, describe, expect, it, vi } from "vitest";

import { useJobApplicationsStore } from "./job-applications.store";
import { useMyApplicationsStore } from "./my-applications.store";
import { IApplication } from "@/utils/interfaces/application/application.interface";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

const application: IApplication = {
  id: "application-1",
  status: "pending",
  appliedAt: "2026-08-01T00:00:00.000Z",
  jobId: "job-1",
  jobTitle: "Frontend Engineer",
};

describe("application API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useMyApplicationsStore.setState({
      applications: [],
      loading: false,
      error: null,
      applying: false,
      withdrawingId: null,
    });
    useJobApplicationsStore.getState().reset();
  });

  /* ------------------------------ My applications --------------------------- */
  it("loads the signed-in employee's applications", async () => {
    axiosMocks.get.mockResolvedValue({ data: [application] });

    await useMyApplicationsStore.getState().queryMyApplications();

    expect(useMyApplicationsStore.getState().applications).toHaveLength(1);
    expect(useMyApplicationsStore.getState().error).toBeNull();
  });

  it("surfaces a load failure without leaving a stale list behind", async () => {
    useMyApplicationsStore.setState({ applications: [application] });
    axiosMocks.get.mockRejectedValue(new Error("network down"));

    await useMyApplicationsStore.getState().queryMyApplications();

    expect(useMyApplicationsStore.getState().applications).toEqual([]);
    expect(useMyApplicationsStore.getState().error).toBeTruthy();
  });

  it("prepends a new application", async () => {
    axiosMocks.post.mockResolvedValue({ data: application });

    const created = await useMyApplicationsStore
      .getState()
      .applyToJob({ jobId: "job-1" });

    expect(created).toEqual(application);
    expect(useMyApplicationsStore.getState().applications).toHaveLength(1);
  });

  it("replaces rather than duplicates a revived application", async () => {
    // Re-applying after a withdrawal revives the same row server-side, so the
    // response carries an id the list already holds.
    useMyApplicationsStore.setState({
      applications: [{ ...application, status: "withdrawn" }],
    });
    axiosMocks.post.mockResolvedValue({
      data: { ...application, status: "pending" },
    });

    await useMyApplicationsStore.getState().applyToJob({ jobId: "job-1" });

    const { applications } = useMyApplicationsStore.getState();
    expect(applications).toHaveLength(1);
    expect(applications[0].status).toBe("pending");
  });

  it("marks a withdrawn application rather than dropping it from the list", async () => {
    useMyApplicationsStore.setState({ applications: [application] });
    axiosMocks.delete.mockResolvedValue({ data: { message: "ok" } });

    const ok = await useMyApplicationsStore
      .getState()
      .withdrawApplication("application-1");

    expect(ok).toBe(true);
    const { applications } = useMyApplicationsStore.getState();
    expect(applications).toHaveLength(1);
    expect(applications[0].status).toBe("withdrawn");
  });

  it("leaves the application untouched when withdrawal fails", async () => {
    useMyApplicationsStore.setState({ applications: [application] });
    axiosMocks.delete.mockRejectedValue(new Error("nope"));

    const ok = await useMyApplicationsStore
      .getState()
      .withdrawApplication("application-1");

    expect(ok).toBe(false);
    expect(useMyApplicationsStore.getState().applications[0].status).toBe(
      "pending",
    );
    expect(useMyApplicationsStore.getState().withdrawingId).toBeNull();
  });

  /* ----------------------------- Job applications --------------------------- */
  it("clears the previous job's applicants as a new job loads", async () => {
    useJobApplicationsStore.setState({
      applicants: [application],
      jobId: "job-1",
    });
    let resolved: (value: unknown) => void = () => {};
    axiosMocks.get.mockReturnValue(
      new Promise((resolve) => {
        resolved = resolve;
      }),
    );

    const pending = useJobApplicationsStore
      .getState()
      .queryJobApplications("job-2", "company-1");

    // Showing job-1's candidates under job-2's heading is worse than an
    // empty list, so the swap happens as the request goes out.
    expect(useJobApplicationsStore.getState().applicants).toEqual([]);
    expect(useJobApplicationsStore.getState().jobId).toBe("job-2");

    resolved({ data: [] });
    await pending;
  });

  it("applies a status change to the matching row only", async () => {
    useJobApplicationsStore.setState({
      applicants: [application, { ...application, id: "application-2" }],
    });
    axiosMocks.patch.mockResolvedValue({
      data: {
        ...application,
        status: "shortlisted",
        statusChangedAt: "2026-08-02T00:00:00.000Z",
      },
    });

    const ok = await useJobApplicationsStore.getState().updateStatus({
      applicationId: "application-1",
      status: "shortlisted",
    });

    expect(ok).toBe(true);
    const { applicants } = useJobApplicationsStore.getState();
    expect(applicants[0].status).toBe("shortlisted");
    expect(applicants[1].status).toBe("pending");
  });

  it("reports a failed status change without changing the row", async () => {
    useJobApplicationsStore.setState({ applicants: [application] });
    axiosMocks.patch.mockRejectedValue(new Error("rejected by server"));

    const ok = await useJobApplicationsStore.getState().updateStatus({
      applicationId: "application-1",
      status: "hired",
    });

    expect(ok).toBe(false);
    expect(useJobApplicationsStore.getState().applicants[0].status).toBe(
      "pending",
    );
    expect(useJobApplicationsStore.getState().updatingId).toBeNull();
  });
});
