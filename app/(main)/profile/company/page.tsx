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
  platformConstant,
} from "@/utils/constants/app.constant";
import { TLocations } from "@/utils/types/location.type";
import { Select } from "@radix-ui/react-select";
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
import { Controller, useForm } from "react-hook-form";
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
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Tag from "@/components/utils/tag";
import ImagePopup from "@/components/utils/image-popup";
import { getSocialPlatformTypeIcon } from "@/utils/extensions/get-social-type";
import { TPlatform } from "@/utils/types/platform.type";
import {
  IBenefits,
  ICareerScopes,
  IJobPosition,
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
import RemoveOpenPositionDialog from "./_dialogs/remove-open-position-dialog";
import { isUuid } from "@/utils/functions/check-uuid";
import { useGetAllCareerScopesStore } from "@/stores/apis/users/get-all-career-scopes.store";
import { useRemoveOneCmpImageStore } from "@/stores/apis/company/remove-one-cmp-image.store";
import RemoveImageDialog from "./_dialogs/remove-image-dialog";
import { useRemoveCmpAvatarStore } from "@/stores/apis/company/remove-cmp-avatar.store";
import { useRemoveCmpCoverStore } from "@/stores/apis/company/remove-cmp-cover.store";
import emptySvgImage from "@/assets/svg/empty.svg";
import Image from "next/image";
import { capitalizeWords } from "@/utils/functions/capitalize-words";
import RemoveAvatarOrCoverDialog from "./_dialogs/remove-avatar-cover-dialog";

export default function ProfilePage() {
  // Store hooks
  const { user, loading, getCurrentUser } = useGetCurrentUserStore();
  const getAllCareerScopeStore = useGetAllCareerScopesStore();
  const company = user?.company;
  const updateOneCmpStore = useUpdateOneCompanyStore();
  const uploadAvatarCmpStore = useUploadCompanyAvatarStore();
  const uploadCoverCmpStore = useUploadCompanyCoverStore();
  const uploadCmpImagesStore = useUploadCompanyImagesStore();
  const removeOneOpenPosition = useRemoveOneOpenPositionStore();
  const removeOneCompImage = useRemoveOneCmpImageStore();
  const removeCmpAvatar = useRemoveCmpAvatarStore();
  const removeCmpCover = useRemoveCmpCoverStore();

  const updateProfileLoadingState =
    updateOneCmpStore.loading ||
    uploadAvatarCmpStore.loading ||
    uploadCoverCmpStore.loading ||
    uploadCmpImagesStore.loading ||
    removeOneOpenPosition.loading ||
    removeOneCompImage.loading ||
    removeCmpAvatar.loading ||
    removeCmpCover.loading;

  const { toast } = useToast();

  // Form hook
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

  // All useState hooks
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openImagePopup, setOpenImagePopup] = useState<boolean>(false);
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(
    null
  );
  const [openRemoveImageDialog, setOpenRemoveImageDialog] =
    useState<boolean>(false);
  const [removedImage, setRemoveImage] = useState<{
    id: string;
    index: number;
  } | null>(null);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] =
    useState<boolean>(false);
  const [openRemoveCoverDialog, setOpenRemoveCoverDialog] =
    useState<boolean>(false);

  const [openPositions, setOpenPositions] = useState<IJobPosition[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<TLocations | string>(
    ""
  );
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);
  const [benefitInput, setBenefitInput] = useState<IBenefits | null>(null);
  const [benefits, setBenefits] = useState<IBenefits[]>([]);
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<number[]>([]);
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<IValues | null>(null);
  const [values, setValues] = useState<IValues[]>([]);
  const [deletedValueIds, setDeletedValueIds] = useState<number[]>([]);
  const [openCareersPopOver, setOpenCareersPopOver] = useState<boolean>(false);
  const [careersInput, setCareersInput] = useState<ICareerScopes | null>(null);
  const [careers, setCareers] = useState<ICareerScopes[]>([]);
  const [deleteCareerScopeIds, setDeleteCareerScopeIds] = useState<string[]>(
    []
  );
  const [socialInput, setSocialInput] = useState<ISocial | null>(null);
  const [socials, setSocials] = useState<ISocial[]>([]);
  const [deleteSocialIds, setDeleteSocialIds] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<
    Record<string, { posted?: Date; deadline?: Date }>
  >({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [openRemoveOpenPositionDialog, setOpenRemoveOpenPositionDialog] =
    useState<boolean>(false);
  const [currentOpenPositionID, setCurrentOpenPositionID] = useState<
    string | null
  >(null);

  // All useRef hooks
  const ignoreNextClick = useRef<boolean>(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // All useEffect hooks
  useEffect(() => {
    // Get current user with HTTP-only cookies
    getCurrentUser();
  }, []);

  const enableEditMode = () => {
    getAllCareerScopeStore.getAllCareerScopes();
    setIsEdit(true);
  };

  const disableEditMode = () => {
    if(avatarFile) setAvatarFile(null);
    setIsEdit(false);
    form.reset();
  };

  useEffect(() => {
    if (user && company) {
      // Initialize form data
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
          phone: company.phone,
        },
        openPositions:
          company.openPositions.map((op) => {
            // Handle deadlineDate parsing with null check
            let deadlineDate = new Date();
            if (op.deadlineDate && typeof op.deadlineDate === "string") {
              if (op.deadlineDate.includes("/")) {
                // Parse DD/MM/YYYY string
                const [day, month, year] = op.deadlineDate
                  .split("/")
                  .map(Number);
                deadlineDate = new Date(year, month - 1, day);
              } else {
                // Parse as ISO string or other format
                deadlineDate = new Date(op.deadlineDate);
              }
            }
            return {
              uuid: op.id,
              title: op.title,
              description: op.description,
              type: op.type,
              educationRequirement: op.education,
              experienceRequirement: op.experience,
              salary: op.salary || "0",
              deadlineDate: deadlineDate,
              skills: Array.isArray(op.skills)
                ? op.skills.join(", ")
                : op.skills || "",
            };
          }) || [],
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
        careerScopes: company.careerScopes.map((cs) => ({
          name: cs.name,
          description: cs.description,
        })),
        socials: company.socials.map((sc) => ({
          id: sc.id,
          platform: sc.platform,
          url: sc.url,
        })),
      });

      setSocials(company.socials ?? []);
      setCareers(company.careerScopes ?? []);
      setOpenPositions(company.openPositions ?? []);
      setBenefits(company.benefits ?? []);
      setValues(company.values ?? []);
      setSelectedLocation(company.location ?? "");
      setSelectedDates(
        Object.fromEntries(
          company.openPositions.map((op) => [
            op.id?.toString() ?? "",
            { deadline: new Date(op.deadlineDate) },
          ])
        )
      );
    }
  }, [user, company, form]);

  useEffect(() => {
    const initialSocial = (form.getValues?.("socials") || []).filter(
      (s): s is { platform: string; url: string } => s !== undefined
    );
    setSocials(initialSocial);
  }, [form]);

  useEffect(() => {
    const initialCareerScope = form.getValues("careerScopes") || [];
    setCareers(
      initialCareerScope.map((cp) => ({
        id: cp?.id ?? "",
        name: cp?.name ?? "",
        description: cp?.description ?? "",
      }))
    );
  }, [form]);

  useEffect(() => {
    const initialBenefit = form.getValues("benefitsAndValues.benefits") || [];
    setBenefits(
      initialBenefit.map((bf) => ({
        id: bf.id,
        label: bf.label,
      }))
    );
  }, [form]);

  useEffect(() => {
    const initialValue = form.getValues("benefitsAndValues.values") || [];
    setBenefits(
      initialValue.map((vl) => ({
        id: vl.id,
        label: vl.label,
      }))
    );
  }, [form]);

  useEffect(() => {
    if (openImagePopup || openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openImagePopup, openProfilePopup]);

  // Add an open position
  const addOpenPosition = () => {
    const newPosition = {
      id: Date.now().toString(),
      title: "",
      description: "",
      experienceRequirement: "",
      educationRequirement: "",
      skills: [],
      salary: "",
      type: "Full Time",
      experience: "",
      education: "",
      postedDate: new Date().toISOString(),
      deadlineDate: new Date().toISOString(),
    };

    setOpenPositions((prevPositions) => [...prevPositions!, newPosition]);
  };

  // Remove an open position
  const removeOpenPosition = async (openPositionID: string) => {
    await removeOneOpenPosition.removeOneOpenPosition(
      company!.id,
      openPositionID
    );

    // Refetch current user to get updated data
    await getCurrentUser();

    toast({
      description: (
        <div className="flex items-center gap-2">
          <LucideCheck />
          <TypographySmall className="font-medium leading-relaxed">
            Remove Open Position Successfully!
          </TypographySmall>
        </div>
      ),
    });

    setIsEdit(false);
  };

  const addBenefits = () => {
    const trimmed = benefitInput?.label.trim();
    if (!trimmed) return;

    // Get current benefits from form
    const currentBenefits = form.getValues("benefitsAndValues.benefits") || [];

    const alreadyExists = currentBenefits.some(
      (bf) => bf.label.toLowerCase() === trimmed.toLowerCase()
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

    // Add new benefit WITHOUT id (will be created in backend)
    const updatedBenefits = [...currentBenefits, { label: trimmed }];

    // Update form state
    form.setValue("benefitsAndValues.benefits", updatedBenefits, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setBenefits(updatedBenefits); // Update local state for UI
    setBenefitInput(null);
    setOpenBenefitPopOver(false);
  };

  const removeBenefit = async (benefitToRemove: string) => {
    const currentBenefits = form.getValues("benefitsAndValues.benefits") || [];

    // Find the benefit to remove
    const benefitToDelete = currentBenefits.find(
      (bf) => bf.label === benefitToRemove
    );

    // If it has an ID, track it for deletion
    if ("id" in benefitToDelete! && benefitToDelete.id) {
      setDeletedBenefitIds((prev) => [...prev, benefitToDelete.id as number]);
    }

    // Remove from form
    const updated = currentBenefits.filter(
      (bf) => bf.label !== benefitToRemove
    );
    form.setValue("benefitsAndValues.benefits", updated, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setBenefits(updated); // Update local state for UI
  };

  const addValue = () => {
    const trimmed = valueInput?.label.trim();
    if (!trimmed) return;

    const currentValues = form.getValues("benefitsAndValues.values") || [];

    const alreadyExists = currentValues.some(
      (value) => value.label.toLowerCase() === trimmed.toLowerCase()
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

    // Add new value WITHOUT id
    const updatedValues = [...currentValues, { label: trimmed }];
    form.setValue("benefitsAndValues.values", updatedValues, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setValues(updatedValues);
    setValueInput(null);
    setOpenValuePopOver(false);
  };

  const removeValue = async (valueToRemove: string) => {
    const currentValues = form.getValues("benefitsAndValues.values") || [];

    // Find the value to remove
    const valueToDelete = currentValues.find(
      (value) => value.label === valueToRemove
    );

    // If it has an ID, track it for deletion
    if ("id" in valueToDelete! && valueToDelete.id) {
      setDeletedValueIds((prev) => [...prev, valueToDelete.id as number]);
    }

    // Remove from form
    const updatedValues = currentValues.filter(
      (value) => value.label !== valueToRemove
    );
    form.setValue("benefitsAndValues.values", updatedValues, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setValues(updatedValues);
  };

  const addCareers = () => {
    const trimmed = careersInput?.name.trim();
    const id = careersInput?.id;
    const description = careersInput?.description;
    if (!trimmed) return;

    const currentCareerScopes = form.getValues("careerScopes") || [];

    // Check for duplicate careers
    const alreadyExists = currentCareerScopes.some(
      (career) => career.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated career",
        description: "Please input another career.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setCareersInput(null);
      setOpenCareersPopOver(false);
      return;
    }

    // Add new career
    const updatedCareers = [
      ...careers.map((career) => ({
        id: career.id ?? "",
        name: career.name,
        description: career.description ?? "",
      })),
      { id: id ?? "", name: trimmed, description: description ?? "" },
    ];
    form.setValue("careerScopes", updatedCareers, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setCareers(updatedCareers);
    setCareersInput(null);
    setOpenCareersPopOver(false); // Close popover after adding career
  };

  // Handle the career selection from the dropdown or input
  const handleCareerSelect = (
    selectedCareerId: string,
    selectedCareerName: string,
    selectedCareerDescription: string
  ) => {
    setCareersInput({
      id: selectedCareerId,
      name: selectedCareerName,
      description: selectedCareerDescription,
    }); // Set the selected career to input
    setOpenCareersPopOver(false); // Close popover after selecting
  };

  // Handle delete career
  const removeCareer = (careerToRemove: string) => {
    const currentCareers = form.getValues("careerScopes") || [];

    // Find the career to delete
    const careerToDelete = currentCareers.find(
      (career) => career.name === careerToRemove
    );

    // If it has an ID, track it for deletion
    if ("id" in careerToDelete! && careerToDelete.id) {
      setDeleteCareerScopeIds((prev) => [...prev, careerToDelete.id!]);
    }

    // Remove from form
    const updatedCareers = currentCareers.filter(
      (career) => career.name !== careerToRemove
    );
    form.setValue("careerScopes", updatedCareers, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setCareers(updatedCareers);
  };

  const addSocial = () => {
    const trimmedPlatform = socialInput?.platform.trim();
    const trimmedUrl = socialInput?.url.trim();
    if (!trimmedPlatform || !trimmedUrl) return;

    const currentSocials = form.getValues("socials") || [];

    // Check for duplicate social entries
    const alreadyExists = currentSocials.some(
      (s) => s?.platform?.toLowerCase() === trimmedPlatform.toLowerCase()
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

    setSocials(updatedSocials); // Update the state
    setSocialInput(null); // Reset the input
  };

  const removeSocial = (platform: TPlatform) => {
    const currentSocials = form.getValues("socials") || [];

    const socialToDelete = currentSocials.find(
      (sc) => sc?.platform === platform
    );

    if ("id" in socialToDelete! && socialToDelete.id) {
      setDeleteSocialIds((prev) => [...prev, socialToDelete.id as string]);
    }

    const updatedSocials = socials.filter(
      (sc) => sc.platform !== socialToDelete?.platform
    );
    form.setValue("socials", updatedSocials, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSocials(updatedSocials); // Update the state
  };

  const handleDateChange = (
    positionId: string,
    type: "posted" | "deadline",
    date: Date
  ) => {
    setSelectedDates((prev) => ({
      ...prev,
      [positionId]: {
        ...prev[positionId],
        [type]: date,
      },
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
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

  const onSubmit = async (data: TCompanyProfileForm) => {
    console.log("Company Profile Data: ", data);
    const updateBody: Partial<TCompanyUpdateBody> = {};

    try {
      const dirtyFields = form.formState.dirtyFields;

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

          // Include existing positions by UUID
          if (pos.uuid) {
            updatedPos.id = pos.uuid;
          }

          // For new positions (uuid === "" or null)
          if (!pos.uuid) {
            updatedPos.isNew = true; // optional flag if your backend needs it
          }

          // Always include existing positions (even if not dirty)
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

        // Always keep all open positions (existing + new)
        if (updatedPositions.length > 0) {
          updateBody.openPositions = updatedPositions as any;
        }
      }

      /* ------------------------ BENEFITS & VALUES ------------------------ */
      if (
        dirtyFields.benefitsAndValues?.benefits ||
        deletedBenefitIds.length > 0
      ) {
        // Send all current benefits (with or without IDs)
        updateBody.benefits = data.benefitsAndValues?.benefits || [];

        // Send IDs to delete
        if (deletedBenefitIds.length > 0) {
          updateBody.benefitIdsToDelete = deletedBenefitIds;
        }
      }

      if (dirtyFields.benefitsAndValues?.values || deletedValueIds.length > 0) {
        // Send all current values (with or without IDs)
        updateBody.values = data.benefitsAndValues?.values || [];

        // Send IDs to delete
        if (deletedValueIds.length > 0) {
          updateBody.valueIdsToDelete = deletedValueIds;
        }
      }

      /* ------------------------ CAREER SCOPES ------------------------ */
      if (dirtyFields.careerScopes || deleteCareerScopeIds.length > 0) {
        // Send all current careerScopes (with or without IDs)
        updateBody.careerScopes = data.careerScopes || [];

        // Send IDs to delete
        if (deleteCareerScopeIds.length > 0) {
          updateBody.careerScopeIdsToDelete = deleteCareerScopeIds;
        }
      }

      /* ------------------------ SOCIALS ------------------------ */
      if (dirtyFields.socials || deleteSocialIds.length > 0) {
        console.log("Social Data: ", data.socials);
        updateBody.socials =
          data.socials
            ?.filter((s): s is { id: string; platform: string; url: string } =>
              Boolean(s && s.platform && s.url)
            )
            .map((s) => ({
              id: s.id,
              platform: s.platform,
              url: s.url,
            })) || [];

        if (deleteSocialIds.length > 0) {
          updateBody.socialIdsToDelete = deleteSocialIds;
        }
      }

      /* ------------------------ IMAGE UPLOADS ------------------------ */
      const uploadTasks: Promise<any>[] = [];

      if (data.basicInfo?.avatar instanceof File) {
        uploadTasks.push(
          uploadAvatarCmpStore.uploadAvatar(company!.id, data.basicInfo.avatar)
        );
      }

      if (data.basicInfo?.cover instanceof File) {
        uploadTasks.push(
          uploadCoverCmpStore.uploadCover(company!.id, data.basicInfo.cover)
        );
      }

      if (data.images) {
        const imageFiles: File[] = data.images
          .map((img) => img?.image)
          .filter((image): image is File => image instanceof File);

        if (imageFiles.length > 0) {
          uploadTasks.push(
            uploadCmpImagesStore.uploadImages(company!.id, imageFiles)
          );
        }
      }

      await Promise.all(uploadTasks);

      console.log("Updated Body: ", updateBody);

      /* ------------------------ API UPDATE ------------------------ */
      if (Object.keys(updateBody).length > 0) {
        await updateOneCmpStore.updateOneCompany(company!.id, updateBody);
      }

      // Refresh page for refetch current user and reset form
      window.location.reload();

      form.reset(data);

      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideCheck />
            <TypographySmall className="font-medium leading-relaxed">
              Updated Company Profile Successfully!
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
        description: "Failed to update company profile.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Explicitly sync all state variables with the form
    form.setValue("benefitsAndValues.benefits", benefits);
    form.setValue("benefitsAndValues.values", values);
    form.setValue("careerScopes", careers);
    form.setValue("socials", socials);

    // Also sync any file uploads that might be managed outside the form
    if (avatarFile) {
      form.setValue("basicInfo.avatar", avatarFile);
    }

    if (coverFile) {
      form.setValue("basicInfo.cover", coverFile);
    }

    // Now submit the form
    form.handleSubmit(onSubmit, console.error)(e);
  };

  const handleRemoveOneCmpImage = async (imageId: string, index: number) => {
    const updated = form.watch("images")?.filter((_, i) => i !== index);
    form.setValue("images", updated);

    if (company) {
      await removeOneCompImage.removeOneCmpImage(company.id, imageId);
    }

    // Refetch current user
    await getCurrentUser();
    setIsEdit(false);
  };

  const handleRemoveCmpCover = async () => {
    if (company) {
      await removeCmpCover.removeCmpCover(company.id);
    }

    // Refetch current user
    await getCurrentUser();
    setIsEdit(false);

    // Close dialog
    setOpenRemoveCoverDialog(false);
  };

  const handleRemoveCmpAvatar = async () => {
    if (company) {
      await removeCmpAvatar.removeCmpAvatar(company.id);
    }

    // Refetch current user
    await getCurrentUser();
    setIsEdit(false);

    // Close dialog
    setOpenRemoveAvatarDialog(false);
  };

  // Profile, Cover and Image Popup handlers
  const handleClickImagePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenImagePopup(true);
  };

  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
  };

  useEffect(() => {
    if (removeOneOpenPosition.loading) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium leading-relaxed">
              Removing Open Position...
            </TypographySmall>
          </div>
        ),
      });
    }

    if (removeOneCompImage.loading) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium leading-relaxed">
              Removing Image...
            </TypographySmall>
          </div>
        ),
      });
    }

    if (updateProfileLoadingState) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium leading-relaxed">
              Updating Company Profile...
            </TypographySmall>
          </div>
        ),
      });
    }
  }, [
    removeOneOpenPosition.loading,
    removeOneCompImage.loading,
    updateProfileLoadingState,
  ]);

  if (loading) return <CompanyProfilePageSkeleton />;
  if (!user || !company) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div
        className="relative h-80 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center"
        style={{
          backgroundImage: `url(${
            coverFile ? URL.createObjectURL(coverFile) : company.cover
          })`,
        }}
      >
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
            <RemoveAvatarOrCoverDialog
              type="cover"
              setOnRemoveAvatarOrCoverDialog={setOpenRemoveCoverDialog}
              onRemoveAvatarOrCoverDialog={openRemoveCoverDialog}
              onNoClick={() => setOpenRemoveCoverDialog(false)}
              onYesClick={handleRemoveCmpCover}
            />
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "cover")}
          aria-label="Upload cover image"
        />
        <div className="relative flex items-center gap-5 tablet-sm:flex-col">
          <Avatar
            className="size-32 tablet-sm:size-28 relative bg-primary-foreground"
            rounded="md"
            onClick={(e) => {
              if (!isEdit) handleClickProfilePopup(e);
            }}
          >
            <AvatarImage
              src={
                avatarFile ? URL.createObjectURL(avatarFile) : company.avatar!
              }
            />
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
                <RemoveAvatarOrCoverDialog
                  type="avatar"
                  setOnRemoveAvatarOrCoverDialog={setOpenRemoveAvatarDialog}
                  onRemoveAvatarOrCoverDialog={openRemoveAvatarDialog}
                  onNoClick={() => setOpenRemoveAvatarDialog(false)}
                  onYesClick={handleRemoveCmpAvatar}
                />
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "avatar")}
              aria-label="Upload avatar image"
            />
          </Avatar>
          <div className="flex flex-col items-start gap-2 text-muted tablet-sm:items-center">
            <TypographyH2 className="tablet-sm:text-center tablet-sm:text-xl">
              {company.name}
            </TypographyH2>
            <TypographyP className="!m-0 tablet-sm:text-center tablet-sm:text-sm">
              {company.industry}
            </TypographyP>
          </div>
        </div>
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
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        <div className="w-[60%] flex flex-col gap-5">
          {/* Company Information Form Section */}
          <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Company Information</TypographyH4>
              <Divider />
            </div>
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
                    defaultValue={selectedLocation}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value: TLocations) => {
                          field.onChange(value);
                          setSelectedLocation(value);
                        }}
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue
                            placeholder={
                              isEdit ? "Select Location" : selectedLocation
                            }
                          />
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
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
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
              </div>
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
            </div>
          </div>

          {/* OpenPosition Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <TypographyH4>Open Position Information</TypographyH4>
                {isEdit && (
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={addOpenPosition}
                  >
                    <LucidePlus
                      className="text-muted-foreground"
                      width={"18px"}
                    />
                    <TypographyMuted>Add New</TypographyMuted>
                  </div>
                )}
              </div>
              <Divider />
            </div>
            <div
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-start gap-5"
            >
              {openPositions && openPositions.length > 0 ? (
                openPositions.map((position, index) => {
                  const positionId = position.id;
                  const deadlineDate =
                    selectedDates[positionId!]?.deadline ||
                    new Date(position.deadlineDate);
                  return (
                    <OpenPositionForm
                      key={index}
                      index={index}
                      form={form}
                      positionIndex={Number(position.id)}
                      positionUUID={position.id ?? ""}
                      isEdit={isEdit}
                      title={position.title}
                      description={position.description}
                      type={position.type}
                      experience={position.experience}
                      education={position.education}
                      skills={position.skills}
                      salary={position.salary}
                      deadlineDate={{
                        defaultValue: deadlineDate,
                        data: deadlineDate,
                        onDataChange: (date: Date | undefined) => {
                          if (date) {
                            if (positionId)
                              handleDateChange(positionId, "deadline", date);
                            form.setValue(
                              `openPositions.${index}.deadlineDate`,
                              date
                            );
                          }
                        },
                      }}
                      onRemove={() => {
                        if (position.id) {
                          if (isUuid(position.id)) {
                            setOpenRemoveOpenPositionDialog(true);
                            setCurrentOpenPositionID(position.id);
                          } else {
                            const updated = openPositions.filter(
                              (op) => op.id !== positionId
                            );
                            setOpenPositions(updated);
                          }
                        }
                      }}
                    />
                  );
                })
              ) : (
                <div className="w-full flex flex-col items-center justify-center p-5">
                  <Image alt="empty" src={emptySvgImage} className="size-44" />
                  <TypographyMuted className="text-sm">
                    No Open Position Available.
                  </TypographyMuted>
                </div>
              )}
            </div>
            <RemoveOpenPositionDialog
              onRemoveOpDialog={openRemoveOpenPositionDialog}
              setOnRemoveOpDialog={setOpenRemoveOpenPositionDialog}
              onNoClick={() => setOpenRemoveOpenPositionDialog(false)}
              onYesClick={() => {
                if (currentOpenPositionID) {
                  removeOpenPosition(currentOpenPositionID);
                  setOpenRemoveOpenPositionDialog(false);
                }
              }}
            />
          </div>

          {/* Company Multiple Images Section */}
          {((company.images && company.images.length > 0) || isEdit) && (
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
                  <RemoveImageDialog
                    onRemoveImageDialog={openRemoveImageDialog}
                    setOnRemoveImageDialog={setOpenRemoveImageDialog}
                    onNoClick={() => setOpenRemoveImageDialog(false)}
                    onYesClick={() => {
                      if (removedImage) {
                        handleRemoveOneCmpImage(
                          removedImage.id,
                          removedImage.index
                        );
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
        <div className="w-[40%] flex flex-col gap-5">
          {/* Benefits Section */}
          {benefits && benefits.length > 0 && (
            <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
              <div className="w-full flex flex-col gap-1">
                <TypographyH4>Benefits</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex flex-wrap gap-3">
                  {benefits &&
                    benefits.length > 0 &&
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
                    ))}
                </div>
                {isEdit && (
                  <Popover
                    open={openBenefitPopOver}
                    onOpenChange={setOpenBenefitPopOver}
                  >
                    <PopoverTrigger asChild>
                      <Button className="w-full text-xs" variant="secondary">
                        Add benefit
                        <LucidePlus />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                      <Input
                        placeholder="Enter your benefit (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"
                        value={benefitInput?.label}
                        onChange={(e) =>
                          setBenefitInput({ label: e.target.value })
                        }
                      />
                      <div className="flex items-center gap-1 [&>button]:text-xs">
                        <Button
                          variant="outline"
                          onClick={() => setOpenBenefitPopOver(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={addBenefits} type="button">
                          Save
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          )}

          {/* Values Section */}
          {values && values.length > 0 && (
            <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
              <div className="w-full flex flex-col gap-1">
                <TypographyH4>Values</TypographyH4>
                <Divider />
              </div>
              <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex flex-wrap gap-3">
                  {values &&
                    values.length > 0 &&
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
                          <LucideXCircle
                            className="text-muted-foreground cursor-pointer text-red-500"
                            width={"18px"}
                            onClick={() => removeValue(value.label)}
                          />
                        )}
                      </div>
                    ))}
                </div>
                {isEdit && (
                  <Popover
                    open={openValuePopOver}
                    onOpenChange={setOpenValuePopOver}
                  >
                    <PopoverTrigger asChild>
                      <Button className="w-full text-xs" variant="secondary">
                        Add value
                        <LucidePlus />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                      <Input
                        placeholder="Enter your value (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"
                        value={valueInput?.label}
                        onChange={(e) =>
                          setValueInput({ label: e.target.value })
                        }
                      />
                      <div className="flex items-center gap-1 [&>button]:text-xs">
                        <Button
                          variant="outline"
                          onClick={() => setOpenValuePopOver(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={addValue} type="button">
                          Save
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          )}

          {/* CareersScopes Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <TypographyH4>Careers Scopes</TypographyH4>
              <Divider />
            </div>
            <div className="w-full flex flex-col items-stretch gap-3">
              <div className="flex flex-wrap gap-3">
                {careers &&
                  careers.length > 0 &&
                  careers.map((career, index) => {
                    return (
                      <div key={index}>
                        <HoverCard>
                          <HoverCardTrigger className="flex items-center rounded-3xl">
                            <Tag label={career.name} />
                            {isEdit && (
                              <LucideXCircle
                                className="text-muted-foreground cursor-pointer ml-1 text-red-500"
                                width={"18px"}
                                onClick={() => removeCareer(career.name)}
                              />
                            )}
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <TypographySmall>
                              {career.description ?? career.name}
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
                open={openCareersPopOver}
                onOpenChange={setOpenCareersPopOver}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {careersInput
                      ? getAllCareerScopeStore.careerScopes?.find(
                          (career) => career.name === careersInput.name
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
                        {getAllCareerScopeStore.careerScopes?.map(
                          (career, index) => (
                            <CommandItem
                              key={index}
                              value={career.name}
                              onSelect={() => {
                                if (career.id)
                                  handleCareerSelect(
                                    career.id,
                                    career.name,
                                    career.description ?? ""
                                  );
                              }} // Handle career selection
                            >
                              {career.name}
                              <LucideCircleCheck
                                className={
                                  careersInput?.name === career.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                }
                              />
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            {isEdit && (
              <Button
                variant="secondary"
                className="w-full text-xs"
                type="button"
                onClick={addCareers}
              >
                <LucidePlus />
                Add Career
              </Button>
            )}
          </div>

          {/* Social Information Form Section */}
          {((company.socials && company.socials?.length > 0) || isEdit) && (
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
                              item.platform as TPlatform
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
                                setSocialInput({
                                  ...socialInput!,
                                  platform: value,
                                })
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
                                  setSocialInput({
                                    ...socialInput!,
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
                        variant="secondary"
                        className="text-xs w-full"
                        type="button"
                        onClick={addSocial}
                      >
                        <LucidePlus />
                        Add new social
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={avatarFile ? URL.createObjectURL(avatarFile) : company.avatar!}
      />
    </form>
  );
}
