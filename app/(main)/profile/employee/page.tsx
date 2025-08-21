"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Divider from "@/components/utils/divider";
import LabelInput from "@/components/utils/label-input";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideAlarmCheck,
  LucideBriefcaseBusiness,
  LucideCamera,
  LucideDownload,
  LucideEdit,
  LucideEye,
  LucideEyeClosed,
  LucideFileText,
  LucideGraduationCap,
  LucideLink2,
  LucideLock,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideSchool,
  LucideTrash2,
  LucideUser,
  LucideXCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TGender } from "@/utils/types/gender.type";
import { TLocations } from "@/utils/types/location.type";
import {
  genderConstant,
  locationConstant,
  platformConstant,
} from "@/utils/constants/app.constant";
import { Textarea } from "@/components/ui/textarea";
import IconLabel from "@/components/utils/icon-label";
import { DatePicker } from "@/components/ui/date-picker";
import { TPlatform } from "@/utils/types/platform.type";
import { Controller, useForm } from "react-hook-form";
import { employeeFormSchema, TEmployeeProfileForm } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IEducation,
  IExperience,
  ISkill,
} from "@/utils/interfaces/user-interface/employee.interface";
import {
  ICareerScopes,
  ISocial,
} from "@/utils/interfaces/user-interface/company.interface";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import ImagePopup from "@/components/utils/image-popup";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import EmployeeProfilePageSkeleton from "./skeleton";
import { dateFormatter } from "@/utils/functions/dateformatter";
import { extractCleanFilename } from "@/utils/functions/extract-clean-filename";
import Tag from "@/components/utils/tag";

