"use client";

import OpenPositionForm from "@/components/company/profile/open-position-form";
import { GridRunners } from "@/components/ui/grid-runners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
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
import RemoveAlertDialog from "@/components/utils/dialogs/remove-alert-dialog";
import IconLabel from "@/components/utils/data-display/icon-label";
import ImagePopup from "@/components/utils/data-display/image-popup";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useCmpAvatarCoverState } from "@/hooks/profile/company/use-cmp-avatar-cover-state";
import useCmpBenefitValueState from "@/hooks/profile/company/use-cmp-benefit-value-state";
import { useCmpCareerScopesState } from "@/hooks/profile/company/use-cmp-careerscope-state";
import useCmpImageState from "@/hooks/profile/company/use-cmp-image-state";
import { useSocialsState } from "@/hooks/profile/employee/use-social-state";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRemoveCmpAvatarStore } from "@/stores/apis/company/remove-cmp-avatar.store";
import { useRemoveCmpCoverStore } from "@/stores/apis/company/remove-cmp-cover.store";
import { useRemoveOneCmpImageStore } from "@/stores/apis/company/remove-one-cmp-image.store";
import { useRemoveOneOpenPositionStore } from "@/stores/apis/company/remove-one-open-position.store";
import {
  TCompanyUpdateBody,
  useUpdateOneCompanyStore,
} from "@/stores/apis/company/update-one-cmp.store";
import { useUploadCompanyAvatarStore } from "@/stores/apis/company/upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "@/stores/apis/company/upload-cmp-cover.store";
import { useUploadCompanyImagesStore } from "@/stores/apis/company/upload-cmp-images.store";
import { useGetAllCareerScopesStore } from "@/stores/apis/users/get-all-career-scopes.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import {
  companyTypeConstant,
  locationConstant,
  loginMethodConstant,
  platformConstant,
} from "@/utils/constants/ui.constant";
import { getSocialPlatformTypeIcon } from "@/utils/functions/ui";
import { capitalizeWords, getNameInitials } from "@/utils/functions/text";
import { isUuid } from "@/utils/functions/validation";
import { getFoundedYearOptions, parseMaybeDate } from "@/utils/functions/date";
import {
  isSupportedProfileImage,
  readImageFileAsDataUrl,
} from "@/utils/functions/file";
import { MAX_IMAGE_SIZE } from "@/utils/constants/config.constant";
import { BenefitValueChip } from "@/components/utils/data-display/benefit-value-chip";
import { IBenefits } from "@/utils/interfaces/user/company.interface";
import { IValues } from "@/utils/interfaces/user/company.interface";
import { TPlatform } from "@/utils/types/user/platform.type";
import {
  ChevronDown,
  LucideBriefcase,
  LucideBuilding,
  LucideCalendarDays,
  LucideCamera,
  LucideCircleCheck,
  LucideClipboardList,
  LucideCompass,
  LucideEdit,
  LucideGlobe,
  LucideLink2,
  LucideLoader2,
  LucideMail,
  LucideMapPin,
  LucidePhone,
  LucidePlus,
  LucideSettings,
  LucideShapes,
  LucideTrash2,
  LucideUsers,
  LucideXCircle,
  LucideZap,
  Sparkles,
} from "lucide-react";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  type Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import type { TCompanyProfileForm } from "./validation";
import { getCompanyProfileCompletion } from "@/utils/functions/profile";
import { CompanyProfilePageLoadingSkeleton } from "@/components/profile/skeleton";
import { SectionTitle } from "@/components/utils/layout/section-title";
import ProfileCompletionCard from "@/components/profile/profile-completion-card";
import ProfileEditActionBar from "@/components/profile/profile-edit-action-bar";
import MissingProfileFieldButton from "@/components/profile/missing-profile-field-button";
import { PageState } from "@/components/utils/feedback/page-state";

/* -------------------------------- Helpers --------------------------------- */
let companyProfileResolverPromise:
  Promise<Resolver<TCompanyProfileForm>> | undefined;

const lazyCompanyProfileResolver: Resolver<TCompanyProfileForm> = async (
  ...args
) => {
  companyProfileResolverPromise ??= Promise.all([
    import("@hookform/resolvers/zod"),
    import("./validation"),
  ]).then(
    ([{ zodResolver }, { companyFormSchema }]) =>
      zodResolver(companyFormSchema) as Resolver<TCompanyProfileForm>,
  );

  return (await companyProfileResolverPromise)(...args);
};

