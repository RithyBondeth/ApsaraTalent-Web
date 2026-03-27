import { IInterview } from "../../../stores/apis/matching/interview.store";

export interface IInterviewCardProps {
  interview: IInterview;
  isEmployee: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}
