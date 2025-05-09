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
  LucideCalendarDays,
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
import Tag from "@/components/utils/tag";
import { TPlatform } from "@/utils/types/platform.type";
import { userList } from "@/data/user-data";
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
import { getSocialPlatformTypeIcon } from "@/utils/get-social-type";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function EmployeeProfilePage() {
  const employeeId = 2;
  const employee = userList.filter((user) => user.role === "employee");
  const employeeList = employee[employeeId].employee;

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { toast } = useToast();

  const [isShowPassword, setIsShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [selectedGender, setSelectedGender] = useState<TGender | string>(employeeList!.gender);
  const [selectedLocation, setSelectedLocation] = useState<TLocations | string>(employeeList!.location);

  // Form   
  const form = useForm<TEmployeeProfileForm>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      basicInfo: {
        firstname: employeeList?.firstname ?? "",
        lastname: employeeList?.lastname ?? "",
        username: employeeList?.username ?? "",
        gender: employeeList?.gender ?? "",
        location: employeeList?.location ?? "",
        avatar: employeeList?.avatar ? new File([], "avatar.png") : null,
      },
      accountSetting: {
        email: employee[employeeId].email ?? "",
        phone: employeeList?.phone,
        currentPassword: employee[employeeId].password ?? "",
        newPassword: "",
        confirmPassword: "",
      },
      profession: {
        job: employeeList?.job ?? "",
        yearOfExperience: employeeList?.yearsOfExperience ?? "",
        availability: employeeList?.availability ?? "",
        description: employeeList?.description ?? "",
      },
      educations:
        employeeList?.educations.map((edu) => ({
          school: edu.school,
          degree: edu.degree,
          year: edu.year,
        })) || [],
      experiences:
        employeeList?.experiences.map((exp) => ({
          title: exp.title,
          description: exp.description,
          startDate: new Date(exp.startDate),
          endDate: new Date(exp.endDate),
        })) || [],
      skills:
        employeeList?.skills.map((skill) => ({
          name: skill.name,
          description: skill.description,
        })) || [],
      references: {
        resume: employeeList?.resume ?? null,
        coverLetter: employeeList?.coverLetter ?? null,
      },
      careerScopes:
        employeeList?.careerScopes.map((cp) => ({
          name: cp.name,
          description: cp.description,
        })) || [],
      socials: employeeList?.socials.map((social) => ({
        platform: social.platform,
        url: social.url,
      })),
    },
  });

  // Education
  const [education, setEducation] = useState<IEducation[]>(employeeList!.educations);

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
  const [experience, setExperience] = useState<IExperience[]>(employeeList!.experiences);

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
  const [socialInput, setSocialInput] = useState<{
    social: string;
    link: string;
  }>({ social: "", link: "" });
  const initialSocial = (form.getValues?.("socials") || []).filter(
    (s): s is { platform: string; url: string } => s !== undefined
  );
  const [socials, setSocials] = useState<ISocial[]>(initialSocial);


  // Avatar and References
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

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
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);
  const initialSkill = form.getValues("skills") || [];
  const [skills, setSkills] = useState<ISkill[]>(
    initialSkill.map((skill) => ({
      name: skill?.name ?? "",
      description: skill?.description ?? "",
    }))
  );
  const [skillInput, setSkillInput] = useState<string>("");
  
  const addSkills = () => {
    const trimmed = skillInput.trim();
    if(!trimmed) return; 

    const alreadyExists = skills.some(
      (skill) => skill.name.toLowerCase() === trimmed.toLowerCase()
    );
    
    if(alreadyExists) {
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
  }

  const removeSkill = async (skillToRemove: string) => {
    const updated = skills.filter((skill) => skill.name !== skillToRemove);
    setSkills(updated);
    form.setValue("skills", updated);
    await form.trigger("skills");
  }

  // CareerScope
  const [openCareerPopOver, setOpenCareerPopOver] = useState<boolean>(false);
  const initialCareerScope = form.getValues("careerScopes") || [];
  const [careerScopes, setCareerScopes] = useState<ICareerScopes[]>(
    initialCareerScope.map((cp) => ({
      name: cp?.name ?? "",
      description: cp?.description ?? "",
    }))
  );
  const [careerScopeInput, setCareerScopeInput] = useState<string>("");


  const addCareerScope = () => {
    const trimmed = careerScopeInput.trim();
    if(!trimmed) return;
    
    const alreadyExists = careerScopes.some(
      (cs) => cs.name.toLowerCase() === trimmed.toLowerCase()
    );

    if(alreadyExists) {
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
  }

  const removeCareerScope = async (careerToRemove: string) => {
    const updated = careerScopes.filter((cs) => cs.name !== careerToRemove);
    setCareerScopes(updated);
    form.setValue("careerScopes", updated);
    await form.trigger("careerScopes");
  }

  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(null);

  useEffect(() => {
    if (resumeFile) {
      const objectUrl = URL.createObjectURL(resumeFile);
      setResumeUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup to prevent memory leak
    }

    if(coverLetterFile) {
      const objectUrl = URL.createObjectURL(coverLetterFile) ;
      setCoverLetterUrl(objectUrl);
    
      return () => URL.revokeObjectURL(objectUrl); // Cleanup to prevent memory leak
    }
  }, [resumeFile, coverLetterFile]);

  return (
    <form className="!min-w-full flex flex-col gap-5">
      <div className="flex items-center justify-between border border-muted rounded-md p-5 tablet-sm:flex-col tablet-sm:[&>div]:w-full tablet-sm:gap-5">
        <div className="flex items-center justify-start gap-5 tablet-sm:flex-col">
          <div className="relative">
            <Avatar className="size-36" rounded="md">
              <AvatarImage
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : employeeList!.avatar
                }
              />
              <AvatarFallback className="uppercase">
                {employeeList!.username.slice(0, 3)}
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
            <TypographyH3>{employeeList?.username}</TypographyH3>
            <TypographyMuted>{employeeList?.job}</TypographyMuted>
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
                    prefix={<LucideMail />}
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
                    prefix={<LucidePhone />}
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
                    prefix={<LucideUser />}
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
                      prefix={<LucideBriefcaseBusiness />}
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
                      prefix={<LucideAlarmCheck />}
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
                          prefix={<LucideSchool />}
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
                          prefix={<LucideGraduationCap />}
                          disabled={!isEdit}
                        />
                      }
                    />
                    <LabelInput
                      label="Graduation Year"
                      input={
                        <Input
                          placeholder="Year"
                          id="year"
                          {...form.register(`educations.${index}.year`)}
                          prefix={<LucideCalendarDays />}
                          disabled={!isEdit}
                        />
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Information Form Section */}
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
                          prefix={<LucideBriefcaseBusiness />}
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
                          render={({ field, fieldState }) => (
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
                          render={({ field, fieldState }) => (
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
                    prefix={<LucideLock />}
                    suffix={
                      isEdit &&
                      (isShowPassword.current ? (
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
                    prefix={<LucideLock />}
                    suffix={
                      isEdit &&
                      (isShowPassword.new ? (
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
                    prefix={<LucideLock />}
                    suffix={
                      isEdit &&
                      (isShowPassword.confirm ? (
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
                      ))
                    }
                  />
                }
              />
            </div>
          </div>

          {/* Skill Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Skills</TypographyH4>
              <Divider />
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted cursor-pointer [&>div>p]:text-xs">
                      <IconLabel icon={null} text={skill.name}/>
                      {isEdit && (
                        <LucideXCircle
                          className="text-muted-foreground cursor-pointer text-red-500"
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
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted cursor-pointer [&>div>p]:text-xs">
                      <IconLabel icon={null} text={career.name}/>
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
                  <Input placeholder="Enter your skill" onChange={(e) => {setCareerScopeInput(e.target.value)}} />
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
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <TypographyH4>References Information</TypographyH4>
            <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
              <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                <div className="flex items-center text-muted-foreground gap-1">
                  <LucideFileText />
                  <TypographyMuted>{resumeFile ? resumeFile.name : employeeList?.resume}</TypographyMuted>
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
                  ) :  <Button type="button" variant="outline" size="icon">
                  <LucideEye />
                  </Button>}
                  <Button variant="outline" size="icon">
                    <LucideDownload />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                <div className="flex items-center text-muted-foreground gap-1">
                  <LucideFileText />
                  <TypographyMuted>{coverLetterFile ? coverLetterFile.name : employeeList?.coverLetter}</TypographyMuted>
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
                  ) :  <Button type="button" variant="outline" size="icon">
                  <LucideEye />
                  </Button>}
                  <Button variant="outline" size="icon">
                    <LucideDownload />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Information Form Section */}
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
                          onClick={() => {}}
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
                          setSocialInput({ ...socialInput, social: value })
                        }
                        value={socialInput.social}
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
                          value={socialInput.link}
                          onChange={(e) =>
                            setSocialInput({
                              ...socialInput,
                              link: e.target.value,
                            })
                          }
                          prefix={<LucideLink2 />}
                        />
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="text-xs w-full"
                  onClick={() => {}}
                >
                  <LucidePlus />
                  Add new social
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}