/**
 * Mirrors `ENotificationCategory` / `ENotificationChannel` in the API.
 *
 * ACCOUNT is deliberately absent from `TNotificationPreferenceCategory`: it
 * covers verification codes, password resets and suspension notices, the API
 * refuses to suppress them, and offering a switch that does nothing is worse
 * than offering none.
 */
export type TNotificationPreferenceCategory =
  "application" | "interview" | "match" | "message";

export type TNotificationChannel = "email" | "push";

export type TNotificationCategoryPreferences = Record<
  TNotificationChannel,
  boolean
>;

export type TNotificationPreferences = {
  emailEnabled: boolean;
  pushEnabled: boolean;
  // The API always sends every category with defaults already merged in, so
  // this is total rather than partial — including "account", which is returned
  // for completeness and never rendered.
  categories: Record<string, TNotificationCategoryPreferences>;
};

export type TUpdateNotificationPreferencesPayload = {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  categories?: Partial<
    Record<
      TNotificationPreferenceCategory,
      Partial<TNotificationCategoryPreferences>
    >
  >;
};

/** The categories the settings page renders, in the order it renders them. */
export const NOTIFICATION_PREFERENCE_CATEGORIES: TNotificationPreferenceCategory[] =
  ["application", "interview", "match", "message"];
