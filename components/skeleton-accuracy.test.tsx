import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CompanyCardSkeleton, {
  CompanyDetailPageLoadingSkeleton,
} from "@/components/company/skeleton";
import { DashboardLoadingSkeleton } from "@/components/dashboard/skeleton";
import EmployeeCardSkeleton, {
  EmployeeDetailPageLoadingSkeleton,
} from "@/components/employee/skeleton";
import { FavoriteLoadingSkeleton } from "@/components/favorite/skeleton";
import FeedPageLoadingSkeleton from "@/components/feed/skeleton";
import InterviewLoadingSkeleton from "@/components/interview/skeleton";
import { MatchingLoadingSkeleton } from "@/components/matching/skeleton";
import MessageLoadingSkeleton from "@/components/message/skeleton";
import NotificationLoadingSkeleton from "@/components/notification/skeleton";
import {
  CompanyProfilePageLoadingSkeleton,
  EmployeeProfilePageLoadingSkeleton,
} from "@/components/profile/skeleton";
import ResumeBuilderLoadingSkeleton, {
  ResumeEditorLoadingSkeleton,
} from "@/components/resume-builder/skeleton";
import {
  SearchCompanyLoadingSkeleton,
  SearchEmployeeLoadingSkeleton,
} from "@/components/search/skeleton";
import SettingLoadingSkeleton from "@/components/setting/skeleton";
import StaticContentLoadingSkeleton from "@/components/static-content/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";

afterEach(cleanup);

const pageSkeletons = [
  ["company card", () => <CompanyCardSkeleton />],
  ["company detail", () => <CompanyDetailPageLoadingSkeleton />],
  ["dashboard", () => <DashboardLoadingSkeleton />],
  ["employee card", () => <EmployeeCardSkeleton />],
  ["employee detail", () => <EmployeeDetailPageLoadingSkeleton />],
  ["favorite employee", () => <FavoriteLoadingSkeleton isEmployee />],
  ["favorite company", () => <FavoriteLoadingSkeleton isEmployee={false} />],
  ["feed employee", () => <FeedPageLoadingSkeleton isEmployee />],
  ["feed company", () => <FeedPageLoadingSkeleton isEmployee={false} />],
  [
    "interview employee",
    () => <InterviewLoadingSkeleton role={USER_ROLE.EMPLOYEE} />,
  ],
  [
    "interview company",
    () => <InterviewLoadingSkeleton role={USER_ROLE.COMPANY} />,
  ],
  ["matching employee", () => <MatchingLoadingSkeleton isEmployee />],
  ["matching company", () => <MatchingLoadingSkeleton isEmployee={false} />],
  ["message", () => <MessageLoadingSkeleton />],
  ["notification", () => <NotificationLoadingSkeleton />],
  ["company profile", () => <CompanyProfilePageLoadingSkeleton />],
  ["employee profile", () => <EmployeeProfilePageLoadingSkeleton />],
  ["resume builder", () => <ResumeBuilderLoadingSkeleton />],
  ["resume editor", () => <ResumeEditorLoadingSkeleton />],
  ["employee search", () => <SearchEmployeeLoadingSkeleton />],
  ["company search", () => <SearchCompanyLoadingSkeleton />],
  ["setting", () => <SettingLoadingSkeleton />],
  ["static content", () => <StaticContentLoadingSkeleton sectionCount={5} />],
] as const;

describe.each(pageSkeletons)("%s skeleton", (_, createSkeleton) => {
  it("keeps placeholder corners square except for circular UI", () => {
    const { container } = render(createSkeleton());
    const invalidRounding = Array.from(
      container.querySelectorAll<HTMLElement>(".animate-shimmer"),
    ).flatMap((element) =>
      element.className
        .split(/\s+/)
        .map((className) => className.split(":").at(-1) ?? className)
        .filter(
          (className) =>
            className.startsWith("rounded") &&
            className !== "rounded-none" &&
            className !== "rounded-full",
        ),
    );

    expect(invalidRounding).toEqual([]);
  });
});

describe("route-specific skeleton geometry", () => {
  it("matches legal section counts and metadata", () => {
    const { container } = render(
      <StaticContentLoadingSkeleton sectionCount={11} hasMeta />,
    );

    expect(container.querySelectorAll("main section")).toHaveLength(11);
    expect(
      container.querySelectorAll("aside [class*='grid-cols-[28px_1fr]']"),
    ).toHaveLength(11);
    // `hasMeta` now means "this page hands the banner its stats on first
    // paint" — the legal pages show last-updated, sections and reading time.
    // It used to mean a single icon-plus-date meta row, which is the shape the
    // hero no longer has.
    expect(container.querySelectorAll("dl > div")).toHaveLength(3);
  });

  it("uses the live notification control heights", () => {
    const { container } = render(<NotificationLoadingSkeleton />);

    expect(container.querySelectorAll(".h-10.w-16")).toHaveLength(6);
    expect(
      container.querySelector(".h-11.w-full.tablet-sm\\:flex"),
    ).not.toBeNull();
  });
});
