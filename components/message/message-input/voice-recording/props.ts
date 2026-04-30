export interface IVoiceRecordingUIProps {
  durationSeconds: number;
  isUploading: boolean;
  onCancel: () => void;
  onStop: () => void;
}
