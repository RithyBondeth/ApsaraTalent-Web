import type {
  TCallStatus,
  ICallParticipant,
} from "@/stores/features/call.store";

export interface ICallOverlayProps {
  status: TCallStatus;
  /** For the receiver: the person who called. */
  caller: ICallParticipant | null;
  /** For the initiator: the person being called. */
  callee: ICallParticipant | null;
  isMuted: boolean;
  callStartedAt: Date | null;
  /** Remote MediaStream — played via hidden <audio autoPlay>. */
  remoteStream: MediaStream | null;
  onMute: () => void;
  onEnd: () => void;
}
