import { ICallParticipant } from "@/stores/features/call/call.store";

export interface IIncomingCallModalProps {
  caller: ICallParticipant;
  onAccept: () => void;
  onDecline: () => void;
}
