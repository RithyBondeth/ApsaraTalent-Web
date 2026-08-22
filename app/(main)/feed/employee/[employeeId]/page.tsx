"use client";

import { Button } from "@/components/ui/button";
import { PageState } from "@/components/utils/feedback/page-state";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ImagePopup from "@/components/utils/data-display/image-popup";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useGetOneEmployeeStore } from "@/stores/apis/employee/get-one-emp.store";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";
import { useCompanyLikeStore } from "@/stores/apis/matching/company-like.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { getSocialPlatformTypeIcon } from "@/utils/functions/ui";
import { translateLocation } from "@/utils/functions/text";
import { AVATAR_INITIALS_LENGTH } from "@/utils/constants/ui.constant";
import { formatShortDate } from "@/utils/functions/date";
import { extractCleanFilename } from "@/utils/functions/file";
import {
  IEducation,
  ISkill,
  IExperience,
} from "@/utils/interfaces/user/employee.interface";
import { ISocialLink } from "@/utils/interfaces/user/social.interface";
import { TPlatform } from "@/utils/types/user/platform.type";
import {
  LucideArrowLeft,
  LucideAtSign,
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideCalendar,
  LucideDownload,
  LucideEye,
  LucideFileText,
  LucideGlobe,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideMail,
  LucideMapPinned,
  LucidePhone,
  LucideTransgender,
  LucideUser,
  LucideUserX,
  LucideZap,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { EmployeeDetailPageLoadingSkeleton } from "@/components/employee/skeleton";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";
import { useFeedActionEffect } from "@/components/utils/effects/feed-action-effect";
import MetaChip from "@/components/utils/data-display/meta-chip";
import { AvailabilityBadge } from "@/components/utils/data-display/availability-badge";
import { DetailCard } from "@/components/utils/data-display/detail-card";
import { SectionTitle } from "@/components/utils/layout/section-title";
import UserModerationMenu from "@/components/moderation/user-moderation-menu";
import { API_GET_EMP_DOCUMENT_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { ProfileDetailHero } from "@/components/feed/detail/profile-detail-hero";

export default function EmployeeDetailPage() {
  /* ---------------------------------- Utils ---------------------------------- */
  const router = useRouter();
  const params = useParams<{ employeeId: string }>();
  const id = params.employeeId;
  const t = useTranslations("toast");
  const tf = useTranslations("feed");
  const tl = useTranslations("locations");

  /* -------------------------------- All States ------------------------------- */
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const { trigger: triggerEffect, effectPortal } = useFeedActionEffect();

  /* ------------------------------ API Integration ---------------------------- */
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const { loading, employeeData, queryOneEmployee } = useGetOneEmployeeStore();
  const companyLikeStore = useCompanyLikeStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const countAllCompanyFavoritesStore = useCountCurrentCompanyFavoritesStore();
  const currentCompanyId = currentUser?.company?.id;

  /* --------------------------------- Effects --------------------------------- */
  // ── Initialize Component State ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") setIsInitialized(true);
  }, []);

  // ── Block access if this emp was already liked by the current cmp ──────
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentCompanyId) {
      setAccessGranted(true);
      return;
    }
    (async () => {
      await useGetCurrentCompanyLikedStore
        .getState()
        .queryCurrentCompanyLiked(currentCompanyId);
      const liked =
        useGetCurrentCompanyLikedStore.getState().currentCompanyLiked;
      if (liked?.some((e) => e.id === id)) {
        router.replace("/feed");
      } else {
        setAccessGranted(true);
      }
    })();
  }, [currentCompanyId, id, isInitialized, router]);

  useEffect(() => {
    const fetch = async () => {
      if (!isInitialized || !id) return;
      try {
        setFetchError(null);
        useGetOneEmployeeStore.setState({ employeeData: null, loading: true });
        await queryOneEmployee(id);
      } catch {
        setFetchError("Failed to load employee data. Please try again.");
      }
    };
    fetch();
  }, [id, isInitialized, queryOneEmployee]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Company Like Employee ─────────────────────────────────────────
  const handleLike = async (e: React.MouseEvent) => {
    if (currentUser?.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData?.id;
      if (!companyId || !employeeId) return;
      // Snapshot before the API call — backend auto-removes from favorites on like
      const wasFavorited = companyFavEmployeeStore.isFavorite(employeeId);
      try {
        triggerEffect("like", e);
        toast.dismiss();
        await companyLikeStore.companyLike(companyId, employeeId);
        const data = useCompanyLikeStore.getState().data;
        if (data) {
          const name =
            data.employee.username ??
            `${data.employee.lastname} ${data.employee.lastname}`;
          if (data.isMatched) {
            toast.success(t("itsAMatch"), {
              description: t("yourCompanyLikedEachOther", { name }),
            });
            // Matching badge increment handled by socket "newNotification" type=match
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          } else {
            toast.success(t("youLiked", { name }), {
              description: tf("likedSuccessDescription"),
            });
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          }
        }
      } catch {
        toast.error(companyLikeStore.error || t("failedToLikeEmployee"));
      } finally {
        // Optimistically add to liked list (avoids a full re-fetch)
        if (employeeData) {
          useGetCurrentCompanyLikedStore
            .getState()
            .optimisticAddLiked(employeeData);
        }
        // Sync favorite badge locally — no network call needed
        if (wasFavorited) countAllCompanyFavoritesStore.decrementCount();
      }
    }
  };

  // ── Handle Add Employee To Favorite ─────────────────────────────────────
  const handleAddToFavorite = async (e: React.MouseEvent) => {
    if (currentUser?.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData?.id;
      const name =
        employeeData?.username ??
        `${employeeData?.firstname} ${employeeData?.lastname}`;
      if (!companyId || !employeeId) return;
      try {
        triggerEffect("save", e);
        await companyFavEmployeeStore.addEmployeeToFavorite(
          companyId,
          employeeId,
        );
        // Increment badge locally — avoids a count re-fetch and the race
        // condition where a stale in-flight response overwrites the new value
        countAllCompanyFavoritesStore.incrementCount();
        toast.success(t("addedToFavorites", { name }));
        // No need to refetch the full favorites list from the detail page;
        // the favorite page fetches fresh data on its own mount.
      } catch {
        toast.error(
          companyFavEmployeeStore.cmpFavError || t("failedToSaveFavorite"),
        );
      }
    }
  };

  // ── Handle Download File ──────────────────────────────────────────────
  const handleDownloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Document download failed");
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error(t("downloadFailed"));
    }
  };

  /* ------------------------------- Loading State ------------------------------- */
  const isLoading = !isInitialized || !accessGranted || loading;
  if (isLoading)
    return (
      <div className="animate-page-in">
        <EmployeeDetailPageLoadingSkeleton />
      </div>
    );

  /* -------------------------------- Error State -------------------------------- */
  if (fetchError)
    return (
      <div className="animate-page-in">
        <PageState
          variant="error"
          title={fetchError}
          action={{
            label: tf("retry"),
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );

  /* ------------------------------ Not Found State ---------------------------- */
  if (!employeeData)
    return (
      <div className="animate-page-in">
        <PageState
          variant="empty"
          title={tf("employeeNotFound")}
          description={tf("employeeNotFoundDescription")}
          icon={LucideUserX}
          action={{ label: tf("backToFeed"), href: "/feed" }}
        />
      </div>
    );

  /* ------------------------------ Derived States ---------------------------- */
  const isFav = companyFavEmployeeStore.isFavorite(id);
  const likeDisabled = companyLikeStore.loading || !currentUser?.company?.id;
  const favDisabled =
    companyFavEmployeeStore.loading || !currentUser?.company?.id;
  const fullName = [employeeData.firstname, employeeData.lastname]
    .filter(Boolean)
    .join(" ");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="profile-detail-page animate-page-in mx-auto flex w-full max-w-7xl flex-col gap-4 tablet-sm:pb-28 sm:gap-5">
      {/* Feed Action Effect Portal Section */}
      {effectPortal}

      {/* Back Navigation Header Section */}
      <header className="sticky top-0 z-30 -mx-3 border-b border-border bg-background/95 px-3 backdrop-blur-xl sm:-mx-4 sm:px-4 lg:-mx-5 lg:px-5">
        <div className="mx-auto flex h-16 min-w-0 max-w-7xl items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 shrink-0 items-center gap-2 border border-border bg-card px-3 text-sm font-semibold text-muted-foreground transition-[border-color,background-color,color,transform] hover:border-foreground/35 hover:bg-muted/60 hover:text-foreground active:translate-y-px"
          >
            <LucideArrowLeft className="size-4" />
            <span className="hidden sm:inline">{tf("back")}</span>
          </button>
          <div className="min-w-0 flex-1 border-l border-border pl-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {tf("employeeDetail")}
            </p>
            <p className="truncate text-sm font-semibold">
              {fullName || tf("employeeDetail")}
            </p>
          </div>
          <UserModerationMenu
            targetId={employeeData.id}
            targetName={fullName || tf("employeeDetail")}
            variant="editorial"
            triggerClassName="size-10 rounded-none border border-border bg-card hover:border-foreground/35"
          />
        </div>
      </header>

      {/* Hero Card Section */}
      <ProfileDetailHero
        kind="employee"
        eyebrow={tf("employeeDetail")}
        name={fullName || employeeData.username || tf("employeeDetail")}
        headline={employeeData.job}
        avatar={employeeData.avatar}
        fallback={
          employeeData.username ? (
            employeeData.username.slice(0, AVATAR_INITIALS_LENGTH)
          ) : (
            <User />
          )
        }
        onAvatarClick={() => setOpenProfilePopup(true)}
        status={
          employeeData.availability ? (
            <AvailabilityBadge availability={employeeData.availability} />
          ) : undefined
        }
        meta={
          <>
            {employeeData.gender && (
              <MetaChip
                icon={<LucideTransgender />}
                text={
                  employeeData.gender.toLowerCase() === "male"
                    ? tf("genderMale")
                    : employeeData.gender.toLowerCase() === "female"
                      ? tf("genderFemale")
                      : tf("genderOther")
                }
              />
            )}
            {employeeData.yearsOfExperience && (
              <MetaChip
                icon={<LucideBriefcaseBusiness />}
                text={employeeData.yearsOfExperience}
              />
            )}
            {employeeData.location && (
              <MetaChip
                icon={<LucideMapPinned />}
                text={translateLocation(employeeData.location, tl)}
              />
            )}
            {employeeData.username && (
              <MetaChip icon={<LucideAtSign />} text={employeeData.username} />
            )}
          </>
        }
        actions={
          <>
            {!isFav && (
              <Button
                variant="outline"
                onClick={handleAddToFavorite}
                disabled={favDisabled}
                className="min-w-24"
              >
                <LucideBookmark className="size-4" /> {tf("save")}
              </Button>
            )}
            <Button
              onClick={handleLike}
              disabled={likeDisabled}
              className="min-w-24"
            >
              <LucideHeartHandshake className="size-4" /> {tf("like")}
            </Button>
          </>
        }
      />

      {/* Content Grid Section */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-5">
        {/* Left Section */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          {/* About Section */}
          {employeeData.description && (
            <DetailCard className="profile-detail-employee-about p-5 sm:p-7">
              <SectionTitle
                icon={<LucideUser />}
                title={tf("dialogAbout")}
                variant="detail"
              />
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {employeeData.description}
              </p>
            </DetailCard>
          )}

          {/* Skills Section */}
          {employeeData.skills && employeeData.skills.length > 0 && (
            <DetailCard className="profile-detail-employee-skills p-5 sm:p-6">
              <SectionTitle
                icon={<LucideZap />}
                title={tf("dialogSkills")}
                variant="detail"
              />
              <div className="profile-detail-skill-cloud flex flex-wrap gap-2">
                {employeeData.skills.map((item: ISkill) => (
                  <HoverCard key={item.id}>
                    <HoverCardTrigger>
                      <Tag label={item.name} />
                    </HoverCardTrigger>
                    <HoverCardContent className="flex flex-col gap-1">
                      <TypographySmall className="text-sm">
                        {item.name}
                      </TypographySmall>
                      <TypographyMuted className="text-xs">
                        {item.description}
                      </TypographyMuted>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </DetailCard>
          )}

          {/* Experience Section */}
          {employeeData.experiences && employeeData.experiences.length > 0 && (
            <DetailCard className="profile-detail-employee-experience p-5 sm:p-6">
              <SectionTitle
                icon={<LucideBriefcaseBusiness />}
                title={tf("experience")}
                variant="detail"
              />
              <div className="flex flex-col gap-3">
                {employeeData.experiences.map(
                  (item: IExperience, i: number) => (
                    <div key={item.id} className="flex gap-3">
                      {/* Timeline dot + line */}
                      <div className="flex flex-shrink-0 flex-col items-center pt-1">
                        <div className="size-2.5 flex-shrink-0 border border-foreground bg-foreground" />
                        {i < employeeData.experiences.length - 1 && (
                          <div className="mt-1.5 w-px flex-1 bg-border/60" />
                        )}
                      </div>
                      {/* Content Section */}
                      <div
                        className={`min-w-0 flex-1 ${i < employeeData.experiences.length - 1 ? "pb-3" : ""}`}
                      >
                        <div className="profile-detail-timeline-card border border-border p-4 transition-[border-color,box-shadow,transform] duration-200 hover:border-foreground/30 hover:shadow-hard-sm">
                          <p className="text-base font-bold tracking-tight">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatShortDate(item.startDate)} —{" "}
                            {item.endDate
                              ? formatShortDate(item.endDate)
                              : tf("present")}
                          </p>
                          {item.description && (
                            <TypographyMuted className="mt-2 text-sm leading-relaxed">
                              {item.description}
                            </TypographyMuted>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </DetailCard>
          )}

          {/* Education Section */}
          {employeeData.educations && employeeData.educations.length > 0 && (
            <DetailCard className="profile-detail-employee-education p-5 sm:p-6">
              <SectionTitle
                icon={<LucideGraduationCap />}
                title={tf("dialogEducation")}
                variant="detail"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {employeeData.educations.map((item: IEducation) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 border border-border p-4 transition-[border-color,box-shadow,transform] duration-200 hover:border-foreground/30 hover:shadow-hard-sm"
                  >
                    <div className="flex size-9 flex-shrink-0 items-center justify-center border border-border bg-muted/60">
                      <LucideGraduationCap
                        className="size-4 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.school}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.degree}
                      </p>
                      {item.year && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/70">
                          <LucideCalendar className="size-3" />
                          {formatShortDate(item.year)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DetailCard>
          )}
        </div>

        {/* Right Section: Sidebar Section */}
        <aside className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:sticky lg:top-20">
          {/* Documents Section */}
          {(employeeData.resume || employeeData.coverLetter) && (
            <DetailCard className="p-5">
              <SectionTitle
                icon={<LucideFileText />}
                title={tf("documents")}
                variant="detail"
              />
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    file: employeeData.resume,
                    suffix: "resume",
                    type: "resume" as const,
                  },
                  {
                    file: employeeData.coverLetter,
                    suffix: "coverletter",
                    type: "cover-letter" as const,
                  },
                ]
                  .filter((d) => d.file)
                  .map(({ file, suffix, type }) => {
                    const documentUrl = API_GET_EMP_DOCUMENT_URL(id, type);
                    return (
                      <div
                        key={suffix}
                        className="flex items-center justify-between gap-2 border border-border bg-muted/40 px-3 py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <LucideFileText
                            className="size-4 flex-shrink-0 text-muted-foreground"
                            strokeWidth={1.5}
                          />
                          <span className="truncate text-xs text-muted-foreground">
                            {extractCleanFilename(file!)}
                          </span>
                        </div>
                        <div className="flex flex-shrink-0 gap-0.5">
                          <Link href={documentUrl} target="_blank">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="View document"
                              className="size-8 rounded-none"
                            >
                              <LucideEye className="size-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Download document"
                            className="size-8 rounded-none"
                            onClick={() =>
                              handleDownloadFile(
                                documentUrl,
                                `${employeeData.username || "user"}-${suffix}`,
                              )
                            }
                          >
                            <LucideDownload className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </DetailCard>
          )}

          {/* Contact Section */}
          <DetailCard className="p-5">
            <SectionTitle
              icon={<LucidePhone />}
              title={tf("contact")}
              variant="detail"
            />
            <div className="space-y-3.5">
              {[
                {
                  icon: <LucidePhone />,
                  label: tf("phone"),
                  val: employeeData.phone,
                },
                {
                  icon: <LucideMail />,
                  label: tf("email"),
                  val: employeeData.email,
                },
                {
                  icon: <LucideMapPinned />,
                  label: tf("address"),
                  val: translateLocation(employeeData.location, tl),
                },
              ]
                .filter((r) => r.val)
                .map((row) => (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 text-muted-foreground [&>svg]:size-4 [&>svg]:stroke-[1.5]">
                      {row.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </p>
                      <p className="mt-0.5 break-words text-sm">{row.val}</p>
                    </div>
                  </div>
                ))}
            </div>
          </DetailCard>

          {/* Socials Section */}
          {employeeData.socials && employeeData.socials.length > 0 && (
            <DetailCard className="p-5">
              <SectionTitle
                icon={<LucideGlobe />}
                title={tf("socialLinks")}
                variant="detail"
              />
              <div className="flex flex-wrap gap-2">
                {employeeData.socials.map((item: ISocialLink) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-border bg-muted/50 px-3 py-2 text-xs font-semibold transition-colors hover:border-foreground/30 hover:bg-muted"
                  >
                    {getSocialPlatformTypeIcon(item.platform as TPlatform)}
                    {item.platform}
                  </Link>
                ))}
              </div>
            </DetailCard>
          )}
        </aside>
      </div>

      {/* Mobile Sticky Action Bar Section */}
      <div className="fixed bottom-0 left-0 right-0 z-30 hidden gap-2 border-t border-border bg-background/95 px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl tablet-md:flex [&>button]:flex-1 [&>button]:rounded-none">
        {!isFav && (
          <Button
            variant="outline"
            onClick={handleAddToFavorite}
            disabled={favDisabled}
          >
            <LucideBookmark /> {tf("save")}
          </Button>
        )}
        <Button onClick={handleLike} disabled={likeDisabled}>
          <LucideHeartHandshake /> {tf("like")}
        </Button>
      </div>

      {/* Profile Popup Section */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={employeeData.avatar ?? ""}
      />
    </div>
  );
}
