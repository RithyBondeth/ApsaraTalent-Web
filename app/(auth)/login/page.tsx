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
import { Separator } from "@/components/ui/separator";
import AuthShell from "@/components/auth/auth-shell";
import { AuthField } from "@/components/auth/auth-field";
import SocialButton from "@/components/utils/buttons/social-button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import LogoComponent from "@/components/utils/brand/logo";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useTwoFactorStore } from "@/stores/apis/auth/two-factor.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { getRememberPreference } from "@/utils/auth/cookie-manager";
import {
  facebookIcon,
  githubIcon,
  googleIcon,
  linkedInIcon as linkedinIcon,
} from "@/utils/constants/asset.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideAlertCircle,
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
import { loginSvg } from "@/utils/constants/asset.constant";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";
import { OTP_LENGTH } from "@/utils/constants/auth.constant";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resolveLandingRoute } from "@/utils/functions/url";

function LoginPage() {
  /* ------------------------------------ Utils -------------------------------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");

  /* -------------------------------- All States ------------------------------- */
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
  // Current user
  const { getCurrentUser } = useGetCurrentUserStore();

  // Regular Email-Password Authentication
  const {
    isAuthenticated,
    login,
    error,
    loading,
    requiresTwoFactor,
    pendingTwoFactorToken,
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

  /* --------------------------------- Memos --------------------------------- */
  // ── Callback URL Function ────────────────────────────────────
  const callbackUrl = useMemo(() => {
    const value = searchParams.get("callbackUrl");
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
      return "/feed";
    }
    return value;
  }, [searchParams]);

  // ── Landing Route Function ───────────────────────────────────
  /*
    Sign-in resolves its own destination on the client, so the middleware's
    role routing never runs for it. Without this an administrator lands on
    /feed — a page built entirely around an employee or company profile their
    role does not have.

    Read at call time rather than memoised on `user`: the store is populated by
    preloadUserData() inside the same promise chain that navigates, so a memo
    would still be holding the pre-login value when it is needed.
  */
  const landingRoute = (target: string) =>
    resolveLandingRoute(
      target,
      useGetCurrentUserStore.getState().user?.role ?? null,
    );

  // ── Phone Login Href Function ────────────────────────────────
  const phoneLoginHref = useMemo(() => {
    if (callbackUrl === "/feed") return "/login/phone-number";
    return `/login/phone-number?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }, [callbackUrl]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Preload User Data Function ────────────────────────────────
  const preloadUserData = useCallback(async () => {
    await getCurrentUser();
    const currentUserState = useGetCurrentUserStore.getState();
    if (!currentUserState.user) {
      throw new Error(
        currentUserState.error ?? "Failed to load the current user",
      );
    }
  }, [getCurrentUser]);

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
    if (!pendingTwoFactorToken || twoFactorOtp.length < 6) return;
    setTwoFactorInitiated(true);
    const success = await twoFactorStore.verifyLogin(
      pendingTwoFactorToken,
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
        toast.dismiss();
        toast.success(t("successLoggedIn"), {
          duration: TOAST_DURATION_MS.SHORT,
        });
      })
      .catch(() => {
        toast.dismiss();
        toast.error(t("loginFailed"), { duration: TOAST_DURATION_MS.SHORT });
      })
      .finally(() => {
        setIsPreloadingData(false);
        setTwoFactorInitiated(false);
        setTwoFactorOtp("");
        router.replace(landingRoute(callbackUrl));
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

    // Resolve the authenticated user before entering the protected app.
    preloadUserData()
      .then(() => {
        toast.dismiss();
        toast.success(t("successLoggedIn"), {
          duration: TOAST_DURATION_MS.SHORT,
        });
      })
      .catch((error) => {
        console.error("Error preloading user data: ", error);
        toast.dismiss();
        toast.error(String(error), { duration: TOAST_DURATION_MS.SHORT });
      })
      .finally(() => {
        setIsPreloadingData(false);
        setLoginInitiated(false);
        isProcessingRegularLogin.current = false;
        router.replace(landingRoute(callbackUrl));
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
          toast.dismiss();
          toast.success(t("successLoggedIn"), {
            duration: TOAST_DURATION_MS.SHORT,
          });
        })
        .catch((error) => {
          console.error("Error preloading user data:", error);
          toast.dismiss();
          toast.error(String(error), { duration: TOAST_DURATION_MS.SHORT });
        })
        .finally(() => {
          setIsPreloadingData(false);
          setSocialLoginInitiated(false);
          isProcessingSocialLogin.current = false;
          router.replace(landingRoute(callbackUrl));
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
    <>
      <AuthShell
        image={loginSvg}
        imageAlt={t("loginPageTitle")}
        eyebrowKey="loginPanelEyebrow"
        titleKey="loginPanelTitle"
        subtitleKey="loginPanelSubtitle"
      >
        <div className="auth-stagger flex w-full flex-col gap-6">
          {/* Logo & Title Section */}
          <div style={{ "--d": "0ms" } as React.CSSProperties}>
            <LogoComponent className="!h-16 w-auto self-start" priority />
            <TypographyH2 className="mt-5 phone-xl:text-2xl">
              {t("loginPageTitle")}
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              {t("loginSubtitle")}
            </TypographyMuted>
          </div>

          {/* Social Button Login Section */}
          <div
            className="flex w-full flex-col gap-3"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Google Login Button */}
              <SocialButton
                image={googleIcon}
                label="Google"
                variant="outline"
                className="auth-social w-full"
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
                className="auth-social w-full"
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
                className="auth-social w-full"
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
                className="auth-social w-full"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("github");
                }}
              />
            </div>
            <Button
              variant="outline"
              className="auth-social w-full"
              onClick={() => router.push(phoneLoginHref)}
            >
              <LucidePhone />
              {t("phoneNumber")}
            </Button>
          </div>

          {/* Divider Section */}
          <div
            className="flex w-full items-center gap-3"
            style={{ "--d": "140ms" } as React.CSSProperties}
          >
            <Separator className="flex-1" />
            <TypographyMuted className="whitespace-nowrap text-xs">
              {t("orContinueWithEmail")}
            </TypographyMuted>
            <Separator className="flex-1" />
          </div>

          {/* Login Form Section */}
          <form
            className="flex w-full flex-col items-stretch gap-4"
            onSubmit={handleSubmit(onSubmit)}
            style={{ "--d": "200ms" } as React.CSSProperties}
          >
            <div className="flex flex-col gap-3.5">
              <AuthField
                label={t("email")}
                type="email"
                autoComplete="email"
                icon={<LucideMail strokeWidth={1.6} className="size-[18px]" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <AuthField
                label={t("password")}
                type="password"
                autoComplete="current-password"
                icon={
                  <LucideLockKeyhole
                    strokeWidth={1.6}
                    className="size-[18px]"
                  />
                }
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex min-h-11 cursor-pointer items-center gap-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <TypographyMuted className="text-xs">
                  {t("rememberMeLabel")}
                </TypographyMuted>
              </label>
              <Link
                href="/forgot-password"
                className="inline-flex min-h-11 items-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("forgotPasswordLink")}
              </Link>
            </div>
            <Button
              type="submit"
              className="auth-submit h-11 w-full"
              disabled={loading}
            >
              {t("loginButton")}
            </Button>
            <div className="flex items-center justify-center gap-1.5">
              <TypographyMuted className="text-sm">
                {t("noAccount")}
              </TypographyMuted>
              <Link
                href="/signup/option"
                className="text-sm font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
              >
                {t("createAccount")}
              </Link>
            </div>
          </form>
        </div>
      </AuthShell>

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
              <div className="flex items-center gap-1.5 text-xs text-destructive">
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
    </>
  );
}

export default LoginPage;
