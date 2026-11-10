import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_NOTIFICATION_PREFERENCES_URL,
  API_NOTIFICATION_UNSUBSCRIBE_URL,
} from "@/utils/constants/apis/notification.api.constant";
import {
  TNotificationPreferences,
  TUpdateNotificationPreferencesPayload,
} from "@/utils/types/notification/preference.type";
import { create } from "zustand";

/* ---------------------------------- Types --------------------------------- */
type TNotificationPreferenceState = {
  preferences: TNotificationPreferences | null;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  error: string | null;
  getPreferences: () => Promise<void>;
  updatePreferences: (
    payload: TUpdateNotificationPreferencesPayload,
  ) => Promise<boolean>;
  unsubscribe: (token: string) => Promise<boolean>;
};

/* ---------------------------------- Store --------------------------------- */
export const useNotificationPreferenceStore =
  create<TNotificationPreferenceState>((set, get) => ({
    preferences: null,
    loading: false,
    loaded: false,
    saving: false,
    error: null,

    getPreferences: async () => {
      set({ loading: true, error: null });
      try {
        const res = await apiClient.get<TNotificationPreferences>(
          API_NOTIFICATION_PREFERENCES_URL,
        );
        set({ preferences: res.data, loading: false, loaded: true });
      } catch (error) {
        set({
          loading: false,
          loaded: true,
          error: extractApiErrorMessage(
            error,
            "Failed to load notification preferences",
          ),
        });
      }
    },

    /**
     * Applies the toggle locally before the request resolves, then replaces the
     * whole object with what the server actually stored.
     *
     * A switch that waits for a round trip before moving reads as broken, and
     * these are the cheapest possible writes. On failure the previous state is
     * put back, so a rejected save cannot leave the UI claiming something the
     * server does not believe.
     */
    updatePreferences: async (payload) => {
      const previous = get().preferences;
      if (previous) {
        set({
          preferences: {
            ...previous,
            ...(payload.emailEnabled !== undefined && {
              emailEnabled: payload.emailEnabled,
            }),
            ...(payload.pushEnabled !== undefined && {
              pushEnabled: payload.pushEnabled,
            }),
            categories: Object.entries(payload.categories ?? {}).reduce(
              (categories, [category, channels]) => ({
                ...categories,
                [category]: { ...categories[category], ...channels },
              }),
              previous.categories,
            ),
          },
        });
      }

      set({ saving: true, error: null });
      try {
        const res = await apiClient.patch<TNotificationPreferences>(
          API_NOTIFICATION_PREFERENCES_URL,
          payload,
        );
        set({ preferences: res.data, saving: false });
        return true;
      } catch (error) {
        set({
          preferences: previous,
          saving: false,
          error: extractApiErrorMessage(
            error,
            "Failed to save notification preferences",
          ),
        });
        return false;
      }
    },

    unsubscribe: async (token) => {
      set({ saving: true, error: null });
      try {
        await apiClient.post(API_NOTIFICATION_UNSUBSCRIBE_URL, { token });
        set({ saving: false });
        return true;
      } catch (error) {
        set({
          saving: false,
          error: extractApiErrorMessage(error, "Failed to unsubscribe"),
        });
        return false;
      }
    },
  }));
