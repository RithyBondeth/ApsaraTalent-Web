"use client";

import OpenPositionForm from "@/components/company/profile/open-position-form";
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
  COMPANY_ICON_COLOR,
  locationConstant,
  loginMethodConstant,
  platformConstant,
} from "@/utils/constants/ui.constant";
import { getSocialPlatformTypeIcon } from "@/utils/functions/ui/get-social-type";
import { capitalizeWords, getNameInitials } from "@/utils/functions/text";
import { isUuid } from "@/utils/functions/validation/check-uuid";
import { parseMaybeDate } from "@/utils/functions/date";
import { IBenefits } from "@/utils/interfaces/user/company.interface";
import { IValues } from "@/utils/interfaces/user/company.interface";
import { TPlatform } from "@/utils/types/user/platform.type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  LucideBuilding,
  LucideCamera,
  LucideCircleCheck,
  LucideCompass,
  LucideEdit,
  LucideGlobe,
  LucideLink2,
  LucideLoader2,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideSettings,
  LucideTrash2,
  LucideUsers,
  LucideXCircle,
  LucideZap,
  Sparkles,
} from "lucide-react";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { companyFormSchema, TCompanyProfileForm } from "./validation";
import { emptySvg } from "@/utils/constants/asset.constant";
import { getCompanyProfileCompletion } from "@/utils/functions/profile";
import { CompanyProfilePageLoadingSkeleton } from "@/components/profile/skeleton";
import { SectionTitle } from "@/components/utils/layout/section-title";
import ProfileCompletionCard from "@/components/profile/profile-completion-card";

