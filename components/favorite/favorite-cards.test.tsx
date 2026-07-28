import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FavoriteCompanyCard from "./company-favorite-card";
import FavoriteEmployeeCard from "./employee-favorite-card";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));
vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string, values?: Record<string, unknown>) => {
    if (namespace === "locations") return key;
    const labels: Record<string, string> = {
      remove: "Remove",
      viewDetail: "View detail",
      founded: `Founded ${values?.year ?? ""}`,
      memberCount: `${values?.count ?? 0} members`,
      positionCount: `${values?.count ?? 0} positions`,
      yrsExp: `${values?.years ?? 0} years`,
    };
    return labels[key] ?? key;
  },
}));

const positions = Array.from({ length: 7 }, (_, index) => ({
  id: `position-${index + 1}`,
  title: `Role ${index + 1}`,
  description: "Role description",
  type: "full-time",
  experience: "mid",
  education: "bachelor",
  skills: ["React"],
}));

describe("favorite cards", () => {
  beforeEach(() => vi.clearAllMocks());

  it("routes company details, removes the favorite, and limits visible roles", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <FavoriteCompanyCard
        id="company-1"
        avatar=""
        name="Apsara Labs"
        industry="Technology"
        foundedYear={2020}
        description="Product company"
        openPosition={positions}
        companySize={40}
        location="phnom-penh"
        isRemoving
        onRemoveFromFavorite={onRemove}
      />,
    );

    expect(screen.getByText("Role 6")).toBeVisible();
    expect(screen.queryByText("Role 7")).not.toBeInTheDocument();
    expect(container.querySelector("article")).toHaveClass(
      "animate-card-pop-shrink",
    );
    await user.click(screen.getByRole("button", { name: "Remove" }));
    await user.click(screen.getByRole("button", { name: "View detail" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(mocks.replace).toHaveBeenCalledWith("/feed/company/company-1");
  });

  it("routes employee details, removes the favorite, and limits visible skills", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <FavoriteEmployeeCard
        id="employee-1"
        avatar=""
        name="Dara Sok"
        username="dara"
        description="Frontend engineer"
        position="Engineer"
        experience="4"
        availability="available"
        location="phnom-penh"
        skills={["One", "Two", "Three", "Four", "Five", "Six", "Seven"]}
        onRemoveFromFavorite={onRemove}
      />,
    );

    expect(screen.getByText("Six")).toBeVisible();
    expect(screen.queryByText("Seven")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    await user.click(screen.getByRole("button", { name: "View detail" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(mocks.replace).toHaveBeenCalledWith("/feed/employee/employee-1");
  });
});
