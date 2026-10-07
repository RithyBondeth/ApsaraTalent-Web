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

export interface IApplicationNote {
  id: string;
  applicationId: string;
  body: string;
  createdAt: string;
  authorId: string | null;
  authorName: string | null;
}

export interface IApplicationStatusHistoryEntry {
  id: string;
  applicationId: string;
  from: TApplicationStatus | null;
  to: TApplicationStatus;
  note: string | null;
  createdAt: string;
  actorId: string | null;
  actorName: string | null;
}

export interface IBulkUpdateApplicationStatusPayload {
  applicationIds: string[];
  status: TApplicationStatus;
  rejectionReason?: string;
}

export interface IBulkUpdateApplicationStatusItemResult {
  applicationId: string;
  ok: boolean;
  status: TApplicationStatus;
  reason: string | null;
}

export interface IBulkUpdateApplicationStatusResponse {
  results: IBulkUpdateApplicationStatusItemResult[];
  updatedCount: number;
  failedCount: number;
}

export interface IPipelineColumn {
  status: TApplicationStatus;
  count: number;
  applications: IApplication[];
}

export interface IJobPipeline {
  jobId: string;
  jobTitle: string;
  columns: IPipelineColumn[];
  totalCount: number;
}