export default function ProfilePage() {
  /* ---------------------------------- Utils ----------------------------------- */
  const t = useTranslations("toast");
  const tCommon = useTranslations("common");
  const tP = useTranslations("profile");
  const tr = useTranslations("resumeBuilder");

  /* -------------------------------- All States -------------------------------- */
  const [isEdit, setIsEdit] = useState<boolean>(false);
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
  const { user, loading, getCurrentUser } = useGetCurrentUserStore();
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
    resolver: zodResolver(companyFormSchema),
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
  // Get Current User Effect
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

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

  // Revoke retained blobs on unmount
  useEffect(() => {
    return () => {
      if (lastUploadedAvatarRef.current)
        URL.revokeObjectURL(lastUploadedAvatarRef.current);
      if (lastUploadedCoverRef.current)
        URL.revokeObjectURL(lastUploadedCoverRef.current);
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

  // FieldArray for OpenPositions
  const openPositionFA = useFieldArray({
    control: form.control,
    name: "openPositions",
  });

  // Hydrate Current User (Company) Data from API
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
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (type === "avatar") {
      const previewUrl = URL.createObjectURL(file);

      setCropImageUrl(previewUrl);
      setOpenCropDialog(true);

      event.target.value = "";
    }

    if (type === "cover") {
      const previewUrl = URL.createObjectURL(file);
      setCoverCropImageUrl(previewUrl);
      setOpenCoverCropDialog(true);
      event.target.value = "";
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
          (updateBody as Record<string, unknown>)[key] = data.basicInfo?.[key];
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
          if (!pos.uuid) updatedPos.isNew = true;

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
          updatedPos.deadlineDate =
            pos.deadlineDate?.toISOString() || new Date().toISOString();

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

  if (loading && !user) return <CompanyProfilePageLoadingSkeleton />;

  /* -------------------------------- Empty State ------------------------------ */
  if (!user || !company) return null;

  /* -------------------------------- Profile Completion ----------------------- */
  const profileCompletion = getCompanyProfileCompletion({
    ...company,
    avatar: avatarLoadError ? undefined : company.avatar,
    cover: coverLoadError ? undefined : company.cover,
  });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 animate-page-in"
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
        <div className="sticky top-14 z-40 -mx-3 sm:-mx-4 lg:-mx-6 px-4 sm:px-5 py-2.5 bg-background/95 backdrop-blur-md border-b border-border/60 flex items-center justify-between gap-3 shadow-sm">
          {/* Edit Profile Status Section */}
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-amber-400" />
            </span>
            <span className="text-sm font-medium">{tP("editProfile")}</span>
          </div>

          {/* Edit Profile Action Buttons Section */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={disableEditMode}
            >
              {tP("cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs min-w-[80px]"
              disabled={updateProfileLoadingState}
            >
              {updateProfileLoadingState ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
              ) : (
                <LucideCircleCheck className="size-3.5" />
              )}
              {updateProfileLoadingState ? tP("updating") : tP("save")}
            </Button>
          </div>
        </div>
      )}

      {/* Profile Completion Section */}
      <ProfileCompletionCard
        percentage={profileCompletion.percentage}
        missingFields={profileCompletion.missingFields}
      />

      {/* Header Section */}
      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        {/* Cover Image Section */}
        <div
          className={`h-44 sm:h-56 rounded-t-2xl bg-cover bg-center bg-no-repeat relative ${!company.cover ? "bg-gradient-to-br from-primary via-primary/70 to-violet-500/40" : ""}`}
          style={
            company.cover
              ? { backgroundImage: `url(${avatarOrCoverPreview.cover})` }
              : {}
          }
        >
          {/* Overlay for Gradient Cover Section */}
          {!company.cover && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
              <div className="absolute -top-10 -right-10 size-56 rounded-full bg-white/5" />
              <div className="absolute top-6 right-28 size-28 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 right-8 size-36 rounded-full bg-white/5" />
            </>
          )}

          {/* Cover Edit Controls Section */}
          {isEdit && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-background/90 text-foreground backdrop-blur-sm text-xs shadow-sm hover:bg-background"
                onClick={() => coverInputRef.current?.click()}
                type="button"
              >
                <LucideCamera className="size-3.5" />
                {tP("changeCover")}
              </Button>
              {company.cover && (
                <Button
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-destructive/90 text-destructive-foreground backdrop-blur-sm text-xs shadow-sm"
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
        <div className="px-5 sm:px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 sm:-mt-12 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <Avatar
                className="size-20 sm:size-24 ring-4 ring-card shadow-xl bg-card cursor-pointer"
                rounded="md"
                onClick={(e) => {
                  if (!isEdit && company.avatar) handleClickAvatarPopup(e);
                }}
              >
                <AvatarImage
                  src={avatarOrCoverPreview.avatar}
                  onError={() => setAvatarLoadError(true)}
                />
                <AvatarFallback className="uppercase text-lg font-semibold">
                  {getNameInitials(company.name)}
                </AvatarFallback>
              </Avatar>

              {isEdit && (
                <div className="flex items-center gap-1 absolute -bottom-1 -right-1">
                  <Button
                    className="size-7 p-0 rounded-full bg-foreground text-primary-foreground shadow-md"
                    onClick={() => avatarInputRef.current?.click()}
                    type="button"
                  >
                    <LucideCamera className="size-3.5" />
                  </Button>
                  {company.avatar && !avatarFile && (
                    <Button
                      className="size-7 p-0 rounded-full bg-destructive text-destructive-foreground shadow-md"
                      type="button"
                      onClick={() => setOpenRemoveAvatarDialog(true)}
                    >
                      <LucideTrash2 className="size-3.5" />
                    </Button>
                  )}
                  {avatarFile && (
                    <Button
                      className="size-7 p-0 rounded-full bg-destructive text-destructive-foreground shadow-md"
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
              accept="image/*"
              onChange={(e) => handleFileChange(e, "avatar")}
            />

            {/* Cover Input Section */}
            <input
              ref={coverInputRef}
              type="file"
              className="hidden"
              accept="image/*"
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
            <div className="flex-1 min-w-0 pb-1 tablet-md:text-center">
              <h2 className="text-xl font-bold leading-tight truncate">
                {company.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {company.industry}
              </p>
            </div>

            {/* Edit Profile Button Section — View Mode Only */}
            {!isEdit && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs mb-1 shrink-0 tablet-md:w-full"
                type="button"
                onClick={enableEditMode}
              >
                <LucideEdit className="size-3.5" />
                {tP("editProfile")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* LEFT Side Section */}
        <div className="w-[60%] min-w-0 flex flex-col gap-5">
          {/* Company Information Section */}
          <div className="w-full flex flex-col items-stretch gap-5 bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 overflow-hidden">
            <SectionTitle
              icon={<LucideBuilding />}
              title={tP("companyInformation")}
            />

            {/* Name and Description Section */}
            <div className="flex flex-col items-start gap-5">
              <LabelInput
                label={tP("companyName")}
                input={
                  <Input
                    placeholder={isEdit ? tP("companyName") : company.name}
                    id="company-name"
                    {...form.register("basicInfo.name")}
                    disabled={!isEdit}
                  />
                }
              />
              <div className="w-full flex flex-col items-start gap-1">
                <div className="w-full flex items-center justify-between">
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
                      className="h-6 px-1.5 text-[9px] gap-1 text-primary hover:text-primary hover:bg-primary/5"
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
                <Textarea
                  autoResize
                  placeholder={
                    isEdit ? tP("companyDescription") : company.description
                  }
                  id="company-description"
                  {...form.register("basicInfo.description")}
                  disabled={!isEdit}
                />
              </div>

              {/* Industry and Location Section */}
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                <LabelInput
                  label={tP("industry")}
                  input={
                    <Input
                      placeholder={isEdit ? tP("industry") : company.industry}
                      id="industry"
                      {...form.register("basicInfo.industry")}
                      disabled={!isEdit}
                    />
                  }
                />
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted className="text-xs">
                    {tP("locations")}
                  </TypographyMuted>
                  <Controller
                    name="basicInfo.location"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue placeholder={tP("locations")} />
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

              {/* Website URL and Company Type Section */}
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                {/* Website URL Section */}
                <LabelInput
                  label={tP("websiteUrl")}
                  input={
                    <Controller
                      name="basicInfo.websiteUrl"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          placeholder="https://yourcompany.com"
                          {...field}
                          value={field.value ?? ""}
                          disabled={!isEdit}
                        />
                      )}
                    />
                  }
                />

                {/* Company Type Section */}
                <div className="flex flex-col items-start gap-2">
                  <TypographyMuted className="text-xs">
                    {tP("companyType")}
                  </TypographyMuted>
                  <Controller
                    name="basicInfo.companyType"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue
                            placeholder={tP("companyTypePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {companyTypeConstant.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* CompanySize, FoundedYear, Email and PhoneNumber Section */}
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                {company.companySize && (
                  <LabelInput
                    label={tP("companySize")}
                    input={
                      <Input
                        type="number"
                        placeholder={
                          isEdit ? tP("companySize") : `${company.companySize}`
                        }
                        id="company-size"
                        {...form.register("basicInfo.companySize")}
                        prefix={<LucideUsers />}
                        disabled={!isEdit}
                      />
                    }
                  />
                )}
                {company.foundedYear && (
                  <LabelInput
                    label={tP("foundedYear")}
                    input={
                      <Input
                        type="number"
                        placeholder={
                          isEdit ? tP("foundedYear") : `${company.foundedYear}`
                        }
                        id="company-founded-year"
                        {...form.register("basicInfo.foundedYear")}
                        prefix={<LucideBuilding />}
                        disabled={!isEdit}
                      />
                    }
                  />
                )}
              </div>
              {user.email && (
                <LabelInput
                  label={tP("email")}
                  input={
                    <Input
                      placeholder={isEdit ? tP("email") : user.email}
                      id="email"
                      {...form.register("accountSetting.email")}
                      prefix={<LucideMail />}
                      disabled={!isEdit}
                    />
                  }
                />
              )}
              {company.phone && (
                <LabelInput
                  label={tP("phoneNumber")}
                  input={
                    <Input
                      placeholder={isEdit ? tP("phoneNumber") : company.phone}
                      id="phone"
                      {...form.register("accountSetting.phone")}
                      prefix={<LucidePhone />}
                      disabled={!isEdit}
                    />
                  }
                />
              )}
            </div>
          </div>

          {/* OpenPosition Information Section */}
          {company.openPositions && (
            <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-stretch gap-5 overflow-hidden">
              <SectionTitle
                icon={<LucideUsers />}
                title={tP("openPositionInformation")}
                action={
                  isEdit ? (
                    <div onClick={addNewOpenPosition}>
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
                  <div className="w-full flex flex-col items-center justify-center p-5">
                    {/* Add New OpenPosition Section */}
                    <Image
                      alt="empty"
                      src={emptySvg}
                      className="size-44 animate-float"
                    />
                    <TypographyMuted className="text-sm">
                      {tP("noOpenPositionAvailable")}
                    </TypographyMuted>
                  </div>
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
            </div>
          )}

          {/* Company Images Section */}
          <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 overflow-hidden">
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
                      className="max-w-[280px] relative"
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
                        className="h-[180px] bg-muted rounded-md my-2 ml-2 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      {isEdit && (
                        <LucideXCircle
                          className="absolute top-3 right-1 cursor-pointer text-red-500"
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
                      className="h-[180px] bg-muted rounded-md my-2 ml-2 flex justify-center items-center cursor-pointer"
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
          </div>
        </div>

        {/* RIGHT SIDE Section */}
        <div className="w-[40%] min-w-0 flex flex-col gap-5">
          {/* Benefits Section */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-start gap-5 overflow-hidden">
            <div className="w-full">
              <SectionTitle
                icon={<LucideCircleCheck />}
                title={tP("benefits")}
              />
            </div>

            {/* Benefit List Section */}
            <div className="w-full flex flex-col items-stretch gap-3">
              <div className="w-full flex flex-wrap gap-3">
                {benefits.length > 0 ? (
                  benefits.map((benefit) => (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted cursor-pointer [&>div>p]:text-xs"
                      key={benefit.label}
                    >
                      <IconLabel
                        icon={
                          <LucideCircleCheck
                            stroke="white"
                            fill={COMPANY_ICON_COLOR.BENEFIT}
                          />
                        }
                        className="[&>p]:text-[#0073E6] font-medium"
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
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center">
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
                  <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                    <Input
                      placeholder={tP("enterBenefitPlaceholder")}
                      onChange={(e) =>
                        setBenefitInput({ label: e.target.value })
                      }
                    />
                    <div className="flex items-center gap-1 [&>button]:text-xs">
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
          </div>

          {/* Values Section */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-start gap-5 overflow-hidden">
            <div className="w-full">
              <SectionTitle icon={<LucideZap />} title={tP("values")} />
            </div>

            {/* Value List Section */}
            <div className="w-full flex flex-col items-stretch gap-3">
              <div className="w-full flex flex-wrap gap-3">
                {values.length > 0 ? (
                  values.map((value, index) => (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted cursor-pointer [&>div>p]:text-xs"
                      key={index}
                    >
                      <IconLabel
                        icon={
                          <LucideCircleCheck
                            stroke="white"
                            fill={COMPANY_ICON_COLOR.VALUE}
                          />
                        }
                        className="[&>p]:text-[#69B41E] font-medium"
                        text={value.label}
                      />
                      {isEdit && (
                        // Remove Value Button Section
                        <LucideXCircle
                          className="text-muted-foreground cursor-pointer text-red-500"
                          width={"18px"}
                          onClick={() => removeValue(value.label)}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center">
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
                  <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                    <Input
                      placeholder={tP("enterValuePlaceholder")}
                      onChange={(e) => setValueInput({ label: e.target.value })}
                    />
                    <div className="flex items-center gap-1 [&>button]:text-xs">
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
          </div>

          {/* Career Scopes Section */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-start gap-5 overflow-hidden">
            <div className="w-full">
              <SectionTitle
                icon={<LucideCompass />}
                title={tP("careerScopesSection")}
              />
            </div>

            {/* Career Scopes List Section */}
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
                  <PopoverContent className="p-0">
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
          </div>

          {/* Social Section */}
          <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-stretch gap-5 overflow-hidden">
            <SectionTitle
              icon={<LucideGlobe />}
              title={tP("socialInformation")}
            />
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
                        {getSocialPlatformTypeIcon(item.platform as TPlatform)}
                      </span>
                      <span className="text-sm truncate">{item.platform}</span>
                    </Link>
                    {isEdit && (
                      <LucideXCircle
                        className="flex-shrink-0 cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                        size={18}
                        onClick={() => removeSocial(item.platform as TPlatform)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center pt-2">
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
                  <div className="w-full flex flex-col items-start gap-4 p-4 mt-3 border border-muted rounded-xl overflow-hidden">
                    <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="w-full sm:w-[180px] flex-shrink-0 flex flex-col items-start gap-1">
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
                            className="h-10 text-muted-foreground"
                            ref={socialSelectPlatformRef}
                          >
                            <SelectValue placeholder={tP("platform")} />
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
                  {tP("addNewSocial")}
                </Button>
              </div>
            )}
          </div>

          {/* Authentication Section */}
          <div className="flex flex-col items-stretch gap-5 bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 overflow-hidden">
            <SectionTitle
              icon={<LucideSettings />}
              title={tP("authentication")}
            />

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
                        {tP("disconnect")}
                      </TypographySmall>
                    </div>
                  ) : (
                    <div className="bg-blue-100 text-blue-500 px-3 py-1 rounded-2xl cursor-pointer">
                      <TypographySmall className="text-xs font-medium">
                        {tP("connect")}
                      </TypographySmall>
                    </div>
                  )}
                </div>
              ))}

              {/* Email/Password Method Section */}
              <div className="w-full flex items-center justify-between bg-primary-foreground rounded-xl py-3 px-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <LucideMail className="mx-1" strokeWidth={1.5} />
                  <TypographySmall>{tP("email")}</TypographySmall>
                </div>
                {user.email ? (
                  <div className="bg-red-100 text-red-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      {tP("disconnect")}
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      {tP("connect")}
                    </TypographySmall>
                  </div>
                )}
              </div>

              {/* PhoneOTP Method Section */}
              <div className="w-full flex items-center justify-between bg-primary-foreground rounded-xl py-3 px-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <LucidePhone className="mx-1" strokeWidth={1.5} />
                  <TypographySmall>{tP("phoneOtp")}</TypographySmall>
                </div>
                {user.phone ? (
                  <div className="bg-red-100 text-red-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      {tP("disconnect")}
                    </TypographySmall>
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-500 px-3 py-1 rounded-2xl cursor-pointer">
                    <TypographySmall className="text-xs font-medium">
                      {tP("connect")}
                    </TypographySmall>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
