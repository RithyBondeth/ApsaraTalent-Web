"use client";

import OpenPositionForm from "@/components/company/profile/open-position-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Select,
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
import {
  locationConstant,
  loginMethodConstant,
  platformConstant,
} from "@/utils/constants/app.constant";
import {
  ChevronDown,
  LucideBuilding,
  LucideCamera,
  LucideCheck,
  LucideCircleCheck,
  LucideEdit,
  LucideLink2,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideUsers,
  LucideXCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Tag from "@/components/utils/tag";
import ImagePopup from "@/components/utils/image-popup";
import { TPlatform } from "@/utils/types/platform.type";
import {
  IBenefits,
  ICareerScopes,
  ISocial,
  IValues,
} from "@/utils/interfaces/user-interface/company.interface";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { CompanyProfilePageSkeleton } from "./skeleton";
import {
  TCompanyUpdateBody,
  useUpdateOneCompanyStore,
} from "@/stores/apis/company/update-one-cmp.store";
import { useUploadCompanyAvatarStore } from "@/stores/apis/company/upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "@/stores/apis/company/upload-cmp-cover.store";
import { useUploadCompanyImagesStore } from "@/stores/apis/company/upload-cmp-images.store";
import { useRemoveOneOpenPositionStore } from "@/stores/apis/company/remove-one-open-position.store";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";
import { isUuid } from "@/utils/functions/check-uuid";
import { useGetAllCareerScopesStore } from "@/stores/apis/users/get-all-career-scopes.store";
import { useRemoveOneCmpImageStore } from "@/stores/apis/company/remove-one-cmp-image.store";
import { useRemoveCmpAvatarStore } from "@/stores/apis/company/remove-cmp-avatar.store";
import { useRemoveCmpCoverStore } from "@/stores/apis/company/remove-cmp-cover.store";
import emptySvgImage from "@/assets/svg/empty.svg";
import Image from "next/image";
import { capitalizeWords } from "@/utils/functions/capitalize-words";
import RemoveAlertDialog from "@/components/utils/dialogs/remove-alert-dialog";
import { parseMaybeDate } from "@/utils/functions/parse-maybe-date";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import Link from "next/link";

export default function ProfilePage() {
  // API Integration
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

  /* ------------------------ All States ------------------------ */
  // Utils
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Image States
  const [openImagePopup, setOpenImagePopup] = useState<boolean>(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(
    null,
  );
  const [openRemoveImageDialog, setOpenRemoveImageDialog] =
    useState<boolean>(false);
  const [removedImage, setRemoveImage] = useState<{
    id: string;
    index: number;
  } | null>(null);

  // Avatar and Cover States
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [openAvatarPopup, setOpenAvatarPopup] = useState<boolean>(false);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] =
    useState<boolean>(false);
  const [openRemoveCoverDialog, setOpenRemoveCoverDialog] =
    useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  // Benefit States
  const [benefitInput, setBenefitInput] = useState<IBenefits | null>(null);
  const [benefits, setBenefits] = useState<IBenefits[]>([]);
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<number[]>([]);
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);

  // Value States
  const [valueInput, setValueInput] = useState<IValues | null>(null);
  const [values, setValues] = useState<IValues[]>([]);
  const [deletedValueIds, setDeletedValueIds] = useState<number[]>([]);
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);

  // CareerScope States
  const [careerScopeInput, setCareerScopeInput] =
    useState<ICareerScopes | null>(null);
  const [careerScopes, setCareerScopes] = useState<ICareerScopes[]>([]);
  const [deleteCareerScopeIds, setDeleteCareerScopeIds] = useState<string[]>(
    [],
  );
  const [openCareerScopePopOver, setOpenCareerScopePopOver] =
    useState<boolean>(false);

  // Social States
  const [socialInput, setSocialInput] = useState<ISocial | null>(null);
  const [socials, setSocials] = useState<ISocial[]>([]);
  const [deleteSocialIds, setDeleteSocialIds] = useState<string[]>([]);
  const socialSelectPlatformRef = useRef<HTMLButtonElement>(null);

  // OpenPosition States
  const [openRemoveOpenPositionDialog, setOpenRemoveOpenPositionDialog] =
    useState<boolean>(false);
  const [currentOpenPositionID, setCurrentOpenPositionID] = useState<
    string | null
  >(null);

  /* ------------------------ Company Profile Form ------------------------ */
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

  // Get Current User Effect
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Avatar and Cover Preview
  const [avatarOrCoverPreview, setAvatarOrCoverPreview] = useState<{
    avatar: string | undefined;
    cover: string | undefined;
  }>({
    avatar: undefined,
    cover: undefined,
  });

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

  /* --------------------- Edit Mode Bussiness Logics --------------------- */
  // Close All The Dialogs
  const closeAllDialogs = () => {
    setOpenRemoveAvatarDialog(false);
    setOpenRemoveImageDialog(false);
    setOpenRemoveOpenPositionDialog(false);
    setOpenRemoveCoverDialog(false);
  };

  // Enable Edit Mode
  const enableEditMode = () => {
    getAllCareerScopeStore.getAllCareerScopes();
    setIsEdit(true);
  };

  const disableEditMode = async () => {
    await getCurrentUser();
    closeAllDialogs();
    setIsEdit(false);
  };

  /* ------------------- Avatar, Cover and Image Bussiness Logics ------------------- */
  // 1.API: Remove Avatar
  const removeAvatar = async () => {
    if (company) await removeCmpAvatarStore.removeCmpAvatar(company.id);

    await disableEditMode();

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

  // 2.API: Remove Cover
  const removeCover = async () => {
    if (company) await removeCmpCoverStore.removeCmpCover(company.id);

    await disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Cover Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  // 3.API: Remove Single Image
  const removeSingleImage = async (imageId: string, index: number) => {
    const updated = form.watch("images")?.filter((_, i) => i !== index);
    form.setValue("images", updated);

    if (company)
      await removeOneCompImageStore.removeOneCmpImage(company.id, imageId);

    await disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Cover Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  // 4.Handle Click Image Popup
  const handleClickImagePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenImagePopup(true);
  };

  // 5.Handle Click Avatar Popup
  const handleClickAvatarPopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenAvatarPopup(true);
  };

  // 6.Handle File Change for Avatar and Cover
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (type === "avatar") {
        setAvatarFile(file);
        form.setValue("basicInfo.avatar", file);
      } else if (type === "cover") {
        setCoverFile(file);
        form.setValue("basicInfo.cover", file);
      }
    }
  };

  /* ------------------- OpenPosition Bussiness Logics ------------------- */
  // 1.Add New Open Position
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

  // 2. API: Remove OpenPosition
  const removeOpenPosition = async (openPositionID: string) => {
    await removeOneOpenPositionStore.removeOneOpenPosition(
      company!.id,
      openPositionID,
    );

    await disableEditMode();

    toast({
      variant: "success",
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Open Position Successfully!
          </TypographySmall>
        </div>
      ),
    });
  };

  /* ------------------- Benefit Bussiness Logics ------------------- */
  // 1. Add New Benefit
  const addNewBenefits = () => {
    const trimmed = benefitInput?.label?.trim();
    if (!trimmed) return;

    const alreadyExists = benefits.some(
      (bf) => bf.label.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Benefit",
        description: "Please input another benefit.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
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

  // 2. Remove Benefit
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

  /* ------------------- Value Bussiness Logics ------------------- */
  // 1.Add New Value
  const addNewValue = () => {
    const trimmed = valueInput?.label?.trim();
    if (!trimmed) return;

    const alreadyExists = values.some(
      (v) => v.label.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated value",
        description: "Please input another value.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
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

  // 2.Remove Value
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

  /* -------------------  CareerScope Bussiness Logics ------------------- */
  //  1.Handle CareerScope Select
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
  const addNewCareerScope = () => {
    const name = careerScopeInput?.name?.trim();
    if (!name) return;

    const alreadyExists = careerScopes.some(
      (c) => (c.name ?? "").trim().toLowerCase() === name.toLowerCase(),
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

  /* ------------------- Social Bussiness Logics ------------------- */
  // 1.Add New Social
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
      toast({
        variant: "destructive",
        title: "Duplicate Social",
        description: "This social platform already exists.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return false;
    }

    const urlExists = socials.some(
      (s) => (s.url ?? "").trim().toLowerCase() === normalizedUrl,
    );

    if (urlExists) {
      toast({
        variant: "destructive",
        title: "Duplicate URL",
        description: "This social link already exists.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
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

  // 2.Remove Social
  const removeSocial = (platform: TPlatform) => {
    const toDelete = socials.find((s) => s.platform === platform);
    if (toDelete?.id) setDeleteSocialIds((prev) => [...prev, toDelete.id!]);

    const updated = socials.filter((s) => s.platform !== platform);
    setSocials(updated);
    form.setValue("socials", updated, { shouldDirty: true, shouldTouch: true });
  };

  /* ------------------- onSubmit Bussiness Logics ------------------- */
  // 1.onSubmit - API: Update The Entire Company Profile
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
          (updateBody as any)[key] = data.basicInfo?.[key];
        }
      });

      /* ------------------------ ACCOUNT SETTINGS ------------------------ */
      const accountKeys: (keyof NonNullable<typeof data.accountSetting>)[] = [
        "email",
        "phone",
      ];

      accountKeys.forEach((key) => {
        if (dirtyFields?.accountSetting?.phone) {
          (updateBody as any).phone = data.accountSetting?.phone?.trim()
            ? data.accountSetting.phone.trim()
            : null;
        }
        if (dirtyFields?.accountSetting?.[key]) {
          (updateBody as any)[key] = data.accountSetting?.[key];
        }
      });

      /* ------------------------ OPEN POSITIONS ------------------------ */
      if (
        Array.isArray(dirtyFields.openPositions) &&
        Array.isArray(data.openPositions)
      ) {
        const updatedPositions = data.openPositions.map((pos, index) => {
          const updatedPos: Record<string, any> = {};
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

        if (updatedPositions.length > 0)
          updateBody.openPositions = updatedPositions as any;
      }

      /* ------------------------ BENEFITS & VALUES ------------------------ */
      if (
        dirtyFields.benefitsAndValues?.benefits ||
        deletedBenefitIds.length > 0
      ) {
        updateBody.benefits = data.benefitsAndValues?.benefits || [];

        if (deletedBenefitIds.length > 0)
          updateBody.benefitIdsToDelete = deletedBenefitIds;
      }

      if (dirtyFields.benefitsAndValues?.values || deletedValueIds.length > 0) {
        updateBody.values = data.benefitsAndValues?.values || [];

        if (deletedValueIds.length > 0)
          updateBody.valueIdsToDelete = deletedValueIds;
      }

      /* ------------------------ CAREER SCOPES ------------------------ */
      if (dirtyFields.careerScopes || deleteCareerScopeIds.length > 0) {
        updateBody.careerScopes = data.careerScopes || [];

        if (deleteCareerScopeIds.length > 0)
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
      }

      /* ------------------------ SOCIALS ------------------------ */
      if (dirtyFields.socials || deleteSocialIds.length > 0) {
        updateBody.socials =
          data.socials
            ?.filter((s): s is { id: string; platform: string; url: string } =>
              Boolean(s && s.platform && s.url),
            )
            .map((s) => ({
              id: s.id,
              platform: s.platform,
              url: s.url,
            })) || [];

        if (deleteSocialIds.length > 0)
          updateBody.socialIdsToDelete = deleteSocialIds;
      }

      /* ------------------------ IMAGE UPLOADS ------------------------ */
      const uploadTasks: Promise<any>[] = [];

      if (data.basicInfo?.avatar instanceof File) {
        uploadTasks.push(
          uploadAvatarCmpStore.uploadAvatar(company!.id, data.basicInfo.avatar),
        );
      }

      if (data.basicInfo?.cover instanceof File) {
        uploadTasks.push(
          uploadCoverCmpStore.uploadCover(company!.id, data.basicInfo.cover),
        );
      }

      if (data.images) {
        const imageFiles: File[] = data.images
          .map((img) => img?.image)
          .filter((image): image is File => image instanceof File);

        if (imageFiles.length > 0) {
          uploadTasks.push(
            uploadCmpImagesStore.uploadImages(company!.id, imageFiles),
          );
        }
      }

      await Promise.all(uploadTasks);

      /* ------------------------ API UPDATE ------------------------ */
      if (Object.keys(updateBody).length > 0) {
        await updateOneCmpStore.updateOneCompany(company!.id, updateBody);
      }

      await getCurrentUser();
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to update company profile.",
      });
    }
  };

  // 2.handleSubmit: Submit Company Profile Form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kepp Local Arrays Synced into RHF
    form.setValue("benefitsAndValues.benefits", benefits, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("benefitsAndValues.values", values, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("careerScopes", careerScopes, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("socials", socials, {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (avatarFile)
      form.setValue("basicInfo.avatar", avatarFile, { shouldDirty: true });

    if (coverFile)
      form.setValue("basicInfo.cover", coverFile, { shouldDirty: true });

    form.handleSubmit(onSubmit, (errors) => console.log("RHF errors:", errors))(
      e,
    );
  };

  // Loading State Effect
  useEffect(() => {
    if (!updateProfileLoadingState) return;

    // Loading Message on Toast
    const toastInstance = toast({
      description: (
        <div className="flex items-center gap-2">
          <ApsaraLoadingSpinner size={50} loop />
          <TypographySmall className="font-medium leading-relaxed">
            {loadingMessage}
          </TypographySmall>
        </div>
      ),
      duration: Infinity,
    });

    return () => toastInstance.dismiss();
  }, [updateProfileLoadingState, loadingMessage, toast]);

  if (loading) return <CompanyProfilePageSkeleton />;
  if (!user || !company) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Header Section */}
      <div
        className="relative h-80 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center"
        style={{
          backgroundImage: `url(${avatarOrCoverPreview.cover})`,
        }}
      >
        {/* Cover and Overlay Section */}
        <BlurBackGroundOverlay />
        {isEdit && (
          <div className="absolute bottom-5 right-5 flex flex-col items-start gap-2">
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

        <div className="relative flex items-center gap-5 tablet-sm:flex-col">
          {/* Avatar Section */}
          <Avatar
            className="size-32 tablet-sm:size-28 relative bg-primary-foreground"
            rounded="md"
            onClick={(e) => {
              if (!isEdit && company.avatar) handleClickAvatarPopup(e);
            }}
          >
            <AvatarImage src={avatarOrCoverPreview.avatar} />
            <AvatarFallback className="uppercase text-lg font-medium">
              {company.name.slice(0, 3)}
            </AvatarFallback>

            {isEdit && (
              <div className="absolute bottom-1 right-1 flex items-center gap-2">
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
          </Avatar>

          <input
            ref={avatarInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "avatar")}
          />

          <input
            ref={coverInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "cover")}
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
          <div className="flex flex-col items-start gap-2 text-muted tablet-sm:items-center">
            <TypographyH2 className="tablet-sm:text-center tablet-sm:text-xl">
              {company.name}
            </TypographyH2>
            <TypographyP className="!m-0 tablet-sm:text-center tablet-sm:text-sm">
              {company.industry}
            </TypographyP>
          </div>
        </div>

        {/* Edit Profile Button Section */}
        {isEdit ? (
          <div className="flex items-center gap-3 absolute top-5 right-5 phone-xl:top-2 phone-xl:right-2">
            <Button
              className="text-xs"
              type="submit"
              disabled={updateProfileLoadingState}
            >
              {updateProfileLoadingState ? "Updating..." : "Save"}
              <LucideCircleCheck />
            </Button>
            <Button className="text-xs" type="button" onClick={disableEditMode}>
              Cancel
              <LucideXCircle />
            </Button>
          </div>
        ) : (
          <Button
            className="text-xs absolute top-5 right-5 phone-xl:top-2 phone-xl:right-2"
            type="button"
            onClick={enableEditMode}
          >
            Edit Profile
            <LucideEdit />
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* LEFT Side Section */}
        <div className="w-[60%] flex flex-col gap-5">
          {/* Company Information Section */}
          <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Company Information</TypographyH4>
              <Divider />
            </div>

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
            <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <TypographyH4>Open Position Information</TypographyH4>
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
                <Divider />
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
                            ) as any) ?? new Date(),
                          data:
                            (form.getValues(
                              `openPositions.${index}.deadlineDate`,
                            ) as any) ?? new Date(),
                          onDataChange: (date) => {
                            form.setValue(
                              `openPositions.${index}.deadlineDate`,
                              date as any,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              },
                            );
                          },
                        }}
                        onRemove={() => {
                          if (openPositionId && isUuid(openPositionId)) {
                            setOpenRemoveOpenPositionDialog(true);
                            setCurrentOpenPositionID(openPositionId);
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
                      className="size-44"
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
                openDialog={openRemoveOpenPositionDialog}
                setOpenDialog={setOpenRemoveOpenPositionDialog}
                onNoClick={() => setOpenRemoveOpenPositionDialog(false)}
                onYesClick={() => {
                  if (currentOpenPositionID) {
                    removeOpenPosition(currentOpenPositionID);
                    setOpenRemoveOpenPositionDialog(false);
                  }
                }}
              />
            </div>
          )}

          {/* Company Images Section */}
          {company.images && (
            <div className="w-full p-5 border-[1px] border-muted rounded-md">
              <div className="flex flex-col gap-1">
                <TypographyH4>Company Images Information</TypographyH4>
                <Divider />
              </div>
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
                  {isEdit && (
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
          )}
        </div>

        {/* RIGHT SIDE Section */}
        <div className="w-[40%] flex flex-col gap-5">
          {/* Benefits Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Benefits</TypographyH4>
              <Divider />
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
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Values</TypographyH4>
              <Divider />
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
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Careers Scopes</TypographyH4>
              <Divider />
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
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Social Information</TypographyH4>
              <Divider />
            </div>

            {/* Social List Section */}
            {socials && socials.length > 0 ? (
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
                  <div className="w-full flex flex-col items-start gap-5 p-5 mt-3 border-[1px] border-muted rounded-md">
                    <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                      <div className="w-full flex flex-col items-start gap-1">
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
                            className="h-12 text-muted-foreground"
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
                                ...(prev ?? { id: "", platform: "", url: "" }),
                                url: e.target.value,
                              }))
                            }
                            prefix={<LucideLink2 />}
                          />
                        }
                      />
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
          <div className="flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Authentication</TypographyH4>
              <Divider />
            </div>

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
