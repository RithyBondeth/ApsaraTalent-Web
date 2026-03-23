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
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import LogoComponent from "@/components/utils/logo";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useLoginStore } from "@/stores/apis/auth/login.store";
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
import { getRememberPreference } from "@/utils/auth/cookie-manager";
import {
  FacebookIcon as facebookIcon,
  GithubIcon as githubIcon,
  GoogleIcon as googleIcon,
  LinkedInIcon as linkedinIcon,
} from "@/utils/constants/asset.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideEye,
  LucideEyeClosed,
  LucideLockKeyhole,
  LucideMail,
  LucidePhone,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, TLoginForm } from "./validation";
import { loginBlackSvg, loginWhiteSvg } from "@/utils/constants/asset.constant";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

function LoginPage() {
  /* ------------------------------------ Utils -------------------------------- */
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  /* -------------------------------- All States ------------------------------- */
  const [mounted, setMounted] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [openRmbDialog, setOpenRmbDialog] = useState<boolean>(false);

  // Login Helpers
  const [socialTypeIdentifier, setSocialTypeIdentifier] = useState<
    string | null
  >(null);
  const [socialLoginInitiated, setSocialLoginInitiated] =
    useState<boolean>(false);
  const isProcessingSocialLogin = useRef<boolean>(false);
  const [loginInitiated, setLoginInitiated] = useState<boolean>(false);
  const [isPreloadingData, setIsPreloadingData] = useState<boolean>(false);

  /* ----------------------------- API Integration ----------------------------- */
  // Current User, Get All Employees and Companies
  const { getCurrentUser } = useGetCurrentUserStore();
  const { queryCompany } = useGetAllCompanyStore();
  const { queryEmployee } = useGetAllEmployeeStore();
  // User Liked Store
  const getCurrentEmployeeLikedStore = useGetCurrentEmployeeLikedStore(); // Companies liked by current employee
  const getCurrentCompanyLikedStore = useGetCurrentCompanyLikedStore(); // Employees liked by current company
  // User Favorited Store
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore(); // Companies favorited by current employee
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore(); // Employees favorited by current company

  //Regular Email-Password Authentication Store
  const { isAuthenticated, message, login, error, loading } = useLoginStore();

  // Social Authentication Stores
  const googleLoginStore = useGoogleLoginStore();
  const linkedInLoginStore = useLinkedInLoginStore();
  const githubLoginStore = useGithubLoginStore();
  const facebookLoginStore = useFacebookLoginStore();

  /* ----------------------- React Hook Form: Login Form ----------------------- */
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
  // ── Preload User Data ────────────────────────────────────────
  const preloadUserData = async () => {
    try {
      // First get current user data
      await getCurrentUser();

      // Wait a bit for getCurrentUser to complete and update the store
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const userData = useGetCurrentUserStore.getState().user;

          if (userData) {
            if (userData.role === "employee" && userData.employee?.id) {
              // Preload employee-specific data
              console.log(
                "Querying all companies, employee liked, and employee favorite inside Login Page!!!",
              );
              await Promise.all([
                getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(
                  userData.employee.id,
                ),
                getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
                  userData.employee.id,
                ),
                queryCompany(),
              ]);
            } else if (userData.role === "company" && userData.company?.id) {
              // Preload company-specific data
              console.log(
                "Querying all employees, company liked, and company favorite inside Login Page!!!",
              );
              await Promise.all([
                getCurrentCompanyLikedStore.queryCurrentCompanyLiked(
                  userData.company.id,
                ),
                getAllCompanyFavoritesStore.queryAllCompanyFavorites(
                  userData.company.id,
                ),
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
  };

  // ── Login Function ───────────────────────────────────────
  const onSubmit = async (data: TLoginForm) => {
    setLoginInitiated(true);
    await login(data.email, data.password, data.rememberMe!);
  };

  /* --------------------------------- Effects --------------------------------- */
  /*
    - Mark as mounted so the theme-dependent image is only resolved client-side,
    - Preventing the SSR/client hydration mismatch on the login image.
  */
  useEffect(() => setMounted(true), []);

  // ── Remember Preference Effect ──────────────────────────
  useEffect(() => {
    try {
      const savedRememberPreference = getRememberPreference();
      setValue("rememberMe", savedRememberPreference);
    } catch (error) {
      console.error("Error loading remember preference:", error);
    }
  }, [setValue]);

  // ── Login Effect ─────────────────────────────────────────
  // Regular Email-Password Login Effect
  useEffect(() => {
    if (!loginInitiated) return;

    if (isAuthenticated && loginInitiated) {
      setIsPreloadingData(true);

      // Preload all user data while showing loading message
      preloadUserData()
        .then(() => {
          console.log("User data preloaded successfully in loin page");
          toast.success(message ?? "Successfully Logged In", {
            duration: 1000,
          });
        })
        .catch((error) => {
          console.error("Error preloading user data: ", error);
          toast.error(String(error), { duration: 1000 });
        })
        .finally(() => {
          setTimeout(() => {
            toast.dismiss();
            setIsPreloadingData(false);
            setLoginInitiated(false);
            router.push("/feed");
          }, DEFAULT_REDIRECT_DELAY_MS);
        });
    }

    if (error && loginInitiated) {
      toast.dismiss();
      toast.error(message ?? "Login failed", {
        action: {
          label: "Retry",
          onClick: () => {
            reset();
            setLoginInitiated(false);
          },
        },
      });
    }
  }, [isAuthenticated, error, message, loading, loginInitiated]);

  // Social Login Function
  const handleSocialLogin = (rememberMe: "true" | "false") => {
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
      isProcessingSocialLogin.current = true; // Prevent duplicate execution
      toast.dismiss();

      setIsPreloadingData(true);

      // Preload user data and navigate
      preloadUserData()
        .then(() => {
          console.log("User data preloaded successfully");
          toast.success("Successfully Logged In", { duration: 1000 });
        })
        .catch((error) => {
          console.error("Error preloading user data:", error);
          toast.error(String(error), { duration: 1000 });
        })
        .finally(() => {
          setTimeout(() => {
            toast.dismiss();
            setIsPreloadingData(false);
            setSocialLoginInitiated(false);
            isProcessingSocialLogin.current = false;
            router.push("/feed");
          }, DEFAULT_REDIRECT_DELAY_MS);
        });

      return;
    }

    // Handle new user (needs to register first)
    if (newUserStore && !socialLoadingState) {
      setIsPreloadingData(false);
      toast.dismiss();
      toast.info("Please register first", { duration: 1500 });

      setTimeout(() => {
        toast.dismiss();
        setSocialLoginInitiated(false);
        router.push("/signup/option");
      }, DEFAULT_REDIRECT_DELAY_MS);

      return;
    }

    // Handle errors
    if (errorStore && !socialLoadingState) {
      setIsPreloadingData(false);
      toast.dismiss();
      toast.error(errorStore.store.error || "Social login failed", {
        action: {
          label: "Retry",
          onClick: () => {
            setSocialLoginInitiated(false);
          },
        },
      });
    }
  }, [
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
    socialLoginInitiated,
    isPreloadingData,
  ]);

  /* -------------------------------- Loading State -------------------------------- */
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
    ? "Preparing your workspace..."
    : "Authenticating...";

  // Get Current Image Based on Theme
  // Only resolve the theme after mounting — avoids SSR/client hydration mismatch
  // Because resolvedTheme is undefined on the server.
  const loginImage =
    mounted && resolvedTheme === "dark" ? loginWhiteSvg : loginBlackSvg;

  /* ----------------------------------- Render UI ----------------------------------- */
  return (
    <div className="h-screen w-screen flex justify-between items-stretch tablet-lg:flex-col tablet-lg:[&>div]:w-full">
      {/* Left Section */}
      <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground tablet-lg:h-fit">
        <div className="size-[70%] flex flex-col items-start justify-center gap-3 tablet-md:w-[85%] tablet-md:py-10">
          {/* Title Section */}
          <div>
            <LogoComponent className="!h-24 w-auto" withoutTitle />
            <TypographyH2 className="phone-xl:text-2xl">
              Log in to your Account
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              Welcome to Apsara Talent! Select method to log in
            </TypographyMuted>
          </div>

          {/* Social Button Login Section */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between items-center gap-3">
              <SocialButton
                image={googleIcon}
                label="Google"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("google");
                }}
              />
              <SocialButton
                image={facebookIcon}
                label="Facebook"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("facebook");
                }}
              />
            </div>
            <div className="flex justify-between items-center gap-3">
              <SocialButton
                image={linkedinIcon}
                label="LinkedIn"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("linkedIn");
                }}
              />
              <SocialButton
                image={githubIcon}
                label="Github"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  setOpenRmbDialog(true);
                  setSocialTypeIdentifier("github");
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("login/phone-number")}
            >
              <LucidePhone />
              Phone Number
            </Button>
          </div>

          {/* Divider Section */}
          <div className="w-full flex justify-between items-center">
            <Separator className="w-1/3" />
            <TypographyMuted className="text-xs text-center">
              or continue with email
            </TypographyMuted>
            <Separator className="w-1/3" />
          </div>

          {/* Login Form Section */}
          <form
            className="w-full flex flex-col items-stretch gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-5">
              <Input
                prefix={<LucideMail strokeWidth={"1.3px"} />}
                placeholder="Email"
                type="email"
                {...register("email")}
                validationMessage={errors.email?.message}
              />
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
                placeholder="Password"
                type={passwordVisibility ? "text" : "password"}
                {...register("password")}
                validationMessage={errors.password?.message}
              />
            </div>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-1">
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
                  Remember me
                </TypographyMuted>
              </div>
              <TypographySmall className="text-xs cursor-pointer hover:text-muted-foreground">
                <Link href="/forgot-password">Forgot Password?</Link>
              </TypographySmall>
            </div>
            <Button type="submit" disabled={loading}>
              Login
            </Button>
            <div className="flex items-center gap-2 mx-auto">
              <TypographyMuted>Do not have account?</TypographyMuted>
              <Link href="/signup/option">
                <TypographySmall className="text-xs cursor-pointer hover:text-muted-foreground">
                  Create account
                </TypographySmall>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Sectiin: Image Poster Section */}
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-lg:p-10">
        <Image src={loginImage} alt="login" height={undefined} width={450} />
      </div>

      {/* Remember Dialog Section */}
      <Dialog open={openRmbDialog} onOpenChange={setOpenRmbDialog}>
        <DialogContent>
          <DialogTitle>Remember Me</DialogTitle>
          <DialogDescription>
            Do you want to remember this login? (30 days for &quot;Yes&quot;, 1
            day for &quot;No&quot;)
          </DialogDescription>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => {
                handleSocialLogin("false");
                setOpenRmbDialog(false);
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                handleSocialLogin("true");
                setOpenRmbDialog(false);
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Dialog Section */}
      <LoadingDialog
        loading={isAuthLoading}
        title={authLoadingTitle}
        subTitle="Please wait while we authenticate your account."
      />
    </div>
  );
}

export default LoginPage;
