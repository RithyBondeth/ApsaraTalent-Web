"use client";

import EmployeeEducationForm from "@/components/employee/profile/education-form";
import EmployeeExperienceForm from "@/components/employee/profile/experience-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import AvatarCropDialog from "@/components/utils/dialogs/avatar-crop-dialog";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import ReferencePreviewDialog from "@/components/utils/dialogs/reference-preview-dialog";
import RemoveAlertDialog from "@/components/utils/dialogs/remove-alert-dialog";
import IconLabel from "@/components/utils/data-display/icon-label";
import ImagePopup from "@/components/utils/data-display/image-popup";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useAvatarState } from "@/hooks/profile/employee/use-avatar-state";
import { useCareerScopesState } from "@/hooks/profile/employee/use-careerscope-state";
import { useReferenceFilesState } from "@/hooks/profile/employee/use-referencefile-state";
import { useSkillsState } from "@/hooks/profile/employee/use-skill-state";
import { useSocialsState } from "@/hooks/profile/employee/use-social-state";
import { useRemoveEmpAvatarStore } from "@/stores/apis/employee/remove-emp-avatar.store";
import { useRemoveEmpCoverLetterStore } from "@/stores/apis/employee/remove-emp-coverletter.store";
import { useRemoveEmpEducationStore } from "@/stores/apis/employee/remove-emp-education.store";
import { useRemoveEmpExperienceStore } from "@/stores/apis/employee/remove-emp-experience.store";
import { useRemoveEmpResumeStore } from "@/stores/apis/employee/remove-emp-resume.store";
import {
  TEmployeeUpdateBody,
  useUpdateOneEmployeeStore,
} from "@/stores/apis/employee/update-one-emp.store";
import { useUploadEmployeeAvatarStore } from "@/stores/apis/employee/upload-emp-avatar.store";
import { useUploadEmployeeCoverLetter } from "@/stores/apis/employee/upload-emp-coverletter.store";
import { useUploadEmployeeResumeStore } from "@/stores/apis/employee/upload-emp-resume.store";
import { useGetAllCareerScopesStore } from "@/stores/apis/users/get-all-career-scopes.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import {
  availabilityConstant,
  genderConstant,
  languageConstant,
  locationConstant,
  loginMethodConstant,
  noticePeriodConstant,
  platformConstant,
  salaryCurrencyConstant,
  workModeConstant,
} from "@/utils/constants/ui.constant";
import { getSocialPlatformTypeIcon } from "@/utils/functions/ui";
import { capitalizeWords } from "@/utils/functions/text";
import { AVATAR_INITIALS_LENGTH } from "@/utils/constants/ui.constant";
import { MAX_IMAGE_SIZE } from "@/utils/constants/config.constant";
import { isUuid } from "@/utils/functions/validation";
import {
  extractCleanFilename,
  isSupportedProfileImage,
  readImageFileAsDataUrl,
} from "@/utils/functions/file";
import { parseMaybeDate } from "@/utils/functions/date";
import { API_GET_EMP_DOCUMENT_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { ICareerScope } from "@/utils/interfaces/user/career.interface";
import { ISkill } from "@/utils/interfaces/user/employee.interface";
import { ISocialLink } from "@/utils/interfaces/user/social.interface";
import { TPlatform } from "@/utils/types/user/platform.type";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  LucideAtSign,
  LucideBadgeCheck,
  LucideBriefcaseBusiness,
  LucideCamera,
  LucideCircleCheck,
  LucideCircleDollarSign,
  LucideClock3,
  LucideCompass,
  LucideLoader2,
  LucideDownload,
  LucideEdit,
  LucideEye,
  LucideEyeOff,
  LucideFileText,
  LucideGlobe,
  LucideGraduationCap,
  LucideLink2,
  LucideMail,
  LucideMapPin,
  LucideMonitor,
  LucidePhone,
  LucidePlus,
  LucideSettings,
  LucideTimer,
  LucideTrash2,
  LucideUser,
  LucideVenusAndMars,
  LucideXCircle,
  LucideZap,
  Sparkles,
} from "lucide-react";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  Controller,
  type Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { PageState } from "@/components/utils/feedback/page-state";
import type { TEmployeeProfileForm } from "./validation";
import {
  addNewEducationSvg,
  addNewExperienceSvg,
} from "@/utils/constants/asset.constant";
import { getEmployeeProfileCompletion } from "@/utils/functions/profile";
import { SectionTitle } from "@/components/utils/layout/section-title";
import ProfileCompletionCard from "@/components/profile/profile-completion-card";
import { EmployeeProfilePageLoadingSkeleton } from "@/components/profile/skeleton";
import MissingProfileFieldButton from "@/components/profile/missing-profile-field-button";
import ProfileEditActionBar from "@/components/profile/profile-edit-action-bar";

/* -------------------------------- Helpers --------------------------------- */
let employeeProfileResolverPromise:
  Promise<Resolver<TEmployeeProfileForm>> | undefined;

const lazyEmployeeProfileResolver: Resolver<TEmployeeProfileForm> = async (
  ...args
) => {
  employeeProfileResolverPromise ??= Promise.all([
    import("@hookform/resolvers/zod"),
    import("./validation"),
  ]).then(
    ([{ zodResolver }, { employeeFormSchema }]) =>
      zodResolver(employeeFormSchema) as Resolver<TEmployeeProfileForm>,
  );

  return (await employeeProfileResolverPromise)(...args);
};

