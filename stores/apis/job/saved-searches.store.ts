import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_SAVED_SEARCHES_URL,
  API_SAVED_SEARCH_URL,
} from "@/utils/constants/apis/job.api.constant";
import {
  ICreateSavedSearchPayload,
  ISavedSearch,
  IUpdateSavedSearchPayload,
} from "@/utils/interfaces/saved-search/saved-search.interface";
import { create } from "zustand";

/*
  Small CRUD slice for the candidate's saved searches. Same shape as the
  application stores: a top-level loading + error for the list, per-row
  ids for pending mutations so the UI can dim just the row being changed.
*/

type TSavedSearchesState = {
  items: ISavedSearch[];
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  updatingId: string | null;
  deletingId: string | null;
  error: string | null;

  fetchAll: () => Promise<void>;
  create: (payload: ICreateSavedSearchPayload) => Promise<ISavedSearch | null>;
  update: (
    savedSearchId: string,
    payload: IUpdateSavedSearchPayload,
  ) => Promise<boolean>;
  remove: (savedSearchId: string) => Promise<boolean>;
  reset: () => void;
};

export const useSavedSearchesStore = create<TSavedSearchesState>((set) => ({
  items: [],
  loading: false,
  loaded: false,
  saving: false,
  updatingId: null,
  deletingId: null,
  error: null,

  reset: () =>
    set({
      items: [],
      loading: false,
      loaded: false,
      saving: false,
      updatingId: null,
      deletingId: null,
      error: null,
    }),

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<ISavedSearch[]>(API_SAVED_SEARCHES_URL);
      set({
        items: response.data,
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        loaded: true,
        error: extractApiErrorMessage(error, "Failed to load saved searches"),
      });
    }
  },

  create: async (payload) => {
    set({ saving: true, error: null });
    try {
      const response = await axios.post<ISavedSearch>(
        API_SAVED_SEARCHES_URL,
        payload,
      );
      set((state) => ({
        // Newest first, matching the API's own order.
        items: [response.data, ...state.items],
        saving: false,
      }));
      return response.data;
    } catch (error) {
      set({
        saving: false,
        error: extractApiErrorMessage(error, "Failed to save this search"),
      });
      return null;
    }
  },

  update: async (savedSearchId, payload) => {
    set({ updatingId: savedSearchId, error: null });
    try {
      const response = await axios.patch<ISavedSearch>(
        API_SAVED_SEARCH_URL(savedSearchId),
        payload,
      );
      set((state) => ({
        items: state.items.map((item) =>
          item.id === savedSearchId ? response.data : item,
        ),
        updatingId: null,
      }));
      return true;
    } catch (error) {
      set({
        updatingId: null,
        error: extractApiErrorMessage(error, "Failed to update saved search"),
      });
      return false;
    }
  },

  remove: async (savedSearchId) => {
    set({ deletingId: savedSearchId, error: null });
    try {
      await axios.delete(API_SAVED_SEARCH_URL(savedSearchId));
      set((state) => ({
        items: state.items.filter((item) => item.id !== savedSearchId),
        deletingId: null,
      }));
      return true;
    } catch (error) {
      set({
        deletingId: null,
        error: extractApiErrorMessage(error, "Failed to delete saved search"),
      });
      return false;
    }
  },
}));
