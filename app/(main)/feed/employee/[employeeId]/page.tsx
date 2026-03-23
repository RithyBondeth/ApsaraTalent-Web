"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Divider from "@/components/utils/divider";
import IconLabel from "@/components/utils/icon-label";
import ImagePopup from "@/components/utils/image-popup";
import Tag from "@/components/utils/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { toast } from "sonner";
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
  LucideAtSign,
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideCalendar,
  LucideClock,
  LucideDownload,
  LucideEye,
  LucideFileText,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideMail,
  LucideMapPinned,
  LucidePhone,
  LucideSchool,
  LucideTransgender,
  LucideUser,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import EmployeeDetailPageSkeleton from "./skeleton";

export default function EmployeeDetailPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const params = useParams<{ employeeId: string }>();
  const id = params.employeeId;

  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const { loading, employeeData, queryOneEmployee } = useGetOneEmployeeStore();

  // Liked APIs
  const companyLikeStore = useCompanyLikeStore();
  const queryCurrentCompanyLiked = useGetCurrentCompanyLikedStore();

  // Favorited APIs
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();

  // Count Current Matching & Favorite APIs -> Update Badge in Sidebar
  const countCurrentCompanyMatching = useCountCurrentCompanyMatchingStore();
  const countAllCompanyFavoritesStore = useCountAllCompanyFavoritesStore();

  /* -------------------------------- All States ------------------------------- */
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Popup States
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  // Initialize Component (Client-Side Only)
  useEffect(() => {
    if (typeof window !== "undefined") setIsInitialized(true);
  }, []);

  // Fetch One Employee Effect
  useEffect(() => {
    const fetchOneEmployee = async () => {
      if (!isInitialized || !id) return;

      try {
        setFetchError(null);
        useGetOneEmployeeStore.setState({ employeeData: null, loading: true });
        await queryOneEmployee(id as string);
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
        setFetchError("Failed to load employee data. Please try again.");
      }
    };

    fetchOneEmployee();
  }, [id, isInitialized, queryOneEmployee]);

  // Profile Popup Effect
  useEffect(() => {
    if (openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openProfilePopup]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Company Like Employee ─────────────────────────────────────────
  const handleLike = async () => {
    if (currentUser && currentUser.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData?.id;

      if (!companyId || !employeeId) return;

      try {
        toast.dismiss();
        await companyLikeStore.companyLike(companyId, employeeId);
        const companyData = useCompanyLikeStore.getState().data;
        if (companyData) {
          const isMatching = companyData.isMatched;
          const employeeName =
            companyData.employee.username ??
            `${companyData.employee.lastname} ${companyData.employee.lastname}`;
          if (isMatching) {
            toast.success("It's a match!", {
              description: `${employeeName} and your company like each other.`,
            });
            countCurrentCompanyMatching.countCurrentCompanyMatching(companyId);
            setTimeout(() => router.push("/matching"), 800);
          } else {
            toast.success(`You liked ${employeeName}.`);
            setTimeout(() => router.push("/feed"), 800);
          }
        }
      } catch {
        const err = companyLikeStore.error || "Failed to like employee";
        toast.error(err);
      } finally {
        queryCurrentCompanyLiked.queryCurrentCompanyLiked(companyId);
      }
    }
  };

  // ── Handle Company Add Employee To Favorite ─────────────────────────────────────────
  const handleAddToFavorite = async () => {
    if (currentUser && currentUser.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData?.id;
      const employeeName =
        employeeData?.username ??
        `${employeeData?.firstname} ${employeeData?.lastname}`;

      if (!companyId || !employeeId) return;

      try {
        await companyFavEmployeeStore.addEmployeeToFavorite(
          companyId,
          employeeId,
        );
        countAllCompanyFavoritesStore.countAllCompanyFavorites(companyId);
        toast.success(`${employeeName} added to favorites.`);
        getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyId);
      } catch {
        const err =
          companyFavEmployeeStore.cmpFavError || "Failed to save employee.";
        toast.error(err);
      }
    }
  };

  // ── Handle Click Profile Popup ─────────────────────────────────────────
  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }

    if ((e.target as HTMLElement).closest(".dialog-content")) return;

    setOpenProfilePopup(true);
  };

  // ── Handle Download File ─────────────────────────────────────────
  const handleDownloadFile = (url: string, filename: string) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* -------------------------------- Render UI -------------------------------- */
  const isLoading = !isInitialized || loading;
  if (isLoading) {
    return (
      <div className="animate-page-in">
        <EmployeeDetailPageSkeleton />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="h-screen w-screen flex justify-center items-center animate-page-in">
        <div className="flex flex-col items-center gap-3">
          <TypographyH4 className="text-red-500">{fetchError}</TypographyH4>
          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="h-screen w-screen flex justify-center items-center animate-page-in">
        <div className="flex flex-col items-center gap-3">
          <TypographyH4>Employee not found</TypographyH4>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-page-in">
      {/* Personal Information Section */}
      <div className="w-full flex items-stretch justify-between border border-muted py-4 sm:py-5 px-4 sm:px-6 lg:px-10 tablet-xl:flex-col tablet-xl:[&>div]:w-full tablet-xl:gap-5">
        <div className="flex flex-col items-center gap-5">
          <Avatar
            className="size-40 tablet-xl:!size-52"
            rounded="md"
            onClick={(e) => {
              if (employeeData.avatar) {
                handleClickProfilePopup(e);
              }
            }}
          >
            <AvatarImage src={employeeData.avatar ?? ""} />
            <AvatarFallback className="uppercase font-bold">
              {employeeData.username ? (
                employeeData.username.slice(0, 3)
              ) : (
                <User />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <TypographyH4>
              {employeeData.firstname} {employeeData.lastname}
            </TypographyH4>
            <TypographyMuted>{employeeData.job}</TypographyMuted>
          </div>
        </div>
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Firstname</TypographyMuted>
            <IconLabel
              icon={<LucideUser strokeWidth={"1.5px"} />}
              text={employeeData.firstname ?? ""}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Lastname</TypographyMuted>
            <IconLabel
              icon={<LucideUser strokeWidth={"1.5px"} />}
              text={employeeData.lastname ?? ""}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Username</TypographyMuted>
            <IconLabel
              icon={<LucideAtSign strokeWidth={"1.5px"} />}
              text={employeeData.username ?? ""}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Gender</TypographyMuted>
            <IconLabel
              icon={<LucideTransgender strokeWidth={"1.5px"} />}
              text={employeeData.gender.toUpperCase() ?? "Other".toUpperCase()}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Experience</TypographyMuted>
            <IconLabel
              icon={<LucideBriefcaseBusiness strokeWidth={"1.5px"} />}
              text={employeeData.yearsOfExperience}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Status</TypographyMuted>
            <IconLabel
              icon={<LucideClock strokeWidth={"1.5px"} />}
              text={employeeData.availability}
            />
          </div>
        </div>
      </div>

      {/* Description, Education, Skill and Experience Section */}
      <div className="flex items-stretch gap-5 tablet-xl:flex-col tablet-xl:[&>div]:w-full">
        <div className="w-2/3 flex flex-col gap-5">
          {/* Description Section */}
          <div className="flex flex-col gap-5 border border-muted p-5">
            <div className="flex flex-col gap-2">
              <TypographyH4>Description</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-col gap-2 border-l-4 border-primary pl-4">
              <TypographySmall className="leading-loose">
                {employeeData.description}
              </TypographySmall>
            </div>
          </div>

          {/* Education Section */}
          {employeeData.educations && employeeData.educations.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Education</TypographyH4>
                <Divider />
              </div>
              {employeeData.educations.map((item: IEducation) => (
                <div
                  className="flex flex-col gap-2 border-l-4 border-primary pl-4"
                  key={item.id}
                >
                  <IconLabel
                    icon={<LucideSchool strokeWidth={"1.5px"} />}
                    text={item.school}
                  />
                  <IconLabel
                    icon={<LucideGraduationCap strokeWidth={"1.5px"} />}
                    text={item.degree}
                  />
                  <IconLabel
                    icon={<LucideCalendar strokeWidth={"1.5px"} />}
                    text={dateFormatter(item.year)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Experience Section */}
          {employeeData.experiences && employeeData.experiences.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Experience</TypographyH4>
                <Divider />
              </div>
              <div className="flex flex-col gap-5">
                {employeeData.experiences.map((item: IExperience) => (
                  <div
                    className="border-l-4 border-primary pl-4 space-y-2"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-1">
                      <TypographyP className="text-lg font-semibold">
                        {item.title}
                      </TypographyP>
                      <TypographyMuted>
                        {dateFormatter(item.startDate)} -{" "}
                        {dateFormatter(item.endDate)}
                      </TypographyMuted>
                    </div>
                    <TypographyMuted className="text-primary leading-relaxed">
                      {item.description}
                    </TypographyMuted>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {employeeData.skills && employeeData.skills.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Skills</TypographyH4>
                <Divider />
              </div>
              <div className="flex flex-wrap gap-3">
                {employeeData.skills.map((item: ISkill) => (
                  <HoverCard key={item.id}>
                    <HoverCardTrigger>
                      <Tag label={item.name} />
                    </HoverCardTrigger>
                    <HoverCardContent className="flex flex-col items-start gap-1">
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
            </div>
          )}
        </div>

        {/* Resume and Contact Section */}
        <div className="w-1/3 flex flex-col gap-5">
          {/* Resume Section */}
          {(employeeData.resume || employeeData.coverLetter) && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Resume</TypographyH4>
                <Divider />
              </div>

              {employeeData.resume && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1 min-w-0">
                    <LucideFileText strokeWidth={"1.5px"} />
                    <TypographyMuted className="truncate">
                      {extractCleanFilename(employeeData.resume)}
                    </TypographyMuted>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={employeeData.resume} target="_blank">
                      <Button variant="outline" size="icon">
                        <LucideEye />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        employeeData?.resume &&
                        handleDownloadFile(
                          employeeData.resume,
                          `${employeeData.username || "user"}-resume`,
                        )
                      }
                    >
                      <LucideDownload />
                    </Button>
                  </div>
                </div>
              )}

              {employeeData.coverLetter && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1 min-w-0">
                    <LucideFileText strokeWidth={"1.5px"} />
                    <TypographyMuted className="truncate">
                      {extractCleanFilename(employeeData.coverLetter)}
                    </TypographyMuted>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={employeeData.coverLetter} target="_blank">
                      <Button variant="outline" size="icon">
                        <LucideEye />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        employeeData?.coverLetter &&
                        handleDownloadFile(
                          employeeData.coverLetter,
                          `${employeeData.username || "user"}-coverletter`,
                        )
                      }
                    >
                      <LucideDownload />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Section */}
          <div className="flex flex-col gap-5 border border-muted p-5">
            <div className="flex flex-col gap-2">
              <TypographyH4>Contact</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-col gap-5">
              {employeeData.phone && (
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted>Phone</TypographyMuted>
                  <IconLabel
                    icon={<LucidePhone strokeWidth={"1.5px"} />}
                    text={employeeData.phone}
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Email</TypographyMuted>
                <IconLabel
                  icon={<LucideMail strokeWidth={"1.5px"} />}
                  text={employeeData.email ?? ""}
                />
              </div>
              {employeeData.location && (
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted>Address</TypographyMuted>
                  <IconLabel
                    icon={<LucideMapPinned strokeWidth={"1.5px"} />}
                    text={employeeData.location}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Socials Section */}
          {employeeData.socials && employeeData.socials.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Socials</TypographyH4>
                <Divider />
              </div>
              <div className="flex flex-wrap gap-3">
                {employeeData.socials.map((item: ISocial) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:underline"
                  >
                    {getSocialPlatformTypeIcon(item.platform as TPlatform)}
                    <TypographySmall>{item.platform}</TypographySmall>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex w-full flex-wrap items-center gap-2 [&>button]:flex-1 sm:w-auto sm:[&>button]:flex-none">
        {!companyFavEmployeeStore.isFavorite(id) && (
          <Button
            variant={"outline"}
            onClick={handleAddToFavorite}
            disabled={
              companyFavEmployeeStore.loading || !currentUser?.company?.id
            }
          >
            <LucideBookmark />
            Save to favorite
          </Button>
        )}
        <Button
          onClick={handleLike}
          disabled={companyLikeStore.loading || !currentUser?.company?.id}
        >
          <LucideHeartHandshake />
          Like
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
