// My Signup Page
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorMessage from "@/components/utils/error-message";
import LogoComponent from "@/components/utils/logo";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { useThemeStore } from "@/stores/themes/theme-store";
import {
  genderConstant,
  locationConstant,
} from "@/utils/constants/app.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideEye,
  LucideEyeClosed,
  LucideLockKeyhole,
  LucideMail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import {
  basicSignupCompanySchema,
  basicSignupEmployeeSchema,
  TBasicSignupCompanySchema,
  TBasicSignupEmployeeSchema,
} from "./validation";

export default function SignupPage() {
  // Utils
  const router = useRouter();
  const { theme } = useThemeStore();

  // Signup Helpers
  const { basicSignupData, setBasicSignupData } = useBasicSignupDataStore();
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] =
    useState<boolean>(false);

  // API Integration
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  // Employee and Company Form
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

  const isEmployeeForm = selectedRole === "employee";

  const cmpForm = useForm<TBasicSignupCompanySchema>({
    resolver: zodResolver(basicSignupCompanySchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const empForm = useForm<TBasicSignupEmployeeSchema>({
    resolver: zodResolver(basicSignupEmployeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      username: "",
      selectedLocation: undefined,
      gender: undefined,
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Employee and Company Error
  const employeeErrors = empForm.formState
    .errors as FieldErrors<TBasicSignupEmployeeSchema>;
  const companyErrors = cmpForm.formState
    .errors as FieldErrors<TBasicSignupCompanySchema>;

  // Set Basic Signup Data for Employee
  const onSubmitEmployee = (data: TBasicSignupEmployeeSchema) => {
    console.log("Basic Employee Data: ", data);

    const payload = {
      ...basicSignupData,
      ...data,
      selectedRole: "employee" as const,
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
      selectedRole: "company" as const,
      phone: data.phone ?? undefined,
    };

    setBasicSignupData(payload);
    router.push("/signup/company");
  };

  // Social Signup Effect
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

  return (
    <div className="size-[70%] flex flex-col items-start justify-center gap-3 tablet-sm:w-[90%]">
      {/* Title Section */}
      <div className="mb-5">
        <LogoComponent
          isBlackLogo={theme === "light" ? false : true}
          className="!h-12 w-auto"
        />
        <TypographyH2>Welcome to Apsara Talent</TypographyH2>
        <TypographyMuted className="text-md">
          Connect with professional community around the world.
        </TypographyMuted>
      </div>

      {/* Form Section */}
      <form
        className="w-full flex flex-col items-stretch gap-5"
        onSubmit={
          isEmployeeForm
            ? empForm.handleSubmit(onSubmitEmployee)
            : cmpForm.handleSubmit(onSubmitCompany)
        }
      >
        {isEmployeeForm && (
          <div className="flex items-center gap-3 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
            <Input
              placeholder="Firstname"
              type="text"
              {...empForm.register("firstName")}
              validationMessage={employeeErrors.firstName?.message}
            />
            <Input
              placeholder="Lastname"
              type="text"
              {...empForm.register("lastName")}
              validationMessage={employeeErrors.lastName?.message}
            />
          </div>
        )}
        {isEmployeeForm && (
          <Input
            type="date"
            placeholder="Date of Birth"
            className="w-full"
            {...empForm.register("dob")}
          />
        )}
        <div className="w-full flex items-center gap-3 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
          {isEmployeeForm && (
            <Input
              type="text"
              placeholder="Username"
              className="w-full"
              {...empForm.register("username")}
              validationMessage={employeeErrors.username?.message}
            />
          )}
          {isEmployeeForm && (
            <div className="w-full flex flex-col items-start gap-1">
              <Controller
                name="selectedLocation"
                control={empForm.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="h-12 text-muted-foreground">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationConstant.map((location, index) => (
                        <SelectItem key={index} value={location}>
                          {location}
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
          )}
        </div>
        <div className="flex flex-col items-stretch gap-5">
          <div className="flex gap-3 [&>select]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
            {isEmployeeForm && (
              <div className="w-full flex flex-col items-start gap-1">
                <Controller
                  name="gender"
                  control={empForm.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
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
                <ErrorMessage>
                  {typeof employeeErrors.gender?.message === "string"
                    ? employeeErrors.gender?.message
                    : null}
                </ErrorMessage>
              </div>
            )}
            {isEmployeeForm ? (
              <Input
                type="number"
                placeholder="Mobile"
                className="w-full"
                {...empForm.register("phone")}
                validationMessage={employeeErrors.phone?.message}
              />
            ) : (
              <Input
                type="number"
                placeholder="Mobile"
                className="w-full"
                {...cmpForm.register("phone")}
                validationMessage={companyErrors.phone?.message}
              />
            )}
          </div>
          {isEmployeeForm ? (
            <Input
              prefix={<LucideMail strokeWidth={"1.3px"} />}
              type="email"
              placeholder="Email"
              {...empForm.register("email")}
              validationMessage={employeeErrors.email?.message}
            />
          ) : (
            <Input
              prefix={<LucideMail strokeWidth={"1.3px"} />}
              type="email"
              placeholder="Email"
              {...cmpForm.register("email")}
              validationMessage={companyErrors.email?.message}
            />
          )}
          {isEmployeeForm ? (
            <Input
              prefix={<LucideLockKeyhole strokeWidth={"1.3px"} />}
              suffix={
                passwordVisibility ? (
                  <LucideEyeClosed
                    strokeWidth={"1.3px"}
                    onClick={() => setPasswordVisibility(false)}
                  />
                ) : (
                  <LucideEye
                    strokeWidth={"1.3px"}
                    onClick={() => setPasswordVisibility(true)}
                  />
                )
              }
              type={passwordVisibility ? "text" : "password"}
              placeholder="Password"
              {...empForm.register("password")}
              validationMessage={employeeErrors.password?.message}
            />
          ) : (
            <Input
              prefix={<LucideLockKeyhole strokeWidth={"1.3px"} />}
              suffix={
                passwordVisibility ? (
                  <LucideEyeClosed
                    strokeWidth={"1.3px"}
                    onClick={() => setPasswordVisibility(false)}
                  />
                ) : (
                  <LucideEye
                    strokeWidth={"1.3px"}
                    onClick={() => setPasswordVisibility(true)}
                  />
                )
              }
              type={passwordVisibility ? "text" : "password"}
              placeholder="Password"
              {...cmpForm.register("password")}
              validationMessage={companyErrors.password?.message}
            />
          )}
          {isEmployeeForm ? (
            <Input
              prefix={<LucideLockKeyhole strokeWidth={"1.3px"} />}
              suffix={
                confirmPassVisibility ? (
                  <LucideEyeClosed
                    strokeWidth={"1.3px"}
                    onClick={() => setConfirmPassVisibility(false)}
                  />
                ) : (
                  <LucideEye
                    strokeWidth={"1.3px"}
                    onClick={() => setConfirmPassVisibility(true)}
                  />
                )
              }
              type={confirmPassVisibility ? "text" : "password"}
              placeholder="Confirm Password"
              {...empForm.register("confirmPassword")}
              validationMessage={employeeErrors.confirmPassword?.message}
            />
          ) : (
            <Input
              prefix={<LucideLockKeyhole strokeWidth={"1.3px"} />}
              suffix={
                confirmPassVisibility ? (
                  <LucideEyeClosed
                    strokeWidth={"1.3px"}
                    onClick={() => setConfirmPassVisibility(false)}
                  />
                ) : (
                  <LucideEye
                    strokeWidth={"1.3px"}
                    onClick={() => setConfirmPassVisibility(true)}
                  />
                )
              }
              type={confirmPassVisibility ? "text" : "password"}
              placeholder="Confirm Password"
              {...cmpForm.register("confirmPassword")}
              validationMessage={companyErrors.confirmPassword?.message}
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="flex-1"
            variant="outline"
            onClick={() => router.push("/login")}
          >
            <LucideArrowLeft />
            Back
          </Button>
          <Button className="flex-1" type="submit">
            <LucideArrowRight />
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
