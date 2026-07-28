import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: null as Record<string, unknown> | null,
  employeeFavorites: {
    companyData: [] as Array<Record<string, unknown>>,
    loading: false,
    error: null as string | null,
    queryAllEmployeeFavorites: vi.fn(),
  },
  companyFavorites: {
    employeeData: [] as Array<Record<string, unknown>>,
    loading: false,
    error: null as string | null,
    queryAllCompanyFavorites: vi.fn(),
  },
  employeeLiked: [] as Array<{ id: string }>,
  companyLiked: [] as Array<{ id: string }>,
  removeCompany: vi.fn(),
  removeEmployee: vi.fn(),
  decrementEmployee: vi.fn(),
  decrementCompany: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/stores/apis/users/get-current-user.store", () => ({
  useGetCurrentUserStore: (selector: (state: { user: unknown }) => unknown) =>
    selector({ user: mocks.user }),
}));
vi.mock("@/stores/apis/favorite/get-all-employee-favorites.store", () => ({
  useGetAllEmployeeFavoritesStore: () => mocks.employeeFavorites,
}));
vi.mock("@/stores/apis/favorite/get-all-company-favorites.store", () => ({
  useGetAllCompanyFavoritesStore: () => mocks.companyFavorites,
}));
vi.mock("@/stores/apis/favorite/employee-fav-company.store", () => ({
  useEmployeeFavCompanyStore: () => ({
    removeCompanyFromFavorite: mocks.removeCompany,
    empFavError: null,
  }),
}));
vi.mock("@/stores/apis/favorite/company-fav-employee.store", () => ({
  useCompanyFavEmployeeStore: () => ({
    removeEmployeeFromFavorite: mocks.removeEmployee,
    cmpFavError: null,
  }),
}));
vi.mock("@/stores/apis/favorite/count-current-employee-favorites.store", () => ({
  useCountCurrentEmployeeFavoritesStore: (
    selector: (state: { decrementCount: typeof mocks.decrementEmployee }) => unknown,
  ) => selector({ decrementCount: mocks.decrementEmployee }),
}));
vi.mock("@/stores/apis/favorite/count-current-company-favorites.store", () => ({
  useCountCurrentCompanyFavoritesStore: (
    selector: (state: { decrementCount: typeof mocks.decrementCompany }) => unknown,
  ) => selector({ decrementCount: mocks.decrementCompany }),
}));
vi.mock("@/stores/apis/matching/get-current-employee-liked.store", () => ({
  useGetCurrentEmployeeLikedStore: () => ({
    currentEmployeeLiked: mocks.employeeLiked,
  }),
}));
vi.mock("@/stores/apis/matching/get-current-company-liked.store", () => ({
  useGetCurrentCompanyLikedStore: () => ({
    currentCompanyLiked: mocks.companyLiked,
  }),
}));
vi.mock("@/components/favorite/company-favorite-card", () => ({
  default: (props: { name: string; isRemoving: boolean; onRemoveFromFavorite: () => void }) => (
    <div data-removing={String(props.isRemoving)}>
      <span>{props.name}</span>
      <button onClick={props.onRemoveFromFavorite}>Remove company</button>
    </div>
  ),
}));
vi.mock("@/components/favorite/employee-favorite-card", () => ({
  default: (props: { name: string; onRemoveFromFavorite: () => void }) => (
    <div>
      <span>{props.name}</span>
      <button onClick={props.onRemoveFromFavorite}>Remove employee</button>
    </div>
  ),
}));
vi.mock("@/components/favorite/skeleton", () => ({
  FavoriteLoadingSkeleton: () => <div>Favorite loading</div>,
}));
vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <span role="img" aria-label={props.alt} />,
}));
vi.mock("sonner", () => ({
  toast: { success: mocks.toastSuccess, error: mocks.toastError },
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values?.name ? `${key}:${values.name}` : key,
}));

import FavoritePageClient from "./favorite-page-client";

const companyFavorite = (id: string, companyId: string, name: string) => ({
  id,
  company: {
    id: companyId,
    name,
    avatar: "",
    industry: "Technology",
    description: "Product company",
    companySize: 20,
    foundedYear: 2020,
    openPositions: [],
    location: "phnom-penh",
  },
});

describe("FavoritePageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.user = {
      role: "employee",
      employee: { id: "employee-1" },
    };
    mocks.employeeFavorites.companyData = [];
    mocks.employeeFavorites.loading = false;
    mocks.employeeFavorites.error = null;
    mocks.companyFavorites.employeeData = [];
    mocks.employeeLiked = [];
    mocks.companyLiked = [];
    mocks.removeCompany.mockResolvedValue(undefined);
    mocks.removeEmployee.mockResolvedValue(undefined);
    mocks.employeeFavorites.queryAllEmployeeFavorites.mockResolvedValue(undefined);
  });

  it("filters already-liked companies and completes delayed favorite removal", async () => {
    mocks.employeeFavorites.companyData = [
      companyFavorite("favorite-1", "company-1", "Visible Labs"),
      companyFavorite("favorite-2", "company-2", "Already Liked"),
    ];
    mocks.employeeLiked = [{ id: "company-2" }];
    const user = userEvent.setup();
    render(<FavoritePageClient initialIsEmployee />);

    expect(await screen.findByText("Visible Labs")).toBeVisible();
    expect(screen.queryByText("Already Liked")).not.toBeInTheDocument();
    expect(mocks.employeeFavorites.queryAllEmployeeFavorites).toHaveBeenCalledWith(
      "employee-1",
    );

    await user.click(screen.getByRole("button", { name: "Remove company" }));
    expect(screen.getByText("Visible Labs").parentElement).toHaveAttribute(
      "data-removing",
      "true",
    );
    await waitFor(
      () =>
        expect(mocks.removeCompany).toHaveBeenCalledWith(
          "employee-1",
          "company-1",
          "favorite-1",
        ),
      { timeout: 1000 },
    );
    expect(mocks.decrementEmployee).toHaveBeenCalledOnce();
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      "removedFromFavorites:Visible Labs",
    );
  });

  it("sends an employee with no favorites to company search", async () => {
    render(<FavoritePageClient initialIsEmployee />);
    const explore = await screen.findByRole("link", { name: "explore" });
    expect(explore).toHaveAttribute("href", "/search/company");
  });

  it("keeps the card and surfaces the thrown API message when removal fails", async () => {
    mocks.employeeFavorites.companyData = [
      companyFavorite("favorite-1", "company-1", "Visible Labs"),
    ];
    mocks.removeCompany.mockRejectedValueOnce(
      new Error("Favorite service unavailable"),
    );
    const user = userEvent.setup();
    render(<FavoritePageClient initialIsEmployee />);

    await user.click(
      await screen.findByRole("button", { name: "Remove company" }),
    );
    await waitFor(
      () =>
        expect(mocks.toastError).toHaveBeenCalledWith(
          "Favorite service unavailable",
        ),
      { timeout: 1000 },
    );
    expect(screen.getByText("Visible Labs")).toBeVisible();
    expect(mocks.decrementEmployee).not.toHaveBeenCalled();
  });
});
