"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorMessage from "@/components/utils/feedback/error-message";
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
  LucideArrowLeft,
  LucideArrowRight,
  LucideEye,
  LucideEyeClosed,
  LucideLockKeyhole,
  LucideMail,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  /* --------------------------------------- Utils --------------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const tLoc = useTranslations("locations");

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

  /* -------------------------------------- All States ------------------------------------ */
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] =
    useState<boolean>(false);

  // Basic Signup Data
  const { basicSignupData, setBasicSignupData } = useBasicSignupDataStore();

  /* ----------------------------------- API Integration ---------------------------------- */
  // Get User Basic Data From Socials: Google, Github, LinkedIn, Facebook
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  // Prased Smart Resume Data
  const { data: parsedData } = useParseResumeStore();

  /* --------------------------------- User Role Handling --------------------------------- */
  /*
    Determine user role (Employee or Company) by checking local state first,
    then falling back to any connected social login providers.
  */
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
    console.log("Basic Employee Data: ", data);

    const payload = {
      ...basicSignupData,
      ...data,
      selectedRole: USER_ROLE.EMPLOYEE,
      phone: data.phone ?? undefined,
    };

    setBasicSignupData(payload);
    router.push("/signup/employee");
  };

  // Set Basic Signup Data for Company
  const onSubmitCompany = (data: TBasicSignupCompanySchema) => {
    console.log("Basic Company Data: ", data);

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
    // Handle Google login data - Auto Fill Information in Form
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

    // Handle LinkedIn login data - Auto Fill Information in Form
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

    // Handle GitHub login data - Auto Fill Information in Form
    if (githubUserData.email && githubUserData.username) {
      cmpForm.setValue("email", githubUserData.email);

      empForm.setValue("email", githubUserData.email);
      empForm.setValue("username", githubUserData.username);
    }

    // Handle Facebook login data - Auto Fill Information in Form
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

    // Clear username field if no social login data is available (default signup flow)
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

  /* -------------------------------------- Render UI -------------------------------------- */
  return (
    <div className="auth-basic-signup flex w-full max-w-[620px] flex-col gap-5 tablet-sm:max-w-full">
      {/* Logo Section */}
      <LogoComponent className="auth-form-logo !h-12 w-auto self-start" />

      {/* Title Section */}
      <div className="auth-heading-group flex flex-col items-start">
        <TypographyH2>{t("signupPageTitle")}</TypographyH2>
        <TypographyMuted className="text-md">
          {t("signupSubtitle")}
        </TypographyMuted>
      </div>

      {/* Form Section */}
      <form
        className="auth-basic-signup-form flex w-full flex-col gap-6"
        onSubmit={
          isEmployeeForm
            ? empForm.handleSubmit(onSubmitEmployee)
            : cmpForm.handleSubmit(onSubmitCompany)
        }
      >
        {/* Employee Information Section */}
        {isEmployeeForm && (
          <div className="auth-signup-section flex flex-col gap-4">
            {/* Divider Section */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                {t("signupSectionPersonal")}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Employee: Firstname & Lastname Section */}
            <div className="auth-signup-field-row flex items-start gap-3 tablet-sm:flex-col">
              <div className="auth-field flex w-full flex-col gap-1.5">
                <label htmlFor="signup-first-name">{t("firstname")}</label>
                <Controller
                  name="firstName"
                  control={empForm.control}
                  render={({ field }) => (
                    <Input
                      id="signup-first-name"
                      placeholder={t("firstname")}
                      type="text"
                      autoComplete="given-name"
                      {...field}
                      validationMessage={employeeErrors.firstName?.message}
                    />
                  )}
                />
              </div>
              <div className="auth-field flex w-full flex-col gap-1.5">
                <label htmlFor="signup-last-name">{t("lastname")}</label>
                <Controller
                  name="lastName"
                  control={empForm.control}
                  render={({ field }) => (
                    <Input
                      id="signup-last-name"
                      placeholder={t("lastname")}
                      type="text"
                      autoComplete="family-name"
                      {...field}
                      validationMessage={employeeErrors.lastName?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* Employee: DOB Section */}
            <div className="auth-field w-full flex flex-col items-start gap-1.5">
              <span className="auth-field-label">{t("dateOfBirth")}</span>
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
                    <DatePicker
                      placeholder={t("dateOfBirth")}
                      date={safeDate}
                      onDateChange={(date) =>
                        field.onChange(date ? formatDateForField(date) : "")
                      }
                      dateFormat="dd MMM yyyy"
                    />
                  );
                }}
              />
              <ErrorMessage>{employeeErrors.dob?.message}</ErrorMessage>
            </div>

            {/* Employee: Username & Location Section */}
            <div className="auth-signup-field-row flex items-start gap-3 tablet-sm:flex-col">
              <div className="auth-field flex w-full flex-col gap-1.5">
                <label htmlFor="signup-username">{t("username")}</label>
                <Controller
                  name="username"
                  control={empForm.control}
                  render={({ field }) => (
                    <Input
                      id="signup-username"
                      type="text"
                      autoComplete="username"
                      placeholder={t("username")}
                      {...field}
                      validationMessage={employeeErrors.username?.message}
                    />
                  )}
                />
              </div>
              <div className="auth-field w-full flex flex-col items-start gap-1.5">
                <label htmlFor="signup-location">{t("location")}</label>
                <Controller
                  name="selectedLocation"
                  control={empForm.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger
                        id="signup-location"
                        className="h-12 text-muted-foreground"
                      >
                        <SelectValue placeholder={t("location")} />
                      </SelectTrigger>
                      <SelectContent>
                        {locationConstant.map((location, index) => (
                          <SelectItem key={index} value={location}>
                            {locationLabels[location] ?? location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage>
                  {typeof employeeErrors.selectedLocation?.message === "string"
                    ? employeeErrors.selectedLocation?.message
                    : null}
                </ErrorMessage>
              </div>
            </div>

            {/* Employee: Gender & Phone Section */}
            <div className="auth-signup-field-row flex items-start gap-3 tablet-sm:flex-col">
              <div className="auth-field w-full flex flex-col items-start gap-1.5">
                <label htmlFor="signup-gender">{t("gender")}</label>
                <Controller
                  name="gender"
                  control={empForm.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger
                        id="signup-gender"
                        className="h-12 text-muted-foreground"
                      >
                        <SelectValue placeholder={t("gender")} />
                      </SelectTrigger>
                      <SelectContent>
                        {genderConstant.map((gender) => (
                          <SelectItem key={gender.id} value={gender.value}>
                            {t(`gender${gender.label as "Male" | "Female"}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage>
                  {typeof employeeErrors.gender?.message === "string"
                    ? employeeErrors.gender?.message
                    : null}
                </ErrorMessage>
              </div>
              <div className="auth-field flex w-full flex-col gap-1.5">
                <label htmlFor="signup-phone">{t("mobile")}</label>
                <Controller
                  name="phone"
                  control={empForm.control}
                  render={({ field }) => (
                    <Input
                      id="signup-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t("mobile")}
                      {...field}
                      validationMessage={employeeErrors.phone?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Employee: Account Security Section */}
        <div className="auth-signup-section flex flex-col gap-4">
          {/* Divider Section */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              {t("signupSectionAccount")}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Company: Phone Section */}
          {!isEmployeeForm && (
            <div className="auth-field flex w-full flex-col gap-1.5">
              <label htmlFor="company-signup-phone">{t("mobile")}</label>
              <Input
                id="company-signup-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t("mobile")}
                {...cmpForm.register("phone")}
                validationMessage={companyErrors.phone?.message}
              />
            </div>
          )}

          {/* Employee and Company: Email Section */}
          <div className="auth-field flex w-full flex-col gap-1.5">
            <label htmlFor="signup-email">{t("email")}</label>
            {isEmployeeForm ? (
              <Controller
                name="email"
                control={empForm.control}
                render={({ field }) => (
                  <Input
                    id="signup-email"
                    prefix={<LucideMail strokeWidth={1.5} />}
                    type="email"
                    autoComplete="email"
                    placeholder={t("email")}
                    {...field}
                    validationMessage={employeeErrors.email?.message}
                  />
                )}
              />
            ) : (
              <Input
                id="signup-email"
                prefix={<LucideMail strokeWidth={1.5} />}
                type="email"
                autoComplete="email"
                placeholder={t("email")}
                {...cmpForm.register("email")}
                validationMessage={companyErrors.email?.message}
              />
            )}
          </div>

          {/* Employee and Company: Password Section */}
          <div className="auth-field flex w-full flex-col gap-1.5">
            <label htmlFor="signup-password">{t("password")}</label>
            {isEmployeeForm ? (
              <Input
                id="signup-password"
                prefix={<LucideLockKeyhole strokeWidth={1.5} />}
                suffix={
                  passwordVisibility ? (
                    <LucideEyeClosed
                      strokeWidth={1.5}
                      onClick={() => setPasswordVisibility(false)}
                    />
                  ) : (
                    <LucideEye
                      strokeWidth={1.5}
                      onClick={() => setPasswordVisibility(true)}
                    />
                  )
                }
                type={passwordVisibility ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("password")}
                {...empForm.register("password")}
                validationMessage={employeeErrors.password?.message}
              />
            ) : (
              <Input
                id="signup-password"
                prefix={<LucideLockKeyhole strokeWidth={1.5} />}
                suffix={
                  passwordVisibility ? (
                    <LucideEyeClosed
                      strokeWidth={1.5}
                      onClick={() => setPasswordVisibility(false)}
                    />
                  ) : (
                    <LucideEye
                      strokeWidth={1.5}
                      onClick={() => setPasswordVisibility(true)}
                    />
                  )
                }
                type={passwordVisibility ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("password")}
                {...cmpForm.register("password")}
                validationMessage={companyErrors.password?.message}
              />
            )}
          </div>

          {/* Employee and Company: Confirm Password Section */}
          <div className="auth-field flex w-full flex-col gap-1.5">
            <label htmlFor="signup-confirm-password">
              {t("confirmPassword")}
            </label>
            {isEmployeeForm ? (
              <Input
                id="signup-confirm-password"
                prefix={<LucideLockKeyhole strokeWidth={1.5} />}
                suffix={
                  confirmPassVisibility ? (
                    <LucideEyeClosed
                      strokeWidth={1.5}
                      onClick={() => setConfirmPassVisibility(false)}
                    />
                  ) : (
                    <LucideEye
                      strokeWidth={1.5}
                      onClick={() => setConfirmPassVisibility(true)}
                    />
                  )
                }
                type={confirmPassVisibility ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("confirmPassword")}
                {...empForm.register("confirmPassword")}
                validationMessage={employeeErrors.confirmPassword?.message}
              />
            ) : (
              <Input
                id="signup-confirm-password"
                prefix={<LucideLockKeyhole strokeWidth={1.5} />}
                suffix={
                  confirmPassVisibility ? (
                    <LucideEyeClosed
                      strokeWidth={1.5}
                      onClick={() => setConfirmPassVisibility(false)}
                    />
                  ) : (
                    <LucideEye
                      strokeWidth={1.5}
                      onClick={() => setConfirmPassVisibility(true)}
                    />
                  )
                }
                type={confirmPassVisibility ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("confirmPassword")}
                {...cmpForm.register("confirmPassword")}
                validationMessage={companyErrors.confirmPassword?.message}
              />
            )}
          </div>
        </div>

        {/* Back & Next Buttons Section */}
        <div className="auth-signup-actions flex items-center gap-3 tablet-sm:flex-col">
          <Button
            type="button"
            className="auth-secondary-action flex-1 tablet-sm:w-full"
            variant="outline"
            onClick={() => router.replace("/signup/option")}
          >
            <LucideArrowLeft />
            {t("back")}
          </Button>
          <Button
            className="auth-primary-action flex-1 tablet-sm:w-full"
            type="submit"
          >
            {t("next")}
            <LucideArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
