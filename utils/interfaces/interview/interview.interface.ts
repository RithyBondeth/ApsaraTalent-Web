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
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

export interface ICreateInterviewPayload {
  employeeId: string;
  companyId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes?: number;
  location?: string;
  meetingLink?: string;
  createdBy: string;
}
