import { TApplicationStatus } from "@/utils/types/application/application-status.type";

export interface IEmployerFunnelStage {
  status: TApplicationStatus;
  count: number;
}

export interface ITopJob {
  jobId: string;
  title: string;
  totalApplicants: number;
  activePipeline: number;
  hired: number;
  rejected: number;
}

export interface ITimeWindowDelta {
  current: number;
  previous: number;
  delta: number;
}

export interface IEmployerAnalytics {
  openPositions: number;
  activePipeline: number;
  hired30d: number;
  rejected30d: number;
  applicationsDelta: ITimeWindowDelta;
  medianDaysToFirstMove: number | null;
  funnel: IEmployerFunnelStage[];
  topJobs: ITopJob[];
}
