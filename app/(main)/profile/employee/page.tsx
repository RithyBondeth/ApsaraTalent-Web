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
  ChevronDown,
  LucideAlarmCheck,
  LucideBriefcaseBusiness,
  LucideCamera,
  LucideCheck,
  LucideCircleCheck,
  LucideDownload,
  LucideEdit,
  LucideEye,
  LucideFileText,
  LucideGraduationCap,
  LucideLink2,
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
  loginMethodConstant,
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
  ICareerScopes,
  ISocial,
} from "@/utils/interfaces/user-interface/employee.interface";
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
import Image from "next/image";
import { useGetAllCareerScopesStore } from "@/stores/apis/users/get-all-career-scopes.store";
import {
  TEmployeeUpdateBody,
  useUpdateOneEmployeeStore,
} from "@/stores/apis/employee/update-one-emp.store";
import { useUploadEmployeeAvatarStore } from "@/stores/apis/employee/upload-emp-avatar.store";
import { useUploadEmployeeResumeStore } from "@/stores/apis/employee/upload-emp-resume.store";
import { useUploadEmployeeCoverLetter } from "@/stores/apis/employee/upload-emp-coverletter.store";
import { useRemoveEmpAvatarStore } from "@/stores/apis/employee/remove-emp-avatar.store";
import { useRemoveEmpResumeStore } from "@/stores/apis/employee/remove-emp-resume.store";
import { useRemoveEmpCoverLetterStore } from "@/stores/apis/employee/remove-emp-coverletter.store";
import { capitalizeWords } from "@/utils/functions/capitalize-words";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRemoveEmpExperienceStore } from "@/stores/apis/employee/remove-emp-experience.store";
import { useRemoveEmpEducationStore } from "@/stores/apis/employee/remove-emp-education.store";
import RemoveAvatarOrCoverDialog from "../company/_dialogs/remove-avatar-cover-dialog";

