import { ICallParticipant } from "@/stores/features/call/types";

export interface IIncomingCallModalProps {
  caller: ICallParticipant;
  onAccept: () => void;
  onDecline: () => void;
}
