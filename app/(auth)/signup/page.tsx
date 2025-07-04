"use client";

import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideEye,
  LucideEyeClosed,
  LucideLockKeyhole,
  LucideMail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import LogoComponent from "@/components/utils/logo";
import { useThemeStore } from "@/stores/themes/theme-store";
import {
  genderConstant,
  locationConstant,
} from "@/utils/constants/app.constant";
import { TGender } from "@/utils/types/gender.type";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/utils/error-message";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { TLocations } from "@/utils/types/location.type";
import {
  basicSignupEmployeeSchema,
  basicSignupCompanySchema,
  TBasicSignupEmployeeSchema,
  TBasicSignupCompanySchema,
} from "./validation";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";

export default function SignupPage() {
  const [selectedLocation, setSelectionLocation] = useState<TLocations | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] = useState<boolean>(false);
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<TGender | null>(null);
  const { theme } = useThemeStore();

  const { basicSignupData, setBasicSignupData } = useBasicSignupDataStore();
  const googleUserData = useGoogleLoginStore();
  const isEmployeeForm = (basicSignupData?.selectedRole || googleUserData.role) === "employee";

  const cmpForm = useForm<TBasicSignupCompanySchema>({
    resolver: zodResolver(basicSignupCompanySchema),
  });
  const empForm = useForm<TBasicSignupEmployeeSchema>({
    resolver: zodResolver(basicSignupEmployeeSchema),
  });

  const employeeErrors = empForm.formState
    .errors as FieldErrors<TBasicSignupEmployeeSchema>;
  const companyErrors = cmpForm.formState
    .errors as FieldErrors<TBasicSignupCompanySchema>;

  const onSubmitEmployee = (data: TBasicSignupEmployeeSchema) => {
    console.log(data);
    setBasicSignupData(data);
    router.push("signup/employee");
  };

  const onSubmitCompany = (data: TBasicSignupCompanySchema) => {
    console.log(data);
    setBasicSignupData(data);
    router.push("signup/company");
  };

  useEffect(() => {
    if(googleUserData) {
      cmpForm.setValue('email', googleUserData.email!);
     
      empForm.setValue('email', googleUserData.email!);
      empForm.setValue('firstName', googleUserData.firstname!);
      empForm.setValue('lastName', googleUserData.lastname!);
      empForm.setValue('username', googleUserData.firstname! + " " + googleUserData.lastname!);
    }
  }, [googleUserData]);

  return (
    <div className="size-[70%] flex flex-col items-start justify-center gap-3 tablet-sm:w-[90%]">
      {/* Title Section */}
      <div className="mb-5">
        <LogoComponent isBlackLogo={theme === "light" ? false : true} />
        <TypographyH2>Welcome to Apsara Talent</TypographyH2>
        <TypographyMuted className="text-md">
          Connect with professional community around the world.
        </TypographyMuted>
      </div>
      {/* End Title Section */}
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
          {isEmployeeForm && <div className="w-full flex flex-col items-start gap-1">
            <Select
              onValueChange={(value: TLocations) => {
                setSelectionLocation(value);
                empForm.setValue("selectedLocation", value, {
                  shouldValidate: true,
                });
                empForm.trigger("selectedLocation");
              }}
              value={selectedLocation || ""}
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
            <ErrorMessage>{employeeErrors.selectedLocation?.message}</ErrorMessage>
          </div>}
        </div>
        <div className="flex flex-col items-stretch gap-5">
          <div className="flex gap-3 [&>select]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
            {isEmployeeForm && (
              <div className="w-full flex flex-col items-start gap-1">
                <Select
                  onValueChange={(value: TGender) => {
                    setSelectedGender(value);
                    empForm.setValue("gender", value, { shouldValidate: true });
                    empForm.trigger("gender");
                  }}
                  value={selectedGender || ""}
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
                <ErrorMessage>{employeeErrors.gender?.message}</ErrorMessage>
              </div>
            )}
            {isEmployeeForm ? (
              <Input
                type="number"
                placeholder="Mobile"
                className="w-full"
                {...empForm.register("phone")}
                validationMessage={
                  isEmployeeForm
                    ? employeeErrors.phone?.message
                    : companyErrors.phone?.message
                }
              />
            ) : (
              <Input
                type="number"
                placeholder="Mobile"
                className="w-full"
                {...cmpForm.register("phone")}
                validationMessage={
                  isEmployeeForm
                    ? employeeErrors.phone?.message
                    : companyErrors.phone?.message
                }
              />
            )}
          </div>
          {isEmployeeForm ? (
            <Input
              prefix={<LucideMail strokeWidth={"1.3px"} />}
              type="email"
              placeholder="Email"
              {...empForm.register("email")}
              validationMessage={
                isEmployeeForm
                  ? employeeErrors.email?.message
                  : companyErrors.email?.message
              }
            />
          ) : (
            <Input
              prefix={<LucideMail strokeWidth={"1.3px"} />}
              type="email"
              placeholder="Email"
              {...cmpForm.register("email")}
              validationMessage={
                isEmployeeForm
                  ? employeeErrors.email?.message
                  : companyErrors.email?.message
              }
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
              validationMessage={
                isEmployeeForm
                  ? employeeErrors.password?.message
                  : companyErrors.password?.message
              }
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
              validationMessage={
                isEmployeeForm
                  ? employeeErrors.password?.message
                  : companyErrors.password?.message
              }
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
              validationMessage={
                isEmployeeForm
                  ? employeeErrors.confirmPassword?.message
                  : companyErrors.confirmPassword?.message
              }
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
              validationMessage={
                isEmployeeForm
                  ? employeeErrors.confirmPassword?.message
                  : companyErrors.confirmPassword?.message
              }
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
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
      {/* End Form Section */}
    </div>
  );
}
