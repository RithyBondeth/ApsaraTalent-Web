"use client";

import EmployeeEducationForm from "@/components/employee/profile/education-form";
import EmployeeExperienceForm from "@/components/employee/profile/experience-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import AvatarCropDialog from "@/components/utils/dialogs/avatar-crop-dialog";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import ReferencePreviewDialog from "@/components/utils/dialogs/reference-preview-dialog";
import RemoveAlertDialog from "@/components/utils/dialogs/remove-alert-dialog";
import IconLabel from "@/components/utils/icon-label";
import ImagePopup from "@/components/utils/image-popup";
import LabelInput from "@/components/utils/label-input";
import Tag from "@/components/utils/tag";
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
import { genderConstant, locationConstant, loginMethodConstant, platformConstant } from "@/utils/constants/ui.constant";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { capitalizeWords } from "@/utils/functions/capitalize-words";
import { isUuid } from "@/utils/extensions/check-uuid";
import { extractCleanFilename } from "@/utils/functions/extract-clean-filename";
import { parseMaybeDate } from "@/utils/functions/parse-maybe-date";
import {
  ICareerScopes,
  ISkill,
  ISocial,
} from "@/utils/interfaces/user-interface/employee.interface";
import { TPlatform } from "@/utils/types/platform.type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  LucideAlarmCheck,
  LucideBriefcaseBusiness,
  LucideCamera,
  LucideCircleCheck,
  LucideCompass,
  LucideDownload,
  LucideEdit,
  LucideEye,
  LucideFileText,
  LucideGlobe,
  LucideGraduationCap,
  LucideLink2,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideSettings,
  LucideTrash2,
  LucideUser,
  LucideXCircle,
  LucideZap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { employeeFormSchema, TEmployeeProfileForm } from "./validation";
import EmployeeProfilePageLoadingSkeleton from "./skeleton";
import { addNewEducationSvgImage, addNewExperienceSvgImage } from "@/utils/constants/asset.constant";

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]">{icon}</span>
      </div>
      <h3 className="font-semibold text-base">{title}</h3>
    </div>
  );
}