export default function EmployeeProfilePage() {
  const { user, loading, getCurrentUser } = useGetCurrentUserStore();
  const employee = user?.employee;

  const { toast } = useToast();
  const form = useForm<TEmployeeProfileForm>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      basicInfo: {
        firstname: "",
        lastname: "",
        username: "",
        gender: "",
        location: "",
        avatar: null,
      },
      accountSetting: {
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      profession: {
        job: "",
        yearOfExperience: "",
        availability: "",
        description: "",
      },
      educations: [],
      experiences: [],
      skills: [],
      references: {
        resume: null,
        coverLetter: null,
      },
      careerScopes: [],
      socials: [],
    },
  });

  // All useState hooks
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [selectedGender, setSelectedGender] = useState<TGender | string>("");
  const [selectedLocation, setSelectedLocation] = useState<TLocations | string>(
    ""
  );
  const [education, setEducation] = useState<IEducation[]>([]);
  const [experience, setExperience] = useState<IExperience[]>([]);
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const [socialInput, setSocialInput] = useState<{
    platform: string;
    url: string;
  }>({ platform: "", url: "" });
  const [socials, setSocials] = useState<ISocial[]>([]);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");
  const [openCareerPopOver, setOpenCareerPopOver] = useState<boolean>(false);
  const [careerScopes, setCareerScopes] = useState<ICareerScopes[]>([]);
  const [careerScopeInput, setCareerScopeInput] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  // All useRef hooks
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);

  // Update form and states when user/employee data becomes available
  useEffect(() => {
    if (user && employee) {
      form.reset({
        basicInfo: {
          firstname: employee.firstname ?? "",
          lastname: employee.lastname ?? "",
          username: employee.username ?? "",
          gender: employee.gender ?? "",
          location: employee.location ?? "",
          avatar: employee.avatar ? new File([], "avatar.png") : null,
        },
        accountSetting: {
          email: user.email ?? "",
          phone: employee.phone,
          currentPassword: user.password ?? "",
          newPassword: "",
          confirmPassword: "",
        },
        profession: {
          job: employee.job ?? "",
          yearOfExperience: employee.yearsOfExperience?.toString(),
          availability: employee.availability ?? "",
          description: employee.description ?? "",
        },
        educations:
          employee.educations.map((edu) => ({
            school: edu.school,
            degree: edu.degree,
            year: edu.year,
          })) || [],
        experiences:
          employee.experiences.map((exp) => ({
            title: exp.title,
            description: exp.description,
            startDate: new Date(exp.startDate),
            endDate: new Date(exp.endDate),
          })) || [],
        skills:
          employee.skills.map((skill) => ({
            name: skill.name,
            description: skill.description,
          })) || [],
        references: {
          resume: employee.resume ?? null,
          coverLetter: employee.coverLetter ?? null,
        },
        careerScopes:
          employee.careerScopes.map((cp) => ({
            name: cp.name,
            description: cp.description,
          })) || [],
        socials: employee.socials.map((social) => ({
          platform: social.platform,
          url: social.url,
        })),
      });

      setSelectedGender(employee.gender ?? "");
      setSelectedLocation(employee.location ?? "");
      setEducation(
        employee.educations.map((edu) => ({
          ...edu,
          year: dateFormatter(edu.year),
        })) ?? []
      );
      setExperience(employee.experiences ?? []);
      setSocials(employee.socials ?? []);
      setSkills(employee.skills ?? []);
      setCareerScopes(employee.careerScopes ?? []);
    }
  }, [user, employee, form]);

  useEffect(() => {
    // Get current user with HTTP-only cookies
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (resumeFile) {
      const objectUrl = URL.createObjectURL(resumeFile);
      setResumeUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [resumeFile]);

  useEffect(() => {
    if (coverLetterFile) {
      const objectUrl = URL.createObjectURL(coverLetterFile);
      setCoverLetterUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [coverLetterFile]);

  useEffect(() => {
    const initialSocial = (form.getValues?.("socials") || []).filter(
      (s): s is { platform: string; url: string } => s !== undefined
    );
    setSocials(initialSocial);
  }, [form]);

  useEffect(() => {
    const initialSkill = form.getValues("skills") || [];
    setSkills(
      initialSkill.map((skill) => ({
        name: skill?.name ?? "",
        description: skill?.description ?? "",
      }))
    );
  }, [form]);

  useEffect(() => {
    const initialCareerScope = form.getValues("careerScopes") || [];
    setCareerScopes(
      initialCareerScope.map((cp) => ({
        name: cp?.name ?? "",
        description: cp?.description ?? "",
      }))
    );
  }, [form]);

  if (loading) return <EmployeeProfilePageSkeleton />;
  if (!user || !employee) return null;

  // Profile Popup

  // Education
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      year: "",
    };
    setEducation((prevEducation) => [...prevEducation, newEducation]);
  };

  const removeEducation = (educationId: string) => {
    setEducation((prevEducation) =>
      prevEducation.filter((edu) => edu.id !== educationId)
    );
  };

  // Experience
  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    };
    setExperience((prevExperience) => [...prevExperience, newExperience]);
  };

  const removeExperience = (experienceId: string) => {
    setExperience((prevExperience) =>
      prevExperience.filter((exp) => exp.id !== experienceId)
    );
  };

  //Socials
  const addSocial = () => {
    const trimmedPlatform = socialInput.platform.trim();
    const trimmedUrl = socialInput.url.trim();

    if (!trimmedPlatform || !trimmedUrl) return;

    const alreadyExists = socials.some(
      (s) => s.platform.toLowerCase() === trimmedPlatform.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicate Social",
        description: "This social platform already exists.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setSocialInput({ platform: "", url: "" });
      return;
    }

    setSocials([...socials, { platform: trimmedPlatform, url: trimmedUrl }]);
    setSocialInput({ platform: "", url: "" });
  };

  const removeSocial = (index: number) => {
    const updatedSocials = socials.filter((_, i) => i !== index);
    setSocials(updatedSocials);
  };

  // Avatar and References
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "resume" | "coverLetter"
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      if (type === "avatar") {
        setAvatarFile(file);
        form.setValue("basicInfo.avatar", file);
      } else if (type === "resume") {
        setResumeFile(file);
        form.setValue("references.resume", file);
      } else if (type === "coverLetter") {
        setCoverLetterFile(file);
        form.setValue("references.coverLetter", file);
      }
    }
  };

  // Skill
  const addSkills = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const alreadyExists = skills.some(
      (skill) => skill.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Skill",
        description: "Please input another skill.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setSkillInput("");
      setOpenSkillPopOver(false);
      return;
    }

    const updated = [...skills, { name: trimmed }];
    setSkills(updated);

    setSkillInput("");
    setOpenSkillPopOver(false);
  };

  const removeSkill = async (skillToRemove: string) => {
    const updated = skills.filter((skill) => skill.name !== skillToRemove);
    setSkills(updated);
    form.setValue("skills", updated);
    await form.trigger("skills");
  };

  // CareerScope
  const addCareerScope = () => {
    const trimmed = careerScopeInput.trim();
    if (!trimmed) return;

    const alreadyExists = careerScopes.some(
      (cs) => cs.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Skill",
        description: "Please input another skill.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });

      setCareerScopeInput("");
      setOpenCareerPopOver(false);
      return;
    }

    const updated = [...careerScopes, { name: trimmed }];
    setCareerScopes(updated);

    setCareerScopeInput("");
    setOpenCareerPopOver(false);
  };

  const removeCareerScope = async (careerToRemove: string) => {
    const updated = careerScopes.filter((cs) => cs.name !== careerToRemove);
    setCareerScopes(updated);
    form.setValue("careerScopes", updated);
    await form.trigger("careerScopes");
  };

  const handleDownloadfile = (file: File) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // clean up
  };

  return user ? (
    <form className="!min-w-full flex flex-col gap-5">
      <div className="flex items-center justify-between border border-muted rounded-md p-5 tablet-sm:flex-col tablet-sm:[&>div]:w-full tablet-sm:gap-5">
        <div className="flex items-center justify-start gap-5 tablet-sm:flex-col">
          <div className="relative" onClick={() => setOpenProfilePopup(true)}>
            <Avatar className="size-36" rounded="md">
              <AvatarImage
                src={
                  avatarFile ? URL.createObjectURL(avatarFile) : employee.avatar
                }
              />
              <AvatarFallback className="uppercase">
                {employee.username?.slice(0, 3)}
              </AvatarFallback>
            </Avatar>
            {isEdit && (
              <Button
                className="size-8 flex justify-center items-center cursor-pointer absolute bottom-1 right-1 p-1 rounded-full bg-foreground text-primary-foreground"
                onClick={() => avatarInputRef.current?.click()}
              >
                <LucideCamera width={"18px"} strokeWidth={"1.2px"} />
              </Button>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "avatar")}
          />
          <div className="flex flex-col items-start gap-1 tablet-sm:items-center">
            <TypographyH3>{employee.username}</TypographyH3>
            <TypographyMuted>{employee.job}</TypographyMuted>
          </div>
        </div>
        {isEdit ? (
          <Button
            type="button"
            className="text-xs"
            onClick={() => setIsEdit(false)}
          >
            Cancel
            <LucideXCircle />
          </Button>
        ) : (
          <Button
            type="button"
            className="text-xs"
            onClick={() => setIsEdit(true)}
          >
            Edit Profile
            <LucideEdit />
          </Button>
        )}
      </div>
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        <div className="w-[60%] flex flex-col gap-5">
          {/* Personal Information Form Section */}
          <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Personal Information</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-col items-start gap-5">
              <div className="w-full flex items-center justify-between gap-5 [&>div]:!w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                <LabelInput
                  label="Firstname"
                  input={
                    <Input
                      placeholder="Firstname"
                      id="firstname"
                      {...form.register("basicInfo.firstname")}
                      disabled={!isEdit}
                    />
                  }
                />
                <LabelInput
                  label="Lastname"
                  input={
                    <Input
                      placeholder="Lastname"
                      id="lastname"
                      {...form.register("basicInfo.lastname")}
                      disabled={!isEdit}
                    />
                  }
                />
              </div>
              <LabelInput
                label="Username"
                input={
                  <Input
                    placeholder="Username"
                    id="username"
                    {...form.register("basicInfo.username")}
                    disabled={!isEdit}
                  />
                }
              />
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2">
                <div className="flex flex-col items-start gap-1">
                  <TypographyMuted className="text-xs">
                    Locations
                  </TypographyMuted>
                  <Controller
                    name="basicInfo.location"
                    control={form.control}
                    defaultValue={selectedLocation}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value: TLocations) => {
                          field.onChange(value);
                          setSelectedLocation(value);
                        }}
                        value={field.value}
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue placeholder="Location" />
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
                <div className="flex flex-col items-start gap-1">
                  <TypographyMuted className="text-xs">Gender</TypographyMuted>
                  <Controller
                    name="basicInfo.gender"
                    control={form.control}
                    defaultValue={selectedGender}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value: TGender) => {
                          field.onChange(value);
                          setSelectedGender(value);
                        }}
                        value={field.value}
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderConstant.map((gender) => (
                            <SelectItem key={gender.id} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <LabelInput
                label="Email"
                input={
                  <Input
                    placeholder="Email"
                    id="email"
                    {...form.register("accountSetting.email")}
                    prefix={<LucideMail strokeWidth={"1.3px"} />}
                    disabled={!isEdit}
                  />
                }
              />
              <LabelInput
                label="Phone Number"
                input={
                  <Input
                    placeholder="Phone Number"
                    id="phone"
                    {...form.register("accountSetting.phone")}
                    prefix={<LucidePhone strokeWidth={"1.3px"} />}
                    disabled={!isEdit}
                  />
                }
              />
            </div>
          </div>

          {/* Professional Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Professional Information</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-col items-start gap-5">
              <LabelInput
                label="Profession"
                input={
                  <Input
                    placeholder="Profession"
                    id="profession"
                    {...form.register("profession.job")}
                    prefix={<LucideUser strokeWidth={"1.3px"} />}
                    disabled={!isEdit}
                  />
                }
              />
              <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-md:flex-col tablet-md:[&>div]:w-full">
                <LabelInput
                  label="Year of Experience"
                  input={
                    <Input
                      placeholder="Year of Experience"
                      id="yearOfExperience"
                      {...form.register("profession.yearOfExperience")}
                      prefix={<LucideBriefcaseBusiness strokeWidth={"1.3px"} />}
                      disabled={!isEdit}
                    />
                  }
                />
                <LabelInput
                  label="Availability"
                  input={
                    <Input
                      placeholder="Availability"
                      id="availability"
                      {...form.register("profession.availability")}
                      prefix={<LucideAlarmCheck strokeWidth={"1.3px"} />}
                      disabled={!isEdit}
                    />
                  }
                />
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <TypographyMuted className="text-xs">
                  Description
                </TypographyMuted>
                <Textarea
                  placeholder="Description"
                  id="description"
                  {...form.register("profession.description")}
                  disabled={!isEdit}
                />
              </div>
            </div>
          </div>

          {/* Education Information Form Section */}
          {employee.educations && employee.educations.length > 0 && (
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <TypographyH4>Education Information</TypographyH4>
                  {isEdit && (
                    <div onClick={addEducation}>
                      <IconLabel
                        text="Add Education"
                        icon={<LucidePlus className="text-muted-foreground" />}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <Divider />
              </div>

              {/* Education Information Section */}
              <div className="flex flex-col items-start gap-5">
                {education.map((edu, index) => (
                  <div
                    className="w-full flex flex-col items-start gap-3"
                    key={edu.id}
                  >
                    <div className="w-full flex items-center justify-between">
                      <TypographyMuted>Education {index + 1}</TypographyMuted>
                      {isEdit && (
                        <LucideTrash2
                          className="cursor-pointer text-red-500"
                          strokeWidth={"1.5px"}
                          width={"18px"}
                          onClick={() =>
                            edu.id && removeEducation(edu.id.toString())
                          }
                        />
                      )}
                    </div>
                    <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                      <LabelInput
                        label="School"
                        input={
                          <Input
                            placeholder="School"
                            id="school"
                            {...form.register(`educations.${index}.school`)}
                            prefix={<LucideSchool strokeWidth={"1.3px"} />}
                            disabled={!isEdit}
                          />
                        }
                      />
                      <LabelInput
                        label="Degree"
                        input={
                          <Input
                            placeholder="Degree"
                            id="degree"
                            {...form.register(`educations.${index}.degree`)}
                            prefix={
                              <LucideGraduationCap strokeWidth={"1.3px"} />
                            }
                            disabled={!isEdit}
                          />
                        }
                      />
                      <LabelInput
                        label="Graduation Year"
                        input={
                          <Controller
                            control={form.control}
                            name={`educations.${index}.year`}
                            render={({ field }) => (
                              <DatePicker
                                placeholder="Graduation Year"
                                date={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onDateChange={field.onChange}
                                disabled={!isEdit}
                              />
                            )}
                          />
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Information Form Section */}
          {employee.experiences && employee.experiences.length > 0 && (
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <TypographyH4>Experience Information</TypographyH4>
                  {isEdit && (
                    <div onClick={addExperience}>
                      <IconLabel
                        text="Add Education"
                        icon={<LucidePlus className="text-muted-foreground" />}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <Divider />
              </div>
              <div className="flex flex-col items-start gap-5">
                {experience.map((exp, index) => (
                  <div
                    className="w-full flex flex-col items-start gap-3"
                    key={exp.id}
                  >
                    <div className="w-full flex items-center justify-between">
                      <TypographyMuted>Experience {index + 1}</TypographyMuted>
                      {isEdit && (
                        <LucideTrash2
                          className="cursor-pointer text-red-500"
                          strokeWidth={"1.5px"}
                          width={"18px"}
                          onClick={() =>
                            exp.id && removeExperience(exp.id.toString())
                          }
                        />
                      )}
                    </div>
                    <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                      <LabelInput
                        label="Title"
                        input={
                          <Input
                            placeholder="Title"
                            id="title"
                            {...form.register(`experiences.${index}.title`)}
                            className="placeholder:!text-red-500"
                            prefix={
                              <LucideBriefcaseBusiness strokeWidth={"1.3px"} />
                            }
                            disabled={!isEdit}
                          />
                        }
                      />
                      <div className="w-full flex flex-col items-start gap-2">
                        <TypographyMuted className="text-xs">
                          Description
                        </TypographyMuted>
                        <Textarea
                          placeholder="Description"
                          id="description"
                          {...form.register(`experiences.${index}.description`)}
                          disabled={!isEdit}
                        />
                      </div>
                      <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                        <div className="w-1/2 flex flex-col items-start gap-1">
                          <TypographyMuted className="text-xs">
                            Start Date
                          </TypographyMuted>
                          <Controller
                            control={form.control}
                            name={`experiences.${index}.startDate`}
                            render={({ field }) => (
                              <DatePicker
                                placeholder="Start Date"
                                date={field.value}
                                onDateChange={field.onChange}
                                disabled={!isEdit}
                              />
                            )}
                          />
                        </div>
                        <div className="w-1/2 flex flex-col items-start gap-1">
                          <TypographyMuted className="text-xs">
                            End Date
                          </TypographyMuted>
                          <Controller
                            control={form.control}
                            name={`experiences.${index}.endDate`}
                            render={({ field }) => (
                              <DatePicker
                                placeholder="End Date"
                                date={field.value}
                                onDateChange={field.onChange}
                                disabled={!isEdit}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    id="currentPassword"
                    {...form.register("accountSetting.currentPassword")}
                    type={isShowPassword.current ? "text" : "password"}
                    disabled={!isEdit}
                    prefix={<LucideLock strokeWidth={"1.3px"} />}
                    suffix={
                      isEdit &&
                      (isShowPassword.current ? (
                        <LucideEyeClosed
                          strokeWidth={"1.3px"}
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              current: false,
                            })
                          }
                        />
                      ) : (
                        <LucideEye
                          strokeWidth={"1.3px"}
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              current: true,
                            })
                          }
                        />
                      ))
                    }
                  />
                }
              />
              <LabelInput
                label="New Password"
                input={
                  <Input
                    placeholder="New Password"
                    id="newPassword"
                    {...form.register("accountSetting.newPassword")}
                    type={isShowPassword.new ? "text" : "password"}
                    disabled={!isEdit}
                    prefix={<LucideLock strokeWidth={"1.3px"} />}
                    suffix={
                      isEdit &&
                      (isShowPassword.new ? (
                        <LucideEyeClosed
                          strokeWidth={"1.3px"}
                          onClick={() =>
                            setIsShowPassword({ ...isShowPassword, new: false })
                          }
                        />
                      ) : (
                        <LucideEye
                          strokeWidth={"1.3px"}
                          onClick={() =>
                            setIsShowPassword({ ...isShowPassword, new: true })
                          }
                        />
                      ))
                    }
                  />
                }
              />
              <LabelInput
                label="Confirm Password"
                input={
                  <Input
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    {...form.register("accountSetting.confirmPassword")}
                    type={isShowPassword.confirm ? "text" : "password"}
                    prefix={<LucideLock strokeWidth={"1.3px"} />}
                    suffix={
                      isEdit &&
                      (isShowPassword.confirm ? (
                        <LucideEyeClosed
                          strokeWidth={"1.3px"}
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              confirm: false,
                            })
                          }
                        />
                      ) : (
                        <LucideEye
                          strokeWidth={"1.3px"}
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              confirm: true,
                            })
                          }
                        />
                      ))
                    }
                  />
                }
              />
            </div>
          </div>

          {/* Skill Section */}
          {employee.skills && employee.skills.length > 0 && (
            <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
              <div className="w-full flex flex-col gap-1">
                <TypographyH4>Skills</TypographyH4>
                <Divider />
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <HoverCard key={index}>
                    <HoverCardTrigger>
                      <div className="flex items-center gap-1">
                        <Tag label={skill.name} />
                        {isEdit && (
                          <LucideXCircle
                            className="cursor-pointer text-red-500"
                            width={"18px"}
                            onClick={() => removeSkill(skill.name)}
                          />
                        )}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <TypographySmall>{skill.description}</TypographySmall>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
              {isEdit && (
                <Popover
                  open={openSkillPopOver}
                  onOpenChange={setOpenSkillPopOver}
                >
                  <PopoverTrigger asChild>
                    <Button className="w-full text-xs" variant="secondary">
                      Add Skill
                      <LucidePlus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                    <Input
                      placeholder="Enter your skill"
                      onChange={(e) => setSkillInput(e.target.value)}
                    />
                    <div className="flex items-center gap-1 [&>button]:text-xs">
                      <Button
                        variant="outline"
                        onClick={() => setOpenSkillPopOver(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={addSkills}>Save</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}

          {/* CareerScopes Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Career Scopes</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-wrap gap-3">
              {careerScopes.map((career, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-1">
                      <Tag label={career.name} />
                      {isEdit && (
                        <LucideXCircle
                          className="text-muted-foreground cursor-pointer text-red-500"
                          width={"18px"}
                          onClick={() => removeCareerScope(career.name)}
                        />
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <TypographySmall>{career.description}</TypographySmall>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
            {isEdit && (
              <Popover
                open={openCareerPopOver}
                onOpenChange={setOpenCareerPopOver}
              >
                <PopoverTrigger asChild>
                  <Button className="w-full text-xs" variant="secondary">
                    Add Career
                    <LucidePlus />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                  <Input
                    placeholder="Enter your skill"
                    onChange={(e) => {
                      setCareerScopeInput(e.target.value);
                    }}
                  />
                  <div className="flex items-center gap-1 [&>button]:text-xs">
                    <Button
                      variant="outline"
                      onClick={() => setOpenCareerPopOver(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addCareerScope}>Save</Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Reference Section */}
          {(employee.resume || employee.coverLetter) && (
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <TypographyH4>References Information</TypographyH4>
              <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
                <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <LucideFileText strokeWidth={"1.3px"} />
                    <TypographyMuted>
                      {resumeFile
                        ? resumeFile.name
                        : extractCleanFilename(employee.resume!)}
                    </TypographyMuted>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      ref={resumeInputRef}
                      onChange={(e) => handleFileChange(e, "resume")}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {isEdit && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => resumeInputRef.current?.click()}
                      >
                        <LucideEdit />
                      </Button>
                    )}
                    {resumeUrl ? (
                      <Link target="_blank" href={resumeUrl}>
                        <Button type="button" variant="outline" size="icon">
                          <LucideEye />
                        </Button>
                      </Link>
                    ) : (
                      <Button type="button" variant="outline" size="icon">
                        <LucideEye />
                      </Button>
                    )}
                    {isEdit ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setResumeFile(null)}
                      >
                        <LucideTrash2 />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownloadfile(resumeFile!)}
                      >
                        <LucideDownload />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <LucideFileText strokeWidth={"1.3px"} />
                    <TypographyMuted>
                      {coverLetterFile
                        ? coverLetterFile.name
                        : extractCleanFilename(employee.coverLetter!)}
                    </TypographyMuted>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      ref={coverLetterInputRef}
                      onChange={(e) => handleFileChange(e, "coverLetter")}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {isEdit && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => coverLetterInputRef.current?.click()}
                      >
                        <LucideEdit />
                      </Button>
                    )}
                    {coverLetterUrl ? (
                      <Link target="_blank" href={coverLetterUrl}>
                        <Button type="button" variant="outline" size="icon">
                          <LucideEye />
                        </Button>
                      </Link>
                    ) : (
                      <Button type="button" variant="outline" size="icon">
                        <LucideEye />
                      </Button>
                    )}
                    {isEdit ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setCoverLetterFile(null)}
                      >
                        <LucideTrash2 />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownloadfile(coverLetterFile!)}
                      >
                        <LucideDownload />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Information Form Section */}
          {employee.socials && employee.socials.length > 0 && (
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
                </div>
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
                          onValueChange={(value: string) =>
                            setSocialInput({ ...socialInput, platform: value })
                          }
                          value={socialInput.platform}
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
                            value={socialInput.url}
                            onChange={(e) =>
                              setSocialInput({
                                ...socialInput,
                                url: e.target.value,
                              })
                            }
                            prefix={<LucideLink2 />}
                          />
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-xs w-full"
                    onClick={addSocial}
                  >
                    <LucidePlus />
                    Add new social
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Popup Section */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={employee.avatar!}
      />
    </form>
  ) : null;
}
