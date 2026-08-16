import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CompanyCardSkeleton, {
  CompanyDetailPageLoadingSkeleton,
} from "@/components/company/skeleton";
import {
  DashboardChartSkeleton,
  DashboardLoadingSkeleton,
} from "@/components/dashboard/skeleton";
import EmployeeCardSkeleton, {
  EmployeeDetailPageLoadingSkeleton,
} from "@/components/employee/skeleton";
import { FavoriteLoadingSkeleton } from "@/components/favorite/skeleton";
import FeedPageLoadingSkeleton, {
  FeedBannerSkeleton,
  FeedDividerSkeleton,
  FeedRecommendationsSkeleton,
} from "@/components/feed/skeleton";
import InterviewLoadingSkeleton from "@/components/interview/skeleton";
import { MatchingLoadingSkeleton } from "@/components/matching/skeleton";
import MessageLoadingSkeleton, {
  MessagePaneSkeleton,
  MessageThreadSkeleton,
} from "@/components/message/skeleton";
import { NavbarUserMenuSkeleton } from "@/components/navbar/skeleton";
import NotificationLoadingSkeleton, {
  NotificationCardSkeleton,
} from "@/components/notification/skeleton";
import {
  CompanyProfilePageLoadingSkeleton,
  EmployeeProfilePageLoadingSkeleton,
} from "@/components/profile/skeleton";
import ResumeBuilderLoadingSkeleton, {
  ResumeEditorLoadingSkeleton,
  TemplateCardSkeleton,
} from "@/components/resume-builder/skeleton";
import {
  SearchCompanyCardSkeleton,
  SearchEmployeeCardSkeleton,
  SearchCompanyLoadingSkeleton,
  SearchEmployeeLoadingSkeleton,
} from "@/components/search/skeleton";
import SettingLoadingSkeleton from "@/components/setting/skeleton";
import StaticContentLoadingSkeleton from "@/components/static-content/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";
import { SectionTitleSkeleton } from "@/components/utils/layout/section-title";
import { USER_ROLE } from "@/utils/constants/auth.constant";

afterEach(cleanup);

const pageSkeletons = [
  ["company card", () => <CompanyCardSkeleton />],
  ["company detail", () => <CompanyDetailPageLoadingSkeleton />],
  ["dashboard", () => <DashboardLoadingSkeleton />],
  ["dashboard activity chart", () => <DashboardChartSkeleton />],
  ["dashboard rate chart", () => <DashboardChartSkeleton variant="rate" />],
  ["employee card", () => <EmployeeCardSkeleton />],
  ["employee detail", () => <EmployeeDetailPageLoadingSkeleton />],
  ["favorite employee", () => <FavoriteLoadingSkeleton isEmployee />],
  ["favorite company", () => <FavoriteLoadingSkeleton isEmployee={false} />],
  ["feed employee", () => <FeedPageLoadingSkeleton isEmployee />],
  ["feed company", () => <FeedPageLoadingSkeleton isEmployee={false} />],
  ["feed banner", () => <FeedBannerSkeleton />],
  ["feed recommendations", () => <FeedRecommendationsSkeleton isEmployee />],
  ["feed divider", () => <FeedDividerSkeleton />],
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
  ["message pane", () => <MessagePaneSkeleton />],
  ["message thread", () => <MessageThreadSkeleton />],
  ["navbar user menu", () => <NavbarUserMenuSkeleton />],
  ["notification", () => <NotificationLoadingSkeleton />],
  ["notification card", () => <NotificationCardSkeleton />],
  ["company profile", () => <CompanyProfilePageLoadingSkeleton />],
  ["employee profile", () => <EmployeeProfilePageLoadingSkeleton />],
  ["resume builder", () => <ResumeBuilderLoadingSkeleton />],
  ["resume editor", () => <ResumeEditorLoadingSkeleton />],
  ["resume template card", () => <TemplateCardSkeleton />],
  ["employee search", () => <SearchEmployeeLoadingSkeleton />],
  ["company search", () => <SearchCompanyLoadingSkeleton />],
  ["employee search card", () => <SearchEmployeeCardSkeleton />],
  ["company search card", () => <SearchCompanyCardSkeleton />],
  ["setting", () => <SettingLoadingSkeleton />],
  ["static content", () => <StaticContentLoadingSkeleton sectionCount={5} />],
  ["page banner", () => <PageBannerSkeleton statCount={2} />],
  ["section title", () => <SectionTitleSkeleton />],
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
  it("keeps individual shimmer shapes decorative", () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);

    const shimmer = container.querySelector(".animate-shimmer");
    expect(shimmer?.getAttribute("aria-hidden")).toBe("true");
    expect(shimmer?.classList.contains("pointer-events-none")).toBe(true);
  });

  it("uses the production page-banner lattice and stat geometry", () => {
    const { container } = render(<PageBannerSkeleton statCount={3} />);

    expect(container.querySelector(".page-banner-grid")).not.toBeNull();
    expect(
      container.querySelector(".page-banner-copy.pixel-pad"),
    ).not.toBeNull();
    expect(container.querySelectorAll(".page-banner-stats > div")).toHaveLength(
      3,
    );
  });

  it("matches legal section counts and metadata", () => {
    const { container } = render(
      <StaticContentLoadingSkeleton sectionCount={11} hasMeta />,
    );

    expect(container.querySelectorAll("main section")).toHaveLength(11);
    expect(
      container.querySelectorAll("aside [class*='grid-cols-[28px_1fr]']"),
    ).toHaveLength(11);
    expect(
      container.querySelector(".mt-6.flex.items-center.gap-2"),
    ).not.toBeNull();
  });

  it("uses the live notification control heights", () => {
    const { container } = render(<NotificationLoadingSkeleton />);

    expect(container.querySelectorAll(".h-10.w-16")).toHaveLength(6);
    expect(
      container.querySelector(".h-11.w-full.tablet-sm\\:flex"),
    ).not.toBeNull();
  });
});