export default function EmployeeProfilePage() {
  /* ----------------------------------- Utils ---------------------------------- */
  const t = useTranslations("toast");
  const tCommon = useTranslations("common");
  const tP = useTranslations("profile");
  const tr = useTranslations("resumeBuilder");

  /* -------------------------------- All States -------------------------------- */
  // Util States
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [hasLoadedProfile, setHasLoadedProfile] = useState<boolean>(false);
  const editModeEnteredAtRef = useRef<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined,
  );

  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);
  const lastUploadedAvatarRef = useRef<string | null>(null);

  // Avatar State
  const {
    avatarFile,
    setAvatarFile,
    openAvatarPopup,
    setOpenAvatarPopup,
    openRemoveAvatarDialog,
    setOpenRemoveAvatarDialog,
    openCropDialog,
    setOpenCropDialog,
    cropImageUrl,
    setCropImageUrl,
    avatarInputRef,
    ignoreNextClick,
  } = useAvatarState();

  // Reference Files States
  const {
    resumeFile,
    setResumeFile,
    coverLetterFile,
    setCoverLetterFile,
    openRemoveResumeDialog,
    setOpenRemoveResumeDialog,
    openRemoveCoverLetterDialog,
    setOpenRemoveCoverLetterDialog,
    resumeInputRef,
    coverLetterInputRef,
    openReferencePreview,
    setOpenReferencePreview,
    previewReferenceType,
    setPreviewReferenceType,
    previewReferenceUrl,
    setPreviewReferenceUrl,
  } = useReferenceFilesState();

  // Social State
  const {
    socialInput,
    setSocialInput,
    socials,
    setSocials,
    deleteSocialIds,
    setDeleteSocialIds,
    socialSelectPlatformRef,
  } = useSocialsState();

  // Skill State
  const {
    skillInput,
    setSkillInput,
    skills,
    setSkills,
    deleteSkillIds,
    setDeleteSkillIds,
    openSkillPopOver,
    setOpenSkillPopOver,
  } = useSkillsState();

  // CareerScope State
  const {
    careerScopeInput,
    setCareerScopeInput,
    careerScopes,
    setCareerScopes,
    deleteCareerScopeIds,
    setDeleteCareerScopeIds,
    openCareerScopePopOver,
    setOpenCareerScopePopOver,
  } = useCareerScopesState();

  // Experience and Education Remove Dialog State
  const [openRemoveExpOrEduDialogState, setOpenRemoveExpOrEduDialogState] =
    useState<{
      experience: { open: boolean; id: string | null };
      education: { open: boolean; id: string | null };
    }>({
      experience: { open: false, id: null },
      education: { open: false, id: null },
    });

  /* ----------------------------- API Integration ---------------------------- */
  // Current User Information and Current User CareerScopes
  const { user, getCurrentUser } = useGetCurrentUserStore();
  const employee = user?.employee;
  const getAllCareerScopesStore = useGetAllCareerScopesStore();

  // Update Employee Informatio
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

  // AI Refine
  const { isRefining: jobLoading, refineContent: refineJob } = useAIRefine();
  const { isRefining: descLoading, refineContent: refineDesc } = useAIRefine();

  /* ------------------------------- Profile Form ------------------------------- */
  // React Hook Form: Employee Profile Schema
  const form = useForm<TEmployeeProfileForm>({
    resolver: lazyEmployeeProfileResolver,
    defaultValues: {
      basicInfo: {
        firstname: "",
        lastname: "",
        dob: null,
        username: "",
        gender: "",
        location: "",
        isHide: false,
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
        workMode: null,
        noticePeriod: null,
        portfolioUrl: "",
        linkedinUrl: "",
        languages: [],
        expectedSalaryMin: null,
        expectedSalaryMax: null,
        salaryCurrency: "USD",
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

  /* --------------------------------- Effects ---------------------------------- */
  // Get Current User Effect
  useEffect(() => {
    let isActive = true;

    void getCurrentUser().finally(() => {
      if (isActive) setHasLoadedProfile(true);
    });

    return () => {
      isActive = false;
    };
  }, [getCurrentUser]);

  // Avatar Preview Effect
  useEffect(() => {
    setAvatarLoadError(false);

    if (!avatarFile) {
      setAvatarPreview(
        lastUploadedAvatarRef.current ?? employee?.avatar ?? undefined,
      );
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile, employee?.avatar]);

  // Revoke retained avatar blob URL on unmount
  useEffect(() => {
    return () => {
      if (lastUploadedAvatarRef.current) {
        URL.revokeObjectURL(lastUploadedAvatarRef.current);
      }
    };
  }, []);

  // Warn the user before leaving the page with unsaved changes
  useEffect(() => {
    if (!isEdit || !form.formState.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isEdit, form.formState.isDirty]);

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

  // Watch Fields
  const jobValue = useWatch({ control: form.control, name: "profession.job" });
  const descValue = useWatch({
    control: form.control,
    name: "profession.description",
  });
  const expValue = useWatch({
    control: form.control,
    name: "profession.yearOfExperience",
  });
  const availValue = useWatch({
    control: form.control,
    name: "profession.availability",
  });
  const languagesValue = useWatch({
    control: form.control,
    name: "profession.languages",
  }) as string[] | undefined;
  const salaryMinValue = useWatch({
    control: form.control,
    name: "profession.expectedSalaryMin",
  });
  const salaryMaxValue = useWatch({
    control: form.control,
    name: "profession.expectedSalaryMax",
  });

  const [langPopoverOpen, setLangPopoverOpen] = useState<boolean>(false);
  const [skillDescriptionInput, setSkillDescriptionInput] =
    useState<string>("");

  // Hydrate Current User (Employee) Data from API
  useEffect(() => {
    if (!user || !employee) return;

    form.reset({
      basicInfo: {
        firstname: employee.firstname ?? "",
        lastname: employee.lastname ?? "",
        dob: employee.dob ? new Date(employee.dob) : null,
        username: employee.username ?? "",
        gender: employee.gender ?? "",
        location: employee.location ?? "",
        isHide: employee.isHide ?? false,
        avatar: employee.avatar ?? null,
      },
      accountSetting: {
        email: user.email ?? "",
        phone: employee.phone ?? "",
      },
      profession: {
        job: employee.job ?? "",
        yearOfExperience: employee.yearsOfExperience?.toString() ?? "",
        availability: employee.availability,
        description: employee.description ?? "",
        workMode: employee.workMode ?? null,
        noticePeriod: employee.noticePeriod ?? null,
        portfolioUrl: employee.portfolioUrl ?? "",
        linkedinUrl: employee.linkedinUrl ?? "",
        languages: employee.languages ?? [],
        expectedSalaryMin: employee.expectedSalaryMin ?? null,
        expectedSalaryMax: employee.expectedSalaryMax ?? null,
        salaryCurrency: "USD",
      },
      experiences:
        employee.experiences?.map((exp) => ({
          id: exp.id,
          title: exp.title ?? "",
          company: exp.company ?? "",
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
          description: cs.description ?? "",
        })) ?? [],
      socials:
        employee.socials?.map((s) => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
        })) ?? [],
      educations: employee.educations?.map((edu) => {
        const parsedYear = edu.year
          ? new Date(edu.year).getFullYear()
          : undefined;
        return {
          id: edu.id,
          school: edu.school ?? "",
          degree: edu.degree ?? "",
          year: parsedYear,
          isStudying: parsedYear
            ? parsedYear > new Date().getFullYear()
            : false,
        };
      }),
    });

    setSocials(employee.socials ?? []);
    setSkills(employee.skills ?? []);
    setCareerScopes(
      (employee.careerScopes ?? []).map((cs) => ({
        ...cs,
        description: cs.description ?? "",
      })),
    );
  }, [employee, form, setCareerScopes, setSkills, setSocials, user]);

  /* -------------------------------- Methods --------------------------------- */
  // ── Edit Mode Methods ──────────────────────────────────────────
  // ── Close All The Dialogs ───────────────────────────────
  const closeAllDialogs = () => {
    setOpenAvatarPopup(false);
    setOpenRemoveAvatarDialog(false);
    setOpenCropDialog(false);
    setOpenRemoveResumeDialog(false);
    setOpenRemoveCoverLetterDialog(false);
    setOpenReferencePreview(false);
    setOpenRemoveExpOrEduDialogState((prev) => ({
      ...prev,
      experience: { open: false, id: null },
      education: { open: false, id: null },
    }));
  };

  // ── Enable Edit Mode ───────────────────────────────────
  const enableEditMode = () => {
    editModeEnteredAtRef.current = Date.now();
    setIsEdit(true);
  };

  const beginEditingField = (fieldId?: string, openControl = false) => {
    enableEditMode();

    if (!fieldId) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const field = document.getElementById(fieldId);
        if (!(field instanceof HTMLElement)) return;

        field.focus();
        if (openControl) field.click();
      });
    });
  };

  // ── Disable Edit Mode ─────────────────────────────────────────
  const disableEditMode = async () => {
    await getCurrentUser();
    setAvatarFile(null);
    setResumeFile(null);
    setCoverLetterFile(null);
    closeAllDialogs();
    setDeleteSkillIds([]);
    setDeleteSocialIds([]);
    setDeleteCareerScopeIds([]);
    setIsEdit(false);
  };

  // ── Open RemoveExperienceOrEducation Dialog ─────────────────────
  const openRemoveExperienceOrEducationDialog = (
    type: "experience" | "education",
    id: string,
  ) => {
    setOpenRemoveExpOrEduDialogState((prev) => ({
      ...prev,
      [type]: { open: true, id },
    }));
  };

  // ── Close RemoveExperienceOrEducation Dialog ────────────────────
  const closeRemoveExperienceOrEducationDialog = (
    type: "experience" | "education",
  ) => {
    setOpenRemoveExpOrEduDialogState((prev) => ({
      ...prev,
      [type]: { open: false, id: null },
    }));
  };

  // ── Reference and Avatar Methods ────────────────────────────────────────────────────
  // ── API: Remove Resume ─────────────────────────────────────────
  const removeResume = async () => {
    if (employee) await removeEmpResumeStore.removeEmpResume(employee.id);

    await disableEditMode();

    toast.success(t("removeResumeSuccess"));
  };

  // ── API: Remove CoverLetter ─────────────────────────────────────
  const removeCoverLetter = async () => {
    if (employee)
      await removeEmpCoverLetterStore.removeEmpCoverLetter(employee.id);

    await disableEditMode();

    toast.success(t("removeCoverLetterSuccess"));
  };

  // ── API: Remove Avatar ─────────────────────────────────────────
  const removeAvatar = async () => {
    if (lastUploadedAvatarRef.current) {
      URL.revokeObjectURL(lastUploadedAvatarRef.current);
      lastUploadedAvatarRef.current = null;
    }
    if (employee) await removeEmpAvatarStore.removeEmpAvatar(employee.id);

    await disableEditMode();

    toast.success(t("removeAvatarSuccess"));
  };

  // ── Handle Click Avatar Popup ───────────────────────────────────
  const handleClickAvatarPopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenAvatarPopup(true);
  };

  // ── Handle Avatar Crop ─────────────────────────────────────────
  const handleAvatarCrop = (file: File) => {
    setAvatarFile(file);

    form.setValue("basicInfo.avatar", file, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // ── Experience Methods ────────────────────────────────────────────────────
  // ── Add New Experience ─────────────────────────────────────────
  const addNewExperience = () => {
    experienceFA.append({
      id: "",
      title: "",
      company: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    });
  };

  // ── API: Remove Experience ─────────────────────────────────────────
  const removeExperience = async (experienceID: string) => {
    if (employee)
      await removeEmpExperieceStore.removeExperience(employee.id, experienceID);

    await disableEditMode();

    toast.success(t("removeExperienceSuccess"));
  };

  // ── Education Methods ────────────────────────────────────────────────────
  // ── Add New Education ─────────────────────────────────────────
  const addNewEducation = () => {
    educationFA.append({
      id: "",
      school: "",
      degree: "",
      year: undefined,
    });
  };

  // ── API: Remove Education ─────────────────────────────────────────
  const removeEducation = async (educationID: string) => {
    if (employee)
      await removeEmpEducationStore.removeEducation(employee.id, educationID);

    await disableEditMode();

    toast.success(t("removeEducationSuccess"));
  };

  // ── Skill Methods ────────────────────────────────────────────────────
  // ── Add New Skill ─────────────────────────────────────────
  const addNewSkills = () => {
    const trimmed = skillInput?.trim();
    if (!trimmed) return;

    const alreadyExists = skills.some(
      (s) => (s.name ?? "").trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(t("duplicatedSkill"), {
        description: t("pleaseInputAnotherSkill"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      setSkillInput(null);
      setSkillDescriptionInput("");
      setOpenSkillPopOver(false);
      return;
    }

    const updatedSkills: ISkill[] = [
      ...skills,
      {
        id: "",
        name: trimmed,
        description: skillDescriptionInput.trim(),
      },
    ];
    setSkills(updatedSkills);

    form.setValue("skills", updatedSkills, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSkillInput(null);
    setSkillDescriptionInput("");
    setOpenSkillPopOver(false);
  };

  // ── Remove Skill ─────────────────────────────────────────
  const removeSkill = (skillToRemove: string) => {
    const skillToDelete = skills.find((s) => s.name === skillToRemove);
    if (skillToDelete?.id)
      setDeleteSkillIds((prev) => [...prev, skillToDelete.id!]);

    const updated = skills.filter((s) => s.name !== skillToRemove);
    setSkills(updated);
    form.setValue("skills", updated, { shouldDirty: true, shouldTouch: true });
  };

  // ── Social Methods ────────────────────────────────────────────────────
  // ── Add New Social ─────────────────────────────────────────
  const addNewSocial = () => {
    const trimmedPlatform = socialInput?.platform?.trim();
    const trimmedUrl = socialInput?.url?.trim();

    if (!trimmedPlatform || !trimmedUrl) return false;

    const normalizedPlatform = trimmedPlatform.toLowerCase();
    const normalizedUrl = trimmedUrl.toLowerCase();

    const platformExists = socials.some(
      (s) => (s.platform ?? "").trim().toLowerCase() === normalizedPlatform,
    );

    if (platformExists) {
      toast.error(t("duplicateSocial"), {
        description: t("socialPlatformAlreadyExists"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      return false;
    }

    const urlExists = socials.some(
      (s) => (s.url ?? "").trim().toLowerCase() === normalizedUrl,
    );

    if (urlExists) {
      toast.error(t("duplicateUrl"), {
        description: t("socialLinkAlreadyExists"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      return false;
    }

    const updated = [
      ...socials,
      {
        id: "",
        platform: capitalizeWords(trimmedPlatform.toLowerCase()),
        url: trimmedUrl,
      },
    ];

    setSocials(updated);
    form.setValue("socials", updated, {
      shouldDirty: true,
      shouldTouch: true,
    });

    return true;
  };

  // ── Remove Social ─────────────────────────────────────────
  const removeSocial = (platform: TPlatform) => {
    const toDelete = socials.find((s) => s.platform === platform);
    if (toDelete?.id) setDeleteSocialIds((prev) => [...prev, toDelete.id!]);

    const updated = socials.filter((s) => s.platform !== platform);
    setSocials(updated);
    form.setValue("socials", updated, { shouldDirty: true, shouldTouch: true });
  };

  // ── CareerScope Methods ────────────────────────────────────────────────────
  // ── Handle CareerScope Select ─────────────────────────────────────────
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

  // ── Add New CareerScope ─────────────────────────────────────────
  const addNewCareerScope = () => {
    const name = careerScopeInput?.name?.trim();
    if (!name) return;

    const alreadyExists = careerScopes.some(
      (c) => (c.name ?? "").trim().toLowerCase() === name.toLowerCase(),
    );
    if (alreadyExists) {
      toast.error(t("duplicatedCareer"), {
        description: t("pleaseSelectAnotherCareer"),
        action: { label: t("tryAgain"), onClick: () => {} },
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

  // ── Remove CareerScope ─────────────────────────────────────────
  const removeCareerScope = (careerToRemove: string) => {
    const toDelete = careerScopes.find((c) => c.name === careerToRemove);
    if (toDelete?.id)
      setDeleteCareerScopeIds((prev) => [...prev, toDelete.id!]);

    const updated = careerScopes.filter((c) => c.name !== careerToRemove);
    setCareerScopes(updated);
    form.setValue("careerScopes", updated, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // ── File Methods ────────────────────────────────────────────────────
  // ── Handle File Change: Avatar, Resume and CoverLetter ─────────────────────────────────────────
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "resume" | "coverLetter",
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (type === "avatar") {
      event.target.value = "";

      if (!isSupportedProfileImage(file)) {
        toast.error(tr("invalidImageType"));
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(tr("imageTooLarge"));
        return;
      }

      try {
        const previewUrl = await readImageFileAsDataUrl(file);
        setCropImageUrl(previewUrl);
        setOpenCropDialog(true);
      } catch {
        toast.error(tr("imageReadFailed"));
      }
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

  // ── Handle File Download: Resume and CoverLetter ─────────────────────────────────────────
  const downloadFileFromUrl = async (url: string, filename?: string) => {
    try {
      const res = await fetch(url, { credentials: "include" });
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
      toast.error(t("downloadFailed"), {
        description: t("unableToDownloadFile"),
      });
    }
  };

  // ── onSubmit Methods ────────────────────────────────────────────────────
  // ── onSubmit - API: Update The Entire Employee Profile ─────────────────────────────────────────
  const onSubmit = async (data: TEmployeeProfileForm) => {
    if (!employee) return;

    const updateBody: Partial<TEmployeeUpdateBody> = {};
    const dirtyFields = form.formState.dirtyFields;

    try {
      /* ------------------------ BASIC INFO ------------------------ */
      const basicInfoKeys: (keyof NonNullable<typeof data.basicInfo>)[] = [
        "firstname",
        "lastname",
        "dob",
        "username",
        "gender",
        "location",
        "isHide",
      ];

      basicInfoKeys.forEach((key) => {
        if (dirtyFields?.basicInfo?.[key]) {
          const val = data.basicInfo?.[key];
          // Serialize dob Date to ISO string for the API
          (updateBody as Record<string, unknown>)[key] =
            val instanceof Date ? val.toISOString() : val;
        }
      });

      /* ------------------------ ACCOUNT SETTINGS ------------------------ */
      const accountKeys: (keyof NonNullable<typeof data.accountSetting>)[] = [
        "email",
        "phone",
      ];

      accountKeys.forEach((key) => {
        if (dirtyFields?.accountSetting?.[key]) {
          (updateBody as Record<string, unknown>)[key] =
            data.accountSetting?.[key];
        }
      });

      /* ------------------------ PROFESSION ------------------------ */
      const professionKeys: (keyof NonNullable<typeof data.profession>)[] = [
        "job",
        "yearOfExperience",
        "availability",
        "description",
        "workMode",
        "noticePeriod",
        "portfolioUrl",
        "linkedinUrl",
        "languages",
        "expectedSalaryMin",
        "expectedSalaryMax",
      ];

      professionKeys.forEach((key) => {
        if (dirtyFields?.profession?.[key]) {
          if (key === "yearOfExperience") {
            const raw = data.profession?.yearOfExperience;
            (updateBody as Record<string, unknown>).yearsOfExperience =
              raw?.trim() ?? "";
          } else if (key === "portfolioUrl" || key === "linkedinUrl") {
            const value = data.profession?.[key];
            (updateBody as Record<string, unknown>)[key] =
              typeof value === "string" && value.trim() ? value.trim() : null;
          } else {
            (updateBody as Record<string, unknown>)[key] = (
              data.profession as Record<string, unknown>
            )?.[key];
          }
        }
      });

      /* ------------------------ SKILLS ------------------------ */
      const skillsChanged =
        skills.some((s) => !s.id) || deleteSkillIds.length > 0;
      if (skillsChanged) {
        updateBody.skills = (data.skills ?? [])
          .filter((s): s is ISkill => !!s && !!s.name?.trim())
          .map((s) => ({
            id: s.id ?? "",
            name: s.name.trim(),
            description: s.description ?? "",
          }));
        if (deleteSkillIds.length > 0) {
          updateBody.skillIdsToDelete = deleteSkillIds;
        }
      }

      /* ------------------------ CAREER SCOPES ------------------------ */
      const careerScopesChanged =
        careerScopes.some((cs) => !cs.id) || deleteCareerScopeIds.length > 0;
      if (careerScopesChanged) {
        updateBody.careerScopes = (data.careerScopes ?? [])
          .filter((cs): cs is ICareerScope => !!cs && !!cs.name?.trim())
          .map((cs) => ({
            id: cs.id ?? "",
            name: cs.name.trim(),
            description: cs.description ?? "",
          }));
        if (deleteCareerScopeIds.length > 0) {
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
        }
      }

      /* ------------------------ SOCIALS ------------------------ */
      const socialsChanged =
        socials.some((s) => !s.id) || deleteSocialIds.length > 0;
      if (socialsChanged) {
        updateBody.socials = (data.socials ?? [])
          .filter(
            (s): s is ISocialLink =>
              !!s && !!s.platform?.trim() && !!s.url?.trim(),
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

      /* ------------------------ EXPERIENCES ------------------------ */
      if (dirtyFields.experiences) {
        updateBody.experiences = (data.experiences ?? [])
          .filter(
            (
              exp,
            ): exp is {
              id?: string;
              title: string;
              company?: string;
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
            ...(exp.company?.trim() ? { company: exp.company.trim() } : {}),
            description: exp.description.trim(),
            startDate: exp.startDate.toISOString(),
            ...(exp.endDate ? { endDate: exp.endDate.toISOString() } : {}),
          }));
      }

      /* ------------------------ EDUCATIONS ------------------------ */
      if (dirtyFields.educations) {
        updateBody.educations = (data.educations ?? [])
          .filter(
            (
              edu,
            ): edu is {
              id?: string;
              school: string;
              degree: string;
              year: number;
            } =>
              !!edu &&
              !!edu.school?.trim() &&
              !!edu.degree?.trim() &&
              typeof edu.year === "number",
          )
          .map((edu) => ({
            ...(edu.id ? { id: edu.id } : {}),
            school: edu.school.trim(),
            degree: edu.degree.trim(),
            year: new Date(edu.year, 0, 1).toISOString(),
          }));
      }

      /* ------------------------ FILE UPLOADS ------------------------ */
      const uploadTasks: Promise<unknown>[] = [];

      const avatarFileToUpload = data.basicInfo?.avatar;
      const resumeFileToUpload = data.references?.resume;
      const coverLetterFileToUpload = data.references?.coverLetter;

      const hasAvatarUpload = avatarFileToUpload instanceof File;
      const hasResumeUpload = resumeFileToUpload instanceof File;
      const hasCoverLetterUpload = coverLetterFileToUpload instanceof File;

      if (hasAvatarUpload) {
        uploadTasks.push(
          uploadAvatarEmpStore.uploadAvatar(employee.id, avatarFileToUpload),
        );
      }

      if (hasResumeUpload) {
        uploadTasks.push(
          uploadResumeEmpStore.uploadResume(employee.id, resumeFileToUpload),
        );
      }

      if (hasCoverLetterUpload) {
        uploadTasks.push(
          uploadCoverLetterEmpStore.uploadCoverLetter(
            employee.id,
            coverLetterFileToUpload,
          ),
        );
      }

      const hasUpdateBodyChanges = Object.keys(updateBody).length > 0;
      const hasFileUploads =
        hasAvatarUpload || hasResumeUpload || hasCoverLetterUpload;

      if (!hasUpdateBodyChanges && !hasFileUploads) {
        setAvatarFile(null);
        setResumeFile(null);
        setCoverLetterFile(null);
        closeAllDialogs();
        setDeleteSkillIds([]);
        setDeleteSocialIds([]);
        setDeleteCareerScopeIds([]);
        setIsEdit(false);
        return;
      }

      await Promise.all(uploadTasks);

      if (hasAvatarUpload && avatarFileToUpload instanceof File) {
        if (lastUploadedAvatarRef.current)
          URL.revokeObjectURL(lastUploadedAvatarRef.current);
        lastUploadedAvatarRef.current = URL.createObjectURL(avatarFileToUpload);
      }

      /* ------------------------ API UPDATE ------------------------ */
      if (hasUpdateBodyChanges) {
        await updateOneEmpStore.updateOneEmployee(employee.id, updateBody);
      }

      toast.success(t("profileUpdatedSuccess"), {
        description: t("profileUpdatedSuccessDescription"),
      });
      await disableEditMode();
    } catch (err) {
      console.error(err);
      toast.error(t("error"), {
        description: t("failedToUpdateEmployeeProfile"),
      });
    }
  };

  // ── handleSubmit: Submit Employee Profile Form ─────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Guard: ignore submissions that arrive within 400ms of entering edit mode
    // (prevents double-click on Edit Profile from immediately hitting Save)
    if (
      editModeEnteredAtRef.current !== null &&
      Date.now() - editModeEnteredAtRef.current < 400
    ) {
      return;
    }

    form.setValue("skills", skills, { shouldDirty: true });
    form.setValue("careerScopes", careerScopes, { shouldDirty: true });
    form.setValue("socials", socials, { shouldDirty: true });

    if (avatarFile)
      form.setValue("basicInfo.avatar", avatarFile, { shouldDirty: true });
    if (resumeFile)
      form.setValue("references.resume", resumeFile, { shouldDirty: true });
    if (coverLetterFile)
      form.setValue("references.coverLetter", coverLetterFile, {
        shouldDirty: true,
      });

    form.handleSubmit(onSubmit, () => toast.error(t("validationError")))(e);
  };

  /* ------------------------------- Loading State ------------------------------- */
  // Compute All Loading States
  const apiLoadingStates = [
    updateOneEmpStore.loading,
    uploadAvatarEmpStore.loading,
    uploadResumeEmpStore.loading,
    uploadCoverLetterEmpStore.loading,
    removeEmpAvatarStore.loading,
    removeEmpResumeStore.loading,
    removeEmpCoverLetterStore.loading,
    removeEmpEducationStore.loading,
    removeEmpExperieceStore.loading,
  ];
  const updateProfileLoadingState = apiLoadingStates.some(Boolean);

  // Loading Message Based on Loading State
  const loadingMessage = removeEmpAvatarStore.loading
    ? tP("removingAvatar")
    : removeEmpResumeStore.loading
      ? tP("removingResume")
      : removeEmpCoverLetterStore.loading
        ? tP("removingCoverLetter")
        : removeEmpExperieceStore.loading
          ? tP("removingExperience")
          : removeEmpEducationStore.loading
            ? tP("removingEducation")
            : uploadAvatarEmpStore.loading
              ? tP("uploadingAvatar")
              : uploadResumeEmpStore.loading
                ? tP("uploadingResume")
                : uploadCoverLetterEmpStore.loading
                  ? tP("uploadingCoverLetter")
                  : updateOneEmpStore.loading
                    ? tP("updatingEmployee")
                    : "";

  if (!hasLoadedProfile) return <EmployeeProfilePageLoadingSkeleton />;

  /* -------------------------------- Empty State ------------------------------ */
  if (!user || !employee)
    return (
      <PageState
        variant="error"
        title={tP("profileUnavailable")}
        description={tP("profileUnavailableDescription")}
        action={{
          label: tP("reloadProfile"),
          onClick: () => window.location.reload(),
        }}
      />
    );

  /* -------------------------------- Profile Completion ---------------------- */
  const profileCompletion = getEmployeeProfileCompletion({
    ...employee,
    email: user.email,
    avatar: avatarLoadError ? undefined : employee.avatar,
  });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <form
      data-profile-editing={isEdit}
      className="profile-editorial profile-employee animate-page-in flex !min-w-full flex-col gap-6 sm:gap-7"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          (e.target as HTMLElement).tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
        }
      }}
    >
      {/* Sticky Edit Action Bar Section */}
      {isEdit && (
        <ProfileEditActionBar
          editLabel={tP("editProfile")}
          cancelLabel={tP("cancel")}
          saveLabel={tP("save")}
          savingLabel={tP("updating")}
          isSaving={updateProfileLoadingState}
          onCancel={disableEditMode}
        />
      )}

      {/* Profile Completion Section */}
      <ProfileCompletionCard
        percentage={profileCompletion.percentage}
        missingFields={profileCompletion.missingFields}
      />

      {/* Header Section */}
      <section className="profile-hero profile-employee-hero overflow-hidden border border-border bg-card">
        {/* Gradient Banner Section */}
        <div className="profile-cover relative h-40 overflow-hidden bg-foreground sm:h-52">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_48%,hsl(var(--background)/0.09)_48%,hsl(var(--background)/0.09)_50%,transparent_50%,transparent_100%)] bg-[length:34px_34px]" />
          <div className="absolute inset-x-5 top-5 flex items-start justify-between text-background sm:inset-x-6 sm:top-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-80">
              {tP("employeeProfileLabel")}
            </span>
          </div>
        </div>

        {/* Identity Row Section */}
        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-10 flex items-end gap-4 tablet-md:flex-col tablet-md:items-center sm:-mt-12">
            {/* Avatar Section */}
            <div
              className="relative flex-shrink-0"
              onClick={(e) => {
                if (!isEdit && employee.avatar) handleClickAvatarPopup(e);
              }}
            >
              <Avatar
                className="size-24 cursor-pointer !rounded-none border-[6px] border-card shadow-none sm:size-28"
                rounded="md"
              >
                <AvatarImage
                  src={avatarPreview}
                  onError={() => setAvatarLoadError(true)}
                />
                <AvatarFallback className="text-lg font-semibold uppercase">
                  {employee.username?.slice(0, AVATAR_INITIALS_LENGTH)}
                </AvatarFallback>
              </Avatar>

              {(isEdit || !employee.avatar) && (
                <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
                  <Button
                    className="size-7 rounded-none bg-foreground p-0 text-primary-foreground shadow-none"
                    type="button"
                    onClick={() => {
                      if (isEdit) {
                        avatarInputRef.current?.click();
                        return;
                      }
                      enableEditMode();
                      requestAnimationFrame(() =>
                        avatarInputRef.current?.click(),
                      );
                    }}
                    aria-label={tP("addMissingField", {
                      field: tP("completionFields.profilePhoto"),
                    })}
                  >
                    <LucideCamera className="size-3.5" />
                  </Button>
                  {employee.avatar && !avatarFile && (
                    <Button
                      className="size-7 rounded-none bg-destructive p-0 text-destructive-foreground shadow-none"
                      type="button"
                      onClick={() => setOpenRemoveAvatarDialog(true)}
                    >
                      <LucideTrash2 className="size-3.5" />
                    </Button>
                  )}
                  {avatarFile && (
                    <Button
                      className="size-7 rounded-none bg-destructive p-0 text-destructive-foreground shadow-none"
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        form.setValue(
                          "basicInfo.avatar",
                          employee.avatar ?? null,
                          { shouldDirty: false },
                        );
                      }}
                    >
                      <LucideXCircle className="size-3.5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Avatar Crop Dialog Section */}
              <AvatarCropDialog
                title={tP("cropAvatar", { username: employee.username ?? "" })}
                open={openCropDialog}
                setOpen={setOpenCropDialog}
                image={cropImageUrl}
                onCropComplete={handleAvatarCrop}
              />

              {/* Remove Avatar Dialog Section */}
              <RemoveAlertDialog
                type="avatar"
                setOpenDialog={setOpenRemoveAvatarDialog}
                openDialog={openRemoveAvatarDialog}
                onNoClick={disableEditMode}
                onYesClick={removeAvatar}
              />
            </div>

            {/* Avatar Input */}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileChange(e, "avatar")}
              aria-label="Upload avatar image"
            />

            {/* Name and Job Section */}
            <div className="min-w-0 flex-1 pb-1 tablet-md:text-center">
              <h1 className="truncate text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl">
                {employee.username}
              </h1>
              <p className="mt-1 truncate text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {employee.job}
              </p>
            </div>

            {/* Edit Profile Button Section - View mode only, single location */}
            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mb-1 shrink-0 rounded-none text-xs tablet-md:w-full"
                onClick={enableEditMode}
              >
                <LucideEdit className="size-3.5" />
                {tP("editProfile")}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="profile-grid grid grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)] items-start gap-5 tablet-lg:grid-cols-1">
        {/* LEFT Side Section */}
        <div className="profile-main-column flex min-w-0 flex-col gap-5">
          {/* Personal Information Section: Firstname, Lastname, Username, DOB, Location, Gender, Email and Phone Number */}
          <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              icon={<LucideUser />}
              title={tP("personalInformation")}
            />

            <div className="grid w-full grid-cols-12 gap-x-4 gap-y-5 tablet-md:grid-cols-1">
              <LabelInput
                className="col-span-6 tablet-md:col-span-1"
                label={tP("firstname")}
                input={
                  !isEdit && !employee.firstname?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("firstname"),
                      })}
                      onClick={() => beginEditingField("firstname")}
                    />
                  ) : (
                    <Input
                      placeholder={tP("firstname")}
                      id="firstname"
                      {...form.register("basicInfo.firstname")}
                      prefix={<LucideUser />}
                      disabled={!isEdit}
                    />
                  )
                }
              />
              <LabelInput
                className="col-span-6 tablet-md:col-span-1"
                label={tP("lastname")}
                input={
                  !isEdit && !employee.lastname?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("lastname"),
                      })}
                      onClick={() => beginEditingField("lastname")}
                    />
                  ) : (
                    <Input
                      placeholder={tP("lastname")}
                      id="lastname"
                      {...form.register("basicInfo.lastname")}
                      prefix={<LucideUser />}
                      disabled={!isEdit}
                    />
                  )
                }
              />

              <LabelInput
                className="col-span-6 tablet-md:col-span-1"
                label={tP("username")}
                input={
                  !isEdit && !employee.username?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("username"),
                      })}
                      onClick={() => beginEditingField("username")}
                    />
                  ) : (
                    <Input
                      placeholder={tP("username")}
                      id="username"
                      {...form.register("basicInfo.username")}
                      prefix={<LucideAtSign />}
                      disabled={!isEdit}
                    />
                  )
                }
              />
              <LabelInput
                className="col-span-6 tablet-md:col-span-1"
                label={tP("dateOfBirth")}
                input={
                  <Controller
                    name="basicInfo.dob"
                    control={form.control}
                    render={({ field }) =>
                      !isEdit && !employee.dob ? (
                        <MissingProfileFieldButton
                          label={tP("addMissingField", {
                            field: tP("dateOfBirth"),
                          })}
                          onClick={() =>
                            beginEditingField("date-of-birth", true)
                          }
                        />
                      ) : (
                        <DatePicker
                          id="date-of-birth"
                          placeholder={tP("dateOfBirth")}
                          date={
                            field.value instanceof Date
                              ? field.value
                              : field.value
                                ? new Date(field.value)
                                : undefined
                          }
                          onDateChange={(date) => field.onChange(date ?? null)}
                          disabled={!isEdit}
                          dateFormat="dd/MM/yyyy"
                          toYear={new Date().getFullYear()}
                          calendarToDate={new Date()}
                          calendarDisabled={{ after: new Date() }}
                          popoverClassName="profile-overlay profile-calendar-popover"
                          calendarClassName="profile-calendar"
                          className="h-12 rounded-none bg-background px-3 py-0 font-normal"
                        />
                      )
                    }
                  />
                }
              />
              <div className="col-span-6 flex flex-col items-start gap-2 tablet-md:col-span-1">
                <TypographyMuted className="text-xs">
                  {tP("gender")}
                </TypographyMuted>
                <Controller
                  name="basicInfo.gender"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isEdit}
                    >
                      <SelectTrigger className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto">
                        <div className="flex min-w-0 items-center gap-2">
                          <LucideVenusAndMars className="size-[18px] shrink-0" />
                          <SelectValue placeholder={tP("gender")} />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="profile-overlay profile-select-content">
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

              <div className="col-span-6 flex flex-col items-start gap-2 tablet-md:col-span-1">
                <TypographyMuted className="text-xs">
                  {tP("locations")}
                </TypographyMuted>
                <Controller
                  name="basicInfo.location"
                  control={form.control}
                  render={({ field }) =>
                    !isEdit && !field.value?.trim() ? (
                      <MissingProfileFieldButton
                        label={tP("addMissingField", {
                          field: tP("locations"),
                        })}
                        onClick={() =>
                          beginEditingField("employee-location", true)
                        }
                      />
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isEdit}
                      >
                        <SelectTrigger
                          id="employee-location"
                          className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <LucideMapPin className="size-[18px] shrink-0" />
                            <SelectValue placeholder={tP("locations")} />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="profile-overlay profile-select-content">
                          {locationConstant.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }
                />
              </div>
              <LabelInput
                className="col-span-7 tablet-md:col-span-1"
                label={tP("email")}
                input={
                  !isEdit && !user.email?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", { field: tP("email") })}
                      onClick={() => beginEditingField("email")}
                    />
                  ) : (
                    <Input
                      placeholder={tP("email")}
                      id="email"
                      {...form.register("accountSetting.email")}
                      prefix={<LucideMail />}
                      disabled={!isEdit}
                    />
                  )
                }
              />
              <LabelInput
                className="col-span-5 tablet-md:col-span-1"
                label={tP("phoneNumber")}
                input={
                  !isEdit && !employee.phone?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("phoneNumber"),
                      })}
                      onClick={() => beginEditingField("phone")}
                    />
                  ) : (
                    <Input
                      placeholder={tP("phoneNumber")}
                      id="phone"
                      {...form.register("accountSetting.phone")}
                      prefix={<LucidePhone />}
                      disabled={!isEdit}
                    />
                  )
                }
              />

              <Controller
                name="basicInfo.isHide"
                control={form.control}
                render={({ field }) => {
                  const isVisible = !field.value;
                  return (
                    <div className="col-span-12 flex items-center justify-between gap-4 border border-border bg-muted/25 px-4 py-3 tablet-md:col-span-1">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center bg-foreground text-background">
                          {isVisible ? (
                            <LucideEye className="size-4" />
                          ) : (
                            <LucideEyeOff className="size-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {tP("profileVisibility")}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {isVisible
                              ? tP("visibleToCompanies")
                              : tP("hiddenFromCompanies")}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isVisible}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                        disabled={!isEdit}
                        aria-label={tP("profileVisibility")}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </section>

          {/* Professional Information Section */}
          <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              icon={<LucideBriefcaseBusiness />}
              title={tP("professionalInformation")}
            />

            <div className="grid w-full grid-cols-12 gap-x-4 gap-y-5 tablet-md:grid-cols-1">
              <div className="col-span-7 w-full space-y-1 tablet-md:col-span-1">
                <div className="flex items-center justify-between">
                  <TypographyMuted className="text-xs">
                    {tP("lookingForPosition")}
                  </TypographyMuted>
                  {isEdit && jobValue && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const result = await refineJob(
                          jobValue,
                          "jobTitle",
                          {
                            skills: skills.map((s) => s.name),
                            careerScopes: careerScopes.map((c) => c.name),
                          },
                          (text) =>
                            form.setValue("profession.job", text, {
                              shouldDirty: true,
                            }),
                        );
                        if (result) toast.success(tr("refinedSuccess"));
                      }}
                      disabled={jobLoading}
                      className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
                    >
                      {jobLoading ? (
                        <LucideLoader2 size={10} className="animate-spin" />
                      ) : (
                        <Sparkles size={10} />
                      )}
                      {tr("aiRefine")}
                    </Button>
                  )}
                </div>
                {!isEdit && !jobValue?.trim() ? (
                  <MissingProfileFieldButton
                    label={tP("addMissingField", {
                      field: tP("lookingForPosition"),
                    })}
                    onClick={() => beginEditingField("profession")}
                  />
                ) : (
                  <Input
                    placeholder={tP("lookingForPosition")}
                    id="profession"
                    {...form.register("profession.job")}
                    prefix={<LucideBriefcaseBusiness />}
                    disabled={!isEdit}
                  />
                )}
              </div>

              <div className="contents">
                {/* Year of Experience Section */}
                <LabelInput
                  className="col-span-5 tablet-md:col-span-1"
                  label={tP("yearOfExperience")}
                  input={
                    !isEdit && !expValue?.trim() ? (
                      <MissingProfileFieldButton
                        label={tP("addMissingField", {
                          field: tP("yearOfExperience"),
                        })}
                        onClick={() => beginEditingField("yearOfExperience")}
                      />
                    ) : (
                      <Input
                        placeholder={tP("yearOfExperience")}
                        id="yearOfExperience"
                        {...form.register("profession.yearOfExperience")}
                        prefix={<LucideBadgeCheck />}
                        disabled={!isEdit}
                      />
                    )
                  }
                />
                {/* Availability Section */}
                <div className="col-span-4 flex w-full flex-col items-start gap-2 tablet-md:col-span-1">
                  <TypographyMuted className="text-xs">
                    {tP("availability")}
                  </TypographyMuted>
                  <Controller
                    name="profession.availability"
                    control={form.control}
                    render={({ field }) =>
                      !isEdit && !field.value?.trim() ? (
                        <MissingProfileFieldButton
                          label={tP("addMissingField", {
                            field: tP("availability"),
                          })}
                          onClick={() =>
                            beginEditingField("availability", true)
                          }
                        />
                      ) : (
                        <CreatableCombobox
                          triggerId="availability"
                          options={availabilityConstant}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder={tP("availability")}
                          icon={<LucideClock3 />}
                          contentClassName="profile-overlay profile-command-popover"
                          disabled={!isEdit}
                        />
                      )
                    }
                  />
                </div>
              </div>

              {/* Work Mode and Notice Period Section */}
              <div className="contents">
                <div className="col-span-4 flex w-full flex-col items-start gap-2 tablet-md:col-span-1">
                  <TypographyMuted className="text-xs">
                    {tP("workMode")}
                  </TypographyMuted>
                  <Controller
                    name="profession.workMode"
                    control={form.control}
                    render={({ field }) =>
                      !isEdit && !field.value ? (
                        <MissingProfileFieldButton
                          label={tP("addMissingField", {
                            field: tP("workMode"),
                          })}
                          onClick={() => beginEditingField("work-mode", true)}
                        />
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                          disabled={!isEdit}
                        >
                          <SelectTrigger
                            id="work-mode"
                            className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <LucideMonitor className="size-[18px] shrink-0" />
                              <SelectValue
                                placeholder={tP("workModePlaceholder")}
                              />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="profile-overlay profile-select-content">
                            {workModeConstant.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }
                  />
                </div>
                <div className="col-span-4 flex w-full flex-col items-start gap-2 tablet-md:col-span-1">
                  <TypographyMuted className="text-xs">
                    {tP("noticePeriod")}
                  </TypographyMuted>
                  <Controller
                    name="profession.noticePeriod"
                    control={form.control}
                    render={({ field }) =>
                      !isEdit && !field.value ? (
                        <MissingProfileFieldButton
                          label={tP("addMissingField", {
                            field: tP("noticePeriod"),
                          })}
                          onClick={() =>
                            beginEditingField("notice-period", true)
                          }
                        />
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                          disabled={!isEdit}
                        >
                          <SelectTrigger
                            id="notice-period"
                            className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <LucideTimer className="size-[18px] shrink-0" />
                              <SelectValue
                                placeholder={tP("noticePeriodPlaceholder")}
                              />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="profile-overlay profile-select-content">
                            {noticePeriodConstant.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }
                  />
                </div>
              </div>

              {/* Portfolio URL and LinkedIn URL Section */}
              <div className="contents">
                <LabelInput
                  className="col-span-6 tablet-md:col-span-1"
                  label={tP("portfolioUrl")}
                  input={
                    <Controller
                      name="profession.portfolioUrl"
                      control={form.control}
                      render={({ field }) =>
                        !isEdit && !field.value?.trim() ? (
                          <MissingProfileFieldButton
                            label={tP("addMissingField", {
                              field: tP("portfolioUrl"),
                            })}
                            onClick={() => beginEditingField("portfolio-url")}
                          />
                        ) : (
                          <Input
                            id="portfolio-url"
                            placeholder="https://your-portfolio.com"
                            {...field}
                            value={field.value ?? ""}
                            prefix={<LucideGlobe />}
                            disabled={!isEdit}
                          />
                        )
                      }
                    />
                  }
                />
                <LabelInput
                  className="col-span-6 tablet-md:col-span-1"
                  label={tP("linkedinUrl")}
                  input={
                    <Controller
                      name="profession.linkedinUrl"
                      control={form.control}
                      render={({ field }) =>
                        !isEdit && !field.value?.trim() ? (
                          <MissingProfileFieldButton
                            label={tP("addMissingField", {
                              field: tP("linkedinUrl"),
                            })}
                            onClick={() => beginEditingField("linkedin-url")}
                          />
                        ) : (
                          <Input
                            id="linkedin-url"
                            placeholder="https://linkedin.com/in/yourname"
                            {...field}
                            value={field.value ?? ""}
                            prefix={<LucideLink2 />}
                            disabled={!isEdit}
                          />
                        )
                      }
                    />
                  }
                />
              </div>

              {/* Languages Section */}
              <div className="col-span-12 flex w-full flex-col items-start gap-2 tablet-md:col-span-1">
                <TypographyMuted className="text-xs">
                  {tP("languages")}
                </TypographyMuted>
                {!isEdit && (languagesValue ?? []).length === 0 ? (
                  <MissingProfileFieldButton
                    label={tP("addLanguage")}
                    onClick={() => {
                      enableEditMode();
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => setLangPopoverOpen(true));
                      });
                    }}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(languagesValue ?? []).map((lang) => (
                      <div
                        key={lang}
                        className="flex items-center gap-1 border border-border bg-muted/50 py-1 pl-3 pr-2"
                      >
                        <span className="text-xs font-medium text-primary">
                          {lang}
                        </span>
                        {isEdit && (
                          <LucideXCircle
                            className="cursor-pointer text-primary/60 hover:text-primary"
                            width="14px"
                            onClick={() => {
                              const updated = (languagesValue ?? []).filter(
                                (l) => l !== lang,
                              );
                              form.setValue("profession.languages", updated, {
                                shouldDirty: true,
                              });
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {isEdit && (
                  <Popover
                    open={langPopoverOpen}
                    onOpenChange={setLangPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full justify-start font-normal text-muted-foreground"
                      >
                        <LucidePlus />
                        {tP("addLanguage")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      sideOffset={8}
                      className="profile-overlay profile-command-popover w-[var(--radix-popover-trigger-width)] p-0"
                    >
                      <Command>
                        <CommandInput placeholder={tP("addLanguage")} />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languageConstant.map((lang) => (
                              <CommandItem
                                key={lang}
                                value={lang}
                                onSelect={() => {
                                  const current = languagesValue ?? [];
                                  const updated = current.includes(lang)
                                    ? current.filter((l) => l !== lang)
                                    : [...current, lang];
                                  form.setValue(
                                    "profession.languages",
                                    updated,
                                    { shouldDirty: true },
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    (languagesValue ?? []).includes(lang)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {lang}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Expected Salary Section */}
              <div className="col-span-12 flex w-full flex-col items-start gap-2 tablet-md:col-span-1">
                <TypographyMuted className="text-xs">
                  {tP("expectedSalary")}
                </TypographyMuted>
                {!isEdit && salaryMinValue == null && salaryMaxValue == null ? (
                  <MissingProfileFieldButton
                    label={tP("addMissingField", {
                      field: tP("expectedSalary"),
                    })}
                    onClick={() => beginEditingField("salary-min")}
                  />
                ) : (
                  <div className="grid w-full grid-cols-[160px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 tablet-sm:grid-cols-1">
                    <div className="min-w-0">
                      <Controller
                        name="profession.salaryCurrency"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? "USD"}
                            onValueChange={field.onChange}
                            disabled={!isEdit}
                          >
                            <SelectTrigger className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto">
                              <div className="flex min-w-0 items-center gap-2">
                                <LucideCircleDollarSign className="size-[18px] shrink-0" />
                                <SelectValue placeholder="USD" />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="profile-overlay profile-select-content">
                              {salaryCurrencyConstant.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <Controller
                        name="profession.expectedSalaryMin"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id="salary-min"
                            type="number"
                            placeholder={tP("salaryMin")}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value),
                              )
                            }
                            disabled={!isEdit}
                          />
                        )}
                      />
                    </div>
                    <TypographyMuted className="shrink-0 text-sm tablet-sm:hidden">
                      —
                    </TypographyMuted>
                    <div className="flex-1">
                      <Controller
                        name="profession.expectedSalaryMax"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id="salary-max"
                            type="number"
                            placeholder={tP("salaryMax")}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value),
                              )
                            }
                            disabled={!isEdit}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="col-span-12 flex w-full flex-col items-start gap-1 tablet-md:col-span-1">
                <div className="flex w-full items-center justify-between">
                  <TypographyMuted className="text-xs font-bold text-foreground">
                    {tP("description")}
                  </TypographyMuted>
                  {isEdit && descValue && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const result = await refineDesc(
                          descValue,
                          "summary",
                          {
                            jobTitle: jobValue,
                            skills: skills.map((s) => s.name),
                            experience: expValue,
                            availability: availValue,
                            careerScopes: careerScopes.map((c) => c.name),
                          },
                          (text) =>
                            form.setValue("profession.description", text, {
                              shouldDirty: true,
                            }),
                        );
                        if (result) toast.success(tr("refinedSuccess"));
                      }}
                      disabled={descLoading}
                      className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
                    >
                      {descLoading ? (
                        <LucideLoader2 size={10} className="animate-spin" />
                      ) : (
                        <Sparkles size={10} />
                      )}
                      {tr("aiRefine")}
                    </Button>
                  )}
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  {!isEdit && !descValue?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("description"),
                      })}
                      onClick={() => beginEditingField("description")}
                    />
                  ) : (
                    <Textarea
                      autoResize
                      placeholder={tP("description")}
                      id="description"
                      {...form.register("profession.description")}
                      disabled={!isEdit}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Experience Information Section */}
          {employee.experiences && (
            <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
              <SectionTitle
                icon={<LucideBriefcaseBusiness />}
                title={tP("experienceInformation")}
                action={
                  isEdit ? (
                    <div onClick={addNewExperience}>
                      <IconLabel
                        text={tP("addExperience")}
                        icon={<LucidePlus className="text-muted-foreground" />}
                        className="cursor-pointer"
                      />
                    </div>
                  ) : undefined
                }
              />
              {/* Experience Form Section */}
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
                            ) as unknown as Date) ?? new Date(),
                          data:
                            (form.watch(
                              `experiences.${index}.startDate`,
                            ) as unknown as Date) ?? new Date(),
                          onDataChange: (date) => {
                            form.setValue(
                              `experiences.${index}.startDate`,
                              date as unknown as Date,
                              { shouldDirty: true, shouldTouch: true },
                            );
                          },
                        }}
                        endDate={{
                          defaultValue:
                            (form.getValues(
                              `experiences.${index}.endDate`,
                            ) as unknown as Date) ?? new Date(),
                          data:
                            (form.watch(
                              `experiences.${index}.endDate`,
                            ) as unknown as Date) ?? new Date(),
                          onDataChange: (date) => {
                            form.setValue(
                              `experiences.${index}.endDate`,
                              date as unknown as Date,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              },
                            );
                          },
                        }}
                        onRemove={() => {
                          if (experienceId && isUuid(experienceId)) {
                            openRemoveExperienceOrEducationDialog(
                              "experience",
                              experienceId,
                            );
                          } else {
                            experienceFA.remove(index);
                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="flex w-full flex-col items-center justify-center p-3">
                    {/* Add New Experience Section */}
                    <Image
                      alt="empty"
                      src={addNewExperienceSvg}
                      className="animate-float size-60"
                    />
                    <Button
                      className="text-xs"
                      variant={"secondary"}
                      type="button"
                      onClick={() => {
                        setIsEdit(true);
                        addNewExperience();
                      }}
                    >
                      {tP("addExperienceBackground")}
                      <LucidePlus />
                    </Button>
                  </div>
                )}
              </div>

              {/* Remove Experience Dialog Section */}
              <RemoveAlertDialog
                type="experience"
                openDialog={openRemoveExpOrEduDialogState.experience.open}
                setOpenDialog={(open) =>
                  setOpenRemoveExpOrEduDialogState((prev) => ({
                    ...prev,
                    experience: {
                      ...prev.experience,
                      open,
                    },
                  }))
                }
                onNoClick={disableEditMode}
                onYesClick={() => {
                  const currentExperienceID =
                    openRemoveExpOrEduDialogState.experience.id;
                  if (currentExperienceID) {
                    removeExperience(currentExperienceID);
                    closeRemoveExperienceOrEducationDialog("experience");
                  }
                }}
              />
            </section>
          )}

          {/* Education Information Section */}
          {employee.educations && (
            <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
              <SectionTitle
                icon={<LucideGraduationCap />}
                title={tP("educationInformation")}
                action={
                  isEdit ? (
                    <div onClick={addNewEducation}>
                      <IconLabel
                        text={tP("addEducation")}
                        icon={<LucidePlus className="text-muted-foreground" />}
                        className="cursor-pointer"
                      />
                    </div>
                  ) : undefined
                }
              />

              {/* Education Form Section */}
              <div className="flex flex-col items-start gap-5">
                {educationFA.fields.length > 0 ? (
                  educationFA.fields.map((row, index) => {
                    const educationId = form.watch(`educations.${index}.id`) as
                      string | undefined;

                    return (
                      <EmployeeEducationForm
                        key={row.id}
                        index={index}
                        form={form}
                        educationIndex={index}
                        educationUUID={educationId ?? ""}
                        isEdit={isEdit}
                        school={form.watch(`educations.${index}.school`)}
                        degree={form.watch(`educations.${index}.degree`)}
                        year={{
                          defaultValue:
                            (form.getValues(
                              `educations.${index}.year`,
                            ) as unknown as Date) ?? new Date(),

                          data:
                            (form.getValues(
                              `educations.${index}.year`,
                            ) as unknown as Date) ?? new Date(),
                          onDataChange: (date) => {
                            form.setValue(
                              `educations.${index}.year`,
                              date as unknown as number,
                              { shouldDirty: true, shouldTouch: true },
                            );
                          },
                        }}
                        onRemove={() => {
                          if (educationId && isUuid(educationId)) {
                            openRemoveExperienceOrEducationDialog(
                              "education",
                              educationId,
                            );
                          } else {
                            educationFA.remove(index);
                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="flex w-full flex-col items-center justify-center p-3">
                    {/* Add New Education Section */}
                    <Image
                      alt="empty"
                      src={addNewEducationSvg}
                      className="animate-float size-60"
                    />
                    <Button
                      variant={"secondary"}
                      className="text-xs"
                      type="button"
                      onClick={() => {
                        setIsEdit(true);
                        addNewEducation();
                      }}
                    >
                      {tP("addEducationBackground")}
                      <LucidePlus />
                    </Button>
                  </div>
                )}
              </div>

              {/* Remove Education Dialog Section */}
              <RemoveAlertDialog
                type="education"
                openDialog={openRemoveExpOrEduDialogState.education.open}
                setOpenDialog={(open) =>
                  setOpenRemoveExpOrEduDialogState((prev) => ({
                    ...prev,
                    education: { ...prev.education, open: open },
                  }))
                }
                onNoClick={disableEditMode}
                onYesClick={() => {
                  const currentEducationID =
                    openRemoveExpOrEduDialogState.education.id;
                  if (currentEducationID) {
                    removeEducation(currentEducationID);
                    closeRemoveExperienceOrEducationDialog("education");
                  }
                }}
              />
            </section>
          )}
        </div>

        {/* RIGHT Side Section*/}
        <aside className="profile-side-column flex min-w-0 flex-col gap-5">
          {/* Skill Section*/}
          <section className="profile-section flex flex-col items-start gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <div className="w-full">
              <SectionTitle icon={<LucideZap />} title={tP("skillsSection")} />
            </div>

            {/* Skil List Section */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div>
                          <Tag
                            label={skill.name}
                            neutral
                            className="!rounded-none border border-border hover:shadow-none"
                          />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <TypographySmall>{skill.description}</TypographySmall>
                      </HoverCardContent>
                    </HoverCard>
                    {isEdit && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="inline-flex items-center justify-center"
                      >
                        <LucideXCircle className="text-red-500" width="18px" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex w-full items-center justify-center">
                {/* No Skill Section */}
                <TypographyMuted className="text-sm">
                  {tP("noSkillAvailable")}
                </TypographyMuted>
              </div>
            )}

            {/* Add New Skill Section */}
            {(isEdit || employee.skills.length === 0) && (
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
                    {tP("addNewSkill")}
                    <LucidePlus />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="profile-overlay profile-form-popover flex w-[var(--radix-popper-anchor-width)] flex-col items-end gap-3"
                >
                  <Input
                    placeholder={tP("enterYourSkill")}
                    value={skillInput ?? ""}
                    onChange={(e) => setSkillInput(e.target.value)}
                  />
                  <Textarea
                    autoResize
                    className="min-h-20 w-full"
                    placeholder={tP("skillDescriptionPlaceholder")}
                    value={skillDescriptionInput}
                    onChange={(e) => setSkillDescriptionInput(e.target.value)}
                  />
                  <div className="grid w-full grid-cols-2 gap-2 [&>button]:w-full [&>button]:text-xs">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setOpenSkillPopOver(false)}
                    >
                      {tP("cancel")}
                    </Button>
                    <Button
                      onClick={() => {
                        if (employee.skills.length === 0) {
                          setIsEdit(true);
                          addNewSkills();
                        } else {
                          addNewSkills();
                        }
                      }}
                      type="button"
                    >
                      {tP("save")}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </section>

          {/* Career Scopes Section */}
          <section className="profile-section flex flex-col items-start gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <div className="w-full">
              <SectionTitle
                icon={<LucideCompass />}
                title={tP("careerScopesSection")}
              />
            </div>

            {/* Career Scopes List Section */}
            <div className="flex w-full flex-wrap gap-3">
              {careerScopes.length > 0 ? (
                careerScopes.map((career, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div>
                          <Tag
                            label={career.name}
                            neutral
                            className="!rounded-none border border-border hover:shadow-none"
                          />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <TypographySmall>
                          {career.description
                            ? career.description
                            : career.name}
                        </TypographySmall>
                      </HoverCardContent>
                    </HoverCard>

                    {isEdit && (
                      <button
                        type="button"
                        onClick={() => removeCareerScope(career.name)}
                        className="inline-flex items-center justify-center"
                      >
                        <LucideXCircle className="text-red-500" width="18px" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex w-full items-center justify-center">
                  {/* No CareerScopes Section */}
                  <TypographyMuted className="text-sm">
                    {tP("noCareerScopeAvailable")}
                  </TypographyMuted>
                </div>
              )}
            </div>

            {/* CareerScopes List Section */}
            {(isEdit || employee.careerScopes.length === 0) && (
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
                      onClick={() => {
                        if (!getAllCareerScopesStore.careerScopes?.length)
                          getAllCareerScopesStore.getAllCareerScopes();
                      }}
                    >
                      {careerScopeInput
                        ? getAllCareerScopesStore.careerScopes?.find(
                            (c) => c.name === careerScopeInput.name,
                          )?.name
                        : tP("selectCareers")}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="profile-overlay profile-command-popover w-[var(--radix-popper-anchor-width)] p-0"
                  >
                    <Command>
                      <CommandInput
                        placeholder={tP("selectCareers")}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          {getAllCareerScopesStore.loading
                            ? tCommon("loadingCareer")
                            : tCommon("noCareerFound")}
                        </CommandEmpty>
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

                {/* Add New CareerScopes Section */}
                <Button
                  variant="secondary"
                  className="w-full text-xs"
                  type="button"
                  onClick={() => {
                    if (employee.careerScopes.length === 0) {
                      setIsEdit(true);
                      addNewCareerScope();
                    } else {
                      addNewCareerScope();
                    }
                  }}
                >
                  <LucidePlus />
                  {tP("addNewCareerScope")}
                </Button>
              </>
            )}
          </section>

          {/* References Section */}
          <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              icon={<LucideFileText />}
              title={tP("referencesInformation")}
            />
            <div className="flex w-full flex-col items-start gap-5 [&>div]:w-full">
              {/* Resume Section */}
              <div className="flex items-center justify-between border border-border bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LucideFileText strokeWidth={"1.3px"} />
                  <TypographyMuted>
                    {resumeFile
                      ? resumeFile.name
                      : employee.resume
                        ? extractCleanFilename(employee.resume)
                        : tP("addYourResume")}
                  </TypographyMuted>
                  <input
                    type="file"
                    accept="application/pdf,.doc,.docx"
                    className="hidden"
                    ref={resumeInputRef}
                    onChange={(e) => handleFileChange(e, "resume")}
                  />
                </div>

                {/* Edit Resume Section */}
                <div className="flex items-center gap-1">
                  {(isEdit || !employee.resume) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (!employee.resume) {
                          setIsEdit(true);
                          resumeInputRef.current?.click();
                        } else {
                          resumeInputRef.current?.click();
                        }
                      }}
                    >
                      <LucideEdit />
                    </Button>
                  )}

                  {/* View Resume Section */}
                  {employee.resume && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (employee.resume)
                          setPreviewReferenceUrl(
                            API_GET_EMP_DOCUMENT_URL(employee.id, "resume"),
                          );
                        setPreviewReferenceType("resume");
                        setOpenReferencePreview(true);
                      }}
                      disabled={!employee.resume}
                    >
                      <LucideEye />
                    </Button>
                  )}

                  {/* Remove and Download Resume Section */}
                  {isEdit && employee.resume ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="bg-red-100 text-red-500"
                      onClick={() => setOpenRemoveResumeDialog(true)}
                    >
                      <LucideTrash2 />
                    </Button>
                  ) : (
                    employee.resume && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (employee.resume) {
                            downloadFileFromUrl(
                              API_GET_EMP_DOCUMENT_URL(employee.id, "resume"),
                              extractCleanFilename(employee.resume),
                            );
                          }
                        }}
                        disabled={!employee.resume}
                      >
                        <LucideDownload />
                      </Button>
                    )
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

              {/* CoverLetter Section */}
              <div className="flex items-center justify-between border border-border bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LucideFileText strokeWidth={"1.3px"} />
                  <TypographyMuted>
                    {coverLetterFile
                      ? coverLetterFile.name
                      : employee.coverLetter
                        ? extractCleanFilename(employee.coverLetter)
                        : tP("addYourCoverLetter")}
                  </TypographyMuted>
                  <input
                    type="file"
                    accept="application/pdf,.doc,.docx"
                    className="hidden"
                    ref={coverLetterInputRef}
                    onChange={(e) => handleFileChange(e, "coverLetter")}
                  />
                </div>

                {/* Edit CoverLetter Section */}
                <div className="flex items-center gap-1">
                  {(isEdit || !employee.coverLetter) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (!employee.coverLetter) {
                          setIsEdit(true);
                          coverLetterInputRef.current?.click();
                        } else {
                          coverLetterInputRef.current?.click();
                        }
                      }}
                    >
                      <LucideEdit />
                    </Button>
                  )}

                  {/* View CoverLetter Section */}
                  {employee.coverLetter && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (employee.coverLetter)
                          setPreviewReferenceUrl(
                            API_GET_EMP_DOCUMENT_URL(
                              employee.id,
                              "cover-letter",
                            ),
                          );
                        setPreviewReferenceType("coverletter");
                        setOpenReferencePreview(true);
                      }}
                      disabled={!employee.coverLetter}
                    >
                      <LucideEye />
                    </Button>
                  )}

                  {/* Remove and Download CoverLetter Section */}
                  {isEdit && employee.coverLetter ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="bg-red-100 text-red-500"
                      onClick={() => setOpenRemoveCoverLetterDialog(true)}
                    >
                      <LucideTrash2 />
                    </Button>
                  ) : (
                    employee.coverLetter && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (employee.coverLetter) {
                            downloadFileFromUrl(
                              API_GET_EMP_DOCUMENT_URL(
                                employee.id,
                                "cover-letter",
                              ),
                              extractCleanFilename(employee.coverLetter),
                            );
                          }
                        }}
                        disabled={!employee.coverLetter}
                      >
                        <LucideDownload />
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Remove CoverLetter Dialog Section */}
            <RemoveAlertDialog
              type="coverLetter"
              openDialog={openRemoveCoverLetterDialog}
              setOpenDialog={setOpenRemoveCoverLetterDialog}
              onNoClick={disableEditMode}
              onYesClick={removeCoverLetter}
            />

            {/* Reference (Resume and CoverLetter) Preview Dialog Section */}
            <ReferencePreviewDialog
              openRefPreview={openReferencePreview}
              setOpenRefPreview={setOpenReferencePreview}
              previewRefType={previewReferenceType}
              referenceUrl={previewReferenceUrl}
              employeeName={employee.username ?? ""}
            />
          </section>

          {/* Socials Section */}
          <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              icon={<LucideGlobe />}
              title={tP("socialInformation")}
            />

            {/* Social List Section */}
            {socials && socials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socials.map((item, index) => (
                  <div
                    className="flex max-w-full items-center gap-1.5"
                    key={index}
                  >
                    <Link
                      href={item.url}
                      className="inline-flex max-w-[200px] items-center gap-1.5 overflow-hidden border border-border bg-muted/50 px-3 py-1.5 text-foreground hover:bg-muted sm:max-w-[260px]"
                    >
                      <span className="flex-shrink-0">
                        {getSocialPlatformTypeIcon(item.platform as TPlatform)}
                      </span>
                      <span className="truncate text-sm">{item.platform}</span>
                    </Link>
                    {isEdit && (
                      <LucideXCircle
                        className="flex-shrink-0 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                        size={18}
                        onClick={() => removeSocial(item.platform as TPlatform)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex w-full items-center justify-center pt-2">
                {/* No Social Section */}
                <TypographyMuted className="text-sm">
                  {tP("noSocialAvailable")}
                </TypographyMuted>
              </div>
            )}

            {/* Social Input Platform and Link Section */}
            {(isEdit || employee.socials.length === 0) && (
              <div>
                {isEdit && (
                  <div className="mt-3 flex w-full flex-col items-start gap-4 overflow-hidden border border-border p-4">
                    <div className="flex w-full flex-col gap-3">
                      <div className="flex w-full flex-shrink-0 flex-col items-start gap-1">
                        <TypographyMuted className="text-xs">
                          {tP("platform")}
                        </TypographyMuted>
                        <Select
                          onValueChange={(value: string) =>
                            setSocialInput((prev) => ({
                              ...(prev ?? { id: "", platform: "", url: "" }),
                              platform: value,
                            }))
                          }
                          value={socialInput?.platform ?? ""}
                        >
                          <SelectTrigger
                            className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto"
                            ref={socialSelectPlatformRef}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-4">
                                {socialInput?.platform ? (
                                  getSocialPlatformTypeIcon(
                                    socialInput.platform as TPlatform,
                                  )
                                ) : (
                                  <LucideGlobe />
                                )}
                              </span>
                              <SelectValue placeholder={tP("platform")} />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="profile-overlay profile-select-content">
                            {platformConstant.map((platform) => (
                              <SelectItem
                                key={platform.id}
                                value={platform.value}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-4">
                                    {getSocialPlatformTypeIcon(
                                      platform.value as TPlatform,
                                    )}
                                  </span>
                                  {platform.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="min-w-0 flex-1">
                        <LabelInput
                          label={tP("link")}
                          input={
                            <Input
                              className="w-full"
                              placeholder="https://example.com/profile"
                              id="link"
                              name="link"
                              value={socialInput?.url ?? ""}
                              onChange={(e) =>
                                setSocialInput((prev) => ({
                                  ...(prev ?? {
                                    id: "",
                                    platform: "",
                                    url: "",
                                  }),
                                  url: e.target.value,
                                }))
                              }
                              prefix={<LucideLink2 />}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Add New Social Section */}
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 w-full text-xs"
                  onClick={() => {
                    const openPlatformSelect = () => {
                      const el = socialSelectPlatformRef.current;
                      if (!el) return;

                      el.focus();
                      el.dispatchEvent(
                        new KeyboardEvent("keydown", {
                          key: "ArrowDown",
                          bubbles: true,
                        }),
                      );
                    };

                    setIsEdit(true);

                    const hasDraft =
                      !!socialInput?.platform?.trim() ||
                      !!socialInput?.url?.trim();

                    if (hasDraft) {
                      const added = addNewSocial();
                      if (!added) return;
                    }

                    setSocialInput({ platform: "", url: "" });

                    requestAnimationFrame(() => {
                      openPlatformSelect();
                    });
                  }}
                >
                  <LucidePlus />
                  {tP("addNewSocial")}
                </Button>
              </div>
            )}
          </section>

          {/* Authentication Section */}
          <section className="profile-section flex flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              icon={<LucideSettings />}
              title={tP("authentication")}
            />

            <div className="flex w-full flex-col items-start gap-3">
              {/* Google, Facebook, LinkedIn and Github Methods Section */}
              {loginMethodConstant.map((item) => (
                <div
                  className="flex w-full cursor-pointer items-center justify-between border border-border bg-muted/35 px-3 py-3"
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
                    <div className="cursor-pointer border border-red-500/20 bg-red-100 px-3 py-1 text-red-500 dark:bg-red-950/30">
                      <TypographySmall className="text-xs font-medium">
                        {tP("disconnect")}
                      </TypographySmall>
                    </div>
                  ) : (
                    <div className="cursor-pointer border border-blue-500/20 bg-blue-100 px-3 py-1 text-blue-500 dark:bg-blue-950/30">
                      <TypographySmall className="text-xs font-medium">
                        {tP("connect")}
                      </TypographySmall>
                    </div>
                  )}
                </div>
              ))}

              {/* Email/Password Method Section */}
              <div className="flex w-full cursor-pointer items-center justify-between border border-border bg-muted/35 px-3 py-3">
                <div className="flex items-center gap-2">
                  <LucideMail className="mx-1" strokeWidth={1.5} />
                  <TypographySmall>{tP("email")}</TypographySmall>
                </div>
                {user.email ? (
                  <div className="cursor-pointer border border-red-500/20 bg-red-100 px-3 py-1 text-red-500 dark:bg-red-950/30">
                    <TypographySmall className="text-xs font-medium">
                      {tP("disconnect")}
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="cursor-pointer border border-blue-500/20 bg-blue-100 px-3 py-1 text-blue-500 dark:bg-blue-950/30">
                    <TypographySmall className="text-xs font-medium">
                      {tP("connect")}
                    </TypographySmall>
                  </div>
                )}
              </div>

              {/* PhoneOTP Method Section */}
              <div className="flex w-full cursor-pointer items-center justify-between border border-border bg-muted/35 px-3 py-3">
                <div className="flex items-center gap-2">
                  <LucidePhone className="mx-1" strokeWidth={1.5} />
                  <TypographySmall>{tP("phoneOtp")}</TypographySmall>
                </div>
                {user.phone ? (
                  <div className="cursor-pointer border border-red-500/20 bg-red-100 px-3 py-1 text-red-500 dark:bg-red-950/30">
                    <TypographySmall className="text-xs font-medium">
                      {tP("disconnect")}
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="cursor-pointer border border-blue-500/20 bg-blue-100 px-3 py-1 text-blue-500 dark:bg-blue-950/30">
                    <TypographySmall className="text-xs font-medium">
                      {tP("connect")}
                    </TypographySmall>
                  </div>
                )}
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Loading Dialog Section */}
      <LoadingDialog
        loading={updateProfileLoadingState}
        title={loadingMessage || tP("updatingEmployee")}
        subTitle={tP("pleaseWaitEmployee")}
      />

      {/* Profile Popup Dialog Section */}
      <ImagePopup
        open={openAvatarPopup}
        setOpen={setOpenAvatarPopup}
        image={avatarPreview ?? employee.avatar!}
      />
    </form>
  );
}
