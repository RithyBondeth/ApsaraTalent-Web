"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Divider from "@/components/utils/divider";
import LabelInput from "@/components/utils/label-input";
import IconLabel from "@/components/utils/icon-label";
import Tag from "@/components/utils/tag";
import ImagePopup from "@/components/utils/image-popup";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  LucideLink2,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideTrash2,
  LucideUser,
  LucideXCircle,
} from "lucide-react";
import {
  genderConstant,
  locationConstant,
  loginMethodConstant,
  platformConstant,
} from "@/utils/constants/app.constant";
import { TGender } from "@/utils/types/gender.type";
import { TLocations } from "@/utils/types/location.type";
import { TPlatform } from "@/utils/types/platform.type";
import { capitalizeWords } from "@/utils/functions/capitalize-words";
import { extractCleanFilename } from "@/utils/functions/extract-clean-filename";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { isUuid } from "@/utils/functions/check-uuid";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import EmployeeProfilePageSkeleton from "./skeleton";
import EmployeeExperienceForm from "@/components/employee/profile/experience-form";
import { employeeFormSchema, TEmployeeProfileForm } from "./validation";
import {
  ISkill,
  ICareerScopes,
  ISocial,
} from "@/utils/interfaces/user-interface/employee.interface";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useGetAllCareerScopesStore } from "@/stores/apis/users/get-all-career-scopes.store";
import {
  TEmployeeUpdateBody,
  useUpdateOneEmployeeStore,
} from "@/stores/apis/employee/update-one-emp.store";
import { useUploadEmployeeAvatarStore } from "@/stores/apis/employee/upload-emp-avatar.store";
import { useUploadEmployeeResumeStore } from "@/stores/apis/employee/upload-emp-resume.store";
import { useUploadEmployeeCoverLetter } from "@/stores/apis/employee/upload-emp-coverletter.store";
import { useRemoveEmpAvatarStore } from "@/stores/apis/employee/remove-emp-avatar.store";
import { useRemoveEmpExperienceStore } from "@/stores/apis/employee/remove-emp-experience.store";
import emptySvgImage from "@/assets/svg/empty.svg";
import { useRemoveEmpResumeStore } from "@/stores/apis/employee/remove-emp-resume.store";
import { useRemoveEmpCoverLetterStore } from "@/stores/apis/employee/remove-emp-coverletter.store";
import { useRemoveEmpEducationStore } from "@/stores/apis/employee/remove-emp-education.store";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";
import RemoveAlertDialog from "@/components/utils/dialogs/remove-alert-dialog";
import { parseMaybeDate } from "@/utils/functions/parse-maybe-date";
import ReferencePreviewDialog from "@/components/utils/dialogs/reference-preview-dialog";

