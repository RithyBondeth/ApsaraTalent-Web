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
  LucideBriefcaseBusiness,
  LucideCalendar,
  LucideClock,
  LucideDownload,
  LucideEye,
  LucideFacebook,
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
import { useParams } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import React, { useEffect, useRef, useState } from "react";
import ImagePopup from "@/components/utils/image-popup";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { useGetOneUserStore } from "@/stores/apis/users/get-one-user.store";
import EmployeeDetailPageSkeleton from "./skeleton";
import { dateFormatter } from "@/utils/functions/dateformatter";
import { useLocalLoginStore, useLoginStore, useSessionLoginStore } from "@/stores/apis/auth/login.store";

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params?.employeeId;
  const [isInitialized, setIsInitialized] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Popup state
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const ignoreNextClick = useRef(false);
  
  // Get data and loading state
  const { loading, user, getOneUerByID } = useGetOneUserStore();
  
  // Get tokens from all possible stores
  const persistentToken = useLocalLoginStore(state => state.accessToken);
  const sessionToken = useSessionLoginStore(state => state.accessToken);
  const memoryToken = useLoginStore(state => state.accessToken);
  const accessToken = memoryToken || sessionToken || persistentToken;

  // Initialize component (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsInitialized(true);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!isInitialized || !id || !accessToken) return;
      
      try {
        setFetchError(null);
        useGetOneUserStore.setState({ user: null, loading: true });
        await getOneUerByID(id as string, accessToken);
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
        setFetchError("Failed to load employee data. Please try again.");
      }
    };

    fetchData();
  }, [id, accessToken, isInitialized]);

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
  if (!isInitialized || loading || !accessToken) {
    return <EmployeeDetailPageSkeleton />;
  }

  if (fetchError) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <TypographyH4 className="text-red-500">{fetchError}</TypographyH4>
          <Button variant="destructive" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
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
            <AvatarImage src={user?.employee?.avatar!} />
            <AvatarFallback className="uppercase">
              {!user?.employee?.avatar ? (
                <LucideUser />
              ) : (
                user?.employee?.avatar.slice(0, 3)
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <TypographyH4>
              {user?.employee?.firstname} {user?.employee?.lastname}
            </TypographyH4>
            <TypographyMuted>{user?.employee?.job}</TypographyMuted>
          </div>
        </div>
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Firstname</TypographyMuted>
            <IconLabel
              icon={<LucideUser strokeWidth={"1.5px"} />}
              text={user?.employee?.firstname!}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Lastname</TypographyMuted>
            <IconLabel
              icon={<LucideUser strokeWidth={"1.5px"} />}
              text={user?.employee?.lastname!}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Username</TypographyMuted>
            <IconLabel
              icon={<LucideAtSign strokeWidth={"1.5px"} />}
              text={user?.employee?.username!}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Gender</TypographyMuted>
            <IconLabel
              icon={<LucideTransgender strokeWidth={"1.5px"} />}
              text={user?.employee?.gender.toUpperCase()!}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Experience</TypographyMuted>
            <IconLabel
              icon={<LucideBriefcaseBusiness strokeWidth={"1.5px"} />}
              text={
                user?.employee?.yearsOfExperience === 1
                  ? `${user?.employee?.yearsOfExperience} year of experience`
                  : `${user?.employee?.yearsOfExperience} years of experience`
              }
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <TypographyMuted>Status</TypographyMuted>
            <IconLabel
              icon={<LucideClock strokeWidth={"1.5px"} />}
              text={`${user?.employee?.availability!.split('_')[0]} ${user?.employee?.availability!.split('_')[1]}`}
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
                {user?.employee?.description}
              </TypographySmall>
            </div>
          </div>

          {/* Education Section */}
          {user?.employee?.educations && user.employee.educations.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Education</TypographyH4>
                <Divider />
              </div>
              {user?.employee?.educations.map((item: IEducation) => (
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
          {user?.employee?.experiences && user.employee.experiences.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Experience</TypographyH4>
                <Divider />
              </div>
              <div className="flex flex-col gap-5">
                {user?.employee?.experiences.map((item: IExperience) => (
                  <div
                    className="border-l-4 border-primary pl-4 space-y-2"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-1">
                      <TypographyP className="text-lg font-semibold">{item.title}</TypographyP>
                      <TypographyMuted>
                        {dateFormatter(item.startDate)} - {dateFormatter(item.endDate)}
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
          {user?.employee?.skills && user.employee.skills.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Skills</TypographyH4>
                <Divider />
              </div>
              <div className="flex flex-wrap gap-3">
                {user?.employee?.skills.map((item: ISkill) => (
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
          {(user?.employee?.resume || user?.employee?.coverLetter) && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Resume</TypographyH4>
                <Divider />
              </div>
              
              {user?.employee?.resume && (
                <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <LucideFileText strokeWidth={"1.5px"} />
                    <TypographyMuted>
                      {user.employee.resume.replace(
                        "http://localhost:3000/storage/resumes/",
                        ""
                      )}
                    </TypographyMuted>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={user.employee.resume} target="_blank">
                      <Button variant="outline" size="icon">
                        <LucideEye />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => user.employee?.resume && handleDownloadFile(user.employee.resume, `${user.employee.username || 'user'}-resume`)}
                    >
                      <LucideDownload />
                    </Button>
                  </div>
                </div>
              )}

              {user?.employee?.coverLetter && (
                <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <LucideFileText strokeWidth={"1.5px"} />
                    <TypographyMuted>
                      {user.employee.coverLetter.replace(
                        "http://localhost:3000/storage/cover-letters/",
                        ""
                      )}
                    </TypographyMuted>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={user.employee.coverLetter} target="_blank">
                      <Button variant="outline" size="icon">
                        <LucideEye />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => user.employee?.coverLetter && handleDownloadFile(user.employee.coverLetter, `${user.employee.username || 'user'}-coverletter`)}
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
              {user?.employee?.phone && (
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted>Phone</TypographyMuted>
                  <IconLabel
                    icon={<LucidePhone strokeWidth={"1.5px"} />}
                    text={user?.employee?.phone}
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Email</TypographyMuted>
                <IconLabel
                  icon={<LucideMail strokeWidth={"1.5px"} />}
                  text={user?.email!}
                />
              </div>
              {user?.employee?.location && (
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted>Address</TypographyMuted>
                  <IconLabel
                    icon={<LucideMapPinned strokeWidth={"1.5px"} />}
                    text={user?.employee?.location}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Socials Section */}
          {user?.employee?.socials && user.employee.socials.length > 0 && (
            <div className="flex flex-col gap-5 border border-muted p-5">
              <div className="flex flex-col gap-2">
                <TypographyH4>Socials</TypographyH4>
                <Divider />
              </div>
              <div className="flex flex-wrap gap-3">
                {user?.employee?.socials.map((item: ISocial) => (
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
        <Button variant={"outline"}>
          <LucideBookmark />
          Save to favorite
        </Button>
        <Button>
          <LucideHeartHandshake />
          Like
        </Button>
      </div>

      {/* Profile Popup Section */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={user?.employee?.avatar!}
      />
    </div>
  );
}