export default function EmployeeProfilePage() {
  // API Integration
  // Current User Information and Current User CareerScopes
  const { user, loading, getCurrentUser } = useGetCurrentUserStore();
  const employee = user?.employee;
  const getAllCareerScopesStore = useGetAllCareerScopesStore();

  // Update Employee Information
  const updateOneEmpStore = useUpdateOneEmployeeStore();

  // Upload Avatar, Resume and CoverLetter
  const uploadAvatarEmpStore = useUploadEmployeeAvatarStore();
  const uploadResumeEmpStore = useUploadEmployeeResumeStore();
  const uploadCoverLetterEmpStore = useUploadEmployeeCoverLetter();

  // Remove Avatar, Resume and CoverLetter
  const removeEmpAvatarStore = useRemoveEmpAvatarStore();
  const removeEmpResumeStore = useRemoveEmpResumeStore();
  const removeEmpCoverLetterStore = useRemoveEmpCoverLetterStore();
  const removeEmpExperieceStore = useRemoveEmpExperienceStore();
  const removeEmpEducationStore = useRemoveEmpEducationStore();

  // Compute All Loading States
  const updatedProfileLoadingState =
    updateOneEmpStore.loading ||
    uploadAvatarEmpStore.loading ||
    uploadResumeEmpStore.loading ||
    uploadCoverLetterEmpStore.loading ||
    removeEmpAvatarStore.loading ||
    removeEmpResumeStore.loading ||
    removeEmpCoverLetterStore.loading;

  // Utils
  const { toast, dismiss } = useToast();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Avatar States
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] =
    useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  // Resume States
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  // CoverLetter States
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);

  // Select Gender and Location States
  const [selectedGender, setSelectedGender] = useState<TGender | string>("");
  const [selectedLocation, setSelectedLocation] = useState<TLocations | string>(
    "",
  );

  // Education and Experience States
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [selectedGraduationDate, setSelectedGraduationDate] =
    useState<Date | null>(null);
  const [selectedExperienceDate, setSelectedExperienceDate] = useState<
    Record<string, { startDate?: Date; endDate?: Date }>
  >({});

  // Social States
  const [socialInput, setSocialInput] = useState<ISocial | null>(null);
  const [socials, setSocials] = useState<ISocial[]>([]);
  const [deleteSocialIds, setDeleteSocialIds] = useState<string[]>([]);

  // Skill States
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [deleteSkillIds, setDeleteSkillIds] = useState<string[]>([]);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

  // CareerScope States
  const [careerScopeInput, setCareerScopeInput] =
    useState<ICareerScopes | null>(null);
  const [careerScopes, setCareerScopes] = useState<ICareerScopes[]>([]);
  const [deleteCareerScopeIds, setDeleteCareerScopeIds] = useState<string[]>(
    [],
  );
  const [openCareerScopePopOver, setOpenCareerScopePopOver] =
    useState<boolean>(false);

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
    shouldFocusError: false,
  });

  // All useEffect Hooks
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Query Current Employee Profile Information Effect
  useEffect(() => {
    if (user && employee) {
      // Initialize form data
      form.reset({
        basicInfo: {
          firstname: employee.firstname ?? "",
          lastname: employee.lastname ?? "",
          username: employee.username ?? "",
          gender: employee.gender ?? "",
          location: employee.location ?? "",
          avatar: employee.avatar ?? null,
        },
        accountSetting: {
          email: user.email ?? "",
          phone: employee.phone,
        },
        profession: {
          job: employee.job ?? "",
          yearOfExperience: employee.yearsOfExperience?.toString(),
          availability: employee.availability ?? "",
          description: employee.description ?? "",
        },
        educations:
          employee.educations.map((edu) => {
            let year = new Date();
            if (edu.year && typeof edu.year === "string") {
              if (edu.year.includes("/")) {
                // Parse DD/MM/YYYY string
                const [d, m, y] = edu.year.split("/").map(Number);
                year = new Date(y, m - 1, d);
              } else {
                // Parse as ISO string or other format
                year = new Date(edu.year);
              }
            }
            return {
              school: edu.school,
              degree: edu.degree,
              year: year,
            };
          }) || [],
        experiences:
          employee.experiences.map((exp) => {
            let startDate = new Date();
            let endDate = new Date();

            if (
              (exp.startDate && typeof exp.startDate === "string") ||
              (exp.endDate && typeof exp.endDate === "string")
            ) {
              if (exp.startDate.includes("/") || exp.endDate.includes("/")) {
                const [dayS, monthS, yearS] = exp.startDate
                  .split("/")
                  .map(Number);
                startDate = new Date(yearS, monthS - 1, dayS);

                const [dayE, monthE, yearE] = exp.endDate
                  .split("/")
                  .map(Number);
                endDate = new Date(yearE, monthE - 1, dayE);
              } else {
                startDate = new Date(exp.startDate);
                endDate = new Date(exp.endDate);
              }
            }
            return {
              title: exp.title,
              description: exp.description,
              startDate: startDate,
              endDate: endDate,
            };
          }) || [],
        skills:
          employee.skills.map((skill) => ({
            name: skill.name,
            description: skill.description,
          })) || [],
        references: {
          resume: employee.resume ?? null,
          coverLetter: employee.coverLetter ?? null,
        },
        careerScopes: employee.careerScopes.map((cp) => ({
          name: cp.name,
          description: cp.description,
        })),
        socials: employee.socials.map((social) => ({
          platform: social.platform,
          url: social.url,
        })),
      });

      setSelectedGender(employee.gender ?? "");
      setSelectedLocation(employee.location ?? "");
      setEducations(
        employee.educations.map((edu) => ({
          ...edu,
          year: dateFormatter(edu.year),
        })) ?? [],
      );
      setExperiences(employee.experiences ?? []);
      setSocials(employee.socials ?? []);
      setSkills(employee.skills ?? []);
      setCareerScopes(employee.careerScopes ?? []);
    }
  }, [user, employee, form]);

  // Initial CareerScope Effect
  useEffect(() => {
    const initialCareerScopes = form.getValues("careerScopes") || [];

    setCareerScopes(
      initialCareerScopes.map((cs) => ({
        id: cs?.id,
        name: cs?.name ?? "",
        description: cs?.description,
      })),
    );
  }, [form]);

  // Initial Social Effect
  useEffect(() => {
    const initialSocial = (form.getValues("socials") || []).filter(
      (s): s is ISocial =>
        !!s && typeof s.platform === "string" && typeof s.url === "string",
    );

    setSocials(initialSocial);
  }, [form]);

  // Initial Skill Effect
  useEffect(() => {
    const initialSkills = form.getValues("skills") || [];

    setSkills(
      initialSkills.map((skill) => ({
        id: skill?.id ?? "",
        name: skill?.name ?? "",
        description: skill?.description ?? "",
      })),
    );
  }, [form]);

  // Initial Resume File
  useEffect(() => {
    if (resumeFile) {
      const objectUrl = URL.createObjectURL(resumeFile);
      setResumeUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [resumeFile]);

  // Initial CoverLetter File
  useEffect(() => {
    if (coverLetterFile) {
      const objectUrl = URL.createObjectURL(coverLetterFile);
      setCoverLetterUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [coverLetterFile]);

  // Handle Enable and Disable Edit Mode
  const enableEditMode = () => {
    getAllCareerScopesStore.getAllCareerScopes();
    setIsEdit(true);
  };

  const disableEditMode = () => {
    setIsEdit(false);
    form.reset();
  };

  // Education Bussiness Logics
  // 1. Add New Education
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      year: new Date().toISOString(),
    };

    setEducations((prevEducation) => [...prevEducation, newEducation]);
  };

  // 2. Remove Education with ID
  const removeEducation = async (educationID: string) => {
    await removeEmpEducationStore.removeEducation(employee!.id, educationID);

    // Refetch current user to get updated data
    await getCurrentUser();

    toast({
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Experience Successfully!
          </TypographySmall>
        </div>
      ),
    });

    setIsEdit(false);
  };

  // Experience Bussiness Logics
  // 1. Add New Experience
  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    };

    setExperiences((prevExperience) => [...prevExperience, newExperience]);
  };

  // 2. Remove Experience with ID
  const removeExperience = async (experienceID: string) => {
    await removeEmpExperieceStore.removeExperience(employee!.id, experienceID);

    // Refetch current user to get updated data
    await getCurrentUser();

    toast({
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Education Successfully!
          </TypographySmall>
        </div>
      ),
    });

    setIsEdit(false);
  };

  // Social Bussiness Logic
  // 1. Add New Social
  const addSocial = () => {
    const trimmedPlatform = socialInput?.platform.trim();
    const trimmedUrl = socialInput?.url.trim();
    if (!trimmedPlatform || !trimmedUrl) return;

    const currentSocails = form.getValues("socials") || [];

    // Check duplicate social entries
    const alreadyExists = currentSocails.some(
      (s) => s?.platform?.toLowerCase() === trimmedPlatform.toLowerCase(),
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicate Social",
        description: "This social platform already exists.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setSocialInput(null);
      return;
    }

    const updatedSocials = [
      ...socials,
      { id: "", platform: capitalizeWords(trimmedPlatform), url: trimmedUrl },
    ];
    form.setValue("socials", updatedSocials, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSocials(updatedSocials);
    setSocialInput(null);
  };

  // 2. Remove Old Social
  const removeSocial = (platform: TPlatform) => {
    const currentSocial = (form.getValues("socials") || []).filter(
      Boolean,
    ) as ISocial[];

    const socialToDelete = currentSocial.find((s) => s?.platform === platform);
    if (!socialToDelete) return;

    if (
      typeof socialToDelete === "object" &&
      "id" in socialToDelete &&
      socialToDelete.id
    ) {
      setDeleteSocialIds((prev) => [...prev, socialToDelete.id as string]);
    }

    const updatedSocials = socials.filter((s) => s.platform !== platform);
    form.setValue("socials", updatedSocials, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSocials(updatedSocials);
  };

  // Skill Bussiness Logics
  // 1. Add New Skill
  const addSkills = () => {
    const trimmed = skillInput?.trim();
    if (!trimmed) return;

    const currentSkills = (form.getValues("skills") || []).filter(
      Boolean,
    ) as ISkill[];

    const alreadyExists = currentSkills.some(
      (skill) => skill.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Skill",
        description: "Please input another skill.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setSkillInput(null);
      setOpenSkillPopOver(false);
      return;
    }

    const updatedSkills: ISkill[] = [...skills, { name: trimmed }];

    form.setValue("skills", updatedSkills, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSkills(updatedSkills);
    setSkillInput(null);
    setOpenSkillPopOver(false);
  };

  // 2. Remove Old Skill
  const removeSkill = async (skillToRemove: string) => {
    const currentSkills = (form.getValues("skills") || []).filter(
      Boolean,
    ) as ISkill[];

    const skillToDelete = currentSkills.find(
      (skill) => skill.name === skillToRemove,
    );
    if (!skillToDelete) return;

    if (
      typeof skillToDelete === "object" &&
      "id" in skillToDelete &&
      skillToDelete.id
    ) {
      setDeleteSkillIds((prev) => [...prev, skillToDelete.id as string]);
    }

    const updatedSkills = currentSkills.filter(
      (skill) => skill.name !== skillToRemove,
    );
    form.setValue("socials", updatedSkills, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSkills(updatedSkills);
  };

  // CareerScope Bussiness Logic
  // 1. Add New CareerScope
  const addCareerScope = () => {
    const trimmed = careerScopeInput?.name.trim();
    const id = careerScopeInput?.id;
    const description = careerScopeInput?.description;
    if (!trimmed) return;

    const currentCareerScopes = (form.getValues("careerScopes") || []).filter(
      Boolean,
    ) as ICareerScopes[];

    const alreadyExists = currentCareerScopes.some(
      (career) => career.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Skill",
        description: "Please input another skill.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });

      setCareerScopeInput(null);
      setOpenCareerScopePopOver(false);
      return;
    }

    const updatedCareerScopes = [
      ...careerScopes.map((career) => ({
        id: career.id ?? "",
        name: career.name,
        description: career.description ?? "",
      })),
      { id: id ?? "", name: trimmed, description: description ?? "" },
    ];

    form.setValue("careerScopes", updatedCareerScopes, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setCareerScopes(updatedCareerScopes);
    setCareerScopeInput(null);
    setOpenCareerScopePopOver(false);
  };

  // 2. CareerScope Selection from the Dropdown or Input
  const handleCareerScopeSelect = (
    selectedCareerId: string,
    selectedCareerName: string,
    selectedCareerDescription: string,
  ) => {
    setCareerScopeInput({
      id: selectedCareerId,
      name: selectedCareerName,
      description: selectedCareerDescription,
    });
  };

  // 3. Remove Old CareerScope with Career's name
  const removeCareerScope = (careerToRemove: string) => {
    const currentCareerScopes = (form.getValues("careerScopes") || []).filter(
      Boolean,
    ) as ICareerScopes[];

    const careerToDelete = currentCareerScopes.find(
      (career) => career.name === careerToRemove,
    );
    if (!careerToDelete) return;

    if (
      typeof careerToDelete === "object" &&
      "id" in careerToDelete &&
      careerToDelete.id
    ) {
      setDeleteCareerScopeIds((prev) => [...prev, careerToDelete.id as string]);
    }

    const updatedCareerScopes = currentCareerScopes.filter(
      (career) => career.name !== careerToRemove,
    );
    form.setValue("careerScopes", updatedCareerScopes, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setCareerScopes(updatedCareerScopes);
  };

  // Handle Avatar and References File Change
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "resume" | "coverLetter",
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

  // Handle Download Resume and CoverLetter File
  const handleDownloadResumeAndCoverLetterFile = (file: File) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // onSubmit: Update The Entire Employee Profile (API's calling)
  const onSubmit = async (data: TEmployeeProfileForm) => {
    console.log("Employee Profile Data: ", data);
    const updateBody: Partial<TEmployeeUpdateBody> = {};

    try {
      const dirtyFields = form.formState.dirtyFields;

      /* ------------------------ BASIC INFO ------------------------ */
      const basicInfoKeys: (keyof NonNullable<typeof data.basicInfo>)[] = [
        "firstname",
        "lastname",
        "username",
        "gender",
        "location",
      ];

      basicInfoKeys.forEach((key) => {
        if (dirtyFields?.basicInfo?.[key]) {
          // backend fields are top-level on UpdateEmployeeInfoDTO
          (updateBody as any)[key] = data.basicInfo?.[key];
        }
      });

      /* ------------------------ ACCOUNT SETTINGS ------------------------ */
      const accountKeys: (keyof NonNullable<typeof data.accountSetting>)[] = [
        "email",
        "phone",
      ];

      accountKeys.forEach((key) => {
        if (dirtyFields?.accountSetting?.[key]) {
          // backend accepts email? + phone? at top-level
          (updateBody as any)[key] = data.accountSetting?.[key];
        }
      });

      /* ------------------------ PROFESSION ------------------------ */
      const professionKeys: (keyof NonNullable<typeof data.profession>)[] = [
        "job",
        "yearOfExperience",
        "availability",
        "description",
      ];

      professionKeys.forEach((key) => {
        if (dirtyFields?.profession?.[key]) {
          if (key === "yearOfExperience") {
            // backend expects yearsOfExperience as number
            const raw = data.profession?.yearOfExperience;
            const num =
              raw !== undefined && raw !== null && raw !== ""
                ? Number(raw)
                : undefined;
            if (num !== undefined && !Number.isNaN(num)) {
              (updateBody as any).yearsOfExperience = num;
            }
          } else {
            // job/availability/description
            (updateBody as any)[key] = (data.profession as any)?.[key];
          }
        }
      });

      /* ------------------------ SKILLS (M2M) ------------------------ */
      if (dirtyFields.skills || deleteSkillIds.length > 0) {
        updateBody.skills = (data.skills ?? [])
          .filter(
            (s): s is ISkill =>
              !!s && typeof s.name === "string" && s.name.trim().length > 0,
          )
          .map((s) => ({
            id: s.id ?? "", // if your ISkill requires id, keep this; otherwise remove
            name: s.name.trim(),
            description: s.description ?? "", // ✅ never undefined
          }));

        if (deleteSkillIds.length > 0) {
          updateBody.skillIdsToDelete = deleteSkillIds;
        }
      }

      /* ------------------------ CAREER SCOPES (M2M) ------------------------ */
      if (dirtyFields.careerScopes || deleteCareerScopeIds.length > 0) {
        updateBody.careerScopes = (data.careerScopes ?? [])
          .filter(
            (cs): cs is ICareerScopes =>
              !!cs && typeof cs.name === "string" && cs.name.trim().length > 0,
          )
          .map((cs) => ({
            id: cs.id ?? "",
            name: cs.name.trim(),
            description: cs.description ?? "",
          }));

        if (deleteCareerScopeIds.length > 0) {
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
        }
      }

      /* ------------------------ SOCIALS (O2M) ------------------------ */
      if (dirtyFields.socials || deleteSocialIds.length > 0) {
        updateBody.socials = (data.socials ?? [])
          .filter(
            (s): s is ISocial =>
              !!s &&
              typeof s.platform === "string" &&
              s.platform.trim().length > 0 &&
              typeof s.url === "string" &&
              s.url.trim().length > 0,
          )
          .map((s) => ({
            id: s.id ?? "",
            platform: s.platform.trim(),
            url: s.url.trim(),
          }));

        if (deleteSocialIds.length > 0) {
          updateBody.socialIdsToDelete = deleteSocialIds;
        }
      }

      /* ------------------------ EDUCATIONS (O2M) ------------------------ */
      if (dirtyFields.educations) {
        updateBody.educations = (data.educations ?? [])
          .filter(
            (
              edu,
            ): edu is {
              id?: string;
              school: string;
              degree: string;
              year: Date;
            } =>
              !!edu &&
              typeof edu.school === "string" &&
              edu.school.trim().length > 0 &&
              typeof edu.degree === "string" &&
              edu.degree.trim().length > 0 &&
              edu.year instanceof Date,
          )
          .map((edu) => ({
            ...(edu.id ? { id: edu.id } : {}),
            school: edu.school,
            degree: edu.degree,
            year: edu.year.toISOString(), // backend wants string
          }));
      }

      /* ------------------------ EXPERIENCES (O2M) ------------------------ */
      updateBody.experiences = (data.experiences ?? [])
        .filter(
          (
            exp,
          ): exp is {
            id?: string;
            title: string;
            description: string;
            startDate: Date;
            endDate?: Date;
          } =>
            !!exp &&
            typeof exp.title === "string" &&
            exp.title.trim().length > 0 &&
            typeof exp.description === "string" &&
            exp.description.trim().length > 0 &&
            exp.startDate instanceof Date &&
            (exp.endDate == null || exp.endDate instanceof Date),
        )
        .map((exp) => ({
          ...(exp.id ? { id: exp.id } : {}),
          title: exp.title,
          description: exp.description,
          startDate: exp.startDate.toISOString(),
          endDate: exp.endDate ? exp.endDate.toISOString() : "",
        }));

      /* ------------------------ FILE UPLOADS ------------------------ */
      const uploadTasks: Promise<any>[] = [];

      // Avatar upload
      if (data.basicInfo?.avatar instanceof File) {
        uploadTasks.push(
          uploadAvatarEmpStore.uploadAvatar(
            employee!.id,
            data.basicInfo.avatar,
          ),
        );
      }

      // Resume upload
      if (data.references?.resume instanceof File) {
        uploadTasks.push(
          uploadResumeEmpStore.uploadResume(
            employee!.id,
            data.references.resume,
          ),
        );
      }

      // Cover letter upload
      if (data.references?.coverLetter instanceof File) {
        uploadTasks.push(
          uploadCoverLetterEmpStore.uploadCoverLetter(
            employee!.id,
            data.references.coverLetter,
          ),
        );
      }

      await Promise.all(uploadTasks);

      /* ------------------------ API UPDATE ------------------------ */
      if (Object.keys(updateBody).length > 0) {
        await updateOneEmpStore.updateOneEmployee(employee!.id, updateBody);
      }

      // Refresh page for refetch current user and reset form
      window.location.reload();

      form.reset(data);

      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideCheck />
            <TypographySmall className="font-medium leading-relaxed">
              Updated Employee Profile Successfully!
            </TypographySmall>
          </div>
        ),
      });

      setIsEdit(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to update employee profile.",
      });
    }
  };

  // handleSubmit: Submit Employee Profile Form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sync all state arrays into the form (important!)
    form.setValue("skills", skills, { shouldDirty: true, shouldTouch: true });
    form.setValue("careerScopes", careerScopes, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("socials", socials, { shouldDirty: true, shouldTouch: true });
    form.setValue("educations", educations as any, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("experiences", experiences as any, {
      shouldDirty: true,
      shouldTouch: true,
    });

    // Sync file inputs managed outside the form
    if (avatarFile) {
      form.setValue("basicInfo.avatar", avatarFile, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (resumeFile) {
      form.setValue("references.resume", resumeFile, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (coverLetterFile) {
      form.setValue("references.coverLetter", coverLetterFile, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    // Submit
    form.handleSubmit(onSubmit, console.error)(e);
  };

  // API for Remove Employee Avatar
  const handleRemoveEmpAvatar = async () => {
    if (employee) await removeEmpAvatarStore.removeEmpAvatar(employee.id);

    await getCurrentUser();
    setIsEdit(false);
    setOpenRemoveAvatarDialog(false);
  };

  // Employee Profile Popup Handler
  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
  };

  if (loading) return <EmployeeProfilePageSkeleton />;
  if (!user || !employee) return null;

  return user ? (
    <form className="!min-w-full flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between border border-muted rounded-md p-5 tablet-sm:flex-col tablet-sm:[&>div]:w-full tablet-sm:gap-5">
        <div className="flex items-center justify-start gap-5 tablet-sm:flex-col">
          <div
            className="relative"
            onClick={(e) => {
              if (!isEdit) {
                if (employee.avatar) handleClickProfilePopup(e);
              }
            }}
          >
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
              <div className="flex items-center gap-1 absolute bottom-1 right-1">
                <Button
                  className="size-8 flex justify-center items-center cursor-pointer p-1 rounded-full bg-foreground text-primary-foreground"
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <LucideCamera width={"18px"} strokeWidth={"1.2px"} />
                </Button>
                <Button
                  className="size-8 flex justify-center items-center cursor-pointer p-1 rounded-full bg-red-500 text-primary-foreground"
                  type="button"
                  onClick={() => setOpenRemoveAvatarDialog(true)}
                >
                  <LucideXCircle width={"18px"} strokeWidth={"1.2px"} />
                </Button>
              </div>
            )}

            {/* Renove Avatar Dialog Section */}
            <RemoveAvatarOrCoverDialog
              type="avatar"
              setOnRemoveAvatarOrCoverDialog={setOpenRemoveAvatarDialog}
              onRemoveAvatarOrCoverDialog={openRemoveAvatarDialog}
              onNoClick={() => setOpenRemoveAvatarDialog(false)}
              onYesClick={handleRemoveEmpAvatar}
            />
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
          <div className="flex items-center gap-3">
            <Button type="submit" className="text-xs">
              Save
              <LucideCircleCheck />
            </Button>
            <Button
              type="button"
              className="text-xs"
              onClick={() => setIsEdit(false)}
            >
              Cancel
              <LucideXCircle />
            </Button>
          </div>
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
                  autoResize
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
                {educations.map((edu, index) => (
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
                {experiences.map((exp, index) => (
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
                          autoResize
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
                      <Button onClick={addSkills} type="button">
                        Save
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}

          {/* CareersScopes Section */}
          {((careerScopes && careerScopes.length > 0) || isEdit) && (
            <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
              <div className="w-full flex flex-col gap-1">
                <TypographyH4>Careers Scopes</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-col items-stretch gap-3">
                <div className="flex flex-wrap gap-3">
                  {careerScopes &&
                    careerScopes.length > 0 &&
                    careerScopes.map((career, index) => {
                      return (
                        <div key={index}>
                          <HoverCard>
                            <HoverCardTrigger className="flex items-center rounded-3xl">
                              <Tag label={career.name} />
                              {isEdit && (
                                <LucideXCircle
                                  className="text-muted-foreground cursor-pointer ml-1 text-red-500"
                                  width={"18px"}
                                  onClick={() => removeCareerScope(career.name)}
                                />
                              )}
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
                      );
                    })}
                </div>
              </div>
              {isEdit && (
                <Popover
                  open={openCareerScopePopOver}
                  onOpenChange={setOpenCareerScopePopOver}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {careerScopeInput
                        ? getAllCareerScopesStore.careerScopes?.find(
                            (career) => career.name === careerScopeInput.name,
                          )?.name
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
                          {getAllCareerScopesStore.careerScopes?.map(
                            (career, index) => (
                              <CommandItem
                                key={index}
                                value={career.name}
                                onSelect={() => {
                                  if (career.id)
                                    handleCareerScopeSelect(
                                      career.id,
                                      career.name,
                                      career.description ?? "",
                                    );
                                }}
                              >
                                {career.name}
                                <LucideCircleCheck
                                  className={
                                    careerScopeInput?.name === career.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }
                                />
                              </CommandItem>
                            ),
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              {isEdit && (
                // Add New Career Section
                <Button
                  variant="secondary"
                  className="w-full text-xs"
                  type="button"
                  onClick={addCareerScope}
                >
                  <LucidePlus />
                  Add Career
                </Button>
              )}
            </div>
          )}

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
                        onClick={() =>
                          handleDownloadResumeAndCoverLetterFile(resumeFile!)
                        }
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
                        onClick={() =>
                          handleDownloadResumeAndCoverLetterFile(
                            coverLetterFile!,
                          )
                        }
                      >
                        <LucideDownload />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Information Form Section */}
          {employee.socials && employee.socials.length > 0 && (
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <div className="flex flex-col gap-1">
                <TypographyH4>Social Information</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-col items-start gap-5">
                <div className="w-full flex flex-col items-stretch gap-3">
                  <div className="flex flex-wrap gap-3">
                    {socials &&
                      socials.length > 0 &&
                      socials.map((item: ISocial, index) => (
                        <div className="flex items-center gap-1" key={index}>
                          <Link
                            href={item.url}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:underline"
                          >
                            {getSocialPlatformTypeIcon(
                              item.platform as TPlatform,
                            )}
                            <TypographySmall>{item.platform}</TypographySmall>
                          </Link>
                          {isEdit && (
                            <LucideXCircle
                              className="text-muted-foreground cursor-pointer text-red-500"
                              width={"18px"}
                              onClick={() =>
                                removeSocial(item.platform as TPlatform)
                              }
                            />
                          )}
                        </div>
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
                            setSocialInput((prev) => ({
                              ...(prev ?? { platform: "", url: "" }),
                              platform: value,
                            }))
                          }
                          value={socialInput?.platform}
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
                            value={socialInput?.url}
                            onChange={(e) =>
                              setSocialInput((prev) => ({
                                ...(prev ?? { platform: "", url: "" }),
                                url: e.target.value,
                              }))
                            }
                            prefix={<LucideLink2 />}
                          />
                        }
                      />
                    </div>
                  </div>
                  {/* Add New Social Button Section */}
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

          {/* Authentication Section */}
          <div className="flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Authentication</TypographyH4>
              <Divider />
            </div>
            <div className="w-full flex flex-col items-start gap-3">
              {loginMethodConstant.map((item) => (
                <div
                  className="w-full flex items-center justify-between bg-primary-foreground rounded-xl py-3 px-2 cursor-pointer"
                  key={item.id}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <TypographySmall>{item.label}</TypographySmall>
                  </div>
                  {user.lastLoginMethod &&
                  user.lastLoginMethod.toUpperCase() ===
                    item.label.toUpperCase() ? (
                    <div className="bg-red-100 text-red-500 px-3 py-1 rounded-2xl cursor-pointer">
                      <TypographySmall className="text-xs font-medium">
                        Disconnect
                      </TypographySmall>
                    </div>
                  ) : (
                    <div className="bg-blue-100 text-blue-500 px-3 py-1 rounded-2xl cursor-pointer">
                      <TypographySmall className="text-xs font-medium">
                        Connect
                      </TypographySmall>
                    </div>
                  )}
                </div>
              ))}
              <div className="w-full flex items-center justify-between bg-primary-foreground rounded-xl py-3 px-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <LucideMail className="mx-1" strokeWidth={1.5} />
                  <TypographySmall>Email</TypographySmall>
                </div>
                {user.email ? (
                  <div className="bg-red-100 text-red-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      Disconnect
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      Connect
                    </TypographySmall>
                  </div>
                )}
              </div>
              <div className="w-full flex items-center justify-between bg-primary-foreground rounded-xl py-3 px-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <LucidePhone className="mx-1" strokeWidth={1.5} />
                  <TypographySmall>Phone OTP</TypographySmall>
                </div>
                {user.phone ? (
                  <div className="bg-red-100 text-red-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      Disconnect
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      Connect
                    </TypographySmall>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Popup Section */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={avatarFile ? URL.createObjectURL(avatarFile) : employee.avatar!}
      />
    </form>
  ) : null;
}
