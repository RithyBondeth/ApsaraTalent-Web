"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import ImagePopup from "@/components/utils/image-popup";
import Tag from "@/components/utils/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { dateFormatterv2 } from "@/utils/functions/dateformatter-v2";
import {
  IBenefits,
  IImage,
  ISocial,
} from "@/utils/interfaces/user-interface/company.interface";
import { TPlatform } from "@/utils/types/platform.type";
import {
  LucideAlarmClock,
  LucideArrowLeft,
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
import { CompanyDetailPageSkeleton } from "./skeleton";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useGetOneCompanyStore } from "@/stores/apis/company/get-one-cmp.store";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useEmployeeLikeStore } from "@/stores/apis/matching/employee-like.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

/* ── Local helpers ──────────────────────────────────────────────── */
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border/60 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]">
          {icon}
        </span>
      </div>
      <h3 className="font-semibold text-base">{title}</h3>
    </div>
  );
}

function MetaChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-full [&>svg]:size-3.5 [&>svg]:shrink-0">
      {icon}
      {label}
    </span>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function CompanyDetailPage() {
  const router = useRouter();
  const param = useParams<{ companyId: string }>();
  const id = param.companyId;

  const t = useTranslations("toast");
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const { loading, companyData, queryOneCompany } = useGetOneCompanyStore();

  const employeeLikeStore = useEmployeeLikeStore();
  const queryCurrentEmployeeLiked = useGetCurrentEmployeeLikedStore();
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore();
  const countCurrentEmployeeMatching = useCountCurrentEmployeeMatchingStore();
  const countAllEmployeeFavoritesStore = useCountAllEmployeeFavoritesStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(null);
  const ignoreNextClick = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") setIsInitialized(true);
  }, []);

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
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openProfilePopup]);

  const handleClickImagePopup = () => {
    if (ignoreNextClick.current) { ignoreNextClick.current = false; return; }
    setOpenImagePopup(true);
  };

  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) { ignoreNextClick.current = false; return; }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
  };

  const handleLike = async () => {
    if (currentUser?.employee) {
      const employeeId = currentUser.employee.id;
      const companyId = companyData?.id;
      if (!employeeId || !companyId) return;
      try {
        toast.dismiss();
        await employeeLikeStore.employeeLike(employeeId, companyId);
        const liked = useEmployeeLikeStore.getState().data;
        if (liked) {
          if (liked.isMatched) {
            toast.success(t("itsAMatch"), { description: t("youLikedEachOther", { name: liked.company.name }) });
            countCurrentEmployeeMatching.countCurrentEmployeeMatching(employeeId);
            setTimeout(() => router.push("/matching"), DEFAULT_REDIRECT_DELAY_MS);
          } else {
            toast.success(t("youLiked", { name: liked.company.name }));
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          }
        }
      } catch {
        toast.error(employeeLikeStore.error || t("failedToLikeCompany"));
      } finally {
        queryCurrentEmployeeLiked.queryCurrentEmployeeLiked(employeeId);
      }
    }
  };

  const handleAddToFavorite = async () => {
    if (currentUser?.employee) {
      const employeeId = currentUser.employee.id;
      const companyId = companyData?.id;
      if (!employeeId || !companyId) return;
      try {
        await employeeFavCompanyStore.addCompanyToFavorite(employeeId, companyId);
        countAllEmployeeFavoritesStore.countAllEmployeeFavorites(employeeId);
        toast.success(t("addedToFavorites", { name: companyData?.name }));
        await getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(employeeId);
      } catch {
        toast.error(employeeFavCompanyStore.empFavError || t("failedToSaveFavorite"));
      }
    }
  };

  const isLoading = !isInitialized || loading;
  if (isLoading) return <div className="animate-page-in"><CompanyDetailPageSkeleton /></div>;

  if (fetchError) return (
    <div className="flex h-[60vh] items-center justify-center animate-page-in">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-red-500 font-medium">{fetchError}</p>
        <Button variant="destructive" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );

  if (!companyData) return (
    <div className="flex h-[60vh] items-center justify-center animate-page-in">
      <div className="flex flex-col items-center gap-3">
        <p className="font-medium">Company not found</p>
        <Link href="/feed"><Button variant="outline">Back to Feed</Button></Link>
      </div>
    </div>
  );

  const isFav = employeeFavCompanyStore.isFavorite(id);
  const likeDisabled = employeeLikeStore.loading || !currentUser?.employee?.id;
  const favDisabled = employeeFavCompanyStore.loading || !currentUser?.employee?.id;

  return (
    <div className="flex flex-col gap-5 animate-page-in tablet-sm:pb-24">
      {/* ── Back Navigation Header ── */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur-sm -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center gap-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LucideArrowLeft className="size-4" />
            Back
          </button>
          <span className="text-border">|</span>
          <span className="text-sm font-semibold truncate">{companyData.name || "Company Detail"}</span>
        </div>
      </header>

      {/* ── Hero Card ─────────────────────────────────────────────── */}
      <Card>
        {/* Cover */}
        <div
          className={`h-44 sm:h-56 rounded-t-2xl bg-cover bg-center bg-no-repeat ${
            !companyData.cover
              ? "bg-gradient-to-br from-primary/30 via-primary/10 to-muted"
              : ""
          }`}
          style={companyData.cover ? { backgroundImage: `url(${companyData.cover})` } : {}}
        />

        {/* Identity */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar — overlaps cover */}
            <Avatar
              className="size-20 sm:size-24 -mt-10 sm:-mt-12 ring-[3px] ring-card shadow-xl flex-shrink-0 cursor-pointer"
              rounded="md"
              onClick={(e) => { if (companyData.avatar) handleClickProfilePopup(e); }}
            >
              <AvatarImage src={companyData.avatar ?? ""} />
              <AvatarFallback className="uppercase text-xl font-bold">
                {companyData.name ? companyData.name.slice(0, 2) : <User />}
              </AvatarFallback>
            </Avatar>

            {/* Name + info */}
            <div className="flex-1 min-w-0 pt-2 tablet-md:text-center tablet-md:pt-0 tablet-md:mt-1">
              <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                {companyData.name}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {companyData.industry}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 tablet-md:justify-center">
                {companyData.location && (
                  <MetaChip icon={<LucideMapPinned />} label={companyData.location} />
                )}
                {companyData.companySize && (
                  <MetaChip icon={<LucideUsers />} label={`${companyData.companySize}+ Employees`} />
                )}
                {companyData.foundedYear && (
                  <MetaChip icon={<LucideCalendarDays />} label={`Est. ${companyData.foundedYear}`} />
                )}
              </div>
            </div>

            {/* Desktop actions */}
            <div className="flex gap-2 flex-shrink-0 pt-2 tablet-md:hidden">
              {!isFav && (
                <Button variant="outline" size="sm" onClick={handleAddToFavorite} disabled={favDisabled}>
                  <LucideBookmark className="size-4" /> Save
                </Button>
              )}
              <Button size="sm" onClick={handleLike} disabled={likeDisabled}>
                <LucideHeartHandshake className="size-4" /> Like
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Content Grid ──────────────────────────────────────────── */}
      <div className="flex items-start gap-5 tablet-lg:flex-col">

        {/* Left — main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* About */}
          {companyData.description && (
            <Card className="p-5 sm:p-6">
              <SectionTitle icon={<LucideInfo />} title={`About ${companyData.name}`} />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {companyData.description}
              </p>
            </Card>
          )}

          {/* Open Positions */}
          {companyData.openPositions && companyData.openPositions.length > 0 && (
            <Card className="p-5 sm:p-6">
              <SectionTitle icon={<LucideBriefcaseBusiness />} title="Open Positions" />
              <div className="flex flex-col gap-4">
                {companyData.openPositions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border/60 p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                  >
                    {/* Position header */}
                    <div className="flex items-start justify-between gap-3 tablet-md:flex-col">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">{item.title}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.type && <Tag icon={<LucideAlarmClock />} label={item.type} />}
                          {item.experience && <Tag icon={<LucideUser />} label={item.experience} />}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground tablet-md:flex-row tablet-md:gap-3 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <LucideCalendarDays className="size-3" />
                          Posted {dateFormatterv2(item.postedDate?.toString() ?? "")}
                        </span>
                        <span className="flex items-center gap-1">
                          <LucideCalendarDays className="size-3" />
                          Deadline {dateFormatterv2(item.deadlineDate?.toString() ?? "")}
                        </span>
                      </div>
                    </div>

                    {/* Position details */}
                    {(item.description || item.education || item.skills || item.salary) && (
                      <div className="mt-4 pt-4 border-t border-border/60 space-y-3">
                        {item.description && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
                            <TypographyMuted className="text-sm leading-relaxed">{item.description}</TypographyMuted>
                          </div>
                        )}
                        {item.education && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Education</p>
                            <TypographyMuted className="text-sm">{item.education}</TypographyMuted>
                          </div>
                        )}
                        {item.skills && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.skills.map((s) => <Tag key={s} label={s} />)}
                            </div>
                          </div>
                        )}
                        {item.salary && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Salary Range</p>
                            <span className="text-sm font-semibold text-primary">{item.salary}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Career Scope */}
          {companyData.careerScopes && companyData.careerScopes.length > 0 && (
            <Card className="p-5 sm:p-6">
              <SectionTitle icon={<LucideCompass />} title="Career Scope" />
              <div className="flex flex-wrap gap-2">
                {companyData.careerScopes.map((career, i) => (
                  <HoverCard key={i}>
                    <HoverCardTrigger><Tag label={career.name} /></HoverCardTrigger>
                    <HoverCardContent>
                      <TypographySmall>{career.description ?? career.name}</TypographySmall>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </Card>
          )}

          {/* Life at Company */}
          {companyData.images && companyData.images.length > 0 && (
            <Card className="p-5 sm:p-6">
              <SectionTitle icon={<LucideCamera />} title={`Life at ${companyData.name}`} />
              <Carousel className="w-full">
                <CarouselContent>
                  {companyData.images.map((item: IImage) => (
                    <CarouselItem key={item.id} className="max-w-[260px]">
                      <div
                        onClick={() => { handleClickImagePopup(); setCurrentCompanyImage(item.image); }}
                        className="h-44 rounded-xl my-1 ml-1 bg-cover bg-center bg-muted cursor-pointer hover:opacity-90 hover:scale-[1.01] transition-all duration-200"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-3" />
                <CarouselNext className="mr-3" />
              </Carousel>
            </Card>
          )}
        </div>

        {/* Right — sidebar */}
        <div className="w-72 flex flex-col gap-5 tablet-lg:w-full">

          {/* Company Info */}
          <Card className="p-5">
            <SectionTitle icon={<LucideBuilding2 />} title="Company Information" />
            <div className="space-y-3.5">
              {[
                { icon: <LucideBuilding />, label: "Industry", val: companyData.industry },
                { icon: <LucideMapPinned />, label: "Location", val: companyData.location },
                { icon: <LucideCalendarDays />, label: "Founded", val: companyData.foundedYear ? `${companyData.foundedYear}` : null },
                { icon: <LucideUsers />, label: "Company Size", val: companyData.companySize ? `${companyData.companySize}+ Employees` : null },
                { icon: <LucidePhone />, label: "Phone", val: companyData.phone },
                { icon: <LucideMail />, label: "Email", val: companyData.email },
              ].filter(r => r.val).map((row) => (
                <div key={row.label} className="flex items-start gap-2.5">
                  <span className="text-muted-foreground mt-0.5 flex-shrink-0 [&>svg]:size-4 [&>svg]:stroke-[1.5]">
                    {row.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{row.label}</p>
                    <p className="text-sm mt-0.5 break-words">{row.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Culture */}
          {(companyData.values.length > 0 || companyData.benefits.length > 0) && (
            <Card className="p-5">
              <SectionTitle icon={<LucideStar />} title="Culture & Benefits" />
              <div className="space-y-4">
                {companyData.values.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Values</p>
                    <div className="flex flex-col gap-1.5">
                      {companyData.values.map((v) => (
                        <div key={v.id} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40 px-3 py-2 rounded-lg">
                          <LucideCircleCheck className="size-4 flex-shrink-0" />
                          {v.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {companyData.benefits.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Benefits</p>
                    <div className="flex flex-col gap-1.5">
                      {companyData.benefits.map((b: IBenefits) => (
                        <div key={b.id} className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 rounded-lg">
                          <LucideCircleCheck className="size-4 flex-shrink-0" />
                          {b.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Socials */}
          {companyData.socials && companyData.socials.length > 0 && (
            <Card className="p-5">
              <SectionTitle icon={<LucideGlobe />} title="Social Links" />
              <div className="flex flex-wrap gap-2">
                {companyData.socials.map((s: ISocial) => (
                  <Link
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-xs font-medium transition-colors"
                  >
                    {getSocialPlatformTypeIcon(s.platform as TPlatform)}
                    {s.platform}
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="hidden tablet-md:flex fixed bottom-0 left-0 right-0 z-20 gap-3 px-4 py-3 bg-background/95 backdrop-blur-sm border-t border-border [&>button]:flex-1">
        {!isFav && (
          <Button variant="outline" onClick={handleAddToFavorite} disabled={favDisabled}>
            <LucideBookmark /> Save
          </Button>
        )}
        <Button onClick={handleLike} disabled={likeDisabled}>
          <LucideHeartHandshake /> Like
        </Button>
      </div>

      <ImagePopup open={openImagePopup} setOpen={setOpenImagePopup} image={currentCompanyImage!} />
      <ImagePopup open={openProfilePopup} setOpen={setOpenProfilePopup} image={companyData.avatar ?? ""} />
    </div>
  );
}
