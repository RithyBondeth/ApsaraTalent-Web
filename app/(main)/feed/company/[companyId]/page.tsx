"use client";

import { Button } from "@/components/ui/button";
import { PageState } from "@/components/utils/feedback/page-state";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ImagePopup from "@/components/utils/data-display/image-popup";
import Tag from "@/components/utils/data-display/tag";
import { BenefitValueChip } from "@/components/utils/data-display/benefit-value-chip";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { getSocialPlatformTypeIcon } from "@/utils/functions/ui";
import {
  formatAvailabilityWords,
  translateLocation,
  getNameInitials,
} from "@/utils/functions/text";
import { useSalaryText } from "@/hooks/utils/use-salary-text";
import { formatDisplayDate } from "@/utils/functions/date";
import { IBenefits } from "@/utils/interfaces/user/company.interface";
import { IImage } from "@/utils/interfaces/user/company.interface";
import { ISocialLink } from "@/utils/interfaces/user/social.interface";
import { TPlatform } from "@/utils/types/user/platform.type";
import {
  LucideAlarmClock,
  LucideArrowLeft,
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideBuilding2,
  LucideCalendarDays,
  LucideCamera,
  LucideCompass,
  LucideGlobe,
  LucideHeartHandshake,
  LucideInfo,
  LucideMail,
  LucideMapPinned,
  LucidePhone,
  LucideStar,
  LucideLanguages,
  LucideUser,
  LucideUsers,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useGetOneCompanyStore } from "@/stores/apis/company/get-one-cmp.store";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useEmployeeLikeStore } from "@/stores/apis/matching/employee-like.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  LIKE_DEBOUNCE_MS,
} from "@/utils/constants/config.constant";
import { useFeedActionEffect } from "@/components/utils/effects/feed-action-effect";
import MetaChip from "@/components/utils/data-display/meta-chip";
import { DetailCard } from "@/components/utils/data-display/detail-card";
import { SectionTitle } from "@/components/utils/layout/section-title";
import { CompanyDetailPageLoadingSkeleton } from "@/components/company/skeleton";
import UserModerationMenu from "@/components/moderation/user-moderation-menu";
import { ProfileDetailHero } from "@/components/feed/detail/profile-detail-hero";