export default function EmployeeProfilePage() {
  /* ------------------- APIs Integration ------------------- */
  // Current User Information and Current User CareerScopes
  const { user, loading, getCurrentUser } = useGetCurrentUserStore();
  const employee = user?.employee;
  const getAllCareerScopesStore = useGetAllCareerScopesStore();

  // Update Employee Information
  const updateOneEmpStore = useUpdateOneEmployeeStore();

  // Update Avatar, Resume and CoverLetter
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
  const updateProfileLoadingState =
    updateOneEmpStore.loading ||
    uploadAvatarEmpStore.loading ||
    uploadResumeEmpStore.loading ||
    uploadCoverLetterEmpStore.loading ||
    removeEmpAvatarStore.loading ||
    removeEmpResumeStore.loading ||
    removeEmpCoverLetterStore.loading ||
    removeEmpEducationStore.loading ||
    removeEmpExperieceStore.loading;

  /* ------------------------ All States ------------------------ */
  // Utils
  const { toast, dismiss } = useToast();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openReferencePreview, setOpenReferencePreview] =
    useState<boolean>(false);
  const [previewReferenceType, setPreviewReferenceType] = useState<
    "resume" | "coverletter"
  >("resume");
  const [previewReferenceUrl, setPreviewReferenceUrl] = useState<string>("");

  // Select Gender and Location
  const [selectedGender, setSelectedGender] = useState<TGender | string>("");
  const [selectedLocation, setSelectedLocation] = useState<TLocations | string>(
    "",
  );

  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [openAvatarPopup, setOpenAvatarPopup] = useState<boolean>(false);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] = useState(false);
  const ignoreNextClick = useRef<boolean>(false);

  // Resume
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveResumeDialog, setOpenRemoveResumeDialog] =
    useState<boolean>(false);

  // CoverLetter
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveCoverLetterDialog, setOpenRemoveCoverLetterDialog] =
    useState<boolean>(false);

  // Social
  const [socialInput, setSocialInput] = useState<ISocial | null>(null);
  const [socials, setSocials] = useState<ISocial[]>([]);
  const [deleteSocialIds, setDeleteSocialIds] = useState<string[]>([]);

  // Skill
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [deleteSkillIds, setDeleteSkillIds] = useState<string[]>([]);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

  // CareerScope
  const [careerScopeInput, setCareerScopeInput] =
    useState<ICareerScopes | null>(null);
  const [careerScopes, setCareerScopes] = useState<ICareerScopes[]>([]);
  const [deleteCareerScopeIds, setDeleteCareerScopeIds] = useState<string[]>(
    [],
  );
  const [openCareerScopePopOver, setOpenCareerScopePopOver] =
    useState<boolean>(false);

  // Experience Remove Dialog States
  const [openRemoveExperienceDialog, setOpenRemoveExperienceDialog] =
    useState<boolean>(false);
  const [currentExperienceID, setCurrentExperienceID] = useState<string | null>(
    null,
  );

  // Education Remove Dialog States
  const [openRemoveEducationDialog, setOpenRemoveEducationDialog] =
    useState<boolean>(false);
  const [currentEducationID, setCurrentEducationID] = useState<string | null>(
    null,
  );

  /* ------------------------ Employee Profile Form ------------------------ */
  // React Hook Form: Employee Profile Schema
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
      references: { resume: null, coverLetter: null },
      careerScopes: [],
      socials: [],
    },
    shouldFocusError: false,
  });

  // Get Current User Effect
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // FieldArray for Experiences
  const experienceFA = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  // FieldArray for Education
  const educationFA = useFieldArray({
    control: form.control,
    name: "educations",
  });

  // Hydrate Current User Data from API
  useEffect(() => {
    if (!user || !employee) return;

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
        phone: employee.phone ?? "",
      },
      profession: {
        job: employee.job ?? "",
        yearOfExperience: employee.yearsOfExperience?.toString() ?? "",
        availability: employee.availability ?? "",
        description: employee.description ?? "",
      },
      experiences:
        employee.experiences?.map((exp) => ({
          id: exp.id,
          title: exp.title ?? "",
          description: exp.description ?? "",
          startDate: parseMaybeDate(exp.startDate),
          endDate: parseMaybeDate(exp.endDate),
        })) ?? [],
      skills:
        employee.skills?.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
        })) ?? [],
      references: {
        resume: employee.resume ?? null,
        coverLetter: employee.coverLetter ?? null,
      },
      careerScopes:
        employee.careerScopes?.map((cs) => ({
          id: cs.id,
          name: cs.name,
          description: cs.description,
        })) ?? [],
      socials:
        employee.socials?.map((s) => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
        })) ?? [],
      educations: employee.educations?.map((edu) => ({
        id: edu.id,
        school: edu.school ?? "",
        degree: edu.degree ?? "",
        year: parseMaybeDate(edu.year),
      })),
    });

    setSelectedGender(employee.gender ?? "");
    setSelectedLocation(employee.location ?? "");

    setSocials(employee.socials ?? []);
    setSkills(employee.skills ?? []);
    setCareerScopes(employee.careerScopes ?? []);
  }, [user, employee, form]);

  /* ------------------------ Edit Mode ------------------------ */
  // Enable Edit Mode
  const enableEditMode = () => {
    getAllCareerScopesStore.getAllCareerScopes();
    setIsEdit(true);
  };

  // Disable Edit Mode
  const disableEditMode = () => {
    setOpenRemoveAvatarDialog(false);
    setOpenRemoveExperienceDialog(false);
    setOpenRemoveEducationDialog(false);
    setOpenRemoveResumeDialog(false);
    setOpenRemoveCoverLetterDialog(false);
    setIsEdit(false);
    form.reset();
  };

  /* ------------------- Reference and Avatar Bussiness Logics ------------------- */
  // 1.API: Remove Resume
  const removeResume = async () => {
    if (employee) await removeEmpResumeStore.removeEmpResume(employee.id);

    await getCurrentUser();
    disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Resume Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  // 2.API: Remove CoverLetter
  const removeCoverLetter = async () => {
    if (employee)
      await removeEmpCoverLetterStore.removeEmpCoverLetter(employee.id);

    await getCurrentUser();
    disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove CoverLetter Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  // 3.API: Remove Avatar
  const removeAvatar = async () => {
    if (employee) await removeEmpAvatarStore.removeEmpAvatar(employee.id);

    await getCurrentUser();
    disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Avatar Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  // 4.Handle Click Avatar Popup
  const handleClickAvatarPopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenAvatarPopup(true);
  };

  /* ------------------- Experience Bussiness Logics ------------------- */
  // 1.Add New Experience
  const addExperience = () => {
    experienceFA.append({
      id: "",
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    });
  };

  // 2.API: Remove Experience
  const removeExperience = async (experienceID: string) => {
    if (employee)
      await removeEmpExperieceStore.removeExperience(employee.id, experienceID);

    await getCurrentUser();
    disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Experience Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  /* ------------------- Education Bussiness Logics ------------------- */
  // 1.Add New Education
  const addNewEducation = () => {
    educationFA.append({
      id: "",
      school: "",
      degree: "",
      year: undefined,
    });
  };

  // 2.API: Remove Education
  const removeEducation = async (experienceID: string) => {
    if (employee)
      await removeEmpEducationStore.removeEducation(employee.id, experienceID);

    await getCurrentUser();
    disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Education Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  /* ------------------- Skill Bussiness Logics ------------------- */
  // 1.Add New Skill
  const addSkills = () => {
    const trimmed = skillInput?.trim();
    if (!trimmed) return;

    const currentSkills = (form.getValues("skills") || []).filter(
      Boolean,
    ) as ISkill[];

    const alreadyExists = currentSkills.some(
      (s) => (s.name ?? "").toLowerCase() === trimmed.toLowerCase(),
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

    const updated = [...skills, { id: "", name: trimmed, description: "" }];
    setSkills(updated);

    form.setValue("skills", updated, { shouldDirty: true, shouldTouch: true });

    setSkillInput(null);
    setOpenSkillPopOver(false);
  };

  // 2.Remove Skill
  const removeSkill = (skillToRemove: string) => {
    const currentSkills = (form.getValues("skills") || []).filter(
      Boolean,
    ) as ISkill[];

    const skillToDelete = currentSkills.find((s) => s.name === skillToRemove);
    if (skillToDelete?.id)
      setDeleteSkillIds((prev) => [...prev, skillToDelete.id!]);

    const updated = currentSkills.filter((s) => s.name !== skillToRemove);
    setSkills(updated);
    form.setValue("skills", updated, { shouldDirty: true, shouldTouch: true });
  };

  /* ------------------- Social Bussiness Logics ------------------- */
  // 1.Add New Social
  const addSocial = () => {
    const trimmedPlatform = socialInput?.platform?.trim();
    const trimmedUrl = socialInput?.url?.trim();
    if (!trimmedPlatform || !trimmedUrl) return;

    const currentSocials = (form.getValues("socials") || []).filter(
      Boolean,
    ) as ISocial[];

    const alreadyExists = currentSocials.some(
      (s) => (s.platform ?? "").toLowerCase() === trimmedPlatform.toLowerCase(),
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

    const updated = [
      ...socials,
      { id: "", platform: capitalizeWords(trimmedPlatform), url: trimmedUrl },
    ];

    setSocials(updated);
    form.setValue("socials", updated, { shouldDirty: true, shouldTouch: true });
    setSocialInput(null);
  };

  // 2.Remove Social
  const removeSocial = (platform: TPlatform) => {
    const currentSocials = (form.getValues("socials") || []).filter(
      Boolean,
    ) as ISocial[];

    const toDelete = currentSocials.find((s) => s.platform === platform);
    if (toDelete?.id) setDeleteSocialIds((prev) => [...prev, toDelete.id!]);

    const updated = currentSocials.filter((s) => s.platform !== platform);
    setSocials(updated);
    form.setValue("socials", updated, { shouldDirty: true, shouldTouch: true });
  };

  /* ------------------- CareerScope Bussiness Logics ------------------- */
  // 1.Handle CareerScope Select
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

  // 2.Add New CareerScope
  const addCareerScope = () => {
    const name = careerScopeInput?.name?.trim();
    if (!name) return;

    const current = (form.getValues("careerScopes") || []).filter(
      Boolean,
    ) as ICareerScopes[];

    const alreadyExists = current.some(
      (c) => (c.name ?? "").toLowerCase() === name.toLowerCase(),
    );
    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Career",
        description: "Please select another career.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setCareerScopeInput(null);
      setOpenCareerScopePopOver(false);
      return;
    }

    const updated = [
      ...careerScopes.map((c) => ({
        id: c.id ?? "",
        name: c.name,
        description: c.description ?? "",
      })),
      {
        id: careerScopeInput?.id ?? "",
        name,
        description: careerScopeInput?.description ?? "",
      },
    ];

    setCareerScopes(updated);
    form.setValue("careerScopes", updated, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setCareerScopeInput(null);
    setOpenCareerScopePopOver(false);
  };

  // 3.Remove CareerScope
  const removeCareerScope = (careerToRemove: string) => {
    const current = (form.getValues("careerScopes") || []).filter(
      Boolean,
    ) as ICareerScopes[];

    const toDelete = current.find((c) => c.name === careerToRemove);
    if (toDelete?.id)
      setDeleteCareerScopeIds((prev) => [...prev, toDelete.id!]);

    const updated = current.filter((c) => c.name !== careerToRemove);
    setCareerScopes(updated);
    form.setValue("careerScopes", updated, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  /* ------------------- File Bussiness Logics ------------------- */
  // Handle File Change: Avatar, Resume and CoverLetter
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "resume" | "coverLetter",
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

    if (type === "avatar") {
      setAvatarFile(file);
      form.setValue("basicInfo.avatar", file, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    if (type === "resume") {
      setResumeFile(file);
      form.setValue("references.resume", file, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    if (type === "coverLetter") {
      setCoverLetterFile(file);
      form.setValue("references.coverLetter", file, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  // Handle File Download: Resume and CoverLetter
  const downloadFileFromUrl = async (url: string, filename?: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch file");

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename ?? extractCleanFilename(url) ?? "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to download the file. Please try again.",
      });
    }
  };

  /* ------------------- onSubmit Bussiness Logics ------------------- */
  // 1.onSubmit
  const onSubmit = async (data: TEmployeeProfileForm) => {
    if (!employee) return;

    const updateBody: Partial<TEmployeeUpdateBody> = {};
    const dirtyFields = form.formState.dirtyFields;

    try {
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
            const raw = data.profession?.yearOfExperience;
            const num =
              raw !== undefined && raw !== null && raw !== ""
                ? Number(raw)
                : undefined;
            if (num !== undefined && !Number.isNaN(num)) {
              (updateBody as any).yearsOfExperience = num;
            }
          } else {
            (updateBody as any)[key] = (data.profession as any)?.[key];
          }
        }
      });

      /* ------------------------ SKILLS ------------------------ */
      if (dirtyFields.skills || deleteSkillIds.length > 0) {
        updateBody.skills = (data.skills ?? [])
          .filter((s): s is ISkill => !!s && !!s.name?.trim())
          .map((s) => ({
            id: s.id ?? "",
            name: s.name.trim(),
            description: s.description ?? "",
          }));

        if (deleteSkillIds.length > 0)
          updateBody.skillIdsToDelete = deleteSkillIds;
      }

      /* ------------------------ CAREER SCOPES ------------------------ */
      if (dirtyFields.careerScopes || deleteCareerScopeIds.length > 0) {
        updateBody.careerScopes = (data.careerScopes ?? [])
          .filter((cs): cs is ICareerScopes => !!cs && !!cs.name?.trim())
          .map((cs) => ({
            id: cs.id ?? "",
            name: cs.name.trim(),
            description: cs.description ?? "",
          }));

        if (deleteCareerScopeIds.length > 0)
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
      }

      /* ------------------------ SOCIALS ------------------------ */
      if (dirtyFields.socials || deleteSocialIds.length > 0) {
        updateBody.socials = (data.socials ?? [])
          .filter(
            (s): s is ISocial => !!s && !!s.platform?.trim() && !!s.url?.trim(),
          )
          .map((s) => ({
            id: s.id ?? "",
            platform: s.platform.trim(),
            url: s.url.trim(),
          }));

        if (deleteSocialIds.length > 0)
          updateBody.socialIdsToDelete = deleteSocialIds;
      }

      /* ------------------------ EXPERIENCES ------------------------ */
      if (dirtyFields.experiences) {
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
              !!exp.title?.trim() &&
              !!exp.description?.trim() &&
              exp.startDate instanceof Date &&
              (exp.endDate == null || exp.endDate instanceof Date),
          )
          .map((exp) => ({
            ...(exp.id ? { id: exp.id } : {}),
            title: exp.title.trim(),
            description: exp.description.trim(),
            startDate: exp.startDate.toISOString(),
            endDate: exp.endDate ? exp.endDate.toISOString() : "",
          }));
      }

      /* ------------------------ FILE UPLOADS ------------------------ */
      const uploadTasks: Promise<any>[] = [];

      if (data.basicInfo?.avatar instanceof File) {
        uploadTasks.push(
          uploadAvatarEmpStore.uploadAvatar(employee.id, data.basicInfo.avatar),
        );
      }

      if (data.references?.resume instanceof File) {
        uploadTasks.push(
          uploadResumeEmpStore.uploadResume(
            employee.id,
            data.references.resume,
          ),
        );
      }

      if (data.references?.coverLetter instanceof File) {
        uploadTasks.push(
          uploadCoverLetterEmpStore.uploadCoverLetter(
            employee.id,
            data.references.coverLetter,
          ),
        );
      }

      await Promise.all(uploadTasks);

      /* ------------------------ API UPDATE ------------------------ */
      if (Object.keys(updateBody).length > 0) {
        await updateOneEmpStore.updateOneEmployee(employee.id, updateBody);
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to update employee profile.",
      });
    }
  };

  // 2.Handle Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // keep your local arrays synced into RHF
    form.setValue("skills", skills, { shouldDirty: true, shouldTouch: true });
    form.setValue("careerScopes", careerScopes, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("socials", socials, { shouldDirty: true, shouldTouch: true });

    if (avatarFile)
      form.setValue("basicInfo.avatar", avatarFile, { shouldDirty: true });
    if (resumeFile)
      form.setValue("references.resume", resumeFile, { shouldDirty: true });
    if (coverLetterFile)
      form.setValue("references.coverLetter", coverLetterFile, {
        shouldDirty: true,
      });

    form.handleSubmit(onSubmit, console.error)(e);
  };

  // Loading State Effect
  useEffect(() => {
    if (updateProfileLoadingState) {
      dismiss();
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium leading-relaxed">
              Updating Employee Profile...
            </TypographySmall>
          </div>
        ),
      });
    }
  }, [updateProfileLoadingState]);

  if (loading) return <EmployeeProfilePageSkeleton />;
  if (!user || !employee) return null;

  return (
    <form className="!min-w-full flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between border border-muted rounded-md p-5 tablet-sm:flex-col tablet-sm:[&>div]:w-full tablet-sm:gap-5">
        <div className="flex items-center justify-start gap-5 tablet-sm:flex-col">
          <div
            className="relative"
            onClick={(e) => {
              if (!isEdit && employee.avatar) handleClickAvatarPopup(e);
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
                {employee.avatar && (
                  <Button
                    className="size-8 flex justify-center items-center cursor-pointer p-1 rounded-full bg-red-500 text-primary-foreground"
                    type="button"
                    onClick={() => setOpenRemoveAvatarDialog(true)}
                  >
                    <LucideXCircle width={"18px"} strokeWidth={"1.2px"} />
                  </Button>
                )}
              </div>
            )}

            <RemoveAlertDialog
              type="avatar"
              setOpenDialog={setOpenRemoveAvatarDialog}
              openDialog={openRemoveAvatarDialog}
              onNoClick={disableEditMode}
              onYesClick={removeAvatar}
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
              Save <LucideCircleCheck />
            </Button>
            <Button type="button" className="text-xs" onClick={disableEditMode}>
              Cancel <LucideXCircle />
            </Button>
          </div>
        ) : (
          <Button type="button" className="text-xs" onClick={enableEditMode}>
            Edit Profile <LucideEdit />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* LEFT */}
        <div className="w-[60%] flex flex-col gap-5">
          {/* Personal Info */}
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

          {/* Professional Info */}
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

          {/* ✅ Experience (FIXED Option A) */}
          {employee.experiences && (
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <TypographyH4>Experience Information</TypographyH4>
                  {isEdit && (
                    <div onClick={addExperience}>
                      <IconLabel
                        text="Add Experience"
                        icon={<LucidePlus className="text-muted-foreground" />}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <Divider />
              </div>

              <div className="flex flex-col items-start gap-5">
                {experienceFA.fields.length > 0 ? (
                  experienceFA.fields.map((row, index) => {
                    const experienceId = form.watch(
                      `experiences.${index}.id`,
                    ) as string | undefined;

                    return (
                      <EmployeeExperienceForm
                        key={row.id}
                        index={index}
                        form={form}
                        experienceIndex={index}
                        experienceUUID={experienceId ?? ""}
                        isEdit={isEdit}
                        title={form.watch(`experiences.${index}.title`)}
                        description={form.watch(
                          `experiences.${index}.description`,
                        )}
                        startDate={{
                          defaultValue:
                            (form.getValues(
                              `experiences.${index}.startDate`,
                            ) as any) ?? new Date(),
                          data:
                            (form.watch(
                              `experiences.${index}.startDate`,
                            ) as any) ?? new Date(),
                          onDataChange: (date) => {
                            form.setValue(
                              `experiences.${index}.startDate`,
                              date as any,
                              { shouldDirty: true, shouldTouch: true },
                            );
                          },
                        }}
                        endDate={{
                          defaultValue:
                            (form.getValues(
                              `experiences.${index}.endDate`,
                            ) as any) ?? new Date(),
                          data:
                            (form.watch(
                              `experiences.${index}.endDate`,
                            ) as any) ?? new Date(),
                          onDataChange: (date) => {
                            form.setValue(
                              `experiences.${index}.endDate`,
                              date as any,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              },
                            );
                          },
                        }}
                        onRemove={() => {
                          if (experienceId && isUuid(experienceId)) {
                            setOpenRemoveExperienceDialog(true);
                            setCurrentExperienceID(experienceId);
                          } else {
                            experienceFA.remove(index); // remove newly added row
                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="w-full flex flex-col items-center justify-center p-5">
                    <Image
                      alt="empty"
                      src={emptySvgImage}
                      className="size-44"
                    />
                    <TypographyMuted className="text-sm">
                      No Experience Available.
                    </TypographyMuted>
                  </div>
                )}
              </div>

              <RemoveAlertDialog
                type="experience"
                openDialog={openRemoveExperienceDialog}
                setOpenDialog={setOpenRemoveExperienceDialog}
                onNoClick={disableEditMode}
                onYesClick={() => {
                  if (currentExperienceID) {
                    removeExperience(currentExperienceID);
                    setOpenRemoveExperienceDialog(false);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-[40%] flex flex-col gap-5">
          {/* Skills */}
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
                    <Button
                      className="w-full text-xs"
                      variant="secondary"
                      type="button"
                    >
                      Add Skill <LucidePlus />
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
                        type="button"
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

          {/* Career Scopes */}
          {((careerScopes && careerScopes.length > 0) || isEdit) && (
            <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
              <div className="w-full flex flex-col gap-1">
                <TypographyH4>Careers Scopes</TypographyH4>
                <Divider />
              </div>

              <div className="flex flex-wrap gap-3">
                {careerScopes.map((career, index) => (
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
                ))}
              </div>

              {isEdit && (
                <>
                  <Popover
                    open={openCareerScopePopOver}
                    onOpenChange={setOpenCareerScopePopOver}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                        type="button"
                      >
                        {careerScopeInput
                          ? getAllCareerScopesStore.careerScopes?.find(
                              (c) => c.name === careerScopeInput.name,
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
                              (career, idx) => (
                                <CommandItem
                                  key={idx}
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

                  <Button
                    variant="secondary"
                    className="w-full text-xs"
                    type="button"
                    onClick={addCareerScope}
                  >
                    <LucidePlus />
                    Add Career
                  </Button>
                </>
              )}
            </div>
          )}

          {/* References */}
          {(employee.resume || employee.coverLetter) && (
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <TypographyH4>References Information</TypographyH4>
              <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
                {/* Resume */}
                {employee.resume && (
                  <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                    <div className="flex items-center text-muted-foreground gap-1">
                      <LucideFileText strokeWidth={"1.3px"} />
                      <TypographyMuted>
                        {resumeFile
                          ? resumeFile.name
                          : employee.resume
                            ? extractCleanFilename(employee.resume)
                            : "Resume"}
                      </TypographyMuted>
                      <input
                        type="file"
                        accept="application/pdf,.doc,.docx"
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

                      {employee.resume && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (employee.resume)
                              setPreviewReferenceUrl(employee.resume);
                            setPreviewReferenceType("resume");
                            setOpenReferencePreview(true);
                          }}
                          disabled={!employee.resume}
                        >
                          <LucideEye />
                        </Button>
                      )}

                      {isEdit ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="text-red-500 bg-red-100"
                          onClick={() => setOpenRemoveResumeDialog(true)}
                        >
                          <LucideTrash2 />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (employee.resume) {
                              downloadFileFromUrl(
                                employee.resume,
                                extractCleanFilename(employee.resume),
                              );
                            }
                          }}
                          disabled={!employee.resume}
                        >
                          <LucideDownload />
                        </Button>
                      )}
                    </div>

                    {/* Remove Resume Dialog Section */}
                    <RemoveAlertDialog
                      type="resume"
                      openDialog={openRemoveResumeDialog}
                      setOpenDialog={setOpenRemoveResumeDialog}
                      onNoClick={disableEditMode}
                      onYesClick={removeResume}
                    />
                  </div>
                )}

                {/* Cover Letter */}
                {employee.coverLetter && (
                  <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                    <div className="flex items-center text-muted-foreground gap-1">
                      <LucideFileText strokeWidth={"1.3px"} />
                      <TypographyMuted>
                        {coverLetterFile
                          ? coverLetterFile.name
                          : employee.coverLetter
                            ? extractCleanFilename(employee.coverLetter)
                            : "Cover Letter"}
                      </TypographyMuted>
                      <input
                        type="file"
                        accept="application/pdf,.doc,.docx"
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

                      {employee.coverLetter && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (employee.coverLetter)
                              setPreviewReferenceUrl(employee.coverLetter);
                            setPreviewReferenceType("coverletter");
                            setOpenReferencePreview(true);
                          }}
                          disabled={!employee.coverLetter}
                        >
                          <LucideEye />
                        </Button>
                      )}

                      {isEdit ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="text-red-500 bg-red-100"
                          onClick={() => setOpenRemoveCoverLetterDialog(true)}
                        >
                          <LucideTrash2 />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (employee.coverLetter) {
                              downloadFileFromUrl(
                                employee.coverLetter,
                                extractCleanFilename(employee.coverLetter),
                              );
                            }
                          }}
                          disabled={!employee.coverLetter}
                        >
                          <LucideDownload />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Reference Preview Dialog Section */}
              <ReferencePreviewDialog
                openRefPreview={openReferencePreview}
                setOpenRefPreview={setOpenReferencePreview}
                previewRefType={previewReferenceType}
                referenceUrl={previewReferenceUrl}
                employeeName={employee.username ?? ""}
              />

              {/* Remove CoverLetter Dialog Section */}
              <RemoveAlertDialog
                type="coverLetter"
                openDialog={openRemoveCoverLetterDialog}
                setOpenDialog={setOpenRemoveCoverLetterDialog}
                onNoClick={disableEditMode}
                onYesClick={removeCoverLetter}
              />
            </div>
          )}

          {/* Socials */}
          {employee.socials && employee.socials.length > 0 && (
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <div className="flex flex-col gap-1">
                <TypographyH4>Social Information</TypographyH4>
                <Divider />
              </div>

              <div className="flex flex-wrap gap-3">
                {socials.map((item, index) => (
                  <div className="flex items-center gap-1" key={index}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:underline"
                    >
                      {getSocialPlatformTypeIcon(item.platform as TPlatform)}
                      <TypographySmall>{item.platform}</TypographySmall>
                    </Link>
                    {isEdit && (
                      <LucideXCircle
                        className="text-muted-foreground cursor-pointer text-red-500"
                        width={"18px"}
                        onClick={() => removeSocial(item.platform as TPlatform)}
                      />
                    )}
                  </div>
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
                            value={socialInput?.url ?? ""}
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

          {/* Authentication */}
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

      {/* Profile Popup */}
      <ImagePopup
        open={openAvatarPopup}
        setOpen={setOpenAvatarPopup}
        image={avatarFile ? URL.createObjectURL(avatarFile) : employee.avatar!}
      />

      {/* Dialogs */}
      <input
        ref={avatarInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, "avatar")}
      />
    </form>
  );
}
