import { TApplicationStatus } from "@/utils/types/application/application-status.type";

export interface IApplication {
  id: string;
  status: TApplicationStatus;
  coverLetterNote?: string;
  /** Present only on a rejection, and only when the company gave a reason. */
  rejectionReason?: string | null;
  /** Null until the owning company first opened the applicant list. */
  reviewedAt?: string | null;
  /** Null while the application has never left `pending`. */
  statusChangedAt?: string | null;
  appliedAt: string;
  jobId?: string;
  jobTitle?: string;
  employeeId?: string;
  employeeName?: string;
  /**
   * The applicant's overall fit, 0-100, reused from the matching score. Null
   * when the pair was never scored — the applicant arrived without swiping.
   * Only returned on the company's applicant list.
   */
  matchScore?: number | null;
}

export interface IApplyPayload {
  jobId: string;
  coverLetterNote?: string;
}

export interface IUpdateApplicationStatusPayload {
  applicationId: string;
  status: TApplicationStatus;
  rejectionReason?: string;
}
