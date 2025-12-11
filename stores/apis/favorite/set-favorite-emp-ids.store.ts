import { create } from "zustand";

type TSetFavoriteEmployeeIds = {
  savedEmployeeIdsToFavorite: Set<string>;
  setEmployeeToFavorite: (id: string) => void;
  removeEmployeeFromFavorite: (id: string) => void;
  toggleEmployeeFavorite: (id: string) => void;
  clearAllEmployeeFavorite: () => void;
};

export const useSetEmployeeToFavoriteStore = create<TSetFavoriteEmployeeIds>(
  (set) => ({
    savedEmployeeIdsToFavorite: new Set(),
    setEmployeeToFavorite: (id: string) =>
      set((state) => ({
        savedEmployeeIdsToFavorite: new Set(state.savedEmployeeIdsToFavorite).add(id),
      })),
    removeEmployeeFromFavorite: (id: string) =>
      set((state) => {
        const newSet = new Set(state.savedEmployeeIdsToFavorite);
        newSet.delete(id);
        return { savedEmployeeIdsToFavorite: newSet };
      }),
    toggleEmployeeFavorite: (id: string) =>
      set((state) => {
        const newSet = new Set(state.savedEmployeeIdsToFavorite);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return { savedEmployeeIdsToFavorite: newSet };
      }),
    clearAllEmployeeFavorite: () => set({ savedEmployeeIdsToFavorite: new Set() }),
  })
);
