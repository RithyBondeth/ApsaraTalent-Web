import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicantCard } from "./applicant-card";
import { ApplicationCard } from "./application-card";
import { IApplication } from "@/utils/interfaces/application/application.interface";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      withdraw: "Withdraw",
      reject: "Reject",
      "advanceTo.shortlisted": "Shortlist",
      "advanceTo.interviewing": "Move to interview",
      "advanceTo.offered": "Make an offer",
      "advanceTo.hired": "Mark as hired",
      "status.pending": "Pending",
      "status.shortlisted": "Shortlisted",
      "status.rejected": "Not selected",
      "status.hired": "Hired",
      "status.withdrawn": "Withdrawn",
      rejectionReason: "Reason given",
      yourNote: "Your note",
      candidateNote: "Candidate note",
      newApplicant: "New",
      appliedOn: `Applied ${values?.date ?? ""}`,
      awaitingReview: "Awaiting review",
      notYetMoved: "Not moved yet",
      unnamedApplicant: "Unnamed applicant",
      untitledRole: "Untitled role",
    };
    return labels[key] ?? key;
  },
}));

const base: IApplication = {
  id: "application-1",
  status: "pending",
  appliedAt: "2026-08-01T00:00:00.000Z",
  jobTitle: "Frontend Engineer",
  employeeName: "Dara",
};

describe("application cards", () => {
  beforeEach(() => vi.clearAllMocks());

  /* ------------------------------ Employee view ----------------------------- */
  it("offers withdrawal while an application is still open", async () => {
    const onWithdraw = vi.fn();
    const user = userEvent.setup();
    render(
      <ApplicationCard
        application={base}
        isWithdrawing={false}
        onWithdraw={onWithdraw}
      />,
    );

    await user.click(screen.getByRole("button", { name: /withdraw/i }));
    expect(onWithdraw).toHaveBeenCalledWith("application-1");
  });

  it("withholds withdrawal once the application has concluded", () => {
    render(
      <ApplicationCard
        application={{ ...base, status: "hired" }}
        isWithdrawing={false}
        onWithdraw={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /withdraw/i })).toBeNull();
  });

  it("shows the candidate why they were rejected", () => {
    render(
      <ApplicationCard
        application={{
          ...base,
          status: "rejected",
          rejectionReason: "Looking for more Go experience",
        }}
        isWithdrawing={false}
        onWithdraw={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Looking for more Go experience"),
    ).toBeInTheDocument();
  });

  /* ------------------------------ Company view ------------------------------ */
  it("names the single next stage rather than offering a menu", async () => {
    const onAdvance = vi.fn();
    const user = userEvent.setup();
    render(
      <ApplicantCard
        application={{ ...base, status: "shortlisted", matchScore: 82 }}
        isUpdating={false}
        onAdvance={onAdvance}
        onReject={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /move to interview/i }),
    );
    expect(onAdvance).toHaveBeenCalledWith("application-1", "interviewing");
  });

  it("renders the fit score, and a dash when the pair was never scored", () => {
    const { rerender } = render(
      <ApplicantCard
        application={{ ...base, matchScore: 82 }}
        isUpdating={false}
        onAdvance={vi.fn()}
        onReject={vi.fn()}
      />,
    );
    expect(screen.getByText("82")).toBeInTheDocument();

    // An unscored applicant must not read as zero — "unknown" and "bad fit"
    // are different answers, and one of them is unfair to the candidate.
    rerender(
      <ApplicantCard
        application={{ ...base, matchScore: null }}
        isUpdating={false}
        onAdvance={vi.fn()}
        onReject={vi.fn()}
      />,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText("0")).toBeNull();
  });

  it("marks an applicant nobody has opened yet", () => {
    const { rerender } = render(
      <ApplicantCard
        application={base}
        isUpdating={false}
        onAdvance={vi.fn()}
        onReject={vi.fn()}
      />,
    );
    expect(screen.getByText("New")).toBeInTheDocument();

    rerender(
      <ApplicantCard
        application={{ ...base, reviewedAt: "2026-08-02T00:00:00.000Z" }}
        isUpdating={false}
        onAdvance={vi.fn()}
        onReject={vi.fn()}
      />,
    );
    expect(screen.queryByText("New")).toBeNull();
  });

  it("leaves a concluded applicant with no stage controls", () => {
    render(
      <ApplicantCard
        application={{ ...base, status: "hired" }}
        isUpdating={false}
        onAdvance={vi.fn()}
        onReject={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /reject/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /mark as hired/i })).toBeNull();
  });

  it("routes rejection through the dialog rather than advancing", async () => {
    const onReject = vi.fn();
    const onAdvance = vi.fn();
    const user = userEvent.setup();
    render(
      <ApplicantCard
        application={base}
        isUpdating={false}
        onAdvance={onAdvance}
        onReject={onReject}
      />,
    );

    await user.click(screen.getByRole("button", { name: /reject/i }));
    expect(onReject).toHaveBeenCalledWith(base);
    expect(onAdvance).not.toHaveBeenCalled();
  });
});
