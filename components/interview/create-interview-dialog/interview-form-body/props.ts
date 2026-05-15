import type { IEmployee } from "@/utils/interfaces/user/employee.interface";
import type { useTranslations } from "next-intl";
import type { Dispatch, SetStateAction } from "react";

export interface IInterviewFormBodyProps {
  t: ReturnType<typeof useTranslations>;
  currentCompanyMatching: IEmployee[] | null;
  selectedEmployeeId: string;
  setSelectedEmployeeId: Dispatch<SetStateAction<string>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  selectedTime: string;
  setSelectedTime: Dispatch<SetStateAction<string>>;
  durationMinutes: number;
  setDurationMinutes: Dispatch<SetStateAction<number>>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  meetingLink: string;
  setMeetingLink: Dispatch<SetStateAction<string>>;
  scheduledAt: string;
  today: Date;
  error: string | null;
  creating: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