export default function CompanyDetailPage() {
  /* ---------------------------------- Utils ---------------------------------- */
  const router = useRouter();
  const param = useParams<{ companyId: string }>();
  const id = param.companyId;
  const t = useTranslations("toast");
  const tf = useTranslations("feed");
  const tl = useTranslations("locations");
  const salaryText = useSalaryText();

  /* -------------------------------- All States ------------------------------- */
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openImagePopup, setOpenImagePopup] = useState<boolean>(false);
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(
    null,
  );
  const ignoreNextClick = useRef<boolean>(false);
  const { trigger: triggerEffect, effectPortal } = useFeedActionEffect();

  /* ------------------------------ API Integration ----------------------------- */
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const { loading, companyData, queryOneCompany } = useGetOneCompanyStore();
  const employeeLikeStore = useEmployeeLikeStore();
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const countAllEmployeeFavoritesStore =
    useCountCurrentEmployeeFavoritesStore();
  const currentEmployeeId = currentUser?.employee?.id;

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (typeof window !== "undefined") setIsInitialized(true);
  }, []);

  // Block access if this company was already liked by the current employee
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentEmployeeId) {
      setAccessGranted(true);
      return;
    }
    (async () => {
      await useGetCurrentEmployeeLikedStore
        .getState()
        .queryCurrentEmployeeLiked(currentEmployeeId);
      const liked =
        useGetCurrentEmployeeLikedStore.getState().currentEmployeeLiked;
      if (liked?.some((c) => c.id === id)) {
        router.replace("/feed");
      } else {
        setAccessGranted(true);
      }
    })();
  }, [currentEmployeeId, id, isInitialized, router]);

  useEffect(() => {
    const fetch = async () => {
      if (!isInitialized || !id) return;
      try {
        setFetchError(null);
        useGetOneCompanyStore.setState({ companyData: null, loading: true });
        await queryOneCompany(id);
      } catch {
        setFetchError("Failed to load company data. Please try again.");
      }
    };
    fetch();
  }, [id, isInitialized, queryOneCompany]);

  useEffect(() => {
    if (openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), LIKE_DEBOUNCE_MS);
    }
  }, [openProfilePopup]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Click Image Popup ─────────────────────────────────────────
  const handleClickImagePopup = () => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    setOpenImagePopup(true);
  };

  // ── Handle Employee Like Company ──────────────────────────────────────
  const handleLike = async (e: React.MouseEvent) => {
    if (currentUser?.employee) {
      const employeeId = currentUser.employee.id;
      const companyId = companyData?.id;
      if (!employeeId || !companyId) return;
      // Snapshot before the API call — backend auto-removes from favorites on like
      const wasFavorited = employeeFavCompanyStore.isFavorite(companyId);
      try {
        triggerEffect("like", e);
        toast.dismiss();
        await employeeLikeStore.employeeLike(employeeId, companyId);
        const liked = useEmployeeLikeStore.getState().data;
        if (liked) {
          if (liked.isMatched) {
            toast.success(t("itsAMatch"), {
              description: t("youLikedEachOther", { name: liked.company.name }),
            });
            // Matching badge increment handled by socket "newNotification" type=match
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          } else {
            toast.success(t("youLiked", { name: liked.company.name }), {
              description: tf("likedSuccessDescription", {
                name: liked.company.name,
              }),
            });
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          }
        }
      } catch {
        toast.error(employeeLikeStore.error || t("failedToLikeCompany"));
      } finally {
        // Optimistically add to liked list (avoids a full re-fetch)
        if (companyData) {
          useGetCurrentEmployeeLikedStore
            .getState()
            .optimisticAddLiked(companyData);
        }
        // Sync favorite badge locally — no network call needed
        if (wasFavorited) countAllEmployeeFavoritesStore.decrementCount();
      }
    }
  };

  // ── Handle Add Company To Favorite ──────────────────────────────────────
  const handleAddToFavorite = async (e: React.MouseEvent) => {
    if (currentUser?.employee) {
      const employeeId = currentUser.employee.id;
      const companyId = companyData?.id;
      if (!employeeId || !companyId) return;
      try {
        triggerEffect("save", e);
        await employeeFavCompanyStore.addCompanyToFavorite(
          employeeId,
          companyId,
        );
        // Increment badge locally — avoids a count re-fetch and the race
        // condition where a stale in-flight response overwrites the new value
        countAllEmployeeFavoritesStore.incrementCount();
        toast.success(t("addedToFavorites", { name: companyData?.name }));
        // No need to refetch the full favorites list from the detail page;
        // the favorite page fetches fresh data on its own mount.
      } catch {
        toast.error(
          employeeFavCompanyStore.empFavError || t("failedToSaveFavorite"),
        );
      }
    }
  };

  /* ------------------------------ Derived States ------------------------------ */
  const isFav = employeeFavCompanyStore.isFavorite(id);
  const likeDisabled = employeeLikeStore.loading || !currentUser?.employee?.id;
  const favDisabled =
    employeeFavCompanyStore.loading || !currentUser?.employee?.id;

  /* ------------------------------- Loading State ------------------------------- */
  const isLoading = !isInitialized || !accessGranted || loading;
  if (isLoading)
    return (
      <div className="animate-page-in">
        <CompanyDetailPageLoadingSkeleton />
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

  /* ------------------------------ Not Found State ------------------------------ */
  if (!companyData)
    return (
      <div className="animate-page-in">
        <PageState
          variant="empty"
          title={tf("companyNotFound")}
          description={tf("companyNotFoundDescription")}
          icon={LucideBuilding2}
          action={{ label: tf("backToFeed"), href: "/feed" }}
        />
      </div>
    );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="profile-detail-page animate-page-in mx-auto flex w-full max-w-7xl flex-col gap-4 tablet-sm:pb-28 sm:gap-5">
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
              {tf("companyDetail")}
            </p>
            <p className="truncate text-sm font-semibold">
              {companyData.name || tf("companyDetail")}
            </p>
          </div>
          <UserModerationMenu
            targetId={companyData.id}
            targetName={companyData.name || tf("companyDetail")}
            variant="editorial"
            triggerClassName="size-10 rounded-none border border-border bg-card hover:border-foreground/35"
          />
        </div>
      </header>

      {/* Hero Card Section */}
      <ProfileDetailHero
        kind="company"
        eyebrow={tf("companyDetail")}
        name={companyData.name || tf("companyDetail")}
        headline={companyData.industry}
        avatar={companyData.avatar}
        cover={companyData.cover}
        fallback={
          companyData.name ? getNameInitials(companyData.name) : <User />
        }
        onAvatarClick={() => setOpenProfilePopup(true)}
        meta={
          <>
            {companyData.industry && (
              <MetaChip icon={<LucideBuilding />} text={companyData.industry} />
            )}
            {companyData.location && (
              <MetaChip
                icon={<LucideMapPinned />}
                text={translateLocation(companyData.location, tl)}
              />
            )}
            {companyData.companySize && (
              <MetaChip
                icon={<LucideUsers />}
                text={tf("dialogEmployeesCount", {
                  count: companyData.companySize,
                })}
              />
            )}
            {companyData.foundedYear && (
              <MetaChip
                icon={<LucideCalendarDays />}
                text={tf("established", { year: companyData.foundedYear })}
              />
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
          {companyData.description && (
            <DetailCard className="profile-detail-company-about p-5 sm:p-7">
              <SectionTitle
                icon={<LucideInfo />}
                title={tf("dialogAboutCompany", { name: companyData.name })}
                variant="detail"
              />
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {companyData.description}
              </p>
            </DetailCard>
          )}

          {/* Open Positions Section */}
          {companyData.openPositions &&
            companyData.openPositions.length > 0 && (
              <DetailCard className="profile-detail-company-positions p-5 sm:p-6">
                <SectionTitle
                  icon={<LucideBriefcaseBusiness />}
                  title={tf("openPositions")}
                  variant="detail"
                  action={
                    <span className="flex size-8 items-center justify-center border border-foreground bg-foreground text-xs font-bold text-background">
                      {companyData.openPositions.length}
                    </span>
                  }
                />
                <div className="flex flex-col gap-4">
                  {companyData.openPositions.map((item) => (
                    <div
                      key={item.id}
                      className="profile-detail-position-card border border-border p-4 transition-[border-color,box-shadow,transform] duration-200 hover:border-foreground/30 hover:shadow-hard sm:p-5"
                    >
                      {/* Position Header Section */}
                      <div className="flex items-start justify-between gap-3 tablet-md:flex-col">
                        <div className="space-y-2">
                          <p className="text-lg font-bold tracking-tight sm:text-xl">
                            {item.title}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.type && (
                              <Tag
                                icon={<LucideAlarmClock />}
                                label={formatAvailabilityWords(item.type)}
                                neutral
                                className="!rounded-none border border-border"
                              />
                            )}
                            {item.experience && (
                              <Tag
                                icon={<LucideUser />}
                                label={item.experience}
                                neutral
                                className="!rounded-none border border-border"
                              />
                            )}
                            {!!item.languagesRequired?.length && (
                              <Tag
                                icon={<LucideLanguages />}
                                label={item.languagesRequired.join(", ")}
                                neutral
                                className="!rounded-none border border-border"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 flex-col gap-1 text-xs text-muted-foreground tablet-md:flex-row tablet-md:gap-3">
                          <span className="flex items-center gap-1">
                            <LucideCalendarDays className="size-3" />
                            {tf("posted")}{" "}
                            {formatDisplayDate(
                              item.postedDate?.toString() ?? "",
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <LucideCalendarDays className="size-3" />
                            {tf("deadline")}{" "}
                            {formatDisplayDate(
                              item.deadlineDate?.toString() ?? "",
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Position Details Section */}
                      {(item.description ||
                        item.education ||
                        item.skills ||
                        item.salary ||
                        item.salaryMin != null ||
                        item.salaryMax != null) && (
                        <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
                          {item.description && (
                            <div>
                              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {tf("description")}
                              </p>
                              <TypographyMuted className="text-sm leading-relaxed">
                                {item.description}
                              </TypographyMuted>
                            </div>
                          )}
                          {item.education && (
                            <div>
                              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {tf("dialogEducation")}
                              </p>
                              <TypographyMuted className="text-sm">
                                {item.education}
                              </TypographyMuted>
                            </div>
                          )}
                          {item.skills && (
                            <div>
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {tf("dialogSkills")}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {item.skills.map((s) => (
                                  <Tag
                                    key={s}
                                    label={s}
                                    neutral
                                    className="!rounded-none border border-border"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {tf("salaryRange")}
                            </p>
                            <span className="text-sm font-semibold text-primary">
                              {salaryText(item)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DetailCard>
            )}

          {/* Career Scope Section */}
          {companyData.careerScopes && companyData.careerScopes.length > 0 && (
            <DetailCard className="p-5 sm:p-6">
              <SectionTitle
                icon={<LucideCompass />}
                title={tf("careerScope")}
                variant="detail"
              />
              <div className="flex flex-wrap gap-2">
                {companyData.careerScopes.map((career, i) => (
                  <HoverCard key={i}>
                    <HoverCardTrigger>
                      <Tag
                        label={career.name}
                        neutral
                        className="!rounded-none border border-border"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <TypographySmall>
                        {career.description ?? career.name}
                      </TypographySmall>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </DetailCard>
          )}

          {/* Company Images Section */}
          {companyData.images && companyData.images.length > 0 && (
            <DetailCard className="profile-detail-company-gallery p-5 sm:p-6">
              <SectionTitle
                icon={<LucideCamera />}
                title={tf("lifeAt", { name: companyData.name })}
                variant="detail"
              />
              <Carousel className="w-full">
                <CarouselContent>
                  {companyData.images.map((item: IImage) => (
                    <CarouselItem key={item.id} className="max-w-[320px]">
                      <div
                        onClick={() => {
                          handleClickImagePopup();
                          setCurrentCompanyImage(item.image);
                        }}
                        className="my-1 ml-1 h-52 cursor-pointer border border-border bg-muted bg-cover bg-center transition-[border-color,filter,transform] duration-200 hover:border-foreground/30 hover:brightness-95"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-3" />
                <CarouselNext className="mr-3" />
              </Carousel>
            </DetailCard>
          )}
        </div>

        {/* Right Section: Sidebar */}
        <aside className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:sticky lg:top-20">
          {/* Company Information Section */}
          <DetailCard className="profile-detail-company-information p-5">
            <SectionTitle
              icon={<LucideBuilding2 />}
              title={tf("companyInformation")}
              variant="detail"
            />
            <div className="space-y-3.5">
              {[
                {
                  icon: <LucideBuilding />,
                  label: tf("industryLabel"),
                  val: companyData.industry,
                },
                {
                  icon: <LucideMapPinned />,
                  label: tf("location"),
                  val: translateLocation(companyData.location, tl),
                },
                {
                  icon: <LucideCalendarDays />,
                  label: tf("foundedLabel"),
                  val: companyData.foundedYear
                    ? `${companyData.foundedYear}`
                    : null,
                },
                {
                  icon: <LucideUsers />,
                  label: tf("companySizeLabel"),
                  val: companyData.companySize
                    ? tf("dialogEmployeesCount", {
                        count: companyData.companySize,
                      })
                    : null,
                },
                {
                  icon: <LucidePhone />,
                  label: tf("phone"),
                  val: companyData.phone,
                },
                {
                  icon: <LucideMail />,
                  label: tf("email"),
                  val: companyData.email,
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

          {/* Values and Benefits Section */}
          {(companyData.values.length > 0 ||
            companyData.benefits.length > 0) && (
            <DetailCard className="p-5">
              <SectionTitle
                icon={<LucideStar />}
                title={tf("cultureAndBenefits")}
                variant="detail"
              />
              <div className="space-y-4">
                {companyData.benefits.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {tf("dialogBenefits")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.benefits.map((b: IBenefits) => (
                        <BenefitValueChip
                          key={b.id}
                          kind="benefit"
                          label={b.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {companyData.values.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {tf("dialogValues")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.values.map((v) => (
                        <BenefitValueChip
                          key={v.id}
                          kind="value"
                          label={v.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DetailCard>
          )}

          {/* Social Section */}
          {companyData.socials && companyData.socials.length > 0 && (
            <DetailCard className="p-5">
              <SectionTitle
                icon={<LucideGlobe />}
                title={tf("socialLinks")}
                variant="detail"
              />
              <div className="flex flex-wrap gap-2">
                {companyData.socials.map((s: ISocialLink) => (
                  <Link
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-border bg-muted/50 px-3 py-2 text-xs font-semibold transition-colors hover:border-foreground/30 hover:bg-muted"
                  >
                    {getSocialPlatformTypeIcon(s.platform as TPlatform)}
                    {s.platform}
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

      {/* Image Popup Section */}
      <ImagePopup
        open={openImagePopup}
        setOpen={setOpenImagePopup}
        image={currentCompanyImage!}
      />

      {/* Profile Popup Section */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={companyData.avatar ?? ""}
      />
    </div>
  );
}
