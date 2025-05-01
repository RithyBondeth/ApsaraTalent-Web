"use client";

import OpenPositionForm from "@/components/company/profile/open-position-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import BlurBackGroundOverlay from "@/components/utils/bur-background-overlay";
import Divider from "@/components/utils/divider";
import IconLabel from "@/components/utils/icon-label";
import LabelInput from "@/components/utils/label-input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  locationConstant,
  platformConstant,
} from "@/utils/constants/app.constant";
import { TLocations } from "@/utils/types/location.type";
import { Select } from "@radix-ui/react-select";
import {
  ChevronDown,
  LucideBuilding,
  LucideCamera,
  LucideCircleCheck,
  LucideCircleX,
  LucideEdit,
  LucideEye,
  LucideEyeClosed,
  LucideLink2,
  LucideLock,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideUsers,
  LucideXCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { companyFormSchema, TCompanyProfileForm } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { careerScopesList } from "@/data/career-data";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import Link from "next/link";
import { userList } from "@/data/user-data";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Tag from "@/components/utils/tag";
import ImagePopup from "@/components/utils/image-popup";
import { getSocialPlatformTypeIcon } from "@/utils/get-social-type";
import { TPlatform } from "@/utils/types/platform.type";
import { ISocial } from "@/utils/interfaces/user-interface/company.interface";

export default function ProfilePage() {
  const userId = 0;
  const company = userList.filter((user) => user.role === 'company');
  const companyList = company[userId].company;
  
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { toast } = useToast();

  const [openImagePopup, setOpenImagePopup] = useState<boolean>(false);
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(null);

  const handleClickImagePopup = (e: React.MouseEvent) => {
    if(ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;  
    }

    if((e.target as HTMLElement).closest(".dialog-content")) return;

    setOpenImagePopup(true);
  }

  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if(ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;  
    }

    if((e.target as HTMLElement).closest(".dialog-content")) return;

    setOpenProfilePopup(true);
  }

  useEffect(() => {
    if(openImagePopup || openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => ignoreNextClick.current = false, 200);
    }
  }, [openImagePopup, openProfilePopup]);

  const [openPositions, setOpenPositions] = useState(companyList?.openPositions);

  const form = useForm<TCompanyProfileForm>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      basicInfo: {
        name: companyList?.name ?? "",
        description: companyList?.description ?? "",
        industry: companyList?.industry ?? "",
        companySize: companyList!.companySize ?? "",
        foundedYear: companyList!.foundedYear ?? "",
        location: companyList?.location ?? "",
        avatar: companyList?.avatar
          ? new File([], "avatar.png")
          : null,
        cover: companyList?.cover ? new File([], "cover.png") : null,
      },
      accountSetting: {
        email: company[userId]?.email ?? "",
        phone: companyList?.phone ?? "",
        currentPassword: company[userId]?.password ?? null,
        newPassword: "",
        confirmPassword: "",
      },
      openPositions: companyList?.openPositions.map((position) => ({
        title: position.title ?? "",
        description: position.description ?? "",
        experienceRequirement: position.experience ?? "",
        educationRequirement: position.education ?? "",
        salary: position.salary ?? "",
        postedDate: new Date(position.postedDate) ?? null,
        deadlineDate: new Date(position.deadlineDate) ?? null,
        skills: position.skills ?? [],
      })),
      images: companyList?.images?.map((image) => image.image ?? []),
      benefitsAndValues: {
        benefits: companyList?.benefits ?? [],
        values: companyList?.values ?? [],
      },
      careerScopes: companyList?.careerScopes ?? [],
      socials: companyList?.socials.map((social) => ({
        platform: social.platform,
        url: social.url,
      })),
    },
    shouldFocusError: false, 
  });

  const addOpenPosition = () => {
  
    const newPosition = {
      id: Date.now().toString(), // Convert to string
      title: "",
      description: "",
      experienceRequirement: "",
      educationRequirement: "",
      skills: [],
      salary: "",
      type: "Full Time", // Default value
      experience: "",
      education: "",
      postedDate: new Date().toISOString(),
      deadlineDate: new Date().toISOString(),
    };

    setOpenPositions((prevPositions) => [...prevPositions!, newPosition]);
  };

  // Remove an open position
  const removeOpenPosition = (positionId: number) => {
    setOpenPositions((prevPositions) => 
      prevPositions!.filter((position) => position.id !== positionId.toString())
    );
  };

  // Benefits
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);
  const [benefitInput, setBenefitInput] = useState<string>("");
  const initialBenefit = form.getValues?.("benefitsAndValues.benefits") || [];
  const [benefits, setBenefits] = useState<{ label: string }[]>(initialBenefit);

  // Values
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<string>("");
  const initialValue = form.getValues?.("benefitsAndValues.values") || [];
  const [values, setValues] = useState<{ label: string }[]>(initialValue);

  // Careers
  const [openCareersPopOver, setOpenCareersPopOver] = useState<boolean>(false);
  const [careersInput, setCareersInput] = useState<string>("");
  const initialCareerScope = form.getValues?.("careerScopes") || [];
  const [careers, setCareers] = useState<{ name: string, description: string }[]>(
    initialCareerScope.map(career => ({ ...career, description: career.description || '' }))
  );

  // Socials
  const [socialInput, setSocialInput] = useState<{ social: string; link: string;}>({ social: "", link: "" });
  const initialSocial = (form.getValues?.("socials") || []).filter(
    (s): s is { platform: string; url: string } => s !== undefined
  );
  const [socials, setSocials] = useState<{ platform: string; url: string }[]>(initialSocial);

  const addBenefits = () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;

    const alreadyExists = benefits.some(
      (bf) => bf.label.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Benefit",
        description: "Please input another benefit.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setBenefitInput("");
      setOpenBenefitPopOver(false);
      return;
    }

    const updated = [...benefits, { label: trimmed }];
    setBenefits(updated);

    setBenefitInput("");
    setOpenBenefitPopOver(false);
  };

  const removeBenefit = async (benefitToRemove: string) => {
    const updated = benefits.filter((bf) => bf.label !== benefitToRemove);
    setBenefits(updated);
    // setValue?.("benefitsAndValues.benefits", updated);

    // await trigger?.("benefitsAndValues.benefits");
  };

  const addValue = () => {
    const trimmed = valueInput.trim();
    if (!trimmed) return;

    // Check for duplicate value
    const alreadyExists = values.some(
      (value) => value.label.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated value",
        description: "Please input another value.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setValueInput("");
      setOpenValuePopOver(false);
      return;
    }

    // Update new value
    const updated = [...values, { label: trimmed }];
    setValues(updated);

    setValueInput("");
    setOpenValuePopOver(false);
  };

  const removeValue = async (valueToRemove: string) => {
    const updated = values.filter((value) => value.label !== valueToRemove);
    setValues(updated);
  };

  const addCareers = () => {
    const trimmed = careersInput.trim();
    if (!trimmed) return;

    // Check for duplicate careers
    const alreadyExists = careers.some(
      (career) => career.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated career",
        description: "Please input another career.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setCareersInput("");
      setOpenCareersPopOver(false);
      return;
    }

    // Add new career
    const updatedCareers = [...careers, { name: trimmed, description: '' }];
    setCareers(updatedCareers);

    // Clear input field
    setCareersInput("");
    setOpenCareersPopOver(false); // Close popover after adding career
  };

  // Handle the career selection from the dropdown or input
  const handleCareerSelect = (selectedCareer: string) => {
    setCareersInput(selectedCareer); // Set the selected career to input
    setOpenCareersPopOver(false); // Close popover after selecting
  };

  // Handle delete career
  const removeCareer = (careerToRemove: string) => {
    const updatedCareers = careers.filter(
      (career) => career.name !== careerToRemove
    );
    setCareers(updatedCareers);
  };

  const addSocial = () => {
    const trimmedSocial = socialInput.social.trim();
    const trimmedLink = socialInput.link.trim();

    if (!trimmedSocial || !trimmedLink) return;

    // Check for duplicate social entries
    const alreadyExists = socials.some(
      (s) => s.platform.toLowerCase() === trimmedSocial.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicate Social",
        description: "This social platform already exists.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const updatedSocials = [
      ...socials,
      { platform: trimmedSocial, url: trimmedLink },
    ];
    setSocials(updatedSocials); // Update the state
    setSocialInput({ social: "", link: "" }); // Reset the input
  };

  const removeSocial = (index: number) => {
    const updatedSocials = socials.filter((_, i) => i !== index);
    setSocials(updatedSocials); // Update the state
  };

  const [isShowPassword, setIsShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [selectedLocation, setSelectedLocation] = useState<TLocations | string>(companyList!.location);

  const [selectedDates, setSelectedDates] = useState<Record<string, { posted?: Date; deadline?: Date }>>({});

  const getDeadlineDate = (positionId: string, fallback: Date) => selectedDates[positionId]?.deadline ?? fallback;

  const handleDateChange = (
    positionId: string,
    type: "posted" | "deadline",
    date: Date
  ) => {
    setSelectedDates((prev) => ({
      ...prev,
      [positionId]: {
        ...prev[positionId],
        [type]: date,
      },
    }));
  };

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (type === 'avatar') {
        setAvatarFile(file);
        form.setValue("basicInfo.avatar", file);
      } else if (type === 'cover') {
        setCoverFile(file);
        form.setValue("basicInfo.cover", file);
      }
    }
  };

  const onSubmit = (data: TCompanyProfileForm) => {
    // Make sure any local state is synced with form data
    const updatedData = {
      ...data,
      benefitsAndValues: {
        benefits: benefits,
        values: values
      },
      careerScopes: careers,
      socials: socials,
      openPositions: openPositions?.map((position, index) => ({
        id: position.id,
        title: data.openPositions?.[index]?.title || position.title,
        description: data.openPositions?.[index]?.description || position.description,
        experience: data.openPositions?.[index]?.experienceRequirement || position.experience,
        education: data.openPositions?.[index]?.educationRequirement || position.education,
        salary: data.openPositions?.[index]?.salary || position.salary,
        skills: data.openPositions?.[index]?.skills || position.skills,
        postedDate: position.postedDate,
        deadlineDate: selectedDates[position.id.toString()]?.deadline?.toISOString() || position.deadlineDate,
        type: "Full Time" // Default value or get from form if you have this field
      }))
    };
  
    console.log("Updated Company Profile:", updatedData);
    
    // Update your local state if needed
    // For example, you might want to update the companyList state
    // const updatedCompanyList = [...companyList];
    // updatedcompanyList = {...updatedcompanyList, ...updatedData};
    // setCompanyList(updatedCompanyList);
    
    // Show success message
    toast({
      title: "Success!",
      description: "Company profile updated successfully.",
    });
  
    // Exit edit mode
    setIsEdit(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Explicitly sync all state variables with the form
    form.setValue("benefitsAndValues.benefits", benefits);
    form.setValue("benefitsAndValues.values", values);
    form.setValue("careerScopes", careers);
    form.setValue("socials", socials);
    
    // Also sync any file uploads that might be managed outside the form
    if (avatarFile) {
      form.setValue("basicInfo.avatar", avatarFile);
    }
    
    if (coverFile) {
      form.setValue("basicInfo.cover", coverFile);
    }
    
    // Now submit the form
    form.handleSubmit(onSubmit)(e);
  };

  const { errors } = form.formState;
  console.log("Error: ", errors);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div
        className="relative h-72 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center"
        style={{ backgroundImage: `url(${coverFile ? URL.createObjectURL(coverFile) : companyList?.cover})` }}
      > 
        <BlurBackGroundOverlay />
        {isEdit && (
          <div 
            className="flex items-center gap-2 cursor-pointer absolute bottom-5 right-5 py-1 px-3 rounded-full bg-foreground text-primary-foreground"
            onClick={() => coverInputRef.current?.click()} 
          >
            <LucideCamera strokeWidth={"1.2px"} width={"18px"}/>
            <TypographySmall className="text-xs">Change Cover</TypographySmall>
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'cover')}
        />
        <div className="relative flex items-center gap-5 tablet-sm:flex-col">
          <Avatar 
            className="size-32 tablet-sm:size-28 relative bg-primary-foreground" rounded="md" 
            onClick={(e) => {
              if(!isEdit) handleClickProfilePopup(e)
            }}
          >
            <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : companyList?.avatar!}/>
            <AvatarFallback className="uppercase">
              {companyList?.name.slice(0, 3)}
            </AvatarFallback>
            {isEdit && (
              <div 
                className="size-8 flex justify-center items-center cursor-pointer absolute bottom-1 right-1 p-1 rounded-full bg-foreground text-primary-foreground"
                onClick={() => avatarInputRef.current?.click()}
              >
                <LucideCamera width={"18px"} strokeWidth={"1.2px"}/>
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'avatar')}
            />
          </Avatar>
          <div className="flex flex-col items-start gap-2 text-muted tablet-sm:items-center">
            <TypographyH2 className="tablet-sm:text-center tablet-sm:text-xl">
              {companyList?.name}
            </TypographyH2>
            <TypographyP className="!m-0 tablet-sm:text-center tablet-sm:text-sm">
              {companyList?.industry}
            </TypographyP>
          </div>
        </div>
        {isEdit ? (
          <Button
            className="text-xs absolute top-5 right-5 phone-xl:top-2 phone-xl:right-2"
            onClick={() => setIsEdit(false)}
          >
            Cancel
            <LucideCircleX />
          </Button>
        ) : (
          <Button
            className="text-xs absolute top-5 right-5 phone-xl:top-2 phone-xl:right-2"
            onClick={() => setIsEdit(true)}
          >
            Edit Profile
            <LucideEdit />
          </Button>
        )}
      </div>
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        <div className="w-[60%] flex flex-col gap-5">
          {/* Company Information Form Section */}
          <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Company Information</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-col items-start gap-5">
              <LabelInput
                label="Company Name"
                input={
                  <Input
                    placeholder={
                      isEdit ? "Company Name" : companyList?.name
                    }
                    id="company-name"
                    {...form.register("basicInfo.name")}
                    disabled={!isEdit}
                  />
                }
              />
              <div className="w-full flex flex-col items-start gap-2">
                <TypographyMuted className="text-xs">
                  Company Description
                </TypographyMuted>
                <Textarea
                  placeholder={
                    isEdit
                      ? "Company Description"
                      : companyList?.description
                  }
                  id="company-description"
                  {...form.register("basicInfo.description")}
                  className="placeholder:text-sm"
                  disabled={!isEdit}
                />
              </div>
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                <LabelInput
                  label="Industry"
                  input={
                    <Input
                      placeholder={
                        isEdit ? "Industry" : companyList?.industry
                      }
                      id="industry"
                      {...form.register("basicInfo.industry")}
                      disabled={!isEdit}
                    />
                  }
                />
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted className="text-xs">
                    Locations
                  </TypographyMuted>
                  <Controller
                    name="basicInfo.location"
                    control={form.control}
                    defaultValue={selectedLocation}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value: TLocations) => {
                          field.onChange(value); 
                          setSelectedLocation(value);
                        }}
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue placeholder={isEdit ? "Select Location" : selectedLocation} />
                        </SelectTrigger>
                        <SelectContent>
                          {locationConstant.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                <LabelInput
                  label="Company Size"
                  input={
                    <Input
                      type="number"
                      placeholder={
                        isEdit
                          ? "Company Size"
                          : companyList?.companySize.toString()
                        
                      }
                      id="company-size"
                      {...form.register("basicInfo.companySize")}
                      prefix={<LucideUsers />}
                      disabled={!isEdit}
                    />
                  }
                />
                <LabelInput
                  label="Founded Year"
                  input={
                    <Input
                      type="number"
                      placeholder={
                        isEdit
                          ? "Founded Year"
                          : companyList?.foundedYear.toString()
                      }
                      id="company-founded-year"
                      {...form.register("basicInfo.foundedYear")}
                      prefix={<LucideBuilding />}
                      disabled={!isEdit}
                    />
                  }
                />
              </div>
              <LabelInput
                label="Email"
                input={
                  <Input
                    placeholder={
                      isEdit ? "Email" : company[userId].email
                    }
                    id="email"
                    {...form.register("accountSetting.email")}
                    prefix={<LucideMail />}
                    disabled={!isEdit}
                  />
                }
              />
              <LabelInput
                label="Phone Number"
                input={
                  <Input
                    placeholder={
                      isEdit ? "Phone number" : companyList?.phone
                    }
                    id="phone"
                    {...form.register("accountSetting.phone")}
                    prefix={<LucidePhone />}
                    disabled={!isEdit}
                  />
                }
              />
            </div>
          </div>

          {/* OpenPosition Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <TypographyH4>Open Position Information</TypographyH4>
                  {isEdit && (
                    <div className="flex items-center gap-1 cursor-pointer" onClick={addOpenPosition}>
                      <LucidePlus className="text-muted-foreground" width={'18px'}/>
                      <TypographyMuted>Add New</TypographyMuted>
                    </div>
                  )}
              </div>
              <Divider />
            </div>
            <div
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-start gap-5"
            >
              {openPositions?.map((position, index) => {
                const positionId = position.id.toString();
                const deadlineFallback = new Date(position.deadlineDate);
                return (
                  <OpenPositionForm
                    key={index}
                    index={index}
                    form={form}
                    positionId={Number(position.id)}
                    positionLabel={`Position ${index + 1}`}
                    isEdit={isEdit}
                    title={position.title}
                    description={position.description}
                    experience={position.experience}
                    education={position.education}
                    skills={position.skills}
                    salary={position.salary}
                    deadlineDate={{
                      defaultValue: deadlineFallback,
                      data: getDeadlineDate(positionId, deadlineFallback),
                      onDataChange: (date: Date | undefined) => {
                        if (date)
                          handleDateChange(positionId, "deadline", date);
                        },
                    }}
                    onRemove={removeOpenPosition}
                  />
                )
              })}
            </div>
          </div>
          {/* Company Multiple Images Section */}
          <div className="w-full p-5 border-[1px] border-muted rounded-md">
            <div className="flex flex-col gap-1">
              <TypographyH4>Company Images Information</TypographyH4>
              <Divider />
            </div>
            <Carousel className="w-full">
              <CarouselContent className="w-full">
                {form.watch("images")?.map((img, index) => {
                  let imageUrl = "";

                  if (typeof img === "string") {
                    imageUrl = img;
                  } else if (img instanceof File) {
                    imageUrl = URL.createObjectURL(img);
                  }

                  return (
                    <CarouselItem key={index} className="max-w-[280px] relative">
                      <div
                        onClick={(e) => {
                          if(!isEdit) {
                            handleClickImagePopup(e);
                            setCurrentCompanyImage(img!.toString());
                          }
                        }}
                        className="h-[180px] bg-muted rounded-md my-2 ml-2 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      {isEdit && (
                        <LucideXCircle
                          className="absolute top-3 right-1 cursor-pointer text-red-500"
                          onClick={() => {
                            const updated = form
                              .watch("images")
                              ?.filter((_, i) => i !== index);
                            form.setValue("images", updated);
                          }}
                        />
                      )}
                    </CarouselItem>
                  );
                })}
                {isEdit && (
                  <CarouselItem className="max-w-[280px]">
                    <label
                      htmlFor="image-upload"
                      className="h-[180px] bg-muted rounded-md my-2 ml-2 flex justify-center items-center cursor-pointer"
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;

                          const currentImages = form.watch("images") || [];
                          form.setValue("images", [...currentImages, files[0]]);
                        }}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <LucidePlus className="text-muted-foreground" />
                        <TypographyMuted className="text-xs">
                          Add Company Image
                        </TypographyMuted>
                      </div>
                    </label>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="ml-8" />
              <CarouselNext className="mr-8" />
            </Carousel>
          </div>
        </div>
        <div className="w-[40%] flex flex-col gap-5">
          <div className="flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Account Settings</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-col items-start gap-5">
              <LabelInput
                label="Current Password"
                input={
                  <Input
                    placeholder="Current Password"
                    id="current-password"
                    {...form.register("accountSetting.currentPassword")}
                    disabled={!isEdit}
                    type={isShowPassword.current ? "text" : "password"}
                    prefix={<LucideLock />}
                    suffix={
                      isShowPassword.current ? (
                        <LucideEyeClosed
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              current: false,
                            })
                          }
                        />
                      ) : (
                        <LucideEye
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              current: true,
                            })
                          }
                        />
                      )
                    }
                  />
                }
              />
              <LabelInput
                label="New Password"
                input={
                  <Input
                    placeholder="New Password"
                    id="new-password"
                    {...form.register("accountSetting.newPassword")}
                    disabled={!isEdit}
                    type={isShowPassword.new ? "text" : "password"}
                    prefix={<LucideLock />}
                    suffix={
                      isShowPassword.new ? (
                        <LucideEyeClosed
                          onClick={() =>
                            setIsShowPassword({ ...isShowPassword, new: false })
                          }
                        />
                      ) : (
                        <LucideEye
                          onClick={() =>
                            setIsShowPassword({ ...isShowPassword, new: true })
                          }
                        />
                      )
                    }
                  />
                }
              />
              <LabelInput
                label="Confirm Password"
                input={
                  <Input
                    placeholder="Confirm Password"
                    id="confirm-password"
                    {...form.register("accountSetting.confirmPassword")}
                    disabled={!isEdit}
                    type={isShowPassword.confirm ? "text" : "password"}
                    prefix={<LucideLock />}
                    suffix={
                      isShowPassword.confirm ? (
                        <LucideEyeClosed
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              confirm: false,
                            })
                          }
                        />
                      ) : (
                        <LucideEye
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              confirm: true,
                            })
                          }
                        />
                      )
                    }
                  />
                }
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Benefits</TypographyH4>
              <Divider />
            </div>
            <div className="w-full flex flex-col items-stretch gap-3">
              <div className="w-full flex flex-wrap gap-3">
                {benefits &&
                  benefits.map((benefit) => (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted [&>div>p]:text-xs"
                      key={benefit.label}
                    >
                      <IconLabel
                        icon={
                          <LucideCircleCheck stroke="white" fill="#0073E6" />
                        }
                        text={benefit.label}
                      />
                      {isEdit && (
                        <LucideXCircle
                          className="text-muted-foreground cursor-pointer text-red-500"
                          width={"18px"}
                          onClick={() => removeBenefit(benefit.label)}
                        />
                      )}
                    </div>
                  ))}
              </div>
              {isEdit && (
                <Popover
                  open={openBenefitPopOver}
                  onOpenChange={setOpenBenefitPopOver}
                >
                  <PopoverTrigger asChild>
                    <Button className="w-full text-xs" variant="secondary">
                      Add benefit
                      <LucidePlus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                    <Input
                      placeholder="Enter your benefit (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                    />
                    <div className="flex items-center gap-1 [&>button]:text-xs">
                      <Button
                        variant="outline"
                        onClick={() => setOpenBenefitPopOver(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={addBenefits}>Save</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Values Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Values</TypographyH4>
              <Divider />
            </div>
            <div className="w-full flex flex-col items-stretch gap-3">
              <div className="w-full flex flex-wrap gap-3">
                {values &&
                  values.map((value, index) => (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted [&>div>p]:text-xs"
                      key={index}
                    >
                      <IconLabel
                        icon={
                          <LucideCircleCheck stroke="white" fill="#69B41E" />
                        }
                        text={value.label}
                      />
                      {isEdit && (
                        <LucideXCircle
                          className="text-muted-foreground cursor-pointer text-red-500"
                          width={"18px"}
                          onClick={() => removeValue(value.label)}
                        />
                      )}
                    </div>
                  ))}
              </div>
              {isEdit && (
                <Popover
                  open={openValuePopOver}
                  onOpenChange={setOpenValuePopOver}
                >
                  <PopoverTrigger asChild>
                    <Button className="w-full text-xs" variant="secondary">
                      Add value
                      <LucidePlus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                    <Input
                      placeholder="Enter your value (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"
                      value={valueInput}
                      onChange={(e) => setValueInput(e.target.value)}
                    />
                    <div className="flex items-center gap-1 [&>button]:text-xs">
                      <Button
                        variant="outline"
                        onClick={() => setOpenValuePopOver(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={addValue}>Save</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* CareersScopes Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Careers Scopes</TypographyH4>
              <Divider />
            </div>
            <div className="w-full flex flex-col items-stretch gap-3">
              <div className="flex flex-wrap gap-3">
                {careers.map((career, index) => (
                  <div key={index} className="rounded-3xl border-2 border-muted duration-300 ease-linear hover:border-muted-foreground">
                    <HoverCard>
                      <HoverCardTrigger className="flex items-center bg-muted rounded-3xl">
                        <Tag label={career.name}/>
                        {isEdit && (
                          <LucideCircleX
                            className="text-muted-foreground cursor-pointer mr-2 text-red-500"
                            width={"18px"}
                            onClick={() => removeCareer(career.name)}
                          />
                        )}
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <TypographySmall>{career.description ? career.description : career.name}</TypographySmall>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
              </div>
            </div>
            {isEdit && (
              <Popover
                open={openCareersPopOver}
                onOpenChange={setOpenCareersPopOver}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {careersInput
                      ? careerScopesList.find(
                          (career) => career.value === careersInput
                        )?.label
                      : "Select careers..."}
                    <ChevronDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Select careers..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No career found.</CommandEmpty>
                      <CommandGroup>
                        {careerScopesList.map((career, index) => (
                          <CommandItem
                            key={index}
                            value={career.value}
                            onSelect={() => handleCareerSelect(career.value)} // Handle career selection
                          >
                            {career.label}
                            <LucideCircleCheck
                              className={
                                careersInput === career.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              }
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            {isEdit && (
              <Button
                variant="secondary"
                className="w-full text-xs"
                onClick={addCareers}
              >
                <LucidePlus />
                Add Career
              </Button>
            )}
          </div>

          {/* Social Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Social Information</TypographyH4>
              <Divider />
            </div>
            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-stretch gap-3">
                <div className="flex flex-wrap gap-3">
                  {socials.map((item: ISocial, index) => (
                    <Link
                        key={index}
                        href={item.url}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:underline"
                    >
                        {getSocialPlatformTypeIcon(item.platform as TPlatform)}
                        <TypographySmall>{item.platform}</TypographySmall>
                        {isEdit && (
                      <LucideXCircle
                        className="text-muted-foreground cursor-pointer text-red-500"
                        width={"18px"}
                        onClick={() => removeSocial(index)}
                      />
                    )}
                    </Link>
                  ))}
                </div>
                {isEdit && (
                  <div>
                    <div className="w-full flex flex-col items-start gap-5 p-5 mt-3 border-[1px] border-muted rounded-md">
                      <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                        <div className="w-full flex flex-col items-start gap-1">
                          <TypographyMuted className="text-xs">
                            Platform
                          </TypographyMuted>
                          <Select
                            onValueChange={(value: string) => setSocialInput({ ...socialInput, social: value })}
                            value={socialInput.social}
                          >
                            <SelectTrigger className="h-12 text-muted-foreground">
                              <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent>
                              {platformConstant.map((platform) => (
                                <SelectItem key={platform.id} value={platform.value}>
                                  {platform.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <LabelInput
                          label="Link"
                          input={
                            <Input
                              placeholder="Link"
                              id="link"
                              name="link"
                              value={socialInput.link}
                              onChange={(e) => setSocialInput({ ...socialInput, link: e.target.value })}
                              prefix={<LucideLink2 />}
                            />
                          }
                        />
                      </div>
                    </div>
                    <Button variant="secondary" className="text-xs w-full" onClick={addSocial}>
                      <LucidePlus />
                      Add new social
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isEdit && (
            <div className="w-full flex justify-end">
              <Button type="submit" className="text-xs w-full">
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
        
      {/* Image Popup Section */}
      <ImagePopup open={openImagePopup} setOpen={setOpenImagePopup} image={currentCompanyImage!}/>

      {/* Profile Popup Section */}
      <ImagePopup 
        open={openProfilePopup} 
        setOpen={setOpenProfilePopup}
        image={avatarFile ? URL.createObjectURL(avatarFile) : companyList?.avatar!}
      />
    </form>
  );
}
