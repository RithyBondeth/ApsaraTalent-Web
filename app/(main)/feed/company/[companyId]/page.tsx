"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IconLabel from "@/components/utils/icon-label";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideAlarmClock,
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCalendarDays,
  LucideCircleCheck,
  LucideHeartHandshake,
  LucideMail,
  LucideMapPinned,
  LucidePhone,
  LucideUser,
  LucideUsers,
} from "lucide-react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Carousel } from "@/components/ui/carousel";
import Divider from "@/components/utils/divider";
import BlurBackGroundOverlay from "@/components/utils/bur-background-overlay";
import { Button } from "@/components/ui/button";
import Tag from "@/components/utils/tag";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useParams } from "next/navigation";
import { IBenefits, IImage, ISocial } from "@/utils/interfaces/user-interface/company.interface";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ImagePopup from "@/components/utils/image-popup";
import React, { useEffect, useRef, useState } from "react";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { TPlatform } from "@/utils/types/platform.type";
import { useGetOneUserStore } from "@/stores/apis/users/get-one-user.store";
import { useLocalLoginStore, useLoginStore, useSessionLoginStore } from "@/stores/apis/auth/login.store";
import { CompanyDetailPageSkeleton } from "./skeleton";
import { dateFormatterv2 } from "@/utils/functions/dateformatter-v2";
import { availabilityConstant } from "@/utils/constants/app.constant";

