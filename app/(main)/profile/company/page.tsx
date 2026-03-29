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
  locationConstant,
  loginMethodConstant,
  platformConstant,
} from "@/utils/constants/ui.constant";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { capitalizeWords } from "@/utils/functions/text";
import { isUuid } from "@/utils/extensions/check-uuid";
import { parseMaybeDate } from "@/utils/functions/date";
import {
  IBenefits,
  IValues,
} from "@/utils/interfaces/user-interface/company.interface";
import { TPlatform } from "@/utils/types/platform.type";
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
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideSettings,
  LucideUsers,
  LucideXCircle,
  LucideZap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { companyFormSchema, TCompanyProfileForm } from "./validation";
import { emptySvgImage } from "@/utils/constants/asset.constant";
import { getCompanyProfileCompletion } from "@/utils/functions/profile";
import { CompanyProfilePageLoadingSkeleton } from "@/components/profile/skeleton";
import { SectionTitle } from "@/components/utils/layout/section-title";
import ProfileCompletionCard from "@/components/profile/profile-completion-card";

export default function ProfilePage() {
  /* -------------------------------- All States -------------------------------- */
  // Utils
  const t = useTranslations("toast");
  const [isEdit, setIsEdit] = useState<boolean>(false);

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

  /* --------------------------------- Effects ---------------------------------- */
  // Get Current User Effect
  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    let avatarUrl: string | undefined;
    let coverUrl: string | undefined;

    if (avatarFile) avatarUrl = URL.createObjectURL(avatarFile);

    if (coverFile) coverUrl = URL.createObjectURL(coverFile);

    setAvatarOrCoverPreview({
      avatar: avatarUrl ?? company?.avatar,
      cover: coverUrl ?? company?.cover,
    });

    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
      if (coverUrl) URL.revokeObjectURL(coverUrl);
    };
  }, [avatarFile, coverFile, company?.avatar, company?.cover]);

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
            salary: op.salary,
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
  }, [user, company, form]);

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
    getAllCareerScopeStore.getAllCareerScopes();
    setIsEdit(true);
  };

  // ── Disable Edit Mode ────────────────────────────────────────────────────
  const disableEditMode = async () => {
    await getCurrentUser();
    setAvatarFile(null);
    setCoverFile(null);
    closeAllDialogs();
    setIsEdit(false);
  };

  // ── Avatar, Cover and Image Methods ──────────────────────────────────────
  // ── API: Remove Avatar ─────────────────────────────────────────
  const removeAvatar = async () => {
    if (company) await removeCmpAvatarStore.removeCmpAvatar(company.id);

    await disableEditMode();

    toast.success(t("removeAvatarSuccess"));
  };

  // ── API: Remove Cover ─────────────────────────────────────────
  const removeCover = async () => {
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

    toast.success(t("removeCoverSuccess"));
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
      salary: "",
      type: "",
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
          updatedPos.salary = pos.salary;
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
      if (
        dirtyFields.benefitsAndValues?.benefits ||
        deletedBenefitIds.length > 0
      ) {
        updateBody.benefits = data.benefitsAndValues?.benefits || [];

        if (deletedBenefitIds.length > 0) {
          updateBody.benefitIdsToDelete = deletedBenefitIds;
        }
      }

      if (dirtyFields.benefitsAndValues?.values || deletedValueIds.length > 0) {
        updateBody.values = data.benefitsAndValues?.values || [];

        if (deletedValueIds.length > 0) {
          updateBody.valueIdsToDelete = deletedValueIds;
        }
      }

      /* ------------------------ CAREER SCOPES ------------------------ */
      if (dirtyFields.careerScopes || deleteCareerScopeIds.length > 0) {
        updateBody.careerScopes = data.careerScopes || [];

        if (deleteCareerScopeIds.length > 0) {
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
        }
      }

      /* ------------------------ SOCIALS ------------------------ */
      if (dirtyFields.socials || deleteSocialIds.length > 0) {
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
        toast.info(t("noChangesDetected"));
        return;
      }

      await Promise.all(uploadTasks);

      /* ------------------------ API UPDATE ------------------------ */
      if (hasUpdateBodyChanges) {
        await updateOneCmpStore.updateOneCompany(company.id, updateBody);
      }

      await getCurrentUser();
      setIsEdit(false);
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

    form.setValue("benefitsAndValues.benefits", benefits);
    form.setValue("benefitsAndValues.values", values);
    form.setValue("careerScopes", careerScopes);
    form.setValue("socials", socials);

    if (avatarFile)
      form.setValue("basicInfo.avatar", avatarFile, { shouldDirty: true });
    if (coverFile)
      form.setValue("basicInfo.cover", coverFile, { shouldDirty: true });

    form.handleSubmit(onSubmit, (errors) => console.log("RHF errors:", errors))(
      e,
    );
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
    ? "Removing avatar..."
    : removeCmpCoverStore.loading
      ? "Removing cover..."
      : removeOneCompImageStore.loading
        ? "Removing image..."
        : removeOneOpenPositionStore.loading
          ? "Removing open position..."
          : uploadAvatarCmpStore.loading
            ? "Uploading avatar..."
            : uploadCoverCmpStore.loading
              ? "Uploading cover..."
              : uploadCmpImagesStore.loading
                ? "Uploading image..."
                : updateOneCmpStore.loading
                  ? "Updating company profile..."
                  : "";

  if (loading) return <CompanyProfilePageLoadingSkeleton />;

  /* -------------------------------- Empty State ------------------------------ */
  if (!user || !company) return null;

  /* -------------------------------- Profile Completion ----------------------- */
  const profileCompletion = getCompanyProfileCompletion(company);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 overflow-x-hidden animate-page-in"
    >
      {/* Profile Completion Section */}
      <ProfileCompletionCard
        percentage={profileCompletion.percentage}
        missingFields={profileCompletion.missingFields}
      />

      {/* Header Section */}
      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        {/* Cover Image Section */}
        <div
          className={`h-44 sm:h-56 rounded-t-2xl bg-cover bg-center bg-no-repeat relative ${!company.cover ? "bg-gradient-to-br from-primary/25 via-primary/10 to-muted/80" : ""}`}
          style={
            company.cover
              ? { backgroundImage: `url(${avatarOrCoverPreview.cover})` }
              : {}
          }
        >
          {isEdit && (
            <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
              <Button
                className="flex items-center gap-2 cursor-pointer py-1 px-3 rounded-full bg-foreground text-primary-foreground"
                onClick={() => coverInputRef.current?.click()}
                type="button"
              >
                <LucideCamera strokeWidth={"1.2px"} width={"18px"} />
                <TypographySmall className="text-xs">
                  Change Cover
                </TypographySmall>
              </Button>
              {company.cover && (
                <Button
                  className="flex items-center gap-2 cursor-pointer py-1 px-3 rounded-full bg-red-500 text-red-100"
                  onClick={() => setOpenRemoveCoverDialog(true)}
                  type="button"
                >
                  <LucideXCircle strokeWidth={"1.2px"} width={"18px"} />
                  <TypographySmall className="text-xs">
                    Remove Cover
                  </TypographySmall>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 pb-5">
          {/* Identity Section */}
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar with Overlap Section */}
            <div className="relative -mt-10 sm:-mt-12 flex-shrink-0">
              <Avatar
                className="size-20 sm:size-24 ring-[3px] ring-card shadow-xl bg-primary-foreground"
                rounded="md"
                onClick={(e) => {
                  if (!isEdit && company.avatar) handleClickAvatarPopup(e);
                }}
              >
                <AvatarImage src={avatarOrCoverPreview.avatar} />
                <AvatarFallback className="uppercase text-lg font-medium">
                  {company.name.slice(0, 3)}
                </AvatarFallback>
              </Avatar>

              {isEdit && (
                <div className="absolute bottom-1 right-1 flex items-center gap-1">
                  <Button
                    className="size-8 flex justify-center items-center cursor-pointer p-1 rounded-full bg-foreground text-primary-foreground"
                    onClick={() => avatarInputRef.current?.click()}
                    type="button"
                  >
                    <LucideCamera width={"18px"} strokeWidth={"1.2px"} />
                  </Button>
                  {company.avatar && (
                    <Button
                      className="size-8 flex justify-center items-center cursor-pointer p-1 rounded-full bg-red-500 text-red-100"
                      onClick={() => setOpenRemoveAvatarDialog(true)}
                      type="button"
                    >
                      <LucideXCircle width={"18px"} strokeWidth={"1.2px"} />
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

            {/* Name and Industry */}
            <div className="flex flex-col items-start gap-1 pt-2 tablet-md:items-center tablet-md:pt-0 flex-1 min-w-0">
              <h2 className="text-xl font-bold leading-tight">
                {company.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {company.industry}
              </p>
            </div>

            {/* Edit Profile Button Section */}
            <div className="flex items-center gap-3 pt-2 tablet-md:pt-0 tablet-md:w-full tablet-md:justify-center">
              {isEdit ? (
                <>
                  <Button
                    className="text-xs"
                    type="submit"
                    disabled={updateProfileLoadingState}
                  >
                    {updateProfileLoadingState ? "Updating..." : "Save"}
                    <LucideCircleCheck />
                  </Button>
                  <Button
                    className="text-xs"
                    type="button"
                    onClick={disableEditMode}
                  >
                    Cancel
                    <LucideXCircle />
                  </Button>
                </>
              ) : (
                <Button
                  className="text-xs"
                  type="button"
                  onClick={enableEditMode}
                >
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
          {/* Company Information Section */}
          <div className="w-full flex flex-col items-stretch gap-5 bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 overflow-hidden">
            <SectionTitle
              icon={<LucideBuilding />}
              title="Company Information"
            />

            {/* Name and Description Section */}
            <div className="flex flex-col items-start gap-5">
              <LabelInput
                label="Company Name"
                input={
                  <Input
                    placeholder={isEdit ? "Company Name" : company.name}
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
                  autoResize
                  placeholder={
                    isEdit ? "Company Description" : company.description
                  }
                  id="company-description"
                  {...form.register("basicInfo.description")}
                  disabled={!isEdit}
                />
              </div>

              {/* Industry and Location Section */}
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                <LabelInput
                  label="Industry"
                  input={
                    <Input
                      placeholder={isEdit ? "Industry" : company.industry}
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
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
              </div>

              {/* CompanySize, FoundedYear, Email and PhoneNumber Section */}
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                {company.companySize && (
                  <LabelInput
                    label="Company Size"
                    input={
                      <Input
                        type="number"
                        placeholder={
                          isEdit ? "Company Size" : `${company.companySize}`
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
                    label="Founded Year"
                    input={
                      <Input
                        type="number"
                        placeholder={
                          isEdit ? "Founded Year" : `${company.foundedYear}`
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
                  label="Email"
                  input={
                    <Input
                      placeholder={isEdit ? "Email" : user.email}
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
                  label="Phone Number"
                  input={
                    <Input
                      placeholder={isEdit ? "Phone number" : company.phone}
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
              <div className="flex items-center justify-between gap-2.5 mb-0 pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]">
                      <LucideUsers />
                    </span>
                  </div>
                  <h3 className="font-semibold text-base">
                    Open Position Information
                  </h3>
                </div>
                {isEdit && (
                  <div onClick={addNewOpenPosition}>
                    <IconLabel
                      text="Add OpenPosition"
                      icon={<LucidePlus className="text-muted-foreground" />}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
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
                        positionIndex={index}
                        positionUUID={openPositionId ?? ""}
                        isEdit={isEdit}
                        title={form.watch(`openPositions.${index}.title`)}
                        description={form.watch(
                          `openPositions.${index}.description`,
                        )}
                        type={form.watch(`openPositions.${index}.type`)}
                        experienceReqirement={form.watch(
                          `openPositions.${index}.experienceRequirement`,
                        )}
                        educationRequirement={form.watch(
                          `openPositions.${index}.educationRequirement`,
                        )}
                        skills={
                          form.watch(`openPositions.${index}.skills`) ?? ""
                        }
                        salary={form.watch(`openPositions.${index}.salary`)}
                        deadlineDate={{
                          defaultValue:
                            (form.getValues(
                              `openPositions.${index}.deadlineDate`,
                            ) as unknown as Date) ?? new Date(),
                          data:
                            (form.getValues(
                              `openPositions.${index}.deadlineDate`,
                            ) as unknown as Date) ?? new Date(),
                          onDataChange: (date) => {
                            form.setValue(
                              `openPositions.${index}.deadlineDate`,
                              date as unknown as Date,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              },
                            );
                          },
                        }}
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
                      src={emptySvgImage}
                      className="size-44 animate-float"
                    />
                    <TypographyMuted className="text-sm">
                      No Open Position Available.
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
              title="Company Images Information"
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
                          Add Company Image
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
              <SectionTitle icon={<LucideCircleCheck />} title="Benefits" />
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
                          <LucideCircleCheck stroke="white" fill="#0073E6" />
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
                      No Benefit Avaliable
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
                      Add New Benefit
                      <LucidePlus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                    <Input
                      placeholder="Enter your benefit (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"
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
                        Cancel
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
                        Save
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
              <SectionTitle icon={<LucideZap />} title="Values" />
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
                          <LucideCircleCheck stroke="white" fill="#69B41E" />
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
                      No Value Avaliable
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
                      Add New Value
                      <LucidePlus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                    <Input
                      placeholder="Enter your value (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"
                      onChange={(e) => setValueInput({ label: e.target.value })}
                    />
                    <div className="flex items-center gap-1 [&>button]:text-xs">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setOpenValuePopOver(false)}
                      >
                        Cancel
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
                        Save
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
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
                        getAllCareerScopeStore.getAllCareerScopes();
                      }}
                    >
                      {careerScopeInput
                        ? getAllCareerScopeStore.careerScopes?.find(
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
                          {getAllCareerScopeStore.loading
                            ? "Loading Career..."
                            : "No Career Found"}
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
                  Add New CareerScope
                </Button>
              </>
            )}
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
                  No Social Avaliable
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

      {/* Loading Dialog Section */}
      <LoadingDialog
        loading={updateProfileLoadingState}
        title={loadingMessage || "Updating company profile..."}
        subTitle="Please wait while we save your company details."
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
