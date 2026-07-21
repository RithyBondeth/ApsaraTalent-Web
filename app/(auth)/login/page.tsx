"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SocialButton from "@/components/utils/buttons/social-button";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import LogoComponent from "@/components/utils/brand/logo";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useTwoFactorStore } from "@/stores/apis/auth/two-factor.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useGetAllCompanyStore } from "@/stores/apis/company/get-all-cmp.store";
import { useGetAllEmployeeStore } from "@/stores/apis/employee/get-all-emp.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useGetEmployeeRecommendationsStore } from "@/stores/apis/recommendation/get-employee-recommendations.store";
import { useGetCompanyRecommendationsStore } from "@/stores/apis/recommendation/get-company-recommendations.store";
import { getRememberPreference } from "@/utils/auth/cookie-manager";
import facebookIcon from "@/assets/socials/facebook.webp";
import githubIcon from "@/assets/socials/github.png";
import googleIcon from "@/assets/socials/google.png";
import linkedinIcon from "@/assets/socials/linkedin.png";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideAlertCircle,
  LucideEye,
  LucideEyeClosed,
  LucideLockKeyhole,
  LucideMail,
  LucidePhone,
  LucideShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { makeLoginSchema, TLoginForm } from "./validation";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";
import { USER_ROLE, OTP_LENGTH } from "@/utils/constants/auth.constant";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function LoginPage() {
  /* ------------------------------------ Utils -------------------------------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");

  /* -------------------------------- All States ------------------------------- */
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [openRmbDialog, setOpenRmbDialog] = useState<boolean>(false);
  const [socialTypeIdentifier, setSocialTypeIdentifier] = useState<
    string | null
  >(null);
  const [socialLoginInitiated, setSocialLoginInitiated] =
    useState<boolean>(false);
  const isProcessingSocialLogin = useRef<boolean>(false);
  const isProcessingRegularLogin = useRef<boolean>(false);
  const [loginInitiated, setLoginInitiated] = useState<boolean>(false);
  const [isPreloadingData, setIsPreloadingData] = useState<boolean>(false);
  const [twoFactorOtp, setTwoFactorOtp] = useState<string>("");
  const [twoFactorInitiated, setTwoFactorInitiated] = useState<boolean>(false);

  /* ----------------------------- API Integration ----------------------------- */
  // Current User, Get All Employees and Companies
  const { getCurrentUser } = useGetCurrentUserStore();
  const { queryCompany } = useGetAllCompanyStore();
  const { queryEmployee } = useGetAllEmployeeStore();

  // User Liked
  const queryCurrentEmployeeLiked = useGetCurrentEmployeeLikedStore(
    (s) => s.queryCurrentEmployeeLiked,
  ); // Companies liked by current employee
  const queryCurrentCompanyLiked = useGetCurrentCompanyLikedStore(
    (s) => s.queryCurrentCompanyLiked,
  ); // Employees liked by current company

  // User Favorited
  const queryAllEmployeeFavorites = useGetAllEmployeeFavoritesStore(
    (s) => s.queryAllEmployeeFavorites,
  ); // Companies favorited by current employee
  const queryAllCompanyFavorites = useGetAllCompanyFavoritesStore(
    (s) => s.queryAllCompanyFavorites,
  ); // Employees favorited by current company

  // Recommendations
  const queryEmployeeRecommendations = useGetEmployeeRecommendationsStore(
    (s) => s.queryEmployeeRecommendations,
  );
  const queryCompanyRecommendations = useGetCompanyRecommendationsStore(
    (s) => s.queryCompanyRecommendations,
  );

  // Regular Email-Password Authentication
  const {
    isAuthenticated,
    login,
    error,
    loading,
    requiresTwoFactor,
    pendingUserId,
    pendingRememberMe,
    clearTwoFactorPending,
  } = useLoginStore();

  // Two-Factor Authentication
  const twoFactorStore = useTwoFactorStore();

  // Social Authentication
  const googleLoginStore = useGoogleLoginStore();
  const linkedInLoginStore = useLinkedInLoginStore();
  const githubLoginStore = useGithubLoginStore();
  const facebookLoginStore = useFacebookLoginStore();

  /* ----------------------- React Hook Form: Login Form ----------------------- */
  // ── Define Schema For Login Form ──────────────────────────
  const loginSchema = useMemo(
    () =>
      makeLoginSchema({
        emailRequired: tv("emailRequired"),
        emailInvalid: tv("emailInvalid"),
        passwordRequired: tv("passwordRequired"),
        passwordMinLength: tv("passwordMinLength"),
        passwordNeedsNumber: tv("passwordNeedsNumber"),
        passwordNeedsSpecial: tv("passwordNeedsSpecial"),
      }),
    [tv],
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── Callback URL Function ────────────────────────────────────
  const callbackUrl = useMemo(() => {
    const value = searchParams.get("callbackUrl");
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
      return "/feed";
    }
    return value;
  }, [searchParams]);

  // ── Phone Login Href Function ────────────────────────────────
  const phoneLoginHref = useMemo(() => {
    if (callbackUrl === "/feed") return "/login/phone-number";
    return `/login/phone-number?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }, [callbackUrl]);

  // ── Preload User Data Function ────────────────────────────────
  const preloadUserData = useCallback(async () => {
    try {
      // First get current user data
      await getCurrentUser();

      // Wait a bit for getCurrentUser to complete and update the store
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const userData = useGetCurrentUserStore.getState().user;

          if (userData) {
            if (userData.role === USER_ROLE.EMPLOYEE && userData.employee?.id) {
              await Promise.all([
                queryCurrentEmployeeLiked(userData.employee.id),
                queryAllEmployeeFavorites(userData.employee.id),
                queryEmployeeRecommendations(userData.employee.id),
                queryCompany(),
              ]);
            } else if (
              userData.role === USER_ROLE.COMPANY &&
              userData.company?.id
            ) {
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
      console.error("Error preloading user data:", error);
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

  // ── Email Password Login Function ────────────────────────────
  const onSubmit = async (data: TLoginForm) => {
    isProcessingRegularLogin.current = false;
    setLoginInitiated(true);
    await login(data.email, data.password, data.rememberMe!);
  };

  // ── Social Login Function ────────────────────────────────────
  const handleSocialLogin = (rememberMe: "true" | "false") => {
    // Reset all social store states to avoid stale errors triggering the effect
    useGoogleLoginStore.setState({
      error: null,
      loading: false,
      isAuthenticated: false,
      newUser: null,
    });
    useLinkedInLoginStore.setState({
      error: null,
      loading: false,
      isAuthenticated: false,
      newUser: null,
    });
    useGithubLoginStore.setState({
      error: null,
      loading: false,
      isAuthenticated: false,
      newUser: null,
    });
    useFacebookLoginStore.setState({
      error: null,
      loading: false,
      isAuthenticated: false,
      newUser: null,
    });

    toast.dismiss();
    setSocialLoginInitiated(true);
    isProcessingSocialLogin.current = false; // Reset flag
    switch (socialTypeIdentifier) {
      case "facebook":
        facebookLoginStore.facebookLogin(rememberMe);
        break;
      case "google":
        googleLoginStore.googleLogin(rememberMe);
        break;
      case "github":
        githubLoginStore.githubLogin(rememberMe);
        break;
      case "linkedIn":
        linkedInLoginStore.linkedinLogin(rememberMe);
        break;
    }
  };

  // ── 2FA Verify Function ──────────────────────────────────────
  const handleTwoFactorVerify = async () => {
    if (!pendingUserId || twoFactorOtp.length < 6) return;
    setTwoFactorInitiated(true);
    const success = await twoFactorStore.verifyLogin(
      pendingUserId,
      twoFactorOtp,
      pendingRememberMe,
    );
    if (!success) {
      setTwoFactorInitiated(false);
      return;
    }
    // Verified — now preload user data and redirect
    setIsPreloadingData(true);
    clearTwoFactorPending();
    preloadUserData()
      .then(() => {
        toast.success(t("successLoggedIn"), {
          duration: TOAST_DURATION_MS.SHORT,
        });
      })
      .catch(() => {
        toast.error(t("loginFailed"), { duration: TOAST_DURATION_MS.SHORT });
      })
      .finally(() => {
        setTimeout(() => {
          toast.dismiss();
          setIsPreloadingData(false);
          setTwoFactorInitiated(false);
          setTwoFactorOtp("");
          router.replace(callbackUrl);
        }, DEFAULT_REDIRECT_DELAY_MS);
      });
  };

  /* --------------------------------- Effects --------------------------------- */
  // ── Remember Preference Effect ───────────────────────────────
  useEffect(() => {
    try {
      const savedRememberPreference = getRememberPreference();
      setValue("rememberMe", savedRememberPreference);
    } catch (error) {
      console.error("Error loading remember preference:", error);
    }
  }, [setValue]);

  // ── Login Effect ─────────────────────────────────────────────
  // Regular Email-Password Login Effect
  useEffect(() => {
    if (!loginInitiated) return;
    if (loading) return;

    if (error) {
      toast.dismiss();
      toast.error(t("loginFailed"), {
        action: {
          label: t("retry"),
          onClick: () => {
            reset();
            setLoginInitiated(false);
            isProcessingRegularLogin.current = false;
          },
        },
      });
      setLoginInitiated(false);
      isProcessingRegularLogin.current = false;
      return;
    }

    if (!isAuthenticated || isProcessingRegularLogin.current) return;

    isProcessingRegularLogin.current = true;
    setIsPreloadingData(true);

    // Preload all user data while showing loading message
    preloadUserData()
      .then(() => {
        console.log("User data preloaded successfully in login page");
        toast.success(t("successLoggedIn"), {
          duration: TOAST_DURATION_MS.SHORT,
        });
      })
      .catch((error) => {
        console.error("Error preloading user data: ", error);
        toast.error(String(error), { duration: TOAST_DURATION_MS.SHORT });
      })
      .finally(() => {
        setTimeout(() => {
          toast.dismiss();
          setIsPreloadingData(false);
          setLoginInitiated(false);
          isProcessingRegularLogin.current = false;
          router.replace(callbackUrl);
        }, DEFAULT_REDIRECT_DELAY_MS);
      });
  }, [
    error,
    isAuthenticated,
    loading,
    loginInitiated,
    preloadUserData,
    reset,
    router,
    callbackUrl,
    t,
  ]);

  // Social Login Effect
  useEffect(() => {
    if (!socialLoginInitiated) return;

    const socialStores = [
      { name: "Google", store: googleLoginStore },
      { name: "LinkedIn", store: linkedInLoginStore },
      { name: "GitHub", store: githubLoginStore },
      { name: "Facebook", store: facebookLoginStore },
    ];

    // One of social store is loading
    const socialLoadingState = socialStores.some((s) => s.store.loading);
    // One of social store is authenticated
    const isAnySocialAuthenticated = socialStores.find(
      (s) => s.store.isAuthenticated,
    );
    // One of social store is error
    const errorStore = socialStores.find(
      (s) => s.store.error && !s.store.isAuthenticated && !s.store.loading,
    );
    // One of social store is a new user
    const newUserStore = socialStores.find(
      (s) => s.store.newUser === true && !s.store.isAuthenticated,
    );

    if (socialLoadingState) {
      return;
    }

    // Handle successful authentication - show loading while preloading data
    if (
      isAnySocialAuthenticated &&
      !socialLoadingState &&
      !isProcessingSocialLogin.current
    ) {
      isProcessingSocialLogin.current = true;
      toast.dismiss();

      setIsPreloadingData(true);

      // Preload user data and navigate
      preloadUserData()
        .then(() => {
          console.log("User data preloaded successfully");
          toast.success(t("successLoggedIn"), {
            duration: TOAST_DURATION_MS.SHORT,
          });
        })
        .catch((error) => {
          console.error("Error preloading user data:", error);
          toast.error(String(error), { duration: TOAST_DURATION_MS.SHORT });
        })
        .finally(() => {
          setTimeout(() => {
            toast.dismiss();
            setIsPreloadingData(false);
            setSocialLoginInitiated(false);
            isProcessingSocialLogin.current = false;
            router.replace(callbackUrl);
          }, DEFAULT_REDIRECT_DELAY_MS);
        });

      return;
    }

    // Handle new user (needs to register first)
    if (newUserStore && !socialLoadingState) {
      setIsPreloadingData(false);
      toast.dismiss();
      setSocialLoginInitiated(false);
      toast.info(t("pleaseRegisterFirst"), {
        duration: TOAST_DURATION_MS.MEDIUM,
      });

      setTimeout(() => {
        toast.dismiss();
        router.replace("/signup/option");
      }, DEFAULT_REDIRECT_DELAY_MS);

      return;
    }

    // Handle errors
    if (errorStore && !socialLoadingState) {
      setIsPreloadingData(false);
      toast.dismiss();
      setSocialLoginInitiated(false);
      isProcessingSocialLogin.current = false;
      toast.error(errorStore.store.error || t("socialLoginFailed"), {
        action: {
          label: t("retry"),
          onClick: () => {
            setSocialLoginInitiated(false);
          },
        },
      });
    }
  }, [
    googleLoginStore,
    linkedInLoginStore,
    githubLoginStore,
    facebookLoginStore,
    googleLoginStore.isAuthenticated,
    googleLoginStore.newUser,
    googleLoginStore.loading,
    googleLoginStore.error,
    linkedInLoginStore.isAuthenticated,
    linkedInLoginStore.newUser,
    linkedInLoginStore.loading,
    linkedInLoginStore.error,
    githubLoginStore.isAuthenticated,
    githubLoginStore.newUser,
    githubLoginStore.loading,
    githubLoginStore.error,
    facebookLoginStore.isAuthenticated,
    facebookLoginStore.newUser,
    facebookLoginStore.loading,
    facebookLoginStore.error,
    callbackUrl,
    preloadUserData,
    router,
    socialLoginInitiated,
    t,
  ]);

  /* --------------------------------- Loading State --------------------------------- */
  const isAnySocialLoading =
    googleLoginStore.loading ||
    linkedInLoginStore.loading ||
    githubLoginStore.loading ||
    facebookLoginStore.loading;

  const isAuthLoading =
    (loginInitiated && loading) ||
    (socialLoginInitiated && isAnySocialLoading) ||
    isPreloadingData;

  const authLoadingTitle = isPreloadingData
    ? t("preparingWorkspace")
    : t("authenticating");

  /* ----------------------------------- Render UI ----------------------------------- */
  return (
    <div className="auth-page auth-login-page flex h-[100dvh] min-h-0 w-full overflow-hidden tablet-lg:flex-col">
      {/* Left Section */}
      <div className="auth-form-pane relative flex h-full min-h-0 w-[58%] items-center justify-center overflow-hidden bg-background px-7 py-10 sm:px-12 tablet-lg:w-full tablet-lg:px-5 tablet-lg:pb-5 tablet-lg:pt-16">
        <div className="auth-form-shell relative z-10 flex w-full max-w-[440px] flex-col gap-6">
          {/* Logo & Title Section */}
          <div className="auth-heading-group auth-stagger flex flex-col items-start gap-1.5">
            <LogoComponent
              className="auth-form-logo mb-3 !h-11 w-auto self-start"
              priority
            />
            <TypographyH2 className="text-3xl font-semibold tracking-[-0.035em] phone-xl:text-2xl">
              {t("loginPageTitle")}
            </TypographyH2>
            <TypographyMuted className="text-sm leading-6 phone-xl:text-sm">
              {t("loginSubtitle")}
            </TypographyMuted>
          </div>

          {/* Social Button Login Section */}
          <div className="auth-stagger flex w-full flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Google Login Button */}
              <SocialButton
                image={googleIcon}
                label="Google"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("google");
                }}
              />
              {/* Facebook Login Button */}
              <SocialButton
                image={facebookIcon}
                label="Facebook"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("facebook");
                }}
              />
              {/* LinkedIn Login Button */}
              <SocialButton
                image={linkedinIcon}
                label="LinkedIn"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("linkedIn");
                }}
              />
              {/* Github Login Button */}
              <SocialButton
                image={githubIcon}
                label="Github"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("github");
                }}
              />
            </div>
            <Button
              variant="outline"
              className="auth-social-button h-11 w-full rounded-xl"
              onClick={() => router.push(phoneLoginHref)}
            >
              <LucidePhone />
              {t("phoneNumber")}
            </Button>
          </div>

          {/* Divider Section */}
          <div className="auth-stagger flex w-full items-center gap-3">
            <Separator className="flex-1" />
            <TypographyMuted className="text-xs whitespace-nowrap">
              {t("orContinueWithEmail")}
            </TypographyMuted>
            <Separator className="flex-1" />
          </div>

          {/* Login Form Section */}
          <form
            className="auth-form auth-stagger flex w-full flex-col items-stretch gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-3">
              <div className="auth-field flex flex-col gap-1.5">
                <label htmlFor="login-email">{t("email")}</label>
                <Input
                  id="login-email"
                  prefix={<LucideMail strokeWidth={1.5} />}
                  placeholder={t("email")}
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  validationMessage={errors.email?.message}
                />
              </div>
              <div className="auth-field flex flex-col gap-1.5">
                <label htmlFor="login-password">{t("password")}</label>
                <Input
                  id="login-password"
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
                  placeholder={t("password")}
                  type={passwordVisibility ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  validationMessage={errors.password?.message}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Controller
                  name="rememberMe"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      id="remember-me"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="remember-me"
                  className="cursor-pointer text-xs text-muted-foreground"
                >
                  {t("rememberMeLabel")}
                </label>
              </div>
              <TypographySmall className="text-xs cursor-pointer hover:text-muted-foreground transition-colors">
                <Link href="/forgot-password">{t("forgotPasswordLink")}</Link>
              </TypographySmall>
            </div>
            <Button
              type="submit"
              className="auth-primary-action h-12 w-full rounded-xl"
              disabled={loading}
            >
              {t("loginButton")}
            </Button>
            <div className="flex items-center justify-center gap-2">
              <TypographyMuted>{t("noAccount")}</TypographyMuted>
              <Link href="/signup/option">
                <TypographySmall className="text-xs cursor-pointer hover:text-muted-foreground transition-colors">
                  {t("createAccount")}
                </TypographySmall>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section: Auth Panel */}
      <AuthBrandPanel className="w-[42%] tablet-lg:hidden" />

      {/* Two-Factor Auth Verification Dialog Section */}
      <Dialog
        open={requiresTwoFactor}
        onOpenChange={(open) => {
          if (!open) {
            clearTwoFactorPending();
            setTwoFactorOtp("");
          }
        }}
      >
        <DialogContent>
          <DialogTitle className="flex items-center gap-2">
            <LucideShieldCheck className="size-5 text-primary" />
            {t("twoFactorTitle")}
          </DialogTitle>
          <DialogDescription>{t("twoFactorDesc")}</DialogDescription>
          <div className="flex flex-col items-center gap-3 py-2">
            <InputOTP
              maxLength={OTP_LENGTH}
              value={twoFactorOtp}
              onChange={setTwoFactorOtp}
              disabled={twoFactorInitiated}
            >
              <InputOTPGroup>
                {Array.from({ length: OTP_LENGTH }, (_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {twoFactorStore.error && (
              <div className="flex items-center gap-1.5 text-destructive text-xs">
                <LucideAlertCircle className="size-3.5 shrink-0" />
                {twoFactorStore.error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                clearTwoFactorPending();
                setTwoFactorOtp("");
              }}
              disabled={twoFactorInitiated}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleTwoFactorVerify}
              disabled={twoFactorInitiated || twoFactorOtp.length < 6}
            >
              {t("verify")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remember Dialog Section */}
      <Dialog open={openRmbDialog} onOpenChange={setOpenRmbDialog}>
        <DialogContent>
          <DialogTitle>{t("rememberMe")}</DialogTitle>
          <DialogDescription>{t("rememberMeDescription")}</DialogDescription>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => {
                handleSocialLogin("false");
                setOpenRmbDialog(false);
              }}
            >
              {t("no")}
            </Button>
            <Button
              onClick={() => {
                handleSocialLogin("true");
                setOpenRmbDialog(false);
              }}
            >
              {t("yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Dialog Section */}
      <LoadingDialog
        loading={isAuthLoading}
        title={authLoadingTitle}
        subTitle={t("pleaseWaitAuth")}
      />
    </div>
  );
}

export default LoginPage;
