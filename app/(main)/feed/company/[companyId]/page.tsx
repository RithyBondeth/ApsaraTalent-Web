"use client";

import { Button } from "@/components/ui/button";
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
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { getSocialPlatformTypeIcon } from "@/utils/functions/ui/get-social-type";
import { translateLocation, getNameInitials } from "@/utils/functions/text";
import { formatDisplayDate } from "@/utils/functions/date";
import { IBenefits } from "@/utils/interfaces/user/company.interface";
import { IImage } from "@/utils/interfaces/user/company.interface";
import { ISocialLink } from "@/utils/interfaces/user/social.interface";
import { TPlatform } from "@/utils/types/user/platform.type";
import {
  LucideAlarmClock,
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideBuilding2,
  LucideCalendarDays,
  LucideCamera,
  LucideCircleCheck,
  LucideCompass,
  LucideGlobe,
  LucideHeartHandshake,
  LucideInfo,
  LucideMail,
  LucideMapPinned,
  LucidePhone,
  LucideStar,
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
import { DetailIdentityHeader } from "@/components/utils/layout/detail-identity-header";

export default function CompanyDetailPage() {
  /* ---------------------------------- Utils ---------------------------------- */
  const router = useRouter();
  const param = useParams<{ companyId: string }>();
  const id = param.companyId;
  const t = useTranslations("toast");
  const tf = useTranslations("feed");
  const tl = useTranslations("locations");

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

  // ── Handle Click Profile Popup ───────────────────────────────────────
  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
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
      <div className="flex h-[60vh] items-center justify-center animate-page-in">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-red-500 font-medium">{fetchError}</p>
          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
          >
            {tf("retry")}
          </Button>
        </div>
      </div>
    );

  /* ------------------------------ Not Found State ------------------------------ */
  if (!companyData)
    return (
      <div className="flex h-[60vh] items-center justify-center animate-page-in">
        <div className="flex flex-col items-center gap-3">
          <p className="font-medium">{tf("companyNotFound")}</p>
          <Link href="/feed">
            <Button variant="outline">{tf("backToFeed")}</Button>
          </Link>
        </div>
      </div>
    );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5 animate-page-in tablet-sm:pb-24">
      {/* Effect Portal Section */}
      {effectPortal}

      {/* Detail Identity Header Section */}
      <DetailIdentityHeader
        title={companyData.name || tf("companyDetail")}
        subtitle={companyData.industry}
        avatar={companyData.avatar}
        cover={companyData.cover}
        fallback={
          companyData.name ? getNameInitials(companyData.name) : <User />
        }
        backLabel={tf("back")}
        onBack={() => router.back()}
        onAvatarClick={
          companyData.avatar
            ? (event) => handleClickProfilePopup(event)
            : undefined
        }
        menu={
          <UserModerationMenu
            targetId={companyData.id}
            targetName={companyData.name || tf("companyDetail")}
          />
        }
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
                className="h-10 rounded-xl px-4"
                onClick={handleAddToFavorite}
                disabled={favDisabled}
              >
                <LucideBookmark className="size-4" /> {tf("save")}
              </Button>
            )}
            <Button
              className="h-10 rounded-xl px-4 shadow-sm"
              onClick={handleLike}
              disabled={likeDisabled}
            >
              <LucideHeartHandshake className="size-4" /> {tf("interested")}
            </Button>
          </>
        }
      />

      {/* Content Grid Section */}
      <div className="flex items-start gap-5 tablet-lg:flex-col">
        {/* Left Section */}
        <div className="stagger-list flex-1 min-w-0 flex flex-col gap-5">
          {/* About Section */}
          {companyData.description && (
            <DetailCard className="p-5 sm:p-6">
              <SectionTitle
                icon={<LucideInfo />}
                title={tf("dialogAboutCompany", { name: companyData.name })}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {companyData.description}
              </p>
            </DetailCard>
          )}

          {/* Open Positions Section */}
          {companyData.openPositions &&
            companyData.openPositions.length > 0 && (
              <DetailCard className="p-5 sm:p-6">
                <SectionTitle
                  icon={<LucideBriefcaseBusiness />}
                  title={tf("openPositions")}
                />
                <div className="flex flex-col gap-4">
                  {companyData.openPositions.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/60 bg-background/50 p-4 transition-all duration-200 hover:border-brand/25 hover:shadow-[0_4px_16px_hsl(var(--foreground)/0.05)]"
                    >
                      {/* Position Header Section */}
                      <div className="flex items-start justify-between gap-3 tablet-md:flex-col">
                        <div className="space-y-2">
                          <p className="font-semibold text-sm">{item.title}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.type && (
                              <Tag
                                icon={<LucideAlarmClock />}
                                label={item.type}
                              />
                            )}
                            {item.experience && (
                              <Tag
                                icon={<LucideUser />}
                                label={item.experience}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground tablet-md:flex-row tablet-md:gap-3 flex-shrink-0">
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
                        item.salary) && (
                        <div className="mt-4 pt-4 border-t border-border/60 space-y-3">
                          {item.description && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                {tf("description")}
                              </p>
                              <TypographyMuted className="text-sm leading-relaxed">
                                {item.description}
                              </TypographyMuted>
                            </div>
                          )}
                          {item.education && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                {tf("dialogEducation")}
                              </p>
                              <TypographyMuted className="text-sm">
                                {item.education}
                              </TypographyMuted>
                            </div>
                          )}
                          {item.skills && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                {tf("dialogSkills")}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {item.skills.map((s) => (
                                  <Tag key={s} label={s} />
                                ))}
                              </div>
                            </div>
                          )}
                          {item.salary && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                {tf("salaryRange")}
                              </p>
                              <span className="text-sm font-semibold text-brand">
                                {item.salary}
                              </span>
                            </div>
                          )}
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
              />
              <div className="flex flex-wrap gap-2">
                {companyData.careerScopes.map((career, i) => (
                  <HoverCard key={i}>
                    <HoverCardTrigger>
                      <Tag label={career.name} />
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
            <DetailCard className="p-5 sm:p-6">
              <SectionTitle
                icon={<LucideCamera />}
                title={tf("lifeAt", { name: companyData.name })}
              />
              <Carousel className="w-full">
                <CarouselContent>
                  {companyData.images.map((item: IImage) => (
                    <CarouselItem key={item.id} className="max-w-[260px]">
                      <div
                        onClick={() => {
                          handleClickImagePopup();
                          setCurrentCompanyImage(item.image);
                        }}
                        className="h-44 rounded-xl my-1 ml-1 bg-cover bg-center bg-muted cursor-pointer hover:opacity-90 hover:scale-[1.01] transition-all duration-200"
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
        <div className="stagger-list w-72 flex flex-col gap-5 tablet-lg:w-full">
          {/* Company Information Section */}
          <DetailCard className="p-5">
            <SectionTitle
              icon={<LucideBuilding2 />}
              title={tf("companyInformation")}
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
                    <span className="text-muted-foreground mt-0.5 flex-shrink-0 [&>svg]:size-4 [&>svg]:stroke-[1.5]">
                      {row.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        {row.label}
                      </p>
                      <p className="text-sm mt-0.5 break-words">{row.val}</p>
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
              />
              <div className="space-y-4">
                {companyData.values.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {tf("dialogValues")}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {companyData.values.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm text-foreground"
                        >
                          <LucideCircleCheck className="size-4 flex-shrink-0 text-brand" />
                          {v.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {companyData.benefits.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {tf("dialogBenefits")}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {companyData.benefits.map((b: IBenefits) => (
                        <div
                          key={b.id}
                          className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm text-foreground"
                        >
                          <LucideCircleCheck className="size-4 flex-shrink-0 text-brand" />
                          {b.label}
                        </div>
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
              <SectionTitle icon={<LucideGlobe />} title={tf("socialLinks")} />
              <div className="flex flex-wrap gap-2">
                {companyData.socials.map((s: ISocialLink) => (
                  <Link
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/50 px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/20 hover:bg-brand-soft/60"
                  >
                    {getSocialPlatformTypeIcon(s.platform as TPlatform)}
                    {s.platform}
                  </Link>
                ))}
              </div>
            </DetailCard>
          )}
        </div>
      </div>

      {/* Mobile Sticky Action Bar Section */}
      <div className="fixed bottom-0 left-0 right-0 z-20 hidden gap-3 border-t border-border/80 bg-card/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_hsl(var(--foreground)/0.06)] backdrop-blur-xl tablet-md:flex [&>button]:h-12 [&>button]:flex-1 [&>button]:rounded-xl">
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
          <LucideHeartHandshake /> {tf("interested")}
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
