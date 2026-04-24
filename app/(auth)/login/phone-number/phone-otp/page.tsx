"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";
import { useGetAllCompanyStore } from "@/stores/apis/company/get-all-cmp.store";
import { useGetAllEmployeeStore } from "@/stores/apis/employee/get-all-emp.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useGetEmployeeRecommendationsStore } from "@/stores/apis/recommendation/get-employee-recommendations.store";
import { useGetCompanyRecommendationsStore } from "@/stores/apis/recommendation/get-company-recommendations.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { phoneOTPWhiteSvg } from "@/utils/constants/asset.constant";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

export default function PhoneOTPPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");

  /* -------------------------------- All States ------------------------------ */

  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();
  const [loginInitiated, setLoginInitiated] = useState<boolean>(false);
  const isProcessingOtpLogin = useRef<boolean>(false);
  const loadingToastIdRef = useRef<string | number | null>(null);

  /* ------------------------------ API Integration --------------------------- */
  // Current User, Get All Employees and Get All Companies
  const { getCurrentUser } = useGetCurrentUserStore();
  const { queryEmployee } = useGetAllEmployeeStore();
  const { queryCompany } = useGetAllCompanyStore();

  // Employee and Company Liked and Favorited
  const queryCurrentCompanyLiked = useGetCurrentCompanyLikedStore(
    (s) => s.queryCurrentCompanyLiked,
  );
  const queryAllCompanyFavorites = useGetAllCompanyFavoritesStore(
    (s) => s.queryAllCompanyFavorites,
  );
  const queryCurrentEmployeeLiked = useGetCurrentEmployeeLikedStore(
    (s) => s.queryCurrentEmployeeLiked,
  );
  const queryAllEmployeeFavorites = useGetAllEmployeeFavoritesStore(
    (s) => s.queryAllEmployeeFavorites,
  );
  const queryEmployeeRecommendations = useGetEmployeeRecommendationsStore(
    (s) => s.queryEmployeeRecommendations,
  );
  const queryCompanyRecommendations = useGetCompanyRecommendationsStore(
    (s) => s.queryCompanyRecommendations,
  );

  // Verify OTP Authentication
  const verifyOtp = useVerifyOTPStore((s) => s.verifyOtp);
  const otpError = useVerifyOTPStore((s) => s.error);
  const otpLoading = useVerifyOTPStore((s) => s.loading);
  const otpMessage = useVerifyOTPStore((s) => s.message);
  const otpRole = useVerifyOTPStore((s) => s.role);
  const otpAuthenticated = useVerifyOTPStore((s) => s.isAuthenticated);

  /* -------------------------------- Methods --------------------------------- */
  // ── Preload User Data ─────────────────────────────────────────
  const preloadUserData = useCallback(async () => {
    try {
      // Fist load current user
      await getCurrentUser();

      // Wait a bit for getCurrentUser to complete and update the store
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const userData = useGetCurrentUserStore.getState().user;

          if (userData) {
            if (userData.role === "employee" && userData.employee?.id) {
              await Promise.all([
                queryCurrentEmployeeLiked(userData.employee.id),
                queryAllEmployeeFavorites(userData.employee.id),
                queryEmployeeRecommendations(userData.employee.id),
                queryCompany(),
              ]);
            } else if (userData.role === "company" && userData.company?.id) {
              await Promise.all([
                queryCurrentCompanyLiked(userData.company.id),
                queryAllCompanyFavorites(userData.company.id),
                queryCompanyRecommendations(userData.company.id),
                queryEmployee(),
              ]);
            }
          }
          resolve();
        }, 100);
      });
    } catch (error) {
      console.error("Error preloading data: ", error);
      throw error;
    }
  }, [
    getCurrentUser,
    queryAllCompanyFavorites,
    queryAllEmployeeFavorites,
    queryCurrentCompanyLiked,
    queryCurrentEmployeeLiked,
    queryCompanyRecommendations,
    queryEmployeeRecommendations,
    queryCompany,
    queryEmployee,
  ]);

  /* ---------------------- React Hook Form: Verify OTP Form -------------------- */
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ otp: string }>();
  const onSubmit = async (data: { otp: string }) => {
    isProcessingOtpLogin.current = false;
    setLoginInitiated(true);
    const phone = basicPhoneSignupData?.phone?.replace("0", "+855") ?? "";
    await verifyOtp(phone, data.otp, basicPhoneSignupData?.rememberMe ?? true);
  };

  /* --------------------------------- Effects --------------------------------- */
  // ── Verify OTP Effect ─────────────────────────────────────────
  useEffect(() => {
    if (!loginInitiated) return;

    // Option A: If the role of user is none, navigate user to signup first
    if (otpRole === "none") {
      toast.dismiss();
      setLoginInitiated(false);
      router.replace("/signup/option");
      return;
    }

    if (otpLoading) {
      if (!loadingToastIdRef.current) {
        loadingToastIdRef.current = toast.loading(t("verifyingOtp"));
      }
      return;
    }

    if (loadingToastIdRef.current) {
      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = null;
    }

    if (otpError) {
      toast.dismiss();
      toast.error(otpError, {
        action: {
          label: t("retry"),
          onClick: () => {
            reset();
            setLoginInitiated(false);
            isProcessingOtpLogin.current = false;
          },
        },
      });
      setLoginInitiated(false);
      isProcessingOtpLogin.current = false;
      return;
    }

    // Option B: If user is authenticated, navigate user to feed page
    if (!otpAuthenticated || isProcessingOtpLogin.current) return;

    isProcessingOtpLogin.current = true;
    if (otpAuthenticated && loginInitiated) {
      toast.dismiss();
      const loadingId = toast.loading(t("authenticating"));

      // Preload all user data while showing loading message
      preloadUserData()
        .then(() => {
          console.log("User data preload successfully in otp page");
          toast.dismiss(loadingId);
          toast.success(t("successLoggedIn"), {
            duration: 1000,
          });
        })
        .catch((error) => {
          console.error("Error preloading user data: ", error);
          toast.dismiss(loadingId);
          toast.error(otpMessage ?? String(error), {
            duration: 1000,
          });
        })
        .finally(() => {
          console.log("inside route to feed finally");
          setTimeout(() => {
            toast.dismiss();
            setLoginInitiated(false);
            isProcessingOtpLogin.current = false;
            router.replace("/feed");
          }, DEFAULT_REDIRECT_DELAY_MS);
        });
    }
  }, [
    loginInitiated,
    otpAuthenticated,
    otpError,
    otpLoading,
    otpMessage,
    otpRole,
    preloadUserData,
    reset,
    router,
    t,
  ]);

  /* --------------------------------------------- Render UI ---------------------------------------------- */
  return (
    <div className="min-h-screen w-full flex tablet-md:flex-col">
      {/* Left Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-background p-6 sm:p-10 tablet-md:w-full tablet-md:min-h-0 tablet-md:py-12">
        <div className="w-full max-w-[440px] flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
          {/* Title Section */}
          <div className="flex flex-col items-start">
            <TypographyH2 className="phone-xl:text-2xl">
              {t("otpTitle")}
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              {t("otpSubtitle")}
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-stretch gap-5"
          >
            {/* OTP Input Section */}
            <Controller
              name="otp"
              control={control}
              defaultValue=""
              rules={{
                required: t("otpRequired"),
                minLength: {
                  value: 6,
                  message: t("otpLength"),
                },
              }}
              render={({ field }) => (
                <div className="flex flex-col items-start gap-3">
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="input-otp-slot !size-12 sm:!size-14 tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={1}
                        className="input-otp-slot !size-12 sm:!size-14 tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={2}
                        className="input-otp-slot !size-12 sm:!size-14 tablet-md:!size-10"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={3}
                        className="input-otp-slot !size-12 sm:!size-14 tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={4}
                        className="input-otp-slot !size-12 sm:!size-14 tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={5}
                        className="input-otp-slot !size-12 sm:!size-14 tablet-md:!size-10"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                  <TypographySmall className="text-muted-foreground phone-xl:text-sm">
                    {t("otpInstructions")}
                  </TypographySmall>
                  {errors.otp && (
                    <ErrorMessage>{errors.otp.message}</ErrorMessage>
                  )}
                </div>
              )}
            />
            <Button type="submit">{t("continue")}</Button>
          </form>

          {/* Resend Code Text Section */}
          <TypographyMuted className="text-center">
            {t("didntReceiveCode")}{" "}
            <TypographySmall className="text-foreground font-medium cursor-pointer">
              {t("resend")}
            </TypographySmall>
          </TypographyMuted>
        </div>
      </div>

      {/* Right Section: Image Poster */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-primary relative overflow-hidden tablet-md:hidden">
        <Image
          src={phoneOTPWhiteSvg}
          alt="phone-otp"
          height={undefined}
          width={600}
        />
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/5" />
      </div>
    </div>
  );
}