export default function ProfilePage() {
  /* ---------------------------------- Utils ----------------------------------- */
  const t = useTranslations("toast");
  const tCommon = useTranslations("common");
  const tP = useTranslations("profile");
  const tr = useTranslations("resumeBuilder");

  // Built once per mount — ~125 entries that never change while editing.
  const foundedYearOptions = useMemo(() => getFoundedYearOptions(), []);

  /* -------------------------------- All States -------------------------------- */
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [hasLoadedProfile, setHasLoadedProfile] = useState<boolean>(false);
  const editModeEnteredAtRef = useRef<number | null>(null);

  // Image States
  const {
    openImagePopup,
    setOpenImagePopup,
    currentCompanyImage,
    setCurrentCompanyImage,
    openRemoveImageDialog,
    setOpenRemoveImageDialog,
    removedImage,
    setRemoveImage,
  } = useCmpImageState();

  // Avatar and Cover States
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

    coverFile,
    setCoverFile,
    openRemoveCoverDialog,
    setOpenRemoveCoverDialog,
    openCoverCropDialog,
    setOpenCoverCropDialog,
    coverCropImageUrl,
    setCoverCropImageUrl,
    coverInputRef,

    ignoreNextClick,
  } = useCmpAvatarCoverState();

  // Benefit and Value States
  const {
    benefitInput,
    setBenefitInput,
    benefits,
    setBenefits,
    deletedBenefitIds,
    setDeletedBenefitIds,
    openBenefitPopOver,
    setOpenBenefitPopOver,

    valueInput,
    setValueInput,
    values,
    setValues,
    deletedValueIds,
    setDeletedValueIds,
    openValuePopOver,
    setOpenValuePopOver,
  } = useCmpBenefitValueState();

  // CareerScope States
  const {
    careerScopeInput,
    setCareerScopeInput,
    careerScopes,
    setCareerScopes,
    deleteCareerScopeIds,
    setDeleteCareerScopeIds,
    openCareerScopePopOver,
    setOpenCareerScopePopOver,
  } = useCmpCareerScopesState();

  // Social States
  const {
    socialInput,
    setSocialInput,
    socials,
    setSocials,
    deleteSocialIds,
    setDeleteSocialIds,
    socialSelectPlatformRef,
  } = useSocialsState();

  // OpenPosition State
  const [openRemoveOpenPositionDialog, setOpenRemoveOpenPositionDialog] =
    useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  // Avatar and Cover Preview
  const [avatarOrCoverPreview, setAvatarOrCoverPreview] = useState<{
    avatar: string | undefined;
    cover: string | undefined;
  }>({
    avatar: undefined,
    cover: undefined,
  });

  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);
  const [coverLoadError, setCoverLoadError] = useState<boolean>(false);

  const lastUploadedAvatarRef = useRef<string | null>(null);
  const lastUploadedCoverRef = useRef<string | null>(null);

  /* ----------------------------- API Integration ---------------------------- */
  // Current User Infomation and Current User CareerScopes
  const { user, getCurrentUser } = useGetCurrentUserStore();
  const company = user?.company;
  const getAllCareerScopeStore = useGetAllCareerScopesStore();

  // Update Company Information
  const updateOneCmpStore = useUpdateOneCompanyStore();

  // Upload Avatar, Cover and Image
  const uploadAvatarCmpStore = useUploadCompanyAvatarStore();
  const uploadCoverCmpStore = useUploadCompanyCoverStore();
  const uploadCmpImagesStore = useUploadCompanyImagesStore();

  // Remove Avatar, Cover, Image and OpenPosition
  const removeOneCompImageStore = useRemoveOneCmpImageStore();
  const removeCmpAvatarStore = useRemoveCmpAvatarStore();
  const removeCmpCoverStore = useRemoveCmpCoverStore();
  const removeOneOpenPositionStore = useRemoveOneOpenPositionStore();

  // AI Refine
  const { isRefining: descLoading, refineContent: refineDesc } = useAIRefine();

  /* ------------------------------- Profile Form ------------------------------- */
  // React Hook Form: Company Profile Schema
  const form = useForm<TCompanyProfileForm>({
    resolver: lazyCompanyProfileResolver,
    defaultValues: {
      basicInfo: {
        name: "",
        description: "",
        industry: "",
        companySize: 0,
        foundedYear: 0,
        location: "",
        websiteUrl: "",
        companyType: null,
        avatar: null,
        cover: null,
      },
      accountSetting: {
        email: "",
        phone: "",
      },
      openPositions: [],
      images: [],
      benefitsAndValues: {
        benefits: [],
        values: [],
      },
      careerScopes: [],
      socials: [],
    },
    shouldFocusError: false,
  });

  // Watch Description Value
  const descValue = useWatch({
    control: form.control,
    name: "basicInfo.description",
  });

  /* --------------------------------- Effects ---------------------------------- */
  // ── Get Current User Effect ────────────────────────
  useEffect(() => {
    let isActive = true;

    void getCurrentUser().finally(() => {
      if (isActive) setHasLoadedProfile(true);
    });

    return () => {
      isActive = false;
    };
  }, [getCurrentUser]);

  // ── Avatar and Cover Effect ───────────────────────
  useEffect(() => {
    // Reset error states whenever the image sources change
    setAvatarLoadError(false);
    setCoverLoadError(false);

    let avatarUrl: string | undefined;
    let coverUrl: string | undefined;

    if (avatarFile) avatarUrl = URL.createObjectURL(avatarFile);
    if (coverFile) coverUrl = URL.createObjectURL(coverFile);

    setAvatarOrCoverPreview({
      // Priority: local file blob (editing) → retained upload blob → server URL
      // Retained blob takes priority over server URL so a broken/slow server URL
      // never causes blank avatar/cover after a successful upload.
      avatar:
        avatarUrl ??
        lastUploadedAvatarRef.current ??
        company?.avatar ??
        undefined,
      cover:
        coverUrl ?? lastUploadedCoverRef.current ?? company?.cover ?? undefined,
    });

    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
      if (coverUrl) URL.revokeObjectURL(coverUrl);
    };
  }, [avatarFile, coverFile, company?.avatar, company?.cover]);

  // ── Revoke Retained Blobs on Unmount Effect ────────
  useEffect(() => {
    return () => {
      if (lastUploadedAvatarRef.current)
        URL.revokeObjectURL(lastUploadedAvatarRef.current);
      if (lastUploadedCoverRef.current)
        URL.revokeObjectURL(lastUploadedCoverRef.current);
    };
  }, []);

  // ── Warn the user before leaving the page  ─────────
  useEffect(() => {
    if (!isEdit || !form.formState.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isEdit, form.formState.isDirty]);

  // ── FieldArray for OpenPositions  ───────────────────
  const openPositionFA = useFieldArray({
    control: form.control,
    name: "openPositions",
  });

  // ── Hydrate CurrentUser (Company) Data from API  ───
  useEffect(() => {
    if (user && company) {
      form.reset({
        basicInfo: {
          name: company.name ?? "",
          description: company.description ?? "",
          industry: company.industry ?? "",
          companySize: company.companySize ?? null,
          foundedYear: company.foundedYear ?? null,
          location: company.location ?? "",
          websiteUrl: company.websiteUrl ?? "",
          companyType: company.companyType ?? null,
          avatar: company.avatar ?? null,
          cover: company.cover ?? null,
        },
        accountSetting: {
          email: user.email ?? "",
          phone: company.phone ?? "",
        },
        openPositions:
          company.openPositions.map((op) => ({
            uuid: op.id,
            title: op.title,
            description: op.description,
            type: op.type,
            educationRequirement: op.education,
            experienceRequirement: op.experience,
            salaryMin: op.salaryMin ?? null,
            salaryMax: op.salaryMax ?? null,
            salaryCurrency: op.salaryCurrency ?? "USD",
            workMode: op.workMode ?? null,
            location: op.location ?? "",
            languagesRequired: op.languagesRequired ?? [],
            openingsCount: op.openingsCount ?? null,
            deadlineDate: parseMaybeDate(op.deadlineDate),
            skills: Array.isArray(op.skills)
              ? op.skills.join(", ")
              : op.skills || "",
          })) || [],
        images:
          company.images?.map((img) => ({ id: img.id, image: img.image })) ||
          [],
        benefitsAndValues: {
          benefits:
            company.benefits.map((bf) => ({
              id: bf.id,
              label: bf.label,
            })) || [],
          values:
            company.values.map((vl) => ({
              id: vl.id,
              label: vl.label,
            })) || [],
        },
        careerScopes:
          company.careerScopes.map((cs) => ({
            id: cs.id,
            name: cs.name,
            description: cs.description ?? "",
          })) ?? [],
        socials:
          company.socials.map((sc) => ({
            id: sc.id,
            platform: sc.platform,
            url: sc.url,
          })) ?? [],
      });

      setSocials(company.socials ?? []);
      setBenefits(company.benefits ?? []);
      setValues(company.values ?? []);
      setCareerScopes(company.careerScopes ?? []);
    }
  }, [
    company,
    form,
    setBenefits,
    setCareerScopes,
    setSocials,
    setValues,
    user,
  ]);

  /* -------------------------------- Methods --------------------------------- */
  // ── Edit Mode Methods ────────────────────────────────────────────────────
  // ── Close All The Dialogs ─────────────────────────────────────
  const closeAllDialogs = () => {
    setOpenRemoveAvatarDialog(false);
    setOpenCropDialog(false);
    setOpenRemoveImageDialog(false);
    setOpenRemoveOpenPositionDialog({ open: false, id: null });
    setOpenRemoveCoverDialog(false);
  };

  // ── Enable Edit Mode ─────────────────────────────────────────
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

  // ── Disable Edit Mode ────────────────────────────────────────────────────
  const disableEditMode = async () => {
    await getCurrentUser();
    setAvatarFile(null);
    setCoverFile(null);
    closeAllDialogs();
    setDeletedBenefitIds([]);
    setDeletedValueIds([]);
    setDeleteCareerScopeIds([]);
    setDeleteSocialIds([]);
    setIsEdit(false);
  };

  // ── Avatar, Cover and Image Methods ──────────────────────────────────────
  // ── API: Remove Avatar ─────────────────────────────────────────
  const removeAvatar = async () => {
    if (lastUploadedAvatarRef.current) {
      URL.revokeObjectURL(lastUploadedAvatarRef.current);
      lastUploadedAvatarRef.current = null;
    }
    if (company) await removeCmpAvatarStore.removeCmpAvatar(company.id);

    await disableEditMode();

    toast.success(t("removeAvatarSuccess"));
  };

  // ── API: Remove Cover ─────────────────────────────────────────
  const removeCover = async () => {
    if (lastUploadedCoverRef.current) {
      URL.revokeObjectURL(lastUploadedCoverRef.current);
      lastUploadedCoverRef.current = null;
    }
    if (company) await removeCmpCoverStore.removeCmpCover(company.id);

    await disableEditMode();

    toast.success(t("removeCoverSuccess"));
  };

  // ── API: Remove Single Image ───────────────────────────────────
  const removeSingleImage = async (imageId: string, index: number) => {
    const updated = form.watch("images")?.filter((_, i) => i !== index);
    form.setValue("images", updated);

    if (company)
      await removeOneCompImageStore.removeOneCmpImage(company.id, imageId);

    await disableEditMode();

    toast.success(t("removeImageSuccess"));
  };

  // ── Handle Click Image Popup ────────────────────────────────────
  const handleClickImagePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenImagePopup(true);
  };

  // ── Handle Click Avatar Popup ────────────────────────────────────
  const handleClickAvatarPopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenAvatarPopup(true);
  };

  // ── Handle Avatar Crop ───────────────────────────────────────────
  const handleAvatarCrop = (file: File) => {
    setAvatarFile(file);

    form.setValue("basicInfo.avatar", file, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleCoverCrop = (file: File) => {
    setCoverFile(file);

    form.setValue("basicInfo.cover", file, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // ── Handle File Change for Avatar and Cover ──────────────────────────
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

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

      if (type === "avatar") {
        setCropImageUrl(previewUrl);
        setOpenCropDialog(true);
      } else {
        setCoverCropImageUrl(previewUrl);
        setOpenCoverCropDialog(true);
      }
    } catch {
      toast.error(tr("imageReadFailed"));
    }
  };

  // ── OpenPosition Methods ────────────────────────────────────────────────
  // ── Add New Open Position ─────────────────────────────────────────
  const addNewOpenPosition = () => {
    openPositionFA.append({
      uuid: "",
      title: "",
      description: "",
      experienceRequirement: "",
      educationRequirement: "",
      skills: "",
      type: "",
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: "USD",
      workMode: null,
      location: "",
      openingsCount: null,
      deadlineDate: undefined,
    });
  };

  // ── API: Remove OpenPosition ────────────────────────────────────────
  const removeOpenPosition = async (openPositionID: string) => {
    await removeOneOpenPositionStore.removeOneOpenPosition(
      company!.id,
      openPositionID,
    );

    await disableEditMode();

    toast.success(t("removeOpenPositionSuccess"));
  };

  // ── Benefit Methods ────────────────────────────────────────────────────
  // ── Add New Benefit ─────────────────────────────────────────
  const addNewBenefits = () => {
    const trimmed = benefitInput?.label?.trim();
    if (!trimmed) return;

    const alreadyExists = benefits.some(
      (bf) => bf.label.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(t("duplicatedBenefit"), {
        description: t("pleaseInputAnotherBenefit"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      setBenefitInput(null);
      setOpenBenefitPopOver(false);
      return;
    }

    const updatedBenefits: IBenefits[] = [...benefits, { label: trimmed }];
    setBenefits(updatedBenefits);

    form.setValue("benefitsAndValues.benefits", updatedBenefits, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setBenefitInput(null);
    setOpenBenefitPopOver(false);
  };

  // ── Remove Benefit ─────────────────────────────────────────
  const removeBenefit = (benefitToRemove: string) => {
    const benefitToDelete = benefits.find((bf) => bf.label === benefitToRemove);
    if (benefitToDelete?.id)
      setDeletedBenefitIds((prev) => [...prev, benefitToDelete.id!]);

    const updated = benefits.filter((bf) => bf.label !== benefitToRemove);
    setBenefits(updated);
    form.setValue("benefitsAndValues.benefits", updated, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // ── Value Methods ────────────────────────────────────────────────────
  // ── Add New Value ─────────────────────────────────────────
  const addNewValue = () => {
    const trimmed = valueInput?.label?.trim();
    if (!trimmed) return;

    const alreadyExists = values.some(
      (v) => v.label.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(t("duplicatedValue"), {
        description: t("pleaseInputAnotherValue"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      setValueInput(null);
      setOpenValuePopOver(false);
      return;
    }

    const updatedValues: IValues[] = [...values, { label: trimmed }];
    setValues(updatedValues);

    form.setValue("benefitsAndValues.values", updatedValues, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setValueInput(null);
    setOpenValuePopOver(false);
  };

  // ── Remove Value ─────────────────────────────────────────
  const removeValue = (valueToRemove: string) => {
    const valueToDelete = values.find((v) => v.label === valueToRemove);
    if (valueToDelete?.id)
      setDeletedValueIds((prev) => [...prev, valueToDelete.id!]);

    const updatedValues = values.filter((v) => v.label !== valueToRemove);
    setValues(updatedValues);
    form.setValue("benefitsAndValues.values", updatedValues, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // ── CareerScope Methods ────────────────────────────────────────────────────
  // ── Handle CareerScope Select ─────────────────────────────────────
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

  // ── onSubmit Methods ────────────────────────────────────────────────────
  // ── onSubmit - API: Update The Entire Company Profile ───────
  const onSubmit = async (data: TCompanyProfileForm) => {
    if (!company) return;

    const updateBody: Partial<TCompanyUpdateBody> = {};
    const dirtyFields = form.formState.dirtyFields;

    try {
      /* ------------------------ BASIC INFO ------------------------ */
      const basicInfoKeys: (keyof NonNullable<typeof data.basicInfo>)[] = [
        "name",
        "description",
        "industry",
        "location",
        "companySize",
        "foundedYear",
        "websiteUrl",
        "companyType",
      ];

      basicInfoKeys.forEach((key) => {
        if (dirtyFields?.basicInfo?.[key]) {
          const value = data.basicInfo?.[key];
          (updateBody as Record<string, unknown>)[key] =
            key === "websiteUrl" && (typeof value !== "string" || !value.trim())
              ? null
              : value;
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

      /* ------------------------ OPEN POSITIONS ------------------------ */
      if (
        Array.isArray(dirtyFields.openPositions) &&
        Array.isArray(data.openPositions)
      ) {
        const updatedPositions = data.openPositions.map((pos) => {
          const updatedPos: Record<string, unknown> = {};

          if (pos.uuid) updatedPos.id = pos.uuid;
          updatedPos.title = pos.title;
          updatedPos.description = pos.description;
          updatedPos.type = pos.type;
          updatedPos.experience = pos.experienceRequirement;
          updatedPos.education = pos.educationRequirement;
          updatedPos.skills = Array.isArray(pos.skills)
            ? pos.skills.join(", ")
            : pos.skills;
          updatedPos.salaryMin = pos.salaryMin ?? null;
          updatedPos.salaryMax = pos.salaryMax ?? null;
          updatedPos.salaryCurrency = pos.salaryCurrency ?? "USD";
          updatedPos.workMode = pos.workMode ?? null;
          updatedPos.location = pos.location ?? null;
          updatedPos.openingsCount = pos.openingsCount ?? null;
          updatedPos.deadlineDate = pos.deadlineDate?.toISOString() ?? null;

          return updatedPos;
        });

        if (updatedPositions.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updateBody.openPositions = updatedPositions as any;
        }
      }

      /* ------------------------ BENEFITS & VALUES ------------------------ */
      const benefitsChanged =
        benefits.some((b) => !b.id) || deletedBenefitIds.length > 0;
      if (benefitsChanged) {
        updateBody.benefits = data.benefitsAndValues?.benefits || [];
        if (deletedBenefitIds.length > 0) {
          updateBody.benefitIdsToDelete = deletedBenefitIds;
        }
      }

      const valuesChanged =
        values.some((v) => !v.id) || deletedValueIds.length > 0;
      if (valuesChanged) {
        updateBody.values = data.benefitsAndValues?.values || [];
        if (deletedValueIds.length > 0) {
          updateBody.valueIdsToDelete = deletedValueIds;
        }
      }

      /* ------------------------ CAREER SCOPES ------------------------ */
      const careerScopesChanged =
        careerScopes.some((cs) => !cs.id) || deleteCareerScopeIds.length > 0;
      if (careerScopesChanged) {
        updateBody.careerScopes = data.careerScopes || [];
        if (deleteCareerScopeIds.length > 0) {
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
        }
      }

      /* ------------------------ SOCIALS ------------------------ */
      const socialsChanged =
        socials.some((s) => !s.id) || deleteSocialIds.length > 0;
      if (socialsChanged) {
        updateBody.socials =
          data.socials
            ?.filter((s): s is { id?: string; platform: string; url: string } =>
              Boolean(s && s.platform?.trim() && s.url?.trim()),
            )
            .map((s) => ({
              id: s.id ?? "",
              platform: s.platform.trim(),
              url: s.url.trim(),
            })) || [];
        if (deleteSocialIds.length > 0) {
          updateBody.socialIdsToDelete = deleteSocialIds;
        }
      }

      /* ------------------------ FILE UPLOADS ------------------------ */
      const uploadTasks: Promise<unknown>[] = [];

      const avatarFileToUpload = data.basicInfo?.avatar;
      const coverFileToUpload = data.basicInfo?.cover;

      const hasAvatarUpload = avatarFileToUpload instanceof File;
      const hasCoverUpload = coverFileToUpload instanceof File;

      if (hasAvatarUpload) {
        uploadTasks.push(
          uploadAvatarCmpStore.uploadAvatar(company.id, avatarFileToUpload),
        );
      }

      if (hasCoverUpload) {
        uploadTasks.push(
          uploadCoverCmpStore.uploadCover(company.id, coverFileToUpload),
        );
      }

      let hasImageUploads = false;

      if (data.images) {
        const imageFiles: File[] = data.images
          .map((img) => img?.image)
          .filter((image): image is File => image instanceof File);

        if (imageFiles.length > 0) {
          hasImageUploads = true;
          uploadTasks.push(
            uploadCmpImagesStore.uploadImages(company.id, imageFiles),
          );
        }
      }

      const hasUpdateBodyChanges = Object.keys(updateBody).length > 0;
      const hasFileUploads =
        hasAvatarUpload || hasCoverUpload || hasImageUploads;

      if (!hasUpdateBodyChanges && !hasFileUploads) {
        setAvatarFile(null);
        setCoverFile(null);
        closeAllDialogs();
        setDeletedBenefitIds([]);
        setDeletedValueIds([]);
        setDeleteCareerScopeIds([]);
        setDeleteSocialIds([]);
        setIsEdit(false);
        return;
      }

      await Promise.all(uploadTasks);

      if (hasAvatarUpload && avatarFileToUpload instanceof File) {
        if (lastUploadedAvatarRef.current)
          URL.revokeObjectURL(lastUploadedAvatarRef.current);
        lastUploadedAvatarRef.current = URL.createObjectURL(avatarFileToUpload);
      }
      if (hasCoverUpload && coverFileToUpload instanceof File) {
        if (lastUploadedCoverRef.current)
          URL.revokeObjectURL(lastUploadedCoverRef.current);
        lastUploadedCoverRef.current = URL.createObjectURL(coverFileToUpload);
      }

      /* ------------------------ API UPDATE ------------------------ */
      if (hasUpdateBodyChanges) {
        await updateOneCmpStore.updateOneCompany(company.id, updateBody);
      }

      toast.success(t("profileUpdatedSuccess"), {
        description: t("profileUpdatedSuccessDescription"),
      });
      await disableEditMode();
    } catch (error) {
      console.error(error);
      toast.error(t("error"), {
        description: t("failedToUpdateCompanyProfile"),
      });
    }
  };

  // ── handleSubmit: Submit Company Profile Form ───────────
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

    form.setValue("benefitsAndValues.benefits", benefits, {
      shouldDirty: true,
    });
    form.setValue("benefitsAndValues.values", values, { shouldDirty: true });
    form.setValue("careerScopes", careerScopes, { shouldDirty: true });
    form.setValue("socials", socials, { shouldDirty: true });

    if (avatarFile)
      form.setValue("basicInfo.avatar", avatarFile, { shouldDirty: true });
    if (coverFile)
      form.setValue("basicInfo.cover", coverFile, { shouldDirty: true });

    form.handleSubmit(onSubmit, () => toast.error(t("validationError")))(e);
  };

  /* -------------------------------- Loading States ------------------------------- */
  // Compute All Loading States
  const updateProfileLoadingState =
    updateOneCmpStore.loading ||
    uploadAvatarCmpStore.loading ||
    uploadCoverCmpStore.loading ||
    uploadCmpImagesStore.loading ||
    removeOneOpenPositionStore.loading ||
    removeOneCompImageStore.loading ||
    removeCmpAvatarStore.loading ||
    removeCmpCoverStore.loading;

  // Loading Message Based on Loading State
  const loadingMessage = removeCmpAvatarStore.loading
    ? tP("removingAvatar")
    : removeCmpCoverStore.loading
      ? tP("removingCover")
      : removeOneCompImageStore.loading
        ? tP("removingImage")
        : removeOneOpenPositionStore.loading
          ? tP("removingOpenPosition")
          : uploadAvatarCmpStore.loading
            ? tP("uploadingAvatar")
            : uploadCoverCmpStore.loading
              ? tP("uploadingCover")
              : uploadCmpImagesStore.loading
                ? tP("uploadingImage")
                : updateOneCmpStore.loading
                  ? tP("updatingCompany")
                  : "";

  if (!hasLoadedProfile) return <CompanyProfilePageLoadingSkeleton />;

  /* -------------------------------- Empty State ------------------------------ */
  if (!user || !company)
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

  /* -------------------------------- Profile Completion ----------------------- */
  const profileCompletion = getCompanyProfileCompletion({
    ...company,
    // The API omits `email` rather than sending null, and the completion
    // helper distinguishes "absent" as null.
    email: user.email ?? null,
    avatar: avatarLoadError ? undefined : company.avatar,
    cover: coverLoadError ? undefined : company.cover,
  });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <form
      onSubmit={handleSubmit}
      data-profile-editing={isEdit}
      className="profile-editorial profile-company animate-page-in flex flex-col gap-6 sm:gap-7"
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
      <section className="profile-hero profile-company-hero overflow-hidden border border-border bg-card">
        {/* Cover Image Section */}
        <div
          className={`profile-cover relative h-48 overflow-hidden bg-cover bg-center bg-no-repeat sm:h-64 ${!company.cover ? "bg-foreground" : ""}`}
          style={
            company.cover
              ? { backgroundImage: `url(${avatarOrCoverPreview.cover})` }
              : {}
          }
        >
          {/* Cover Background Section: the same grid the detail heroes use.
              Drawn over a cover photo as well, which is what the detail
              pages do — gating it on "no photo" is what made the two
              covers diverge. */}
          <div className="profile-detail-hero-grid" aria-hidden />
          <GridRunners
            className="profile-detail-grid-runners"
            density="quiet"
          />

          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" />
          <span className="absolute bottom-4 left-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white sm:left-6">
            {tP("companyProfileLabel")}
          </span>

          {/* Cover Edit Controls Section */}
          {(isEdit || !company.cover) && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                className="flex h-8 items-center gap-1.5 rounded-none border border-white/30 bg-background/90 px-3 text-xs text-foreground backdrop-blur-sm hover:bg-background"
                onClick={() => {
                  if (isEdit) {
                    coverInputRef.current?.click();
                    return;
                  }
                  enableEditMode();
                  requestAnimationFrame(() => coverInputRef.current?.click());
                }}
                type="button"
              >
                <LucideCamera className="size-3.5" />
                {company.cover
                  ? tP("changeCover")
                  : tP("addMissingField", {
                      field: tP("completionFields.coverImage"),
                    })}
              </Button>
              {company.cover && (
                <Button
                  className="flex h-8 items-center gap-1.5 rounded-none bg-destructive/90 px-3 text-xs text-destructive-foreground backdrop-blur-sm"
                  onClick={() => setOpenRemoveCoverDialog(true)}
                  type="button"
                >
                  <LucideXCircle className="size-3.5" />
                  {tP("removeCover")}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Identity Row Section */}
        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-10 flex items-end gap-4 tablet-md:flex-col tablet-md:items-center sm:-mt-12">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <Avatar
                className="size-24 cursor-pointer !rounded-none border-[6px] border-card bg-card shadow-none sm:size-28"
                rounded="md"
                onClick={(e) => {
                  if (!isEdit && company.avatar) handleClickAvatarPopup(e);
                }}
              >
                <AvatarImage
                  src={avatarOrCoverPreview.avatar}
                  onError={() => setAvatarLoadError(true)}
                />
                <AvatarFallback className="text-lg font-semibold uppercase">
                  {getNameInitials(company.name)}
                </AvatarFallback>
              </Avatar>

              {(isEdit || !company.avatar) && (
                <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
                  <Button
                    className="size-7 rounded-none bg-foreground p-0 text-primary-foreground shadow-none"
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
                    type="button"
                  >
                    <LucideCamera className="size-3.5" />
                  </Button>
                  {company.avatar && !avatarFile && (
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
                      onClick={() => {
                        setAvatarFile(null);
                        form.setValue(
                          "basicInfo.avatar",
                          company.avatar ?? null,
                          { shouldDirty: false },
                        );
                      }}
                      type="button"
                    >
                      <LucideXCircle className="size-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Avatar Input Section */}
            <input
              ref={avatarInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(e, "avatar")}
            />

            {/* Cover Input Section */}
            <input
              ref={coverInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(e, "cover")}
            />

            {/* Hidden Cover Error Detector Section */}
            {company.cover && !coverFile && (
              <Image
                src={company.cover}
                alt=""
                width={1}
                height={1}
                unoptimized
                className="hidden"
                aria-hidden="true"
                onError={() => setCoverLoadError(true)}
              />
            )}

            {/* Avatar Crop Dialog Section */}
            <AvatarCropDialog
              title={`Crop ${company.name} Avatar`}
              open={openCropDialog}
              setOpen={setOpenCropDialog}
              image={cropImageUrl}
              onCropComplete={handleAvatarCrop}
            />

            {/* Cover Crop Dialog Section */}
            <AvatarCropDialog
              title={`Crop ${company.name} Cover`}
              open={openCoverCropDialog}
              setOpen={setOpenCoverCropDialog}
              image={coverCropImageUrl}
              onCropComplete={handleCoverCrop}
              aspect={16 / 9}
              cropShape="rect"
              fileName="cover.jpg"
            />

            {/* Remove Cover Dialog Section */}
            <RemoveAlertDialog
              type="cover"
              setOpenDialog={setOpenRemoveCoverDialog}
              openDialog={openRemoveCoverDialog}
              onNoClick={() => setOpenRemoveCoverDialog(false)}
              onYesClick={removeCover}
            />

            {/* Remove Avatar Dialog Section */}
            <RemoveAlertDialog
              type="avatar"
              setOpenDialog={setOpenRemoveAvatarDialog}
              openDialog={openRemoveAvatarDialog}
              onNoClick={() => setOpenRemoveAvatarDialog(false)}
              onYesClick={removeAvatar}
            />

            {/* Name and Industry Section */}
            <div className="min-w-0 flex-1 pb-1 tablet-md:text-center">
              <h1 className="truncate text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl">
                {company.name}
              </h1>
              <p className="mt-1 truncate text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {company.industry}
              </p>
            </div>

            {/* Edit Profile Button Section — View Mode Only */}
            {!isEdit && (
              <Button
                variant="outline"
                size="sm"
                className="mb-1 shrink-0 rounded-none text-xs tablet-md:w-full"
                type="button"
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
          {/* Company Information Section */}
          <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              icon={<LucideBuilding />}
              title={tP("companyInformation")}
            />

            {/* Company Details Grid Section */}
            <div className="grid w-full grid-cols-12 gap-x-4 gap-y-5 tablet-md:grid-cols-1">
              <LabelInput
                className="col-span-7 tablet-md:col-span-1"
                label={tP("companyName")}
                input={
                  !isEdit && !company.name?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("companyName"),
                      })}
                      onClick={() => beginEditingField("company-name")}
                    />
                  ) : (
                    <Input
                      placeholder={tP("companyName")}
                      id="company-name"
                      {...form.register("basicInfo.name")}
                      prefix={<LucideBuilding />}
                      disabled={!isEdit}
                    />
                  )
                }
              />

              <LabelInput
                className="col-span-5 tablet-md:col-span-1"
                label={tP("industry")}
                input={
                  !isEdit && !company.industry?.trim() ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", { field: tP("industry") })}
                      onClick={() => beginEditingField("industry")}
                    />
                  ) : (
                    <Input
                      placeholder={tP("industry")}
                      id="industry"
                      {...form.register("basicInfo.industry")}
                      prefix={<LucideBriefcase />}
                      disabled={!isEdit}
                    />
                  )
                }
              />

              <div className="col-span-12 flex w-full flex-col items-start gap-1 tablet-md:col-span-1">
                <div className="flex w-full items-center justify-between">
                  <TypographyMuted className="text-xs font-bold text-foreground">
                    {tP("companyDescription")}
                  </TypographyMuted>
                  {isEdit && descValue && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const result = await refineDesc(
                          descValue,
                          "companyBio",
                          {
                            companyName: form.getValues("basicInfo.name"),
                            industry: form.getValues("basicInfo.industry"),
                            openPositions: (
                              form.getValues("openPositions") ?? []
                            )
                              .map((p: { title?: string }) => p.title)
                              .filter(Boolean) as string[],
                            benefits: benefits.map((b) => b.label),
                            values: values.map((v) => v.label),
                          },
                          (text) =>
                            form.setValue("basicInfo.description", text, {
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
                {!isEdit && !company.description?.trim() ? (
                  <MissingProfileFieldButton
                    label={tP("addMissingField", {
                      field: tP("companyDescription"),
                    })}
                    onClick={() => beginEditingField("company-description")}
                  />
                ) : (
                  <Textarea
                    autoResize
                    placeholder={tP("companyDescription")}
                    id="company-description"
                    {...form.register("basicInfo.description")}
                    disabled={!isEdit}
                  />
                )}
              </div>

              {/* Location Section */}
              <div className="col-span-5 flex flex-col items-start gap-2 tablet-md:col-span-1">
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
                          beginEditingField("company-location", true)
                        }
                      />
                    ) : (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEdit}
                      >
                        <SelectTrigger
                          id="company-location"
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

              {/* Website URL Section */}
              <LabelInput
                className="col-span-7 tablet-md:col-span-1"
                label={tP("websiteUrl")}
                input={
                  <Controller
                    name="basicInfo.websiteUrl"
                    control={form.control}
                    render={({ field }) =>
                      !isEdit && !field.value?.trim() ? (
                        <MissingProfileFieldButton
                          label={tP("addMissingField", {
                            field: tP("websiteUrl"),
                          })}
                          onClick={() => beginEditingField("company-website")}
                        />
                      ) : (
                        <Input
                          id="company-website"
                          placeholder="https://yourcompany.com"
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

              {/* Company Type Section */}
              <div className="col-span-4 flex flex-col items-start gap-2 tablet-md:col-span-1">
                <TypographyMuted className="text-xs">
                  {tP("companyType")}
                </TypographyMuted>
                <Controller
                  name="basicInfo.companyType"
                  control={form.control}
                  render={({ field }) =>
                    !isEdit && !field.value ? (
                      <MissingProfileFieldButton
                        label={tP("addMissingField", {
                          field: tP("companyType"),
                        })}
                        onClick={() => beginEditingField("company-type", true)}
                      />
                    ) : (
                      <CreatableCombobox
                        options={companyTypeConstant}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder={tP("companyTypePlaceholder")}
                        emptyText={tP("companyTypeEmpty")}
                        ariaLabel={tP("companyType")}
                        icon={<LucideShapes />}
                        triggerId="company-type"
                        contentClassName="profile-overlay profile-command-popover"
                        disabled={!isEdit}
                      />
                    )
                  }
                />
              </div>

              {/* CompanySize, FoundedYear, Email and PhoneNumber Section */}
              <LabelInput
                className="col-span-4 tablet-md:col-span-1"
                label={tP("companySize")}
                input={
                  !isEdit && !company.companySize ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("companySize"),
                      })}
                      onClick={() => beginEditingField("company-size")}
                    />
                  ) : (
                    <Input
                      type="number"
                      placeholder={tP("companySize")}
                      id="company-size"
                      {...form.register("basicInfo.companySize")}
                      prefix={<LucideUsers />}
                      disabled={!isEdit}
                    />
                  )
                }
              />

              <LabelInput
                className="col-span-4 tablet-md:col-span-1"
                label={tP("foundedYear")}
                input={
                  !isEdit && !company.foundedYear ? (
                    <MissingProfileFieldButton
                      label={tP("addMissingField", {
                        field: tP("foundedYear"),
                      })}
                      onClick={() =>
                        beginEditingField("company-founded-year", true)
                      }
                    />
                  ) : (
                    <Controller
                      name="basicInfo.foundedYear"
                      control={form.control}
                      render={({ field }) => (
                        <CreatableCombobox
                          options={foundedYearOptions}
                          value={field.value ? String(field.value) : ""}
                          onChange={(value) => field.onChange(Number(value))}
                          placeholder={tP("foundedYear")}
                          emptyText={tP("foundedYearEmpty")}
                          ariaLabel={tP("foundedYear")}
                          icon={<LucideCalendarDays />}
                          triggerId="company-founded-year"
                          contentClassName="profile-overlay profile-command-popover"
                          allowCreate={false}
                          disabled={!isEdit}
                        />
                      )}
                    />
                  )
                }
              />

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
                  !isEdit && !company.phone?.trim() ? (
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
            </div>
          </section>

          {/* OpenPosition Information Section */}
          {company.openPositions && (
            <section className="profile-section flex w-full flex-col items-stretch gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
              <SectionTitle
                icon={<LucideUsers />}
                title={tP("openPositionInformation")}
                action={
                  isEdit || openPositionFA.fields.length === 0 ? (
                    <div
                      onClick={() => {
                        if (!isEdit) enableEditMode();
                        addNewOpenPosition();
                      }}
                    >
                      <IconLabel
                        text={tP("addOpenPosition")}
                        icon={<LucidePlus className="text-muted-foreground" />}
                        className="cursor-pointer"
                      />
                    </div>
                  ) : undefined
                }
              />
              {/* OpenPosition Form Section */}
              <div className="flex flex-col items-start gap-5">
                {openPositionFA.fields.length > 0 ? (
                  openPositionFA.fields.map((row, index) => {
                    const openPositionId = form.watch(
                      `openPositions.${index}.uuid`,
                    ) as string | undefined;

                    return (
                      <OpenPositionForm
                        key={row.id}
                        index={index}
                        form={form}
                        positionUUID={openPositionId ?? ""}
                        isEdit={isEdit}
                        title={form.watch(`openPositions.${index}.title`)}
                        description={form.watch(
                          `openPositions.${index}.description`,
                        )}
                        experienceReqirement={form.watch(
                          `openPositions.${index}.experienceRequirement`,
                        )}
                        educationRequirement={form.watch(
                          `openPositions.${index}.educationRequirement`,
                        )}
                        onRemove={() => {
                          if (openPositionId && isUuid(openPositionId)) {
                            setOpenRemoveOpenPositionDialog({
                              open: true,
                              id: openPositionId,
                            });
                          } else {
                            openPositionFA.remove(index);
                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <PageState
                    variant="empty"
                    title={tP("openPositionEmpty")}
                    description={tP("openPositionEmptyDescription")}
                    icon={LucideClipboardList}
                    compact
                  />
                )}
              </div>

              {/* Remove OpenPosition Dialog Section */}
              <RemoveAlertDialog
                type="position"
                openDialog={openRemoveOpenPositionDialog.open}
                setOpenDialog={(open) =>
                  setOpenRemoveOpenPositionDialog((prev) => ({
                    ...prev,
                    open: open,
                  }))
                }
                onNoClick={() =>
                  setOpenRemoveOpenPositionDialog({ open: false, id: null })
                }
                onYesClick={() => {
                  if (openRemoveOpenPositionDialog.id) {
                    removeOpenPosition(openRemoveOpenPositionDialog.id);
                    setOpenRemoveOpenPositionDialog({ open: false, id: null });
                  }
                }}
              />
            </section>
          )}

          {/* Company Images Section */}
          <section className="profile-section w-full overflow-hidden border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              icon={<LucideBuilding />}
              title={tP("companyImagesInformation")}
            />
            <Carousel className="w-full">
              <CarouselContent className="w-full">
                {form.watch("images")?.map((img, index) => {
                  let imageUrl = img?.image;
                  if (img?.image instanceof File) {
                    imageUrl = URL.createObjectURL(img.image);
                  }

                  return (
                    <CarouselItem
                      key={index}
                      className="relative max-w-[280px]"
                    >
                      <div
                        onClick={(e) => {
                          if (!isEdit) {
                            handleClickImagePopup(e);
                            if (img?.image) {
                              setCurrentCompanyImage(img.image.toString());
                            }
                          }
                        }}
                        className="my-2 ml-2 h-[180px] bg-muted bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      {isEdit && (
                        <LucideXCircle
                          className="absolute right-1 top-3 cursor-pointer text-destructive"
                          type="button"
                          onClick={() => {
                            if (img?.id === "" || img?.id === undefined) {
                              const updated = form
                                .watch("images")
                                ?.filter((_, i) => i !== index);
                              form.setValue("images", updated);
                            } else {
                              setOpenRemoveImageDialog(true);
                              setRemoveImage({ id: img.id, index: index });
                            }
                          }}
                        />
                      )}
                    </CarouselItem>
                  );
                })}
                {/* Remove Company Image Dialog Section */}
                <RemoveAlertDialog
                  type="image"
                  openDialog={openRemoveImageDialog}
                  setOpenDialog={setOpenRemoveImageDialog}
                  onNoClick={() => setOpenRemoveImageDialog(false)}
                  onYesClick={() => {
                    if (removedImage) {
                      removeSingleImage(removedImage.id, removedImage.index);
                      setOpenRemoveImageDialog(false);
                    }
                  }}
                />
                {(isEdit || company.images?.length === 0) && (
                  <CarouselItem className="max-w-[280px]">
                    <label
                      htmlFor="image-upload"
                      className="profile-image-upload my-2 ml-2 flex h-[180px] cursor-pointer items-center justify-center border border-dashed border-foreground/30 bg-muted/50 transition-colors hover:bg-muted"
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (!isEdit) enableEditMode();
                          const files = e.target.files;
                          if (!files) return;
                          const currentImages = form.watch("images");
                          if (currentImages) {
                            form.setValue("images", [
                              ...currentImages,
                              { image: files[0] },
                            ]);
                          }
                        }}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <LucidePlus className="text-muted-foreground" />
                        <TypographyMuted className="text-xs">
                          {tP("addCompanyImage")}
                        </TypographyMuted>
                      </div>
                    </label>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious type="button" className="ml-8" />
              <CarouselNext type="button" className="mr-8" />
            </Carousel>
          </section>
        </div>

        {/* RIGHT SIDE Section */}
        <aside className="profile-side-column flex min-w-0 flex-col gap-5">
          {/* Benefits Section */}
          <section className="profile-section flex flex-col items-start gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <div className="w-full">
              <SectionTitle
                icon={<LucideCircleCheck />}
                title={tP("benefits")}
              />
            </div>

            {/* Benefit List Section */}
            <div className="flex w-full flex-col items-stretch gap-3">
              <div className="flex w-full flex-wrap gap-2">
                {benefits.length > 0 ? (
                  benefits.map((benefit) => (
                    <BenefitValueChip
                      key={benefit.label}
                      kind="benefit"
                      label={benefit.label}
                      onRemove={
                        isEdit ? () => removeBenefit(benefit.label) : undefined
                      }
                    />
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center">
                    {/* No Benefit Section */}
                    <TypographyMuted className="text-sm">
                      {tP("noBenefitAvailable")}
                    </TypographyMuted>
                  </div>
                )}
              </div>
              {(isEdit || company.benefits.length === 0) && (
                <Popover
                  open={openBenefitPopOver}
                  onOpenChange={setOpenBenefitPopOver}
                >
                  <PopoverTrigger asChild>
                    <Button
                      className="w-full text-xs"
                      type="button"
                      variant="secondary"
                    >
                      {tP("addNewBenefit")}
                      <LucidePlus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="profile-overlay profile-form-popover flex w-[var(--radix-popper-anchor-width)] flex-col items-end gap-3"
                  >
                    <Input
                      placeholder={tP("enterBenefitPlaceholder")}
                      onChange={(e) =>
                        setBenefitInput({ label: e.target.value })
                      }
                    />
                    <div className="grid w-full grid-cols-2 gap-2 [&>button]:w-full [&>button]:text-xs">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setOpenBenefitPopOver(false)}
                      >
                        {tP("cancel")}
                      </Button>
                      <Button
                        onClick={() => {
                          if (company.benefits.length === 0) {
                            setIsEdit(true);
                            addNewBenefits();
                          } else {
                            addNewBenefits();
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
            </div>
          </section>

          {/* Values Section */}
          <section className="profile-section flex flex-col items-start gap-5 overflow-hidden border border-border bg-card p-5 sm:p-6">
            <div className="w-full">
              <SectionTitle icon={<LucideZap />} title={tP("values")} />
            </div>

            {/* Value List Section */}
            <div className="flex w-full flex-col items-stretch gap-3">
              <div className="flex w-full flex-wrap gap-2">
                {values.length > 0 ? (
                  values.map((value, index) => (
                    <BenefitValueChip
                      key={index}
                      kind="value"
                      label={value.label}
                      onRemove={
                        isEdit ? () => removeValue(value.label) : undefined
                      }
                    />
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center">
                    {/* No Value Section */}
                    <TypographyMuted className="text-sm">
                      {tP("noValueAvailable")}
                    </TypographyMuted>
                  </div>
                )}
              </div>
              {(isEdit || company.values.length === 0) && (
                <Popover
                  open={openValuePopOver}
                  onOpenChange={setOpenValuePopOver}
                >
                  <PopoverTrigger asChild>
                    <Button
                      className="w-full text-xs"
                      type="button"
                      variant="secondary"
                    >
                      {tP("addNewValue")}
                      <LucidePlus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="profile-overlay profile-form-popover flex w-[var(--radix-popper-anchor-width)] flex-col items-end gap-3"
                  >
                    <Input
                      placeholder={tP("enterValuePlaceholder")}
                      onChange={(e) => setValueInput({ label: e.target.value })}
                    />
                    <div className="grid w-full grid-cols-2 gap-2 [&>button]:w-full [&>button]:text-xs">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setOpenValuePopOver(false)}
                      >
                        {tP("cancel")}
                      </Button>
                      <Button
                        onClick={() => {
                          if (company.values.length === 0) {
                            setIsEdit(true);
                            addNewValue();
                          } else {
                            addNewValue();
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
            </div>
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
                        <LucideXCircle
                          className="text-destructive"
                          width="18px"
                        />
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
            {(isEdit || company.careerScopes.length === 0) && (
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
                        if (!getAllCareerScopeStore.careerScopes?.length)
                          getAllCareerScopeStore.getAllCareerScopes();
                      }}
                    >
                      {careerScopeInput
                        ? getAllCareerScopeStore.careerScopes?.find(
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
                          {getAllCareerScopeStore.loading
                            ? tCommon("loadingCareer")
                            : tCommon("noCareerFound")}
                        </CommandEmpty>
                        <CommandGroup>
                          {getAllCareerScopeStore.careerScopes?.map(
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
                    if (company.careerScopes.length === 0) {
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

          {/* Social Section */}
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
                        className="flex-shrink-0 cursor-pointer text-destructive transition-colors hover:text-destructive-accent"
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
            {(isEdit || company.socials.length === 0) && (
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
                  className="w-full text-xs"
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
                    <div className="cursor-pointer border border-destructive-border bg-destructive-subtle px-3 py-1 text-destructive-accent">
                      <TypographySmall className="text-xs font-medium">
                        {tP("disconnect")}
                      </TypographySmall>
                    </div>
                  ) : (
                    <div className="cursor-pointer border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
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
                  <div className="cursor-pointer border border-destructive-border bg-destructive-subtle px-3 py-1 text-destructive-accent">
                    <TypographySmall className="text-xs font-medium">
                      {tP("disconnect")}
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="cursor-pointer border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
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
                  <div className="cursor-pointer border border-destructive-border bg-destructive-subtle px-3 py-1 text-destructive-accent">
                    <TypographySmall className="text-xs font-medium">
                      {tP("disconnect")}
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="cursor-pointer border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
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
        title={loadingMessage || tP("updatingCompany")}
        subTitle={tP("pleaseWaitCompany")}
      />

      {/* Image Popup Section */}
      {currentCompanyImage && (
        <ImagePopup
          open={openImagePopup}
          setOpen={setOpenImagePopup}
          image={currentCompanyImage}
        />
      )}

      {/* Profile Popup Section */}
      <ImagePopup
        open={openAvatarPopup}
        setOpen={setOpenAvatarPopup}
        image={avatarOrCoverPreview.avatar ?? company.avatar!}
      />
    </form>
  );
}
