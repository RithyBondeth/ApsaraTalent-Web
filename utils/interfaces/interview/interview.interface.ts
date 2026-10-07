import { TInterviewStatus } from "@/utils/types/interview/interview-status.type";

export interface IInterview {
  id: string;
  employee: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    avatar?: string;
  };
  company: {
    id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description?: string;
  scheduledAt: string;
  /** IANA timezone the scheduler was in. Null on legacy rows. */
  timezone: string | null;
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  status: TInterviewStatus;
  createdBy: string;
  createdAt: string;
}

export interface ICreateInterviewPayload {
  employeeId: string;
  companyId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  /**
   * IANA timezone the picker was in when the time was chosen. Sent so the
   * server can render every downstream email in the same zone the scheduler
   * saw — "2:00 PM" in an inbox with no browser to convert it is the exact
   * ambiguity this exists to remove.
   */
  timezone?: string;
  durationMinutes?: number;
  location?: string;
  meetingLink?: string;
  createdBy: string;
}
