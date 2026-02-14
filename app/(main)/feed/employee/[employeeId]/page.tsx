"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import IconLabel from "@/components/utils/icon-label";
import Tag from "@/components/utils/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  LucideAtSign,
  LucideBookmark,
  LucideBookMarked,
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
} from "lucide-react";
import Divider from "@/components/utils/divider";
import {
  IEducation,
  IExperience,
  ISkill,
  ISocial,
} from "@/utils/interfaces/user-interface/employee.interface";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import React, { useEffect, useRef, useState } from "react";
import ImagePopup from "@/components/utils/image-popup";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import EmployeeDetailPageSkeleton from "./skeleton";
import { dateFormatter } from "@/utils/functions/dateformatter";
import { extractCleanFilename } from "@/utils/functions/extract-clean-filename";
import { useCompanyLikeStore } from "@/stores/apis/matching/company-like.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useToast } from "@/hooks/use-toast";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { capitalizeWords } from "@/utils/functions/capitalize-words";
import { useGetOneEmployeeStore } from "@/stores/apis/employee/get-one-emp.store";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";

export default function EmployeeDetailPage() {
  const params = useParams<{ employeeId: string }>();
  const id = params.employeeId;
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast, dismiss } = useToast();

  // Popup state
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  // API Calls
  const { loading, employeeData, queryOneEmployee } = useGetOneEmployeeStore();
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const companyLikeStore = useCompanyLikeStore();
  const { countCurrentCompanyMatching } = useCountCurrentCompanyMatchingStore();
  const { queryCurrentCompanyLiked } = useGetCurrentCompanyLikedStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const countAllCompanyFavoritesStore = useCountAllCompanyFavoritesStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();

  // Initialize component (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsInitialized(true);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [id, isInitialized, queryOneEmployee]);

  // Handle popup clicks
  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }

    if ((e.target as HTMLElement).closest(".dialog-content")) return;

    setOpenProfilePopup(true);
  };

  useEffect(() => {
    if (openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openProfilePopup]);

  // Handle file downloads
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

  // Loading or error states
  if (!isInitialized || loading) {
    return <EmployeeDetailPageSkeleton />;
  }

  if (fetchError) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
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
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <TypographyH4>Employee not found</TypographyH4>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (currentUser && currentUser.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData.id;

      if (!companyId || !employeeId) return;

      try {
        dismiss();
        await companyLikeStore.companyLike(companyId, employeeId);
        const companyData = useCompanyLikeStore.getState().data;
        if (companyData) {
          const isMatching = companyData.isMatched;
          const employeeName =
            companyData.employee.username ??
            `${companyData.employee.lastname} ${companyData.employee.lastname}`;
          if (isMatching) {
            toast({
              variant: "success",
              title: "It's a match!",
              description: (
                <div className="flex items-center gap-2">
                  <LucideHeartHandshake />
                  <TypographySmall className="font-medium">
                    {employeeName} and your company like each other.
                  </TypographySmall>
                </div>
              ),
            });
            countCurrentCompanyMatching(companyId);
            setTimeout(() => router.push("/matching"), 800);
          } else {
            toast({
              variant: "success",
              description: (
                <div className="flex items-center gap-2">
                  <LucideHeartHandshake />
                  <TypographySmall className="font-medium">
                    You liked {employeeName}.
                  </TypographySmall>
                </div>
              ),
            });
            setTimeout(() => router.push("/feed"), 800);
          }
        }
      } catch (error) {
        const err = companyLikeStore.error || "Failed to like employee";
        toast({ variant: "destructive", title: "Error", description: err });
      } finally {
        queryCurrentCompanyLiked(companyId);
      }
    }
  };

  const handleAddToFavorite = async () => {
    if (currentUser && currentUser.company) {
      const companyId = currentUser.company.id;
      const employeeId = employeeData.id;
      const employeeName =
        employeeData.username ??
        `${employeeData.firstname} ${employeeData.lastname}`;

      if (!companyId || !employeeId) return;

      try {
        await companyFavEmployeeStore.addEmployeeToFavorite(
          companyId,
          employeeId
        );
        countAllCompanyFavoritesStore.countAllCompanyFavorites(companyId);
        toast({
          variant: "success",
          description: (
            <div className="flex items-center gap-2">
              <LucideBookMarked />
              <TypographySmall className="font-medium">
                {employeeName} added to favorites.
              </TypographySmall>
            </div>
          ),
        });
        getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyId);
      } catch (error) {
        const err = companyFavEmployeeStore.error || "Failed to save employee.";
        toast({ title: "Error", description: err, variant: "destructive" });
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Personal Information Section */}
      <div className="w-full flex items-stretch justify-between border border-muted py-5 px-10 tablet-xl:flex-col tablet-xl:[&>div]:w-full tablet-xl:gap-5">
        <div className="flex flex-col items-center gap-5">
          <Avatar
            className="size-40 tablet-xl:!size-52"
            rounded="md"
            onClick={handleClickProfilePopup}
          >
            <AvatarImage src={employeeData.avatar ?? ""} />
            <AvatarFallback className="uppercase">
              {!employeeData.avatar ? (
                <LucideUser />
              ) : (
                employeeData.avatar.slice(0, 3)
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
              text={
                employeeData.yearsOfExperience === 1
                  ? `${employeeData.yearsOfExperience} year of experience`
                  : `${employeeData.yearsOfExperience} years of experience`
              }
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Status</TypographyMuted>
            <IconLabel
              icon={<LucideClock strokeWidth={"1.5px"} />}
              text={`${capitalizeWords(
                employeeData.availability!.split("_")[0]!
              )} ${capitalizeWords(employeeData.availability!.split("_")[1]!)}`}
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
                <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <LucideFileText strokeWidth={"1.5px"} />
                    <TypographyMuted>
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
                          `${employeeData.username || "user"}-resume`
                        )
                      }
                    >
                      <LucideDownload />
                    </Button>
                  </div>
                </div>
              )}

              {employeeData.coverLetter && (
                <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <LucideFileText strokeWidth={"1.5px"} />
                    <TypographyMuted>
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
                          `${employeeData.username || "user"}-coverletter`
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
                    {getSocialPlatformTypeIcon(item.platform)}
                    <TypographySmall>{item.platform}</TypographySmall>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex items-center gap-2">
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
