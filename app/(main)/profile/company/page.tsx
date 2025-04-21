"use client";

import OpenPositionForm from "@/components/company/profile/open-position-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { companyList } from "@/data/company-data";
import {
  locationConstant,
  platformConstant,
} from "@/utils/constants/app.constant";
import { TLocations } from "@/utils/types/location.type";
import { TPlatform } from "@/utils/types/platform.type";
import { Select } from "@radix-ui/react-select";
import {
  Check,
  ChevronDown,
  LucideBuilding,
  LucideCircleCheck,
  LucideCircleX,
  LucideEdit,
  LucideEye,
  LucideEyeClosed,
  LucideImagePlus,
  LucideLink2,
  LucideLock,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideUsers,
  LucideXCircle,
} from "lucide-react";
import { useState } from "react";
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
import { careerOptions } from "@/data/career-data";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TypographySmall } from "@/components/utils/typography/typography-small";

export default function ProfilePage() {
  const companyId = 1;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<TCompanyProfileForm>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      basicInfo: {
        name: companyList[companyId].name ?? "",
        description: companyList[companyId].description ?? "",
        industry: companyList[companyId].industry ?? "",
        companySize: companyList[companyId].companySize ?? "",
        foundedYear: companyList[companyId].foundedYear ?? "",
        location: companyList[companyId].location ?? "",
        avatar: companyList[companyId].avatar
          ? new File([], "avatar.png")
          : null,
        cover: companyList[companyId].cover ? new File([], "cover.png") : null,
      },
      accountSetting: {
        email: companyList[companyId].email ?? "",
        phone: companyList[companyId].phone ?? "",
        currentPassword: companyList[companyId].password ?? null,
        newPassword: "",
        confirmPassword: "",
      },
      openPositions: companyList[companyId].openPositions.map((position) => ({
        title: position.title ?? "",
        description: position.description ?? "",
        experienceRequirement: position.experience ?? "",
        educationRequirement: position.education ?? "",
        salary: position.salary ?? "",
        postedDate: new Date(position.postedDate) ?? null,
        deadlineDate: new Date(position.deadlineDate) ?? null,
        skill: position.skills ?? [],
      })),
      images: companyList[companyId].images ?? [],
      benefitsAndValues: {
        benefits: companyList[companyId].benefits ?? [],
        values: companyList[companyId].values ?? [],
      },
      careerScopes: companyList[companyId].careerScopes ?? [],
      socials: companyList[companyId].socials.map((social) => ({
        social: social.social,
        link: social.link,
      })),
    },
  });

  // Benefits
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);
  const [benefitInput, setBenefitInput] = useState<string>("");
  const initialBenefit = form.getValues?.("benefitsAndValues.benefits") || [];
  const [benefits, setBenefits] = useState<string[]>(initialBenefit);

  // Values
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<string>("");
  const initialValue = form.getValues?.("benefitsAndValues.values") || [];
  const [values, setValues] = useState<string[]>(initialValue);

  // Careers
  const [openCareersPopOver, setOpenCareersPopOver] = useState<boolean>(false);
  const [careersInput, setCareersInput] = useState<string>("");
  const initialCareerScope = form.getValues?.("careerScopes") || [];
  const [careers, setCareers] = useState<string[]>(initialCareerScope);

  const addBenefits = () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;

    const alreadyExists = benefits.some(
      (bf) => bf.toLowerCase() === trimmed.toLowerCase()
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

    const updated = [...benefits, trimmed];
    setBenefits(updated);

    setBenefitInput("");
    setOpenBenefitPopOver(false);
  };

  const removeBenefit = async (benefitToRemove: string) => {
    const updated = benefits.filter((bf) => bf !== benefitToRemove);
    setBenefits(updated);
    // setValue?.("benefitsAndValues.benefits", updated);

    // await trigger?.("benefitsAndValues.benefits");
  };

  const addValue = () => {
    const trimmed = valueInput.trim();
    if (!trimmed) return;

    // Check for duplicate value
    const alreadyExists = values.some(
      (value) => value.toLowerCase() === trimmed.toLowerCase()
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
    const updated = [...values, trimmed];
    setValues(updated);

    setValueInput("");
    setOpenValuePopOver(false);
  };

  const removeValue = async (valueToRemove: string) => {
    const updated = values.filter((value) => value !== valueToRemove);
    setValues(updated);
  };

  const addCareers = () => {
    const trimmed = careersInput.trim();
    if (!trimmed) return;

    // Check for duplicate careers
    const alreadyExists = careers.some(
      (career) => career.toLowerCase() === trimmed.toLowerCase()
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
    const updatedCareers = [...careers, trimmed];
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
      (career) => career !== careerToRemove
    );
    setCareers(updatedCareers);
  };

  const [isShowPassword, setIsShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<TLocations | string>(
    companyList[companyId].location
  );
  const [selectedPlatform, setSelectedPlatform] = useState<TPlatform | null>(
    null
  );
  const [selectedDates, setSelectedDates] = useState<
    Record<string, { posted?: Date; deadline?: Date }>
  >({});

  const getDeadlineDate = (positionId: string, fallback: Date) =>
    selectedDates[positionId]?.deadline ?? fallback;

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

  const onSubmit = (data: TCompanyProfileForm) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        className="relative h-72 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center"
        style={{
          backgroundImage:
            "url(https://plus.unsplash.com/premium_photo-1661962642401-ebd5ae0514ca?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXBwbGUlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D)",
        }}
      >
        <BlurBackGroundOverlay />
        <div className="relative flex items-center gap-5 tablet-sm:flex-col">
          <Avatar className="size-32 tablet-sm:size-28" rounded="md">
            <AvatarFallback>
              {companyList[companyId].avatar.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-2 text-muted tablet-sm:items-center">
            <TypographyH2 className="tablet-sm:text-center tablet-sm:text-xl">
              {companyList[companyId].name}
            </TypographyH2>
            <TypographyP className="!m-0 tablet-sm:text-center tablet-sm:text-sm">
              {companyList[companyId].industry}
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
            <form action="" className="flex flex-col items-start gap-5">
              <LabelInput
                label="Company Name"
                input={
                  <Input
                    placeholder={
                      isEdit ? "Company Name" : companyList[companyId].name
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
                      : companyList[companyId].description
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
                        isEdit ? "Industry" : companyList[companyId].industry
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
                        onValueChange={(value: TLocations) =>
                          field.onChange(value)
                        }
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue
                            placeholder={
                              isEdit ? "Select Location" : selectedLocation
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Map over your locations and create SelectItems */}
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
                          : companyList[companyId].companySize.toString() +
                            "+ Employee"
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
                          : companyList[companyId].foundedYear.toString()
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
                      isEdit ? "Email" : companyList[companyId].email
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
                      isEdit ? "Phone number" : companyList[companyId].phone
                    }
                    id="phone"
                    {...form.register("accountSetting.phone")}
                    prefix={<LucidePhone />}
                    disabled={!isEdit}
                  />
                }
              />
            </form>
          </div>

          {/* OpenPosition Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <TypographyH4>Open Position Information</TypographyH4>
                <IconLabel
                  text="Add Open Position"
                  icon={<LucidePlus className="text-muted-foreground" />}
                  className="cursor-pointer"
                />
              </div>
              <Divider />
            </div>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-start gap-5"
            >
              {companyList[companyId].openPositions &&
                companyList[companyId].openPositions.map((position, index) => {
                  const positionId = position.id.toString();
                  const deadlineFallback = new Date(position.deadlineDate);
                  return (
                    <OpenPositionForm
                      key={position.id}
                      index={index}
                      form={form}
                      positionLabel={`Position ${position.id}`}
                      isEdit={isEdit}
                      title={position.title}
                      description={position.description}
                      experience={position.experience}
                      education={position.education}
                      skill={position.skills}
                      salary={position.salary}
                      deadlineDate={{
                        defaultValue: deadlineFallback,
                        data: getDeadlineDate(positionId, deadlineFallback),
                        onDataChange: (date: Date | undefined) => {
                          if (date)
                            handleDateChange(positionId, "deadline", date);
                        },
                      }}
                    />
                  );
                })}
              {isEdit && (
                <div className="w-full flex justify-end">
                  <Button type="submit" className="text-xs">
                    Submit
                  </Button>
                </div>
              )}
            </form>
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
                    <CarouselItem key={index} className="max-w-[280px] relative group">
                      <div className="h-[180px] bg-muted rounded-md my-2 ml-2 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
                      {isEdit && (
                        <LucideXCircle
                          className="absolute top-3 right-1 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const updated = form.watch("images")?.filter((_, i) => i !== index);
                            form.setValue("images", updated);
                          }}
                        />
                      )}
                    </CarouselItem>
                  );
                })}
                {isEdit && <CarouselItem className="max-w-[280px]">
                  <label htmlFor="image-upload" className="h-[180px] bg-muted rounded-md my-2 ml-2 flex justify-center items-center cursor-pointer">
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
                </CarouselItem>}
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
            <form action="" className="flex flex-col items-start gap-5">
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
            </form>
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
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted"
                      key={benefit}
                    >
                      <IconLabel
                        icon={<LucideCircleCheck stroke="white" fill="#0073E6" />}
                        text={benefit}
                      />
                      {isEdit && (
                        <LucideXCircle className="text-muted-foreground cursor-pointer" onClick={() => removeBenefit(benefit)}/>
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
                  values.map((value) => (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted"
                      key={value}
                    >
                      <IconLabel
                        icon={<LucideCircleCheck stroke="white" fill="#69B41E" />}
                        text={value}
                      />
                      {isEdit && (
                        <LucideXCircle className="text-muted-foreground cursor-pointer" onClick={() => removeValue(value)} />
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
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted"
                  >
                    <TypographySmall>{career}</TypographySmall>
                    {isEdit && (
                      <LucideCircleX className="text-muted-foreground cursor-pointer" onClick={() => removeCareer(career)} />
                    )}
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
                      ? careerOptions.find(
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
                        {careerOptions.map((career, index) => (
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
                <div className="w-full flex flex-col items-start gap-3">
                  <TypographyMuted>Social 1</TypographyMuted>
                  <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                    <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                      <div className="flex flex-col items-start gap-1">
                        <TypographyMuted className="text-xs">
                          Platform
                        </TypographyMuted>
                        <Select
                          onValueChange={(value: TPlatform) =>
                            setSelectedPlatform(value)
                          }
                          value={selectedPlatform || ""}
                        >
                          <SelectTrigger className="h-12 text-muted-foreground">
                            <SelectValue placeholder="Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformConstant.map((platform) => (
                              <SelectItem
                                key={platform.id}
                                value={platform.value}
                              >
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
                            prefix={<LucideLink2 />}
                          />
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button variant="secondary" className="text-xs w-full">
                  <LucidePlus />
                  Add new social
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
