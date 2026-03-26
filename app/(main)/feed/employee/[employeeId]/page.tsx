"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ImagePopup from "@/components/utils/image-popup";
import Tag from "@/components/utils/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useGetOneEmployeeStore } from "@/stores/apis/employee/get-one-emp.store";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useCompanyLikeStore } from "@/stores/apis/matching/company-like.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { dateFormatter } from "@/utils/functions/dateformatter";
import { extractCleanFilename } from "@/utils/functions/extract-clean-filename";
import {
  IEducation,
  IExperience,
  ISkill,
  ISocial,
} from "@/utils/interfaces/user-interface/employee.interface";
import { TPlatform } from "@/utils/types/platform.type";
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
  LucideZap,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import EmployeeDetailPageSkeleton from "./skeleton";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";
import { DetailCard as Card, SectionTitle, MetaChip } from "@/components/feed/detail-helpers";

/* ── Local helpers ──────────────────────────────────────────────── */
function availabilityClass(availability: string) {
  const s = availability.toLowerCase();
  if (s.includes("full"))
    return "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300";
  if (s.includes("part"))
    return "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300";
  if (s.includes("free"))
    return "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300";
  return "bg-muted text-muted-foreground";
}

/* ── Main component ─────────────────────────────────────────────── */
export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams<{ employeeId: string }>();
  const id = params.employeeId;

  const t = useTranslations("toast");
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const { loading, employeeData, queryOneEmployee } = useGetOneEmployeeStore();

  const companyLikeStore = useCompanyLikeStore();
  const queryCurrentCompanyLiked = useGetCurrentCompanyLikedStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();
  const countCurrentCompanyMatching = useCountCurrentCompanyMatchingStore();
  const countAllCompanyFavoritesStore = useCountAllCompanyFavoritesStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const ignoreNextClick = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") setIsInitialized(true);
  }, []);

  // Block access if this employee was already liked by the current company
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentUser?.company?.id) {
      setAccessGranted(true);
      return;
    }
    (async () => {
      await useGetCurrentCompanyLikedStore.getState().queryCurrentCompanyLiked(currentUser.company!.id);
      const liked = useGetCurrentCompanyLikedStore.getState().currentCompanyLiked;
      if (liked?.some((e) => e.id === id)) {
        router.replace("/feed");
      } else {
        setAccessGranted(true);
      }
    })();
  }, [isInitialized, id, currentUser?.company?.id, router]);

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

  useEffect(() => {
    if (openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openProfilePopup]);

  const handleLike = async () => {
    if (currentUser?.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData?.id;
      if (!companyId || !employeeId) return;
      try {
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
            countCurrentCompanyMatching.countCurrentCompanyMatching(companyId);
            setTimeout(
              () => router.push("/matching"),
              DEFAULT_REDIRECT_DELAY_MS,
            );
          } else {
            toast.success(t("youLiked", { name }));
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          }
        }
      } catch {
        toast.error(companyLikeStore.error || t("failedToLikeEmployee"));
      } finally {
        queryCurrentCompanyLiked.queryCurrentCompanyLiked(companyId);
        countAllCompanyFavoritesStore.countAllCompanyFavorites(companyId);
      }
    }
  };

  const handleAddToFavorite = async () => {
    if (currentUser?.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData?.id;
      const name =
        employeeData?.username ??
        `${employeeData?.firstname} ${employeeData?.lastname}`;
      if (!companyId || !employeeId) return;
      try {
        await companyFavEmployeeStore.addEmployeeToFavorite(
          companyId,
          employeeId,
        );
        countAllCompanyFavoritesStore.countAllCompanyFavorites(companyId);
        toast.success(t("addedToFavorites", { name }));
        getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyId);
      } catch {
        toast.error(
          companyFavEmployeeStore.cmpFavError || t("failedToSaveFavorite"),
        );
      }
    }
  };

  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
  };

  const handleDownloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = !isInitialized || !accessGranted || loading;
  if (isLoading)
    return (
      <div className="animate-page-in">
        <EmployeeDetailPageSkeleton />
      </div>
    );

  if (fetchError)
    return (
      <div className="flex h-[60vh] items-center justify-center animate-page-in">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-red-500 font-medium">{fetchError}</p>
          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );

  if (!employeeData)
    return (
      <div className="flex h-[60vh] items-center justify-center animate-page-in">
        <div className="flex flex-col items-center gap-3">
          <p className="font-medium">Employee not found</p>
          <Link href="/feed">
            <Button variant="outline">Back to Feed</Button>
          </Link>
        </div>
      </div>
    );

  const isFav = companyFavEmployeeStore.isFavorite(id);
  const likeDisabled = companyLikeStore.loading || !currentUser?.company?.id;
  const favDisabled =
    companyFavEmployeeStore.loading || !currentUser?.company?.id;
  const fullName = [employeeData.firstname, employeeData.lastname]
    .filter(Boolean)
    .join(" ");

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
          <span className="text-sm font-semibold truncate">{fullName || "Employee Detail"}</span>
        </div>
      </header>

      {/* ── Hero Card ─────────────────────────────────────────────── */}
      <Card>
        {/* Gradient banner with decorative circles */}
        <div className="h-36 sm:h-44 rounded-t-2xl bg-gradient-to-r from-primary to-primary/50 relative overflow-hidden">
          <div className="absolute -top-6 right-10 size-36 rounded-full bg-white/5" />
          <div className="absolute top-4 right-32 size-20 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 right-4 size-24 rounded-full bg-white/5" />
        </div>

        {/* Identity */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar — overlaps banner */}
            <Avatar
              className="size-20 sm:size-24 -mt-10 sm:-mt-12 ring-[3px] ring-card shadow-xl flex-shrink-0 cursor-pointer"
              rounded="md"
              onClick={(e) => {
                if (employeeData.avatar) handleClickProfilePopup(e);
              }}
            >
              <AvatarImage src={employeeData.avatar ?? ""} />
              <AvatarFallback className="uppercase font-bold text-xl">
                {employeeData.username ? (
                  employeeData.username.slice(0, 2)
                ) : (
                  <User />
                )}
              </AvatarFallback>
            </Avatar>

            {/* Name + info */}
            <div className="flex-1 min-w-0 pt-2 tablet-md:text-center tablet-md:pt-0 tablet-md:mt-1">
              <div className="flex items-center gap-2 flex-wrap tablet-md:justify-center">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                  {fullName}
                </h1>
                {employeeData.availability && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${availabilityClass(employeeData.availability)}`}
                  >
                    {employeeData.availability}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">
                {employeeData.job}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 tablet-md:justify-center">
                {employeeData.gender && (
                  <MetaChip
                    icon={<LucideTransgender />}
                    label={employeeData.gender}
                  />
                )}
                {employeeData.yearsOfExperience && (
                  <MetaChip
                    icon={<LucideBriefcaseBusiness />}
                    label={employeeData.yearsOfExperience}
                  />
                )}
                {employeeData.location && (
                  <MetaChip
                    icon={<LucideMapPinned />}
                    label={employeeData.location}
                  />
                )}
                {employeeData.username && (
                  <MetaChip
                    icon={<LucideAtSign />}
                    label={employeeData.username}
                  />
                )}
              </div>
            </div>

            {/* Desktop actions */}
            <div className="flex gap-2 flex-shrink-0 pt-2 tablet-md:hidden">
              {!isFav && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToFavorite}
                  disabled={favDisabled}
                >
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
      <div className="flex items-start gap-5 tablet-xl:flex-col">
        {/* Left — main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* About */}
          {employeeData.description && (
            <Card className="p-5 sm:p-6">
              <SectionTitle icon={<LucideUser />} title="About" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {employeeData.description}
              </p>
            </Card>
          )}

          {/* Skills */}
          {employeeData.skills && employeeData.skills.length > 0 && (
            <Card className="p-5 sm:p-6">
              <SectionTitle icon={<LucideZap />} title="Skills" />
              <div className="flex flex-wrap gap-2">
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
            </Card>
          )}

          {/* Experience */}
          {employeeData.experiences && employeeData.experiences.length > 0 && (
            <Card className="p-5 sm:p-6">
              <SectionTitle
                icon={<LucideBriefcaseBusiness />}
                title="Experience"
              />
              <div className="flex flex-col gap-3">
                {employeeData.experiences.map(
                  (item: IExperience, i: number) => (
                    <div key={item.id} className="flex gap-3">
                      {/* Timeline dot + line */}
                      <div className="flex flex-col items-center pt-1 flex-shrink-0">
                        <div className="size-2.5 rounded-full bg-primary ring-2 ring-primary/20 flex-shrink-0" />
                        {i < employeeData.experiences.length - 1 && (
                          <div className="w-px flex-1 bg-border/60 mt-1.5" />
                        )}
                      </div>
                      {/* Content */}
                      <div
                        className={`flex-1 min-w-0 ${i < employeeData.experiences.length - 1 ? "pb-3" : ""}`}
                      >
                        <div className="rounded-xl border border-border/60 p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {dateFormatter(item.startDate)} —{" "}
                            {dateFormatter(item.endDate)}
                          </p>
                          {item.description && (
                            <TypographyMuted className="text-sm leading-relaxed mt-2">
                              {item.description}
                            </TypographyMuted>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>
          )}

          {/* Education */}
          {employeeData.educations && employeeData.educations.length > 0 && (
            <Card className="p-5 sm:p-6">
              <SectionTitle icon={<LucideGraduationCap />} title="Education" />
              <div className="flex flex-col gap-3">
                {employeeData.educations.map((item: IEducation) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-border/60 p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <LucideGraduationCap
                        className="size-4 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{item.school}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.degree}
                      </p>
                      {item.year && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                          <LucideCalendar className="size-3" />
                          {dateFormatter(item.year)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right — sidebar */}
        <div className="w-72 flex flex-col gap-5 tablet-xl:w-full">
          {/* Documents */}
          {(employeeData.resume || employeeData.coverLetter) && (
            <Card className="p-5">
              <SectionTitle icon={<LucideFileText />} title="Documents" />
              <div className="flex flex-col gap-2.5">
                {[
                  { file: employeeData.resume, suffix: "resume" },
                  { file: employeeData.coverLetter, suffix: "coverletter" },
                ]
                  .filter((d) => d.file)
                  .map(({ file, suffix }) => (
                    <div
                      key={suffix}
                      className="flex items-center justify-between gap-2 px-3 py-2.5 bg-muted/50 rounded-xl border border-border/40"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <LucideFileText
                          className="size-4 text-muted-foreground flex-shrink-0"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs text-muted-foreground truncate">
                          {extractCleanFilename(file!)}
                        </span>
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        <Link href={file!} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <LucideEye className="size-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() =>
                            handleDownloadFile(
                              file!,
                              `${employeeData.username || "user"}-${suffix}`,
                            )
                          }
                        >
                          <LucideDownload className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Contact */}
          <Card className="p-5">
            <SectionTitle icon={<LucidePhone />} title="Contact" />
            <div className="space-y-3.5">
              {[
                {
                  icon: <LucidePhone />,
                  label: "Phone",
                  val: employeeData.phone,
                },
                {
                  icon: <LucideMail />,
                  label: "Email",
                  val: employeeData.email,
                },
                {
                  icon: <LucideMapPinned />,
                  label: "Address",
                  val: employeeData.location,
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
          </Card>

          {/* Socials */}
          {employeeData.socials && employeeData.socials.length > 0 && (
            <Card className="p-5">
              <SectionTitle icon={<LucideGlobe />} title="Social Links" />
              <div className="flex flex-wrap gap-2">
                {employeeData.socials.map((item: ISocial) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-xs font-medium transition-colors"
                  >
                    {getSocialPlatformTypeIcon(item.platform as TPlatform)}
                    {item.platform}
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
          <Button
            variant="outline"
            onClick={handleAddToFavorite}
            disabled={favDisabled}
          >
            <LucideBookmark /> Save
          </Button>
        )}
        <Button onClick={handleLike} disabled={likeDisabled}>
          <LucideHeartHandshake /> Like
        </Button>
      </div>

      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={employeeData.avatar ?? ""}
      />
    </div>
  );
}
