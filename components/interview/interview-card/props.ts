import { IInterview } from "@/utils/interfaces/interview/interview.interface";

export interface IInterviewCardProps {
  interview: IInterview;
  isEmployee: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}