export default function CompanyDetailPage() {
  const param = useParams();
  const id = param?.companyId;
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State for popups
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(null);
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
    if (typeof window !== 'undefined') setIsInitialized(true);
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
        console.error("Failed to fetch company data:", error);
        setFetchError("Failed to load company data. Please try again.");
      }
    };

    fetchData();
  }, [id, accessToken, isInitialized]);

  // Handle popup clicks
  const handleClickImagePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    setOpenImagePopup(true);
  };

  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    setOpenProfilePopup(true);
  };

  // Loading or error states
  if (!isInitialized || loading || !accessToken) {
    return <CompanyDetailPageSkeleton />;
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
          <TypographyH4>Company not found</TypographyH4>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-5">
      {/* Header Section */}
      <div
        className="relative h-80 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center tablet-sm:items-start"
        style={{ backgroundImage: `url(${user?.company?.cover})` }}
      >
        <BlurBackGroundOverlay />
        <div className="relative flex items-center gap-5 tablet-sm:flex-col">
          <Avatar
            className="size-32 tablet-sm:size-28"
            rounded="md"
            onClick={handleClickProfilePopup}
          >
            <AvatarImage src={user?.company?.avatar!} />
            <AvatarFallback className="uppercase">
              {user?.company?.name.slice(0, 3)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-2 text-muted tablet-sm:items-center">
            <TypographyH2 className="tablet-sm:text-center tablet-sm:text-xl">
              {user?.company?.name}
            </TypographyH2>
            <TypographyP className="!m-0 tablet-sm:text-center tablet-sm:text-sm">
              {user?.company?.industry}
            </TypographyP>
            <div className="flex items-center gap-5">
              <IconLabel
                icon={<LucideCalendarDays />}
                text={`Founded in ${user?.company?.foundedYear}`}
                className="[&>p]:text-primary-foreground"
              />
              <IconLabel
                icon={<LucideUsers />}
                text={`${user?.company?.companySize}+ Employees`}
                className="[&>p]:text-primary-foreground"
              />
            </div>
          </div>
        </div>
        <div className="z-10 absolute right-3 bottom-3 flex items-center gap-3">
          <Button variant="outline">
            <LucideBookmark />
            Save to Favorite
          </Button>
          <Button>
            <LucideHeartHandshake />
            Like
          </Button>
        </div>
      </div>
      <div className="w-full flex items-stretch gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        <div className="w-2/3 flex flex-col items-stretch gap-5">
          {/* Description Section */}
          <div className="w-full flex flex-col items-start gap-3 border border-muted py-5 px-10">
            <div className="w-full flex flex-col gap-2">
              <TypographyH4>About {user?.company?.name}</TypographyH4>
              <Divider />
            </div>
            <div className="flex items-start gap-3">
              <div className="h-full w-2 bg-primary" />
              <TypographyMuted className="leading-loose">
                {user?.company?.description}
              </TypographyMuted>
            </div>
          </div>

          {/* Open Positions Section */}
          {user?.company?.openPositions && user.company.openPositions.length > 0 && (
            <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
              <div className="w-full flex flex-col gap-2">
                <TypographyH4>Open Positions</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-col gap-3">
                {user?.company?.openPositions?.map((item) => (
                  <div
                    className="border border-muted px-5 py-3 rounded-md"
                    key={item.id}
                  >
                    <div className="flex flex-col items-start gap-5">
                      <div className="w-full flex items-center justify-between tablet-md:flex-col tablet-md:gap-5 tablet-md:[&>div]:w-full">
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-2">
                            <LucideBriefcaseBusiness strokeWidth={"1.5px"} />
                            <TypographyP className="font-medium !m-0">
                              {item.title}
                            </TypographyP>
                          </div>
                          <div className="flex items-center gap-3">
                            <Tag 
                              icon={<LucideAlarmClock strokeWidth={'1.5px'}/>} 
                              label={availabilityConstant.find((type) => type.value == item.type)?.label!} 
                            />
                            <Tag icon={<LucideUser strokeWidth={'1.5px'}/>} label={item.experience} />
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <IconLabel
                            icon={
                              <LucideCalendarDays className="text-muted-foreground" strokeWidth={"1.5px"}/>
                            }
                          text={`Post - ${dateFormatterv2(item.postedDate?.toString() ?? "")}`}
                          />
                          <IconLabel
                            icon={
                              <LucideCalendarDays className="text-muted-foreground" strokeWidth={"1.5px"}/>
                            }
                            text={`Deadline - ${dateFormatterv2(item.deadlineDate?.toString() ?? "")}`}
                          />
                        </div>
                      </div>
                      <Divider />
                      <div className="flex flex-col items-start gap-5">
                        <div className="flex flex-col items-start gap-2">
                          <TypographySmall className="font-medium">
                            Description
                          </TypographySmall>
                          <TypographyMuted>{item.description}</TypographyMuted>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <TypographySmall className="font-medium">
                            Education
                          </TypographySmall>
                          <TypographyMuted>{item.education}</TypographyMuted>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <TypographySmall className="font-medium">
                            Skills
                          </TypographySmall>
                          <div className="flex flex-wrap gap-3">
                            {item.skills.map((skill) => (
                              <Tag key={skill} label={skill} />
                            ))}
                          </div>
                        </div>
                        {item.salary && (
                          <div className="flex flex-col items-start gap-2">
                            <TypographySmall className="font-medium">
                              Salary Range
                            </TypographySmall>
                            <TypographyMuted>{item.salary}</TypographyMuted>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Careers Section */}
          {user?.company?.careerScopes && user.company.careerScopes.length > 0 && (
            <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
              <div className="w-full flex flex-col gap-1">
                <TypographyH4>Company Careers</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-col items-stretch gap-3">
                <div className="flex flex-wrap gap-3">
                  {user?.company?.careerScopes.map((career, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border-[1px] border-muted duration-300 ease-linear hover:border-muted-foreground"
                    >
                      <HoverCard>
                        <HoverCardTrigger>
                          <Tag label={career.name} />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <TypographySmall>{career.description ? career.description : career.name}</TypographySmall>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Life at Company Section */}
          {user?.company?.images && user.company.images.length > 0 && (
            <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
              <div className="w-full flex flex-col gap-2">
                <TypographyH4>Life at {user.company.name}</TypographyH4>
                <Divider />
              </div>
              <div className="w-full">
                <Carousel className="w-full">
                  <CarouselContent className="w-full">
                    {user.company.images.map((item: IImage) => (
                      <CarouselItem key={item.id} className="max-w-[280px]">
                        <div
                          onClick={(e) => {
                            handleClickImagePopup(e);
                            setCurrentCompanyImage(item.image);
                          }}
                          className="h-[180px] bg-muted rounded-md my-2 ml-2 bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-3" />
                  <CarouselNext className="mr-3" />
                </Carousel>
              </div>
            </div>
          )}
        </div>
        <div className="w-1/3 flex flex-col items-stretch gap-5">
          <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
            <div className="w-full flex flex-col gap-2">
              <TypographyH4>Company Information</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-col gap-5 [&>div>p]:text-primary [&>div>p]:font-medium [&>div>p]:text-md">
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Industry</TypographyMuted>
                <IconLabel
                  icon={<LucideBuilding className="text-muted-foreground" strokeWidth={"1.5px"}/>}
                  text={user?.company?.industry!}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Location</TypographyMuted>
                <IconLabel
                  icon={<LucideMapPinned className="text-muted-foreground" strokeWidth={"1.5px"}/>}
                  text={user?.company?.location!}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Founded</TypographyMuted>
                <IconLabel
                  icon={<LucideCalendarDays className="text-muted-foreground" strokeWidth={"1.5px"}/>}
                  text={`Founded in ${user?.company?.foundedYear}`}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Company Size</TypographyMuted>
                <IconLabel
                  icon={<LucideUsers className="text-muted-foreground" strokeWidth={"1.5px"}/>}
                  text={`${user?.company?.companySize}+ Employees`}
                />
              </div>
              {user?.company?.phone && (
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted>Phone</TypographyMuted>
                  <IconLabel 
                    icon={<LucidePhone className="text-muted-foreground" strokeWidth={"1.5px"}/>} 
                    text={user?.company?.phone!} 
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Email</TypographyMuted>
                <IconLabel
                  icon={<LucideMail className="text-muted-foreground" strokeWidth={"1.5px"}/>}
                  text={user?.email!}
                />
              </div>
            </div>
          </div>

          {/* Culture and Benefit Section */}
          <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
            <div className="w-full flex flex-col gap-2">
              <TypographyH4>Company Culture</TypographyH4>
              <Divider />
            </div>
            <div className="w-full flex flex-col items-stretch gap-3 [&>div]:w-full">
              {user?.company?.values && user.company.values.length > 0 && (
                <div className="flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                  <TypographyP className="font-medium">Values</TypographyP>
                  <div className="flex flex-col gap-2">
                    {user?.company?.values?.map((item) => (
                      <IconLabel
                        key={item.id}
                        icon={<LucideCircleCheck stroke="white" fill="#69B41E" />}
                        text={item.label}
                      />
                    ))}
                  </div>
                </div>
              )}
              {user?.company?.benefits && user.company.benefits.length > 0 && (
                <div className="flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                  <TypographyP className="font-medium">Benefits</TypographyP>
                  <div className="flex flex-col gap-2">
                    {user?.company?.benefits?.map((item: IBenefits) => (
                      <IconLabel
                        key={item.id}
                        icon={<LucideCircleCheck stroke="white" fill="#0073E6" />}
                        text={item.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Section */}
          {user?.company?.socials && user.company.socials.length > 0 && (
            <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
              <div className="w-full flex flex-col gap-2">
                <TypographyH4>Company Socials</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-wrap gap-3">
                {user.company.socials.map((item: ISocial) => (
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
        image={user?.company?.avatar!}
      />
    </div>
  );
}