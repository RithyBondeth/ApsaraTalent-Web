"use client";

import { Button } from "@/components/ui/button";
import { AuthField } from "@/components/auth/auth-field";
import { AuthSelect } from "@/components/auth/auth-select";
import { AuthDateField } from "@/components/auth/auth-date-field";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import LogoComponent from "@/components/utils/brand/logo";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useParseResumeStore } from "@/stores/apis/auth/parse-resume.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import {
  genderConstant,
  locationConstant,
} from "@/utils/constants/ui.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideArrowRight,
  LucideCalendar,
  LucideLockKeyhole,
  LucideMail,
  LucideMapPin,
  LucidePhone,
  LucideUser,
  LucideUsers,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import {
  makeBasicSignupCompanySchema,
  makeBasicSignupEmployeeSchema,
  TBasicSignupCompanySchema,
  TBasicSignupEmployeeSchema,
} from "./validation";
import { formatDateForField } from "@/utils/functions/date";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default function SignupPage() {
  /* --------------------------------------- Utils ---------------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const tLoc = useTranslations("locations");

  /* -------------------------------------- All States ------------------------------------ */
  // Basic Signup Data
  const { basicSignupData, setBasicSignupData } = useBasicSignupDataStore();

  /* ----------------------------------- API Integration ---------------------------------- */
  // Get User Basic Data From Socials: Google, Github, LinkedIn, Facebook
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  // Parsed Smart Resume Data
  const { data: parsedData } = useParseResumeStore();

  /* --------------------------------- User Role Handling --------------------------------- */
  const selectedRole = useMemo(
    () =>
      basicSignupData?.selectedRole ||
      googleUserData.role ||
      githubUserData.role ||
      linkedInUserData.role ||
      facebookUserData.role,
    [
      basicSignupData?.selectedRole,
      googleUserData.role,
      githubUserData.role,
      linkedInUserData.role,
      facebookUserData.role,
    ],
  );
  const isEmployeeForm = selectedRole === USER_ROLE.EMPLOYEE;

  /* ------------------------- Options for floating-label selects ------------------------- */
  const locationOptions = useMemo(() => {
    const locationLabels: Record<string, string> = {
      "Phnom Penh": tLoc("phnomPenh"),
      "Banteay Meanchey": tLoc("banteayMeanchey"),
      Battambang: tLoc("battambang"),
      "Kampong Cham": tLoc("kampongCham"),
      "Kampong Chhnang": tLoc("kampongChhnang"),
      "Kampong Speu": tLoc("kampongSpeu"),
      "Kampong Thom": tLoc("kampongThom"),
      Kampot: tLoc("kampot"),
      Kandal: tLoc("kandal"),
      Kep: tLoc("kep"),
      "Koh Kong": tLoc("kohKong"),
      Kratie: tLoc("kratie"),
      Mondulkiri: tLoc("mondulkiri"),
      "Oddar Meanchey": tLoc("oddarMeanchey"),
      Pailin: tLoc("pailin"),
      "Preah Sihanouk": tLoc("preahSihanouk"),
      "Preah Vihear": tLoc("preahVihear"),
      "Prey Veng": tLoc("preyVeng"),
      Pursat: tLoc("pursat"),
      Ratanakiri: tLoc("ratanakiri"),
      "Siem Reap": tLoc("siemReap"),
      "Stung Treng": tLoc("stungTreng"),
      "Svay Rieng": tLoc("svayRieng"),
      Takeo: tLoc("takeo"),
      "Tbong Khmum": tLoc("tbongKhmum"),
    };

    return locationConstant.map((loc) => ({
      value: loc,
      label: locationLabels[loc] ?? loc,
    }));
  }, [tLoc]);
  const genderOptions = useMemo(
    () =>
      genderConstant.map((g) => ({
        value: g.value,
        label: t(`gender${g.label as "Male" | "Female"}`),
      })),
    [t],
  );

  /* ----------------------- React Hook Form: Emp and Cmp Signup Form ---------------------- */
  // ── Validation Messages For Signup Forms ───────────────────────────────
  const signupMessages = useMemo(
    () => ({
      phoneInvalid: tv("phoneInvalid"),
      emailRequired: tv("emailRequired"),
      emailInvalid: tv("emailInvalid"),
      passwordRequired: tv("passwordRequired"),
      passwordMinLength: tv("passwordMinLength"),
      passwordNeedsNumber: tv("passwordNeedsNumber"),
      passwordNeedsSpecial: tv("passwordNeedsSpecial"),
      confirmPasswordRequired: tv("confirmPasswordRequired"),
      passwordsMismatch: tv("passwordsMismatch"),
      firstNameRequired: tv("firstNameRequired"),
      lastNameRequired: tv("lastNameRequired"),
      dobRequired: tv("dobRequired"),
      usernameRequired: tv("usernameRequired"),
      locationRequired: tv("locationRequired"),
      genderRequired: tv("genderRequired"),
    }),
    [tv],
  );

  // ── Pre-fill Employee Form from Resume Parsed ──────────────────────────
  const defaultEmpValues = useMemo(() => {
    const stripped = parsedData?.phone?.replace(/[\s\-().]/g, "") ?? "";
    const normalizedPhone =
      stripped.startsWith("855") && !stripped.startsWith("+855")
        ? `+${stripped}`
        : stripped;
    const validPhone = /^(\+855|0)[0-9]{8,9}$/.test(normalizedPhone)
      ? normalizedPhone
      : "";

    const matchedLocation = parsedData?.location
      ? locationConstant.find(
          (loc) =>
            loc.toLowerCase() === parsedData.location!.trim().toLowerCase(),
        )
      : undefined;

    return {
      firstName: parsedData?.firstName ?? "",
      lastName: parsedData?.lastName ?? "",
      dob: "",
      username:
        parsedData?.firstName && parsedData?.lastName
          ? `${parsedData.firstName} ${parsedData.lastName}`
          : "",
      selectedLocation: matchedLocation,
      gender: undefined,
      phone: validPhone,
      email: parsedData?.email ?? "",
      password: "",
      confirmPassword: "",
    };
  }, [parsedData]);

  // ── Initialize Cmp Form with Default Values ────────────────────────────
  const cmpForm = useForm<TBasicSignupCompanySchema>({
    resolver: zodResolver(makeBasicSignupCompanySchema(signupMessages)),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ── Initialize Emp Form with Default Values ────────────────────────────
  const empForm = useForm<TBasicSignupEmployeeSchema>({
    resolver: zodResolver(makeBasicSignupEmployeeSchema(signupMessages)),
    defaultValues: defaultEmpValues,
  });

  // ── Cmp and Emp form error states ──────────────────────────────────────
  const employeeErrors = empForm.formState
    .errors as FieldErrors<TBasicSignupEmployeeSchema>;
  const companyErrors = cmpForm.formState
    .errors as FieldErrors<TBasicSignupCompanySchema>;

  /* ----------------------------------- Methods ------------------------------------------- */
  // ── Signup Function ────────────────────────────────────────────────────
  // Set Basic Signup Data for Employee
  const onSubmitEmployee = (data: TBasicSignupEmployeeSchema) => {
    const payload = {
      ...basicSignupData,
      ...data,
      selectedRole: USER_ROLE.EMPLOYEE,
      phone: data.phone ?? undefined,
    };

    setBasicSignupData(payload);
    router.push("/signup/employee");
  };

  // ── Signup Function ────────────────────────────────────────────────────
  // Set Basic Signup Data for Company
  const onSubmitCompany = (data: TBasicSignupCompanySchema) => {
    const payload = {
      ...basicSignupData,
      ...data,
      selectedRole: USER_ROLE.COMPANY,
      phone: data.phone ?? undefined,
    };

    setBasicSignupData(payload);
    router.push("/signup/company");
  };

  /* --------------------------------------- Effects --------------------------------------- */
  // ── Social Signup Effect ────────────────────────────────────────────────
  useEffect(() => {
    if (
      googleUserData.email &&
      googleUserData.firstname &&
      googleUserData.lastname
    ) {
      cmpForm.setValue("email", googleUserData.email);
      empForm.setValue("email", googleUserData.email);
      empForm.setValue("firstName", googleUserData.firstname);
      empForm.setValue("lastName", googleUserData.lastname);
      empForm.setValue(
        "username",
        googleUserData.firstname + " " + googleUserData.lastname,
      );
    }

    if (
      linkedInUserData.email &&
      linkedInUserData.firstname &&
      linkedInUserData.lastname
    ) {
      cmpForm.setValue("email", linkedInUserData.email);
      empForm.setValue("email", linkedInUserData.email);
      empForm.setValue("firstName", linkedInUserData.firstname);
      empForm.setValue("lastName", linkedInUserData.lastname);
      empForm.setValue(
        "username",
        linkedInUserData.firstname + " " + linkedInUserData.lastname,
      );
    }

    if (githubUserData.email && githubUserData.username) {
      cmpForm.setValue("email", githubUserData.email);
      empForm.setValue("email", githubUserData.email);
      empForm.setValue("username", githubUserData.username);
    }

    if (
      facebookUserData.email &&
      facebookUserData.firstname &&
      facebookUserData.lastname
    ) {
      cmpForm.setValue("email", facebookUserData.email);
      empForm.setValue("email", facebookUserData.email);
      empForm.setValue("firstName", facebookUserData.firstname);
      empForm.setValue("lastName", facebookUserData.lastname);
      empForm.setValue(
        "username",
        facebookUserData.firstname + " " + facebookUserData.lastname,
      );
    }

    const hasSocialData =
      googleUserData.email ||
      linkedInUserData.email ||
      githubUserData.email ||
      facebookUserData.email;

    if (!hasSocialData) {
      empForm.setValue("username", "");
    }
  }, [
    googleUserData,
    githubUserData,
    linkedInUserData,
    facebookUserData,
    cmpForm,
    empForm,
  ]);

  /* -------------------------------- Section Divider Helper ------------------------------- */
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );

  /* -------------------------------------- Render UI -------------------------------------- */
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Logo Section */}
      <LogoComponent className="!h-16 w-auto self-start" priority />

      {/* Title Section */}
      <div>
        <TypographyH2>{t("signupPageTitle")}</TypographyH2>
        <TypographyMuted className="text-md">
          {t("signupSubtitle")}
        </TypographyMuted>
      </div>

      {/* Form Section */}
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={
          isEmployeeForm
            ? empForm.handleSubmit(onSubmitEmployee)
            : cmpForm.handleSubmit(onSubmitCompany)
        }
      >
        {/* Employee: Personal Section */}
        {isEmployeeForm && (
          <div className="flex flex-col gap-4">
            <SectionLabel>{t("signupSectionPersonal")}</SectionLabel>

            {/* Employee: Firstname & Lastname Section */}
            <div className="field-row w-full">
              <Controller
                name="firstName"
                control={empForm.control}
                render={({ field }) => (
                  <AuthField
                    label={t("firstname")}
                    icon={
                      <LucideUser className="size-[18px]" strokeWidth={1.6} />
                    }
                    error={employeeErrors.firstName?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={empForm.control}
                render={({ field }) => (
                  <AuthField
                    label={t("lastname")}
                    icon={
                      <LucideUser className="size-[18px]" strokeWidth={1.6} />
                    }
                    error={employeeErrors.lastName?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Employee: DOB and Username Section */}
            <div className="field-row w-full">
              <Controller
                name="dob"
                control={empForm.control}
                render={({ field }) => {
                  const selectedDate = field.value
                    ? new Date(field.value)
                    : undefined;
                  const safeDate =
                    selectedDate instanceof Date &&
                    !Number.isNaN(selectedDate.getTime())
                      ? selectedDate
                      : undefined;
                  return (
                    <AuthDateField
                      label={t("dateOfBirth")}
                      icon={
                        <LucideCalendar
                          className="size-[18px]"
                          strokeWidth={1.6}
                        />
                      }
                      date={safeDate}
                      onDateChange={(date) =>
                        field.onChange(date ? formatDateForField(date) : "")
                      }
                      error={employeeErrors.dob?.message}
                    />
                  );
                }}
              />
              <Controller
                name="username"
                control={empForm.control}
                render={({ field }) => (
                  <AuthField
                    label={t("username")}
                    icon={
                      <LucideUser className="size-[18px]" strokeWidth={1.6} />
                    }
                    error={employeeErrors.username?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Employee: Gender and Location Section */}
            <div className="field-row w-full">
              <Controller
                name="selectedLocation"
                control={empForm.control}
                render={({ field }) => (
                  <AuthSelect
                    label={t("location")}
                    icon={
                      <LucideMapPin className="size-[18px]" strokeWidth={1.6} />
                    }
                    options={locationOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    error={
                      typeof employeeErrors.selectedLocation?.message ===
                      "string"
                        ? employeeErrors.selectedLocation?.message
                        : undefined
                    }
                  />
                )}
              />
              <Controller
                name="gender"
                control={empForm.control}
                render={({ field }) => (
                  <AuthSelect
                    label={t("gender")}
                    icon={
                      <LucideUsers className="size-[18px]" strokeWidth={1.6} />
                    }
                    options={genderOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    error={
                      typeof employeeErrors.gender?.message === "string"
                        ? employeeErrors.gender?.message
                        : undefined
                    }
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Company: Account Security Section */}
        <div className="flex flex-col gap-4">
          <SectionLabel>{t("signupSectionAccount")}</SectionLabel>

          {/* Company: Phone and Email Section */}
          <div className="field-row w-full">
            {isEmployeeForm ? (
              <Controller
                name="phone"
                control={empForm.control}
                render={({ field }) => (
                  <AuthField
                    label={t("mobile")}
                    type="tel"
                    inputMode="numeric"
                    icon={
                      <LucidePhone className="size-[18px]" strokeWidth={1.6} />
                    }
                    error={employeeErrors.phone?.message}
                    {...field}
                  />
                )}
              />
            ) : (
              <AuthField
                label={t("mobile")}
                type="tel"
                inputMode="numeric"
                icon={<LucidePhone className="size-[18px]" strokeWidth={1.6} />}
                error={companyErrors.phone?.message}
                {...cmpForm.register("phone")}
              />
            )}

            {isEmployeeForm ? (
              <Controller
                name="email"
                control={empForm.control}
                render={({ field }) => (
                  <AuthField
                    label={t("email")}
                    type="email"
                    autoComplete="email"
                    icon={
                      <LucideMail className="size-[18px]" strokeWidth={1.6} />
                    }
                    error={employeeErrors.email?.message}
                    {...field}
                  />
                )}
              />
            ) : (
              <AuthField
                label={t("email")}
                type="email"
                autoComplete="email"
                icon={<LucideMail className="size-[18px]" strokeWidth={1.6} />}
                error={companyErrors.email?.message}
                {...cmpForm.register("email")}
              />
            )}
          </div>

          {/* Company: Password and Confirm Password Section */}
          <div className="field-row w-full">
            <AuthField
              label={t("password")}
              type="password"
              autoComplete="new-password"
              icon={
                <LucideLockKeyhole className="size-[18px]" strokeWidth={1.6} />
              }
              error={
                isEmployeeForm
                  ? employeeErrors.password?.message
                  : companyErrors.password?.message
              }
              {...(isEmployeeForm
                ? empForm.register("password")
                : cmpForm.register("password"))}
            />
            <AuthField
              label={t("confirmPassword")}
              type="password"
              autoComplete="new-password"
              icon={
                <LucideLockKeyhole className="size-[18px]" strokeWidth={1.6} />
              }
              error={
                isEmployeeForm
                  ? employeeErrors.confirmPassword?.message
                  : companyErrors.confirmPassword?.message
              }
              {...(isEmployeeForm
                ? empForm.register("confirmPassword")
                : cmpForm.register("confirmPassword"))}
            />
          </div>
        </div>

        {/* Back & Next Buttons Section */}
        <div className="auth-action-row w-full">
          <AuthBackButton
            className="w-full"
            onClick={() => router.replace("/signup/option")}
          >
            {t("back")}
          </AuthBackButton>
          <Button className="auth-submit h-11 w-full" type="submit">
            {t("next")}
            <LucideArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
