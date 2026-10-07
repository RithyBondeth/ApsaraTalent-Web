/**
 * Mirrors the frequency enum on the API. Kept as a string union rather than
 * a re-exported enum so the shared type does not depend on the server's
 * ESavedSearchFrequency at type-check time.
 */
export type TSavedSearchFrequency = "off" | "daily" | "weekly";

export interface ISavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  frequency: TSavedSearchFrequency;
  lastNotifiedAt: string | null;
  lastResultJobIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSavedSearchPayload {
  name: string;
  filters: Record<string, unknown>;
  frequency?: TSavedSearchFrequency;
}

export interface IUpdateSavedSearchPayload {
  name?: string;
  frequency?: TSavedSearchFrequency;
  filters?: Record<string, unknown>;
}

export interface ISavedSearchPreview {
  totalMatches: number;
  newMatchCount: number;
}
