import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_APPLICATION_NOTES_URL,
  API_APPLICATION_NOTE_URL,
} from "@/utils/constants/apis/job.api.constant";
import { IApplicationNote } from "@/utils/interfaces/application/application.interface";
import { create } from "zustand";

/*
  One Zustand slice per feature area, matching the pattern already used by
  `job-applications.store.ts`. Notes are keyed by application id so opening
  a drawer for a different candidate does not flash the previous list.
*/

type TApplicationNotesState = {
  notesByApplication: Record<string, IApplicationNote[]>;
  loadingByApplication: Record<string, boolean>;
  savingByApplication: Record<string, boolean>;
  deletingId: string | null;
  error: string | null;
  fetchNotes: (applicationId: string) => Promise<void>;
  createNote: (applicationId: string, body: string) => Promise<boolean>;
  deleteNote: (applicationId: string, noteId: string) => Promise<boolean>;
  reset: (applicationId?: string) => void;
};

export const useApplicationNotesStore = create<TApplicationNotesState>(
  (set, get) => ({
    notesByApplication: {},
    loadingByApplication: {},
    savingByApplication: {},
    deletingId: null,
    error: null,

    reset: (applicationId) => {
      if (!applicationId) {
        set({
          notesByApplication: {},
          loadingByApplication: {},
          savingByApplication: {},
          deletingId: null,
          error: null,
        });
        return;
      }
      set((state) => {
        const notes = { ...state.notesByApplication };
        delete notes[applicationId];
        const loading = { ...state.loadingByApplication };
        delete loading[applicationId];
        const saving = { ...state.savingByApplication };
        delete saving[applicationId];
        return {
          notesByApplication: notes,
          loadingByApplication: loading,
          savingByApplication: saving,
        };
      });
    },

    fetchNotes: async (applicationId) => {
      set((state) => ({
        loadingByApplication: {
          ...state.loadingByApplication,
          [applicationId]: true,
        },
        error: null,
      }));

      try {
        const response = await axios.get<IApplicationNote[]>(
          API_APPLICATION_NOTES_URL(applicationId),
        );
        set((state) => ({
          notesByApplication: {
            ...state.notesByApplication,
            [applicationId]: response.data,
          },
          loadingByApplication: {
            ...state.loadingByApplication,
            [applicationId]: false,
          },
        }));
      } catch (error) {
        set((state) => ({
          error: extractApiErrorMessage(error, "Failed to load notes"),
          loadingByApplication: {
            ...state.loadingByApplication,
            [applicationId]: false,
          },
        }));
      }
    },

    createNote: async (applicationId, body) => {
      set((state) => ({
        savingByApplication: {
          ...state.savingByApplication,
          [applicationId]: true,
        },
        error: null,
      }));

      try {
        const response = await axios.post<IApplicationNote>(
          API_APPLICATION_NOTES_URL(applicationId),
          { body },
        );
        set((state) => ({
          notesByApplication: {
            ...state.notesByApplication,
            // Newest first, to match the API's own order.
            [applicationId]: [
              response.data,
              ...(state.notesByApplication[applicationId] ?? []),
            ],
          },
          savingByApplication: {
            ...state.savingByApplication,
            [applicationId]: false,
          },
        }));
        return true;
      } catch (error) {
        set((state) => ({
          error: extractApiErrorMessage(error, "Failed to save note"),
          savingByApplication: {
            ...state.savingByApplication,
            [applicationId]: false,
          },
        }));
        return false;
      }
    },

    deleteNote: async (applicationId, noteId) => {
      set({ deletingId: noteId, error: null });

      try {
        await axios.delete(API_APPLICATION_NOTE_URL(applicationId, noteId));
        const current = get().notesByApplication[applicationId] ?? [];
        set((state) => ({
          notesByApplication: {
            ...state.notesByApplication,
            [applicationId]: current.filter((note) => note.id !== noteId),
          },
          deletingId: null,
        }));
        return true;
      } catch (error) {
        set({
          error: extractApiErrorMessage(error, "Failed to delete note"),
          deletingId: null,
        });
        return false;
      }
    },
  }),
);
