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
import { useParams, useRouter } from "next/navigation";
import {
  IBenefits,
  IImage,
  ISocial,
} from "@/utils/interfaces/user-interface/company.interface";
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
import { CompanyDetailPageSkeleton } from "./skeleton";
import { dateFormatterv2 } from "@/utils/functions/dateformatter-v2";
import { availabilityConstant } from "@/utils/constants/app.constant";

import { useEmployeeLikeStore } from "@/stores/apis/matching/employee-like.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { toast } from "@/hooks/use-toast";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useGetOneCompanyStore } from "@/stores/apis/company/get-one-cmp.store";

export default function CompanyDetailPage() {
  const param = useParams<{ companyId: string }>();
  const id = param.companyId;
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State for popups
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(
    null
  );
  const ignoreNextClick = useRef(false);

  // Get data and loading state
  //const { loading, user, getOneUerByID } = useGetOneUserStore();
  const { loading, companyData, queryOneCompany } = useGetOneCompanyStore();
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const employeeLikeStore = useEmployeeLikeStore();
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();

  // Initialize component (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") setIsInitialized(true);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!isInitialized || !id) return;

      try {
        setFetchError(null);
        useGetOneCompanyStore.setState({ companyData: null, loading: true });
        await queryOneCompany(id as string);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        setFetchError("Failed to load company data. Please try again.");
      }
    };

    fetchData();
  }, [id, isInitialized, queryOneCompany]);

  // Handle popup clicks
  const handleClickImagePopup = () => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    setOpenImagePopup(true);
  };

  const handleClickProfilePopup = () => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if (companyData?.avatar) setOpenProfilePopup(true);
  };

  // Loading or error states
  if (!isInitialized || loading) {
    return <CompanyDetailPageSkeleton />;
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

  if (!companyData) {
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

  const handleLike = async () => {
    const employeeId = currentUser?.employee?.id;
    const companyId = companyData.id;

    if (!employeeId) {
      toast({
        title: "Sign in required",
        description: "Please sign in as an employee to like a company.",
        variant: "destructive",
      });
      return;
    }
    if (!companyId) return;
    try {
      await employeeLikeStore.employeeLike(employeeId, companyId);
      const data = useEmployeeLikeStore.getState().data;
      if (data?.isMatched) {
        toast({
          title: "It's a match!",
          description: `You and ${data.company.name} like each other.`,
        });
        setTimeout(() => router.push("/matching"), 800);
      } else {
        toast({
          title: "Liked",
          description: `You liked ${companyData.name}.`,
        });
        setTimeout(() => router.push("/feed"), 800);
      }
    } catch {
      const err =
        useEmployeeLikeStore.getState().error || "Failed to like company";
      toast({ title: "Error", description: err, variant: "destructive" });
    }
  };

  const handleSaveFavorite = async () => {
    const employeeId = currentUser?.employee?.id;
    const companyId = companyData.id;
    if (!employeeId) {
      toast({
        title: "Sign in required",
        description: "Please sign in as an employee to save a company.",
        variant: "destructive",
      });
      return;
    }
    if (!companyId) return;
    try {
      await employeeFavCompanyStore.addCompanyToFavorite(employeeId, companyId);
      toast({ title: "Saved", description: "Company added to favorites." });
    } catch {
      const err = employeeFavCompanyStore.error || "Failed to save company";
      toast({ title: "Error", description: err, variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Section */}
      {companyData && (
        <div
          className="relative h-80 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center tablet-sm:items-start"
          style={{ backgroundImage: `url(${companyData.cover})` }}
        >
          <BlurBackGroundOverlay />
          <div className="relative flex items-center gap-5 tablet-sm:flex-col">
            <Avatar
              className="size-32 tablet-sm:size-28"
              rounded="md"
              onClick={handleClickProfilePopup}
            >
              <AvatarImage src={companyData.avatar ?? ""} />
              <AvatarFallback className="uppercase">
                {companyData.name.slice(0, 3)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-2 text-muted tablet-sm:items-center">
              <TypographyH2 className="tablet-sm:text-center tablet-sm:text-xl">
                {companyData.name}
              </TypographyH2>
              <TypographyP className="!m-0 tablet-sm:text-center tablet-sm:text-sm">
                {companyData.industry}
              </TypographyP>
              <div className="flex items-center gap-5">
                <IconLabel
                  icon={<LucideCalendarDays />}
                  text={`Founded in ${companyData.foundedYear}`}
                  className="[&>p]:text-primary-foreground"
                />
                <IconLabel
                  icon={<LucideUsers />}
                  text={`${companyData.companySize}+ Employees`}
                  className="[&>p]:text-primary-foreground"
                />
              </div>
            </div>
          </div>
          <div className="z-10 absolute right-3 bottom-3 flex items-center gap-3">
            {!employeeFavCompanyStore.isFavorite(id) && (
              <Button
                variant="outline"
                onClick={handleSaveFavorite}
                disabled={
                  employeeFavCompanyStore.loading || !currentUser?.employee?.id
                }
              >
                <LucideBookmark />
                Save to Favorite
              </Button>
            )}
            <Button
              onClick={handleLike}
              disabled={employeeLikeStore.loading || !currentUser?.employee?.id}
            >
              <LucideHeartHandshake />
              Like
            </Button>
          </div>
        </div>
      )}
      <div className="w-full flex items-stretch gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        <div className="w-2/3 flex flex-col items-stretch gap-5">
          {/* Description Section */}
          {companyData && companyData.description && (
            <div className="w-full flex flex-col items-start gap-3 border border-muted py-5 px-10">
              <div className="w-full flex flex-col gap-2">
                <TypographyH4>About {companyData.name}</TypographyH4>
                <Divider />
              </div>
              <div className="flex items-start gap-3">
                <div className="h-full w-2 bg-primary" />
                <TypographyMuted className="leading-loose">
                  {companyData.description}
                </TypographyMuted>
              </div>
            </div>
          )}

          {/* Open Positions Section */}
          {companyData &&
            companyData.openPositions &&
            companyData.openPositions.length > 0 && (
              <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                <div className="w-full flex flex-col gap-2">
                  <TypographyH4>Open Positions</TypographyH4>
                  <Divider />
                </div>
                <div className="w-full flex flex-col gap-3">
                  {companyData.openPositions?.map((item) => (
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
                              {item.type && (
                                <Tag
                                  icon={
                                    <LucideAlarmClock strokeWidth={"1.5px"} />
                                  }
                                  label={
                                    availabilityConstant.find(
                                      (type) => type.value == item.type
                                    )?.label ?? ""
                                  }
                                />
                              )}
                              {item.experience && (
                                <Tag
                                  icon={<LucideUser strokeWidth={"1.5px"} />}
                                  label={item.experience}
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-start gap-2">
                            <IconLabel
                              icon={
                                <LucideCalendarDays
                                  className="text-muted-foreground"
                                  strokeWidth={"1.5px"}
                                />
                              }
                              text={`Post - ${dateFormatterv2(
                                item.postedDate?.toString() ?? ""
                              )}`}
                            />
                            <IconLabel
                              icon={
                                <LucideCalendarDays
                                  className="text-muted-foreground"
                                  strokeWidth={"1.5px"}
                                />
                              }
                              text={`Deadline - ${dateFormatterv2(
                                item.deadlineDate?.toString() ?? ""
                              )}`}
                            />
                          </div>
                        </div>
                        <Divider />
                        <div className="flex flex-col items-start gap-5">
                          {item.description && (
                            <div className="flex flex-col items-start gap-2">
                              <TypographySmall className="font-medium">
                                Description
                              </TypographySmall>
                              <TypographyMuted>
                                {item.description}
                              </TypographyMuted>
                            </div>
                          )}
                          {item.education && (
                            <div className="flex flex-col items-start gap-2">
                              <TypographySmall className="font-medium">
                                Education
                              </TypographySmall>
                              <TypographyMuted>
                                {item.education}
                              </TypographyMuted>
                            </div>
                          )}
                          {item.skills && (
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
                          )}
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
          {companyData &&
            companyData.careerScopes.length > 0 &&
            companyData.careerScopes &&
            companyData.careerScopes.length > 0 && (
              <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
                <div className="w-full flex flex-col gap-1">
                  <TypographyH4>Company Careers</TypographyH4>
                  <Divider />
                </div>
                <div className="w-full flex flex-col items-stretch gap-3">
                  <div className="flex flex-wrap gap-3">
                    {companyData.careerScopes.map((career, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border-[1px] border-muted duration-300 ease-linear hover:border-muted-foreground"
                      >
                        <HoverCard>
                          <HoverCardTrigger>
                            <Tag label={career.name} />
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <TypographySmall>
                              {career.description
                                ? career.description
                                : career.name}
                            </TypographySmall>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Life at Company Section */}
          {companyData.images && companyData.images.length > 0 && (
            <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
              <div className="w-full flex flex-col gap-2">
                <TypographyH4>Life at {companyData.name}</TypographyH4>
                <Divider />
              </div>
              <div className="w-full">
                <Carousel className="w-full">
                  <CarouselContent className="w-full">
                    {companyData.images.map((item: IImage) => (
                      <CarouselItem key={item.id} className="max-w-[280px]">
                        <div
                          onClick={() => {
                            handleClickImagePopup();
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
                  icon={
                    <LucideBuilding
                      className="text-muted-foreground"
                      strokeWidth={"1.5px"}
                    />
                  }
                  text={companyData.industry ?? ""}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Location</TypographyMuted>
                <IconLabel
                  icon={
                    <LucideMapPinned
                      className="text-muted-foreground"
                      strokeWidth={"1.5px"}
                    />
                  }
                  text={companyData.location ?? ""}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Founded</TypographyMuted>
                <IconLabel
                  icon={
                    <LucideCalendarDays
                      className="text-muted-foreground"
                      strokeWidth={"1.5px"}
                    />
                  }
                  text={`Founded in ${companyData.foundedYear}`}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Company Size</TypographyMuted>
                <IconLabel
                  icon={
                    <LucideUsers
                      className="text-muted-foreground"
                      strokeWidth={"1.5px"}
                    />
                  }
                  text={`${companyData.companySize}+ Employees`}
                />
              </div>
              {companyData.phone && (
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted>Phone</TypographyMuted>
                  <IconLabel
                    icon={
                      <LucidePhone
                        className="text-muted-foreground"
                        strokeWidth={"1.5px"}
                      />
                    }
                    text={companyData.phone ?? ""}
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-2">
                <TypographyMuted>Email</TypographyMuted>
                <IconLabel
                  icon={
                    <LucideMail
                      className="text-muted-foreground"
                      strokeWidth={"1.5px"}
                    />
                  }
                  text={companyData.email}
                />
              </div>
            </div>
          </div>

          {/* Culture and Benefit Section */}
          {(companyData.values.length < 0 ||
            companyData.benefits.length < 0) && (
            <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
              <div className="w-full flex flex-col gap-2">
                <TypographyH4>Company Culture</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-col items-stretch gap-3 [&>div]:w-full">
                {companyData &&
                  companyData.values &&
                  companyData.values.length > 0 && (
                    <div className="flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                      <TypographyP className="font-medium">Values</TypographyP>
                      <div className="flex flex-col gap-2">
                        {companyData.values.map((item) => (
                          <IconLabel
                            key={item.id}
                            icon={
                              <LucideCircleCheck
                                stroke="white"
                                fill="#69B41E"
                              />
                            }
                            text={item.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                {companyData &&
                  companyData.benefits &&
                  companyData.benefits.length > 0 && (
                    <div className="flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                      <TypographyP className="font-medium">
                        Benefits
                      </TypographyP>
                      <div className="flex flex-col gap-2">
                        {companyData.benefits.map((item: IBenefits) => (
                          <IconLabel
                            key={item.id}
                            icon={
                              <LucideCircleCheck
                                stroke="white"
                                fill="#0073E6"
                              />
                            }
                            text={item.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Social Section */}
          {companyData.socials && companyData.socials.length > 0 && (
            <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
              <div className="w-full flex flex-col gap-2">
                <TypographyH4>Company Socials</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-wrap gap-3">
                {companyData.socials.map((item: ISocial) => (
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
        image={companyData.avatar ?? ""}
      />
    </div>
  );
}
