import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCompanyFavEmployeeStore } from "./company-fav-employee.store";
import { useCountCurrentCompanyFavoritesStore } from "./count-current-company-favorites.store";
import { useCountCurrentEmployeeFavoritesStore } from "./count-current-employee-favorites.store";
import { useEmployeeFavCompanyStore } from "./employee-fav-company.store";
import { useGetAllCompanyFavoritesStore } from "./get-all-company-favorites.store";
import { useGetAllEmployeeFavoritesStore } from "./get-all-employee-favorites.store";

const axiosMocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));
vi.mock("zustand/middleware", () => ({
  persist: (initializer: unknown) => initializer,
}));

describe("favorite API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    localStorage.clear();
    useCompanyFavEmployeeStore.setState({
      favoriteEmployeeIds: new Set(),
      message: null,
      loading: false,
      cmpFavError: null,
    });
    useEmployeeFavCompanyStore.setState({
      favoriteCompanyIds: new Set(),
      message: null,
      loading: false,
      empFavError: null,
    });
    useCountCurrentCompanyFavoritesStore.setState({
      totalCmpFavorites: null,
      loading: false,
      error: null,
    });
    useCountCurrentEmployeeFavoritesStore.setState({
      totalEmpFavorites: null,
      loading: false,
      error: null,
    });
    useGetAllCompanyFavoritesStore.setState({
      employeeData: null,
      loading: false,
      error: null,
    });
    useGetAllEmployeeFavoritesStore.setState({
      companyData: null,
      loading: false,
      error: null,
    });
  });

  it("adds, removes, checks, optimistically removes, and clears company favorites", async () => {
    axiosMocks.post
      .mockResolvedValueOnce({ data: { message: "Employee saved" } })
      .mockResolvedValueOnce({ data: { message: "Employee removed" } });
    const store = useCompanyFavEmployeeStore.getState();

    await store.addEmployeeToFavorite("company-1", "employee-1");
    expect(useCompanyFavEmployeeStore.getState().isFavorite("employee-1")).toBe(
      true,
    );
    await useCompanyFavEmployeeStore
      .getState()
      .removeEmployeeFromFavorite("company-1", "employee-1", "favorite-1");
    expect(useCompanyFavEmployeeStore.getState().isFavorite("employee-1")).toBe(
      false,
    );

    useCompanyFavEmployeeStore.setState({
      favoriteEmployeeIds: new Set(["employee-2"]),
    });
    useCompanyFavEmployeeStore.getState().optimisticRemove("employee-2");
    useCompanyFavEmployeeStore.getState().clearFavorite();
    expect(useCompanyFavEmployeeStore.getState()).toMatchObject({
      favoriteEmployeeIds: new Set(),
      message: null,
      cmpFavError: null,
    });
  });

  it("adds, removes, checks, optimistically removes, and clears employee favorites", async () => {
    axiosMocks.post
      .mockResolvedValueOnce({ data: { message: "Company saved" } })
      .mockResolvedValueOnce({ data: { message: "Company removed" } });

    await useEmployeeFavCompanyStore
      .getState()
      .addCompanyToFavorite("employee-1", "company-1");
    expect(useEmployeeFavCompanyStore.getState().isFavorite("company-1")).toBe(
      true,
    );
    await useEmployeeFavCompanyStore
      .getState()
      .removeCompanyFromFavorite("employee-1", "company-1", "favorite-1");
    expect(useEmployeeFavCompanyStore.getState().isFavorite("company-1")).toBe(
      false,
    );

    useEmployeeFavCompanyStore.setState({
      favoriteCompanyIds: new Set(["company-2"]),
    });
    useEmployeeFavCompanyStore.getState().optimisticRemove("company-2");
    useEmployeeFavCompanyStore.getState().clearFavorites();
    expect(useEmployeeFavCompanyStore.getState()).toMatchObject({
      favoriteCompanyIds: new Set(),
      message: null,
      empFavError: null,
    });
  });

  it("rolls an optimistic favorite back when the API fails", async () => {
    axiosMocks.post.mockRejectedValueOnce(new Error("save failed"));

    await expect(
      useCompanyFavEmployeeStore
        .getState()
        .addEmployeeToFavorite("company-1", "employee-1"),
    ).rejects.toThrow("save failed");

    expect(useCompanyFavEmployeeStore.getState()).toMatchObject({
      favoriteEmployeeIds: new Set(),
      loading: false,
      cmpFavError: "save failed",
    });
  });

  it("rolls back failed employee favorite additions and both removal types", async () => {
    axiosMocks.post.mockRejectedValue(new Error("favorite request failed"));

    await expect(
      useEmployeeFavCompanyStore
        .getState()
        .addCompanyToFavorite("employee-1", "company-1"),
    ).rejects.toThrow("favorite request failed");
    expect(useEmployeeFavCompanyStore.getState().favoriteCompanyIds).toEqual(
      new Set(),
    );

    useEmployeeFavCompanyStore.setState({
      favoriteCompanyIds: new Set(["company-1"]),
    });
    await expect(
      useEmployeeFavCompanyStore
        .getState()
        .removeCompanyFromFavorite("employee-1", "company-1", "favorite-1"),
    ).rejects.toThrow("favorite request failed");
    expect(useEmployeeFavCompanyStore.getState().favoriteCompanyIds).toEqual(
      new Set(["company-1"]),
    );

    useCompanyFavEmployeeStore.setState({
      favoriteEmployeeIds: new Set(["employee-1"]),
    });
    await expect(
      useCompanyFavEmployeeStore
        .getState()
        .removeEmployeeFromFavorite("company-1", "employee-1", "favorite-1"),
    ).rejects.toThrow("favorite request failed");
    expect(useCompanyFavEmployeeStore.getState().favoriteEmployeeIds).toEqual(
      new Set(["employee-1"]),
    );
  });

  it("loads and locally adjusts favorite counts for both roles", async () => {
    axiosMocks.get
      .mockResolvedValueOnce({ data: { count: 4 } })
      .mockResolvedValueOnce({ data: { count: 7 } });

    await useCountCurrentCompanyFavoritesStore
      .getState()
      .countCurrentCmpFavorites("company-1");
    await useCountCurrentEmployeeFavoritesStore
      .getState()
      .countCurrentEmpFavorites("employee-1");
    useCountCurrentCompanyFavoritesStore.getState().incrementCount();
    useCountCurrentCompanyFavoritesStore.getState().decrementCount();
    useCountCurrentEmployeeFavoritesStore.getState().incrementCount();
    useCountCurrentEmployeeFavoritesStore.getState().decrementCount();

    expect(
      useCountCurrentCompanyFavoritesStore.getState().totalCmpFavorites,
    ).toBe(4);
    expect(
      useCountCurrentEmployeeFavoritesStore.getState().totalEmpFavorites,
    ).toBe(7);
  });

  it("keeps favorite counts non-negative and handles count failures", async () => {
    useCountCurrentCompanyFavoritesStore.setState({ totalCmpFavorites: null });
    useCountCurrentEmployeeFavoritesStore.setState({ totalEmpFavorites: 0 });
    useCountCurrentCompanyFavoritesStore.getState().decrementCount();
    useCountCurrentEmployeeFavoritesStore.getState().decrementCount();
    expect(
      useCountCurrentCompanyFavoritesStore.getState().totalCmpFavorites,
    ).toBe(0);
    expect(
      useCountCurrentEmployeeFavoritesStore.getState().totalEmpFavorites,
    ).toBe(0);

    axiosMocks.get
      .mockRejectedValueOnce(new Error("company count failed"))
      .mockRejectedValueOnce(new Error("employee count failed"));
    await useCountCurrentCompanyFavoritesStore
      .getState()
      .countCurrentCmpFavorites("company-1");
    await useCountCurrentEmployeeFavoritesStore
      .getState()
      .countCurrentEmpFavorites("employee-1");
    expect(useCountCurrentCompanyFavoritesStore.getState()).toMatchObject({
      totalCmpFavorites: null,
      loading: false,
      error: "company count failed",
    });
    expect(useCountCurrentEmployeeFavoritesStore.getState()).toMatchObject({
      totalEmpFavorites: null,
      loading: false,
      error: "employee count failed",
    });
  });

  it("loads company favorites and synchronizes the favorite employee set", async () => {
    const favorites = [
      { id: "favorite-1", employee: { id: "employee-1" } },
      { id: "favorite-2", employee: { id: "employee-2" } },
    ];
    axiosMocks.get.mockResolvedValueOnce({ data: favorites });

    await useGetAllCompanyFavoritesStore
      .getState()
      .queryAllCompanyFavorites("company-1");

    expect(useGetAllCompanyFavoritesStore.getState().employeeData).toEqual(
      favorites,
    );
    expect(useCompanyFavEmployeeStore.getState().favoriteEmployeeIds).toEqual(
      new Set(["employee-1", "employee-2"]),
    );
  });

  it("loads employee favorites and synchronizes the favorite company set", async () => {
    const favorites = [
      { id: "favorite-1", company: { id: "company-1" } },
      { id: "favorite-2", company: { id: "company-2" } },
    ];
    axiosMocks.get.mockResolvedValueOnce({ data: favorites });

    await useGetAllEmployeeFavoritesStore
      .getState()
      .queryAllEmployeeFavorites("employee-1");

    expect(useGetAllEmployeeFavoritesStore.getState().companyData).toEqual(
      favorites,
    );
    expect(useEmployeeFavCompanyStore.getState().favoriteCompanyIds).toEqual(
      new Set(["company-1", "company-2"]),
    );
  });

  it("records failures when favorite collections cannot be loaded", async () => {
    axiosMocks.get
      .mockRejectedValueOnce(new Error("company favorites failed"))
      .mockRejectedValueOnce(new Error("employee favorites failed"));

    await useGetAllCompanyFavoritesStore
      .getState()
      .queryAllCompanyFavorites("company-1");
    await useGetAllEmployeeFavoritesStore
      .getState()
      .queryAllEmployeeFavorites("employee-1");

    expect(useGetAllCompanyFavoritesStore.getState()).toMatchObject({
      employeeData: null,
      loading: false,
      error: "company favorites failed",
    });
    expect(useGetAllEmployeeFavoritesStore.getState()).toMatchObject({
      companyData: null,
      loading: false,
      error: "employee favorites failed",
    });
  });
});