export default function EmployeeProfilePage() {
  /* -------------------------------- All States -------------------------------- */
  // Util States
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
  const { user, loading, getCurrentUser } = useGetCurrentUserStore();
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

  /* ------------------------------- Profile Form ------------------------------- */
  // React Hook Form: Employee Profile Schema
  const form = useForm<TEmployeeProfileForm>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      basicInfo: {
        firstname: "",
        lastname: "",
        dob: null,
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

  /* --------------------------------- Effects ---------------------------------- */
  // Get Current User Effect
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Avatar Preview
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(employee?.avatar);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile, employee?.avatar]);

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
  }, [user, employee, form]);

  /* -------------------------------- Methods --------------------------------- */
  // ── Edit Mode Methods ────────────────────────────────────────────────────
  // ── Close All The Dialogs ─────────────────────────────────────────
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

  // ── Enable Edit Mode ─────────────────────────────────────────
  const enableEditMode = () => {
    getAllCareerScopesStore.getAllCareerScopes();
    setIsEdit(true);
  };

  // ── Disable Edit Mode ─────────────────────────────────────────
  const disableEditMode = async () => {
    await getCurrentUser();
    setAvatarFile(null);
    setResumeFile(null);
    setCoverLetterFile(null);
    closeAllDialogs();
    setIsEdit(false);
  };

  // ── Open RemoveExperienceOrEducation Dialog ─────────────────────────────────────────
  const openRemoveExperienceOrEducationDialog = (
    type: "experience" | "education",
    id: string,
  ) => {
    setOpenRemoveExpOrEduDialogState((prev) => ({
      ...prev,
      [type]: { open: true, id },
    }));
  };

  // ── Close RemoveExperienceOrEducation Dialog ─────────────────────────────────────────
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

    toast.success("Remove Resume Successfully!");
  };

  // ── API: Remove CoverLetter ─────────────────────────────────────────
  const removeCoverLetter = async () => {
    if (employee)
      await removeEmpCoverLetterStore.removeEmpCoverLetter(employee.id);

    await disableEditMode();

    toast.success("Remove CoverLetter Successfully!");
  };

  // ── API: Remove Avatar ─────────────────────────────────────────
  const removeAvatar = async () => {
    if (employee) await removeEmpAvatarStore.removeEmpAvatar(employee.id);

    await disableEditMode();

    toast.success("Remove Avatar Successfully!");
  };

  // ── Handle Click Avatar Popup ─────────────────────────────────────────
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

    toast.success("Remove Experience Successfully!");
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

    toast.success("Remove Education Successfully!");
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
      toast.error("Duplicated Skill", {
        description: "Please input another skill.",
        action: { label: "Try again", onClick: () => {} },
      });
      setSkillInput(null);
      setOpenSkillPopOver(false);
      return;
    }

    const updatedSkills: ISkill[] = [
      ...skills,
      { id: "", name: trimmed, description: "" },
    ];
    setSkills(updatedSkills);

    form.setValue("skills", updatedSkills, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSkillInput(null);
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
      toast.error("Duplicate Social", {
        description: "This social platform already exists.",
        action: { label: "Try again", onClick: () => {} },
      });
      return false;
    }

    const urlExists = socials.some(
      (s) => (s.url ?? "").trim().toLowerCase() === normalizedUrl,
    );

    if (urlExists) {
      toast.error("Duplicate URL", {
        description: "This social link already exists.",
        action: { label: "Try again", onClick: () => {} },
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
      toast.error("Duplicated Career", {
        description: "Please select another career.",
        action: { label: "Try again", onClick: () => {} },
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
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "resume" | "coverLetter",
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (type === "avatar") {
      const previewUrl = URL.createObjectURL(file);

      setCropImageUrl(previewUrl);
      setOpenCropDialog(true);

      event.target.value = "";
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
      toast.error("Download failed", {
        description: "Unable to download the file. Please try again.",
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
              (updateBody as Record<string, unknown>).yearsOfExperience = num;
            }
          } else {
            (updateBody as Record<string, unknown>)[key] = (
              data.profession as Record<string, unknown>
            )?.[key];
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

        if (deleteSkillIds.length > 0) {
          updateBody.skillIdsToDelete = deleteSkillIds;
        }
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

        if (deleteCareerScopeIds.length > 0) {
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
        }
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
        toast.info("No Changes Detected.");
        return;
      }

      await Promise.all(uploadTasks);

      /* ------------------------ API UPDATE ------------------------ */
      if (hasUpdateBodyChanges) {
        await updateOneEmpStore.updateOneEmployee(employee.id, updateBody);
      }

      await getCurrentUser();
      setIsEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Error!", {
        description: "Failed to update employee profile.",
      });
    }
  };

  // ── handleSubmit: Submit Employee Profile Form ─────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.setValue("skills", skills);
    form.setValue("careerScopes", careerScopes);
    form.setValue("socials", socials);

    if (avatarFile)
      form.setValue("basicInfo.avatar", avatarFile, { shouldDirty: true });
    if (resumeFile)
      form.setValue("references.resume", resumeFile, { shouldDirty: true });
    if (coverLetterFile)
      form.setValue("references.coverLetter", coverLetterFile, {
        shouldDirty: true,
      });

    form.handleSubmit(onSubmit, (errors) => console.log("RHF errors:", errors))(
      e,
    );
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
    ? "Removing avatar..."
    : removeEmpResumeStore.loading
      ? "Removing resume..."
      : removeEmpCoverLetterStore.loading
        ? "Removing cover letter..."
        : removeEmpExperieceStore.loading
          ? "Removing experience..."
          : removeEmpEducationStore.loading
            ? "Removing education..."
            : uploadAvatarEmpStore.loading
              ? "Uploading avatar..."
              : uploadResumeEmpStore.loading
                ? "Uploading resume..."
                : uploadCoverLetterEmpStore.loading
                  ? "Uploading cover letter..."
                  : updateOneEmpStore.loading
                    ? "Updating employee profile..."
                    : "";

  if (loading) return <EmployeeProfilePageLoadingSkeleton />;

  /* -------------------------------- Empty State ------------------------------ */
  if (!user || !employee) return null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <form className="!min-w-full flex flex-col gap-5 overflow-x-hidden" onSubmit={handleSubmit}>
      <LoadingDialog
        loading={updateProfileLoadingState}
        title={loadingMessage || "Updating employee profile..."}
        subTitle="Please wait while we save your profile changes."
      />

      {/* Header Section*/}
      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        {/* Gradient Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-primary to-primary/60 relative overflow-hidden">
          <div className="absolute -top-6 right-10 size-36 rounded-full bg-white/5" />
          <div className="absolute top-4 right-32 size-20 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 right-4 size-24 rounded-full bg-white/5" />

          {/* Edit/Save/Cancel buttons — top-right of banner on desktop */}
          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-3">
            {isEdit ? (
              <>
                <Button type="submit" className="text-xs">
                  {updateProfileLoadingState ? "Updating..." : "Save"}{" "}
                  <LucideCircleCheck />
                </Button>
                <Button type="button" className="text-xs" onClick={disableEditMode}>
                  Cancel
                  <LucideXCircle />
                </Button>
              </>
            ) : (
              <Button type="button" className="text-xs" onClick={enableEditMode}>
                Edit Profile
                <LucideEdit />
              </Button>
            )}
          </div>
        </div>

        {/* Avatar + name area */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar with overlap */}
            <div
              className="relative -mt-10 sm:-mt-12 flex-shrink-0"
              onClick={(e) => {
                if (!isEdit && employee.avatar) handleClickAvatarPopup(e);
              }}
            >
              <Avatar className="size-20 sm:size-24 ring-[3px] ring-card shadow-xl" rounded="md">
                <AvatarImage src={avatarPreview} />
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

              {/* Avatar Crop Dialog Section */}
              <AvatarCropDialog
                title={`Crop ${employee.username ?? ""} Avatar`}
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

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "avatar")}
              aria-label="Upload avatar image"
            />

            {/* Name + job title */}
            <div className="flex flex-col items-start gap-1 pt-2 tablet-md:items-center tablet-md:pt-0 flex-1">
              <h2 className="text-xl font-bold leading-tight">{employee.username}</h2>
              <p className="text-sm text-muted-foreground">{employee.job}</p>
            </div>

            {/* Edit/Save/Cancel buttons — visible only on mobile (stacked below name) */}
            <div className="flex sm:hidden items-center gap-3 tablet-md:w-full tablet-md:justify-center">
              {isEdit ? (
                <>
                  <Button type="submit" className="text-xs">
                    {updateProfileLoadingState ? "Updating..." : "Save"}{" "}
                    <LucideCircleCheck />
                  </Button>
                  <Button type="button" className="text-xs" onClick={disableEditMode}>
                    Cancel
                    <LucideXCircle />
                  </Button>
                </>
              ) : (
                <Button type="button" className="text-xs" onClick={enableEditMode}>
                  Edit Profile
                  <LucideEdit />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* LEFT Side Section */}
        <div className="w-[60%] min-w-0 flex flex-col gap-5">
          {/* Personal Information Section */}
          <div className="w-full flex flex-col items-stretch gap-5 bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 overflow-hidden">
            <SectionTitle icon={<LucideUser />} title="Personal Information" />

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
                label="Date of Birth"
                input={
                  <Controller
                    name="basicInfo.dob"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        type="date"
                        id="dob"
                        placeholder="Date of Birth"
                        disabled={!isEdit}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : (field.value ?? "")
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : null,
                          )
                        }
                      />
                    )}
                  />
                }
              />

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
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
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
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
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

          {/* Professional Information Section */}
          <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-stretch gap-5 overflow-hidden">
            <SectionTitle icon={<LucideBriefcaseBusiness />} title="Professional Information" />

            <div className="flex flex-col items-start gap-5">
              <LabelInput
                label="Looking for position"
                input={
                  <Input
                    placeholder="Looking for position"
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

          {/* Experience Information Section */}
          {employee.experiences && (
            <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-stretch gap-5 overflow-hidden">
              <div className="flex items-center justify-between gap-2.5 mb-0 pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]"><LucideBriefcaseBusiness /></span>
                  </div>
                  <h3 className="font-semibold text-base">Experience Information</h3>
                </div>
                {isEdit && (
                  <div onClick={addNewExperience}>
                    <IconLabel
                      text="Add Experience"
                      icon={<LucidePlus className="text-muted-foreground" />}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
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
                  <div className="w-full flex flex-col items-center justify-center p-3">
                    {/* Add New Experience Section */}
                    <Image
                      alt="empty"
                      src={addNewExperienceSvgImage}
                      className="size-60 animate-float"
                    />
                    <Button
                      className="text-xs"
                      variant={"secondary"}
                      onClick={() => {
                        setIsEdit(true);
                        addNewExperience();
                      }}
                    >
                      Add Your Experience Background
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
            </div>
          )}

          {/* Education Information Section */}
          {employee.educations && (
            <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-stretch gap-5 overflow-hidden">
              <div className="flex items-center justify-between gap-2.5 mb-0 pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]"><LucideGraduationCap /></span>
                  </div>
                  <h3 className="font-semibold text-base">Education Information</h3>
                </div>
                {isEdit && (
                  <div onClick={addNewEducation}>
                    <IconLabel
                      text="Add Education"
                      icon={<LucidePlus className="text-muted-foreground" />}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Education Form Section */}
              <div className="flex flex-col items-start gap-5">
                {educationFA.fields.length > 0 ? (
                  educationFA.fields.map((row, index) => {
                    const educationId = form.watch(`educations.${index}.id`) as
                      | string
                      | undefined;

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
                  <div className="w-full flex flex-col items-center justify-center p-3">
                    {/* Add New Education Section */}
                    <Image
                      alt="empty"
                      src={addNewEducationSvgImage}
                      className="size-60 animate-float"
                    />
                    <Button
                      variant={"secondary"}
                      className="text-xs"
                      onClick={() => {
                        setIsEdit(true);
                        addNewEducation();
                      }}
                    >
                      Add Your Education Background
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
            </div>
          )}
        </div>

        {/* RIGHT Side Section*/}
        <div className="w-[40%] min-w-0 flex flex-col gap-5">
          {/* Skill Section*/}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-start gap-5 overflow-hidden">
            <div className="w-full">
              <SectionTitle icon={<LucideZap />} title="Skills" />
            </div>

            {/* Skil List Section */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div>
                          <Tag label={skill.name} />
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
              <div className="w-full flex items-center justify-center">
                {/* No Skill Section */}
                <TypographyMuted className="text-sm">
                  No Skill Avaliable
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
                    Add New Skill
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
                      type="button"
                      onClick={() => setOpenSkillPopOver(false)}
                    >
                      Cancel
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
                      Save
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Career Scopes Section*/}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-start gap-5 overflow-hidden">
            <div className="w-full">
              <SectionTitle icon={<LucideCompass />} title="Career Scopes" />
            </div>

            {/* Career Scopes List Section*/}
            <div className="w-full flex flex-wrap gap-3">
              {careerScopes.length > 0 ? (
                careerScopes.map((career, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div>
                          <Tag label={career.name} />
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
                <div className="w-full flex items-center justify-center">
                  {/* No CareerScopes Section */}
                  <TypographyMuted className="text-sm">
                    No CareerScope Avaliable
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
                        getAllCareerScopesStore.getAllCareerScopes();
                      }}
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
                        <CommandEmpty>
                          {getAllCareerScopesStore.loading
                            ? "Loading Career..."
                            : "No Career Found"}
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
                  Add New CareerScope
                </Button>
              </>
            )}
          </div>

          {/* References Section */}
          <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-stretch gap-5 overflow-hidden">
            <SectionTitle icon={<LucideFileText />} title="References Information" />
            <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
              {/* Resume Section */}
              <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                <div className="flex items-center text-muted-foreground gap-1">
                  <LucideFileText strokeWidth={"1.3px"} />
                  <TypographyMuted>
                    {resumeFile
                      ? resumeFile.name
                      : employee.resume
                        ? extractCleanFilename(employee.resume)
                        : "Add Your Resume"}
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
                          setPreviewReferenceUrl(employee.resume);
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
                      className="text-red-500 bg-red-100"
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
                              employee.resume,
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
              <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                <div className="flex items-center text-muted-foreground gap-1">
                  <LucideFileText strokeWidth={"1.3px"} />
                  <TypographyMuted>
                    {coverLetterFile
                      ? coverLetterFile.name
                      : employee.coverLetter
                        ? extractCleanFilename(employee.coverLetter)
                        : "Add Your CoverLetter"}
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
                          setPreviewReferenceUrl(employee.coverLetter);
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
                      className="text-red-500 bg-red-100"
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
                              employee.coverLetter,
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
          </div>

          {/* Social Section */}
          <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-stretch gap-5 overflow-hidden">
            <SectionTitle icon={<LucideGlobe />} title="Social Information" />

            {/* Social List Section */}
            {socials && socials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socials.map((item, index) => (
                  <div
                    className="flex items-center gap-1.5 max-w-full"
                    key={index}
                  >
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full hover:underline max-w-[200px] sm:max-w-[260px] overflow-hidden"
                    >
                      <span className="flex-shrink-0">
                        {getSocialPlatformTypeIcon(
                          item.platform as TPlatform,
                        )}
                      </span>
                      <span className="text-sm truncate">
                        {item.platform}
                      </span>
                    </Link>
                    {isEdit && (
                      <LucideXCircle
                        className="flex-shrink-0 cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                        size={18}
                        onClick={() =>
                          removeSocial(item.platform as TPlatform)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center pt-2">
                {/* No Social Section */}
                <TypographyMuted className="text-sm">
                  No Social Avaliable
                </TypographyMuted>
              </div>
            )}

            {/* Social Input Platform and Link Section */}
            {(isEdit || employee.socials.length === 0) && (
              <div>
                {isEdit && (
                  <div className="w-full flex flex-col items-start gap-4 p-4 mt-3 border border-muted rounded-xl overflow-hidden">
                    <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="w-full sm:w-[180px] flex-shrink-0 flex flex-col items-start gap-1">
                        <TypographyMuted className="text-xs">
                          Platform
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
                            className="h-10 text-muted-foreground"
                            ref={socialSelectPlatformRef}
                          >
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

                      <div className="flex-1 min-w-0">
                        <LabelInput
                          label="Link"
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
                  className="text-xs w-full"
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
                  Add New Social
                </Button>
              </div>
            )}
          </div>

          {/* Authentication Section*/}
          <div className="flex flex-col items-stretch gap-5 bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 overflow-hidden">
            <SectionTitle icon={<LucideSettings />} title="Authentication" />

            <div className="w-full flex flex-col items-start gap-3">
              {/* Google, Facebook, LinkedIn and Github Methods Section */}
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

              {/* Email/Password Method Section */}
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

              {/* PhoneOTP Method Section */}
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

      {/* Profile Popup Dialog Section */}
      <ImagePopup
        open={openAvatarPopup}
        setOpen={setOpenAvatarPopup}
        image={avatarPreview ?? employee.avatar!}
      />
    </form>
  );
}
