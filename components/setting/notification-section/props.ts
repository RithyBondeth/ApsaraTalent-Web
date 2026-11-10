import {
  TNotificationPreferences,
  TUpdateNotificationPreferencesPayload,
} from "@/utils/types/notification/preference.type";

export interface INotificationSectionProps {
  preferences: TNotificationPreferences | null;
  loading: boolean;
  saving: boolean;
  onChange: (payload: TUpdateNotificationPreferencesPayload) => void;
}
