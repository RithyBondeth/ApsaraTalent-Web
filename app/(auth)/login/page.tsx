"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SocialButton from "@/components/utils/buttons/social-button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import {
  googleIcon,
  facebookIcon,
  linkedinIcon,
  githubIcon,
} from "@/utils/constants/asset.constant";
import {
  LucideCheck,
  LucideEye,
  LucideEyeClosed,
  LucideInfo,
  LucideLockKeyhole,
  LucideMail,
  LucidePhone,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LogoComponent from "@/components/utils/logo";
import loginWhiteSvg from "@/assets/svg/login-white.svg";
import loginBlackSvg from "@/assets/svg/login-black.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, TLoginForm } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { getRememberPreference } from "@/utils/auth/get-access-token";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";
import { useGetAllCompanyStore } from "@/stores/apis/company/get-all-cmp.store";
import { useGetAllEmployeeStore } from "@/stores/apis/employee/get-all-emp.store";

function LoginPage() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [openRmbDialog, setOpenRmbDialog] = useState<boolean>(false);
  const [socialTypeIdentifier, setSocialTypeIdentifier] = useState<
    string | null
  >(null);
  const [loginInitiated, setLoginInitiated] = useState<boolean>(false);
  const [socialLoginInitiated, setSocialLoginInitiated] =
    useState<boolean>(false);
  const [isPreloadingData, setIsPreloadingData] = useState<boolean>(false);
  const isProcessingSocialLogin = useRef<boolean>(false);

  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { toast, dismiss } = useToast();

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

  // Load remember preference on mount
  useEffect(() => {
    try {
      const savedRememberPreference = getRememberPreference();
      setValue("rememberMe", savedRememberPreference);
    } catch (error) {
      console.error("Error loading remember preference:", error);
    }
  }, [setValue]);

  // User Stores
  const { getCurrentUser } = useGetCurrentUserStore();
  const { queryCompany } = useGetAllCompanyStore();
  const { queryEmployee } = useGetAllEmployeeStore();
  const getCurrentEmployeeLikedStore = useGetCurrentEmployeeLikedStore(); // Companies liked by current employee
  const getCurrentCompanyLikedStore = useGetCurrentCompanyLikedStore(); // Employees liked by current company
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore(); // Companies favorited by current employee
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore(); // Employees favorited by current company

  // Email/Password Authentication Store
  const { isAuthenticated, message, login, error, loading } = useLoginStore();

  // Social Authentication Stores
  const googleLoginStore = useGoogleLoginStore();
  const linkedInLoginStore = useLinkedInLoginStore();
  const githubLoginStore = useGithubLoginStore();
  const facebookLoginStore = useFacebookLoginStore();

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
                "Querying all companies, employee liked, and employee favorite inside Login Page!!!"
              );
              await Promise.all([
                getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(
                  userData.employee.id
                ),
                getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
                  userData.employee.id
                ),
                queryCompany(),
              ]);
            } else if (userData.role === "company" && userData.company?.id) {
              // Preload company-specific data
              console.log(
                "Querying all employees, company liked, and company favorite inside Login Page!!!"
              );
              await Promise.all([
                getCurrentCompanyLikedStore.queryCurrentCompanyLiked(
                  userData.company.id
                ),
                getAllCompanyFavoritesStore.queryAllCompanyFavorites(
                  userData.company.id
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

  const onSubmit = async (data: TLoginForm) => {
    setLoginInitiated(true);
    await login(data.email, data.password, data.rememberMe!);
  };

  // Regular Email/Password Login Effect
  useEffect(() => {
    if (!loginInitiated) return;

    if (isAuthenticated && loginInitiated) {
      dismiss(); // Dismiss any previous toasts

      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium">
              Authenticating...
            </TypographySmall>
          </div>
        ),
        duration: Infinity,
      });

      // Preload all user data while showing loading message
      preloadUserData()
        .then(() => {
          console.log("User data preloaded successfully");
          dismiss();
          toast({
            description: (
              <div className="flex items-center gap-2">
                <LucideCheck />
                <TypographySmall className="font-medium leading-relaxed">
                  {message}
                </TypographySmall>
              </div>
            ),
            duration: 1000,
          });
        })
        .catch((error) => {
          console.error("Error preloading user data:", error);
          dismiss();
          toast({
            description: (
              <div className="flex items-center gap-2">
                <LucideCheck />
                <TypographySmall className="font-medium leading-relaxed">
                  {error}
                </TypographySmall>
              </div>
            ),
            duration: 1000,
          });
        })
        .finally(() => {
          setTimeout(() => {
            dismiss();
            setLoginInitiated(false);
            router.push("/feed");
          }, 1000);
        });
    }

    if (loading && loginInitiated) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium">
              Authenticating...
            </TypographySmall>
          </div>
        ),
        duration: Infinity,
      });
    }

    if (error && loginInitiated) {
      dismiss();
      toast({
        variant: "destructive",
        description: (
          <div className="flex flex-row items-center gap-2">
            <LucideInfo />
            <TypographySmall className="font-medium leading-relaxed">
              {message}
            </TypographySmall>
          </div>
        ),
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              reset();
              setLoginInitiated(false);
            }}
          >
            Retry
          </ToastAction>
        ),
      });
    }
  }, [isAuthenticated, error, message, loading, loginInitiated]);

  // Social Login Effect
  useEffect(() => {
    if (!socialLoginInitiated) return;

    const socialStores = [
      { name: "Google", store: googleLoginStore },
      { name: "LinkedIn", store: linkedInLoginStore },
      { name: "GitHub", store: githubLoginStore },
      { name: "Facebook", store: facebookLoginStore },
    ];

    const isAnySocialLoading = socialStores.some((s) => s.store.loading);
    const isAnySocialAuthenticated = socialStores.find(
      (s) => s.store.isAuthenticated
    );
    const newUserStore = socialStores.find(
      (s) => s.store.newUser === true && !s.store.isAuthenticated
    );
    const errorStore = socialStores.find(
      (s) => s.store.error && !s.store.isAuthenticated && !s.store.loading
    );

    // Show popup loading toast
    if (isAnySocialLoading) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium">
              Authenticating...
            </TypographySmall>
          </div>
        ),
        duration: Infinity,
      });
      return;
    }

    // Handle successful authentication - show loading while preloading data
    if (
      isAnySocialAuthenticated &&
      !isAnySocialLoading &&
      !isProcessingSocialLogin.current
    ) {
      isProcessingSocialLogin.current = true; // Prevent duplicate execution
      dismiss(); // Dismiss authentication toast

      // Show data loading toast immediately
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium">
              Authenticating...
            </TypographySmall>
          </div>
        ),
        duration: Infinity,
      });

      setIsPreloadingData(true);

      // Preload user data and navigate
      preloadUserData()
        .then(() => {
          console.log("User data preloaded successfully");
          dismiss();
          toast({
            description: (
              <div className="flex items-center gap-2">
                <LucideCheck />
                <TypographySmall className="font-medium leading-relaxed">
                  Logged in successfully
                </TypographySmall>
              </div>
            ),
            duration: 1000,
          });
        })
        .catch((error) => {
          console.error("Error preloading user data:", error);
          dismiss();
          toast({
            description: (
              <div className="flex items-center gap-2">
                <LucideCheck />
                <TypographySmall className="font-medium leading-relaxed">
                  {error}
                </TypographySmall>
              </div>
            ),
            duration: 1000,
          });
        })
        .finally(() => {
          setTimeout(() => {
            dismiss();
            setIsPreloadingData(false);
            setSocialLoginInitiated(false);
            isProcessingSocialLogin.current = false;
            router.push("/feed");
          }, 1000);
        });

      return;
    }

    // Handle new user (needs to register)
    if (newUserStore && !isAnySocialLoading) {
      dismiss();

      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideInfo />
            <TypographySmall className="font-medium leading-relaxed">
              Please register first
            </TypographySmall>
          </div>
        ),
        duration: 1500,
      });

      setTimeout(() => {
        dismiss();
        setSocialLoginInitiated(false);
        router.push("/signup/option");
      }, 1500);

      return;
    }

    // Handle errors
    if (errorStore && !isAnySocialLoading) {
      dismiss();

      toast({
        variant: "destructive",
        description: (
          <div className="flex flex-row items-center gap-2">
            <LucideInfo />
            <TypographySmall className="font-medium leading-relaxed">
              {errorStore.store.error || "Social login failed"}
            </TypographySmall>
          </div>
        ),
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              setSocialLoginInitiated(false);
            }}
          >
            Retry
          </ToastAction>
        ),
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

  const currentTheme = resolvedTheme || "light";
  const loginImage = currentTheme === "dark" ? loginWhiteSvg : loginBlackSvg;

  return (
    <div className="h-screen w-screen flex justify-between items-stretch tablet-lg:flex-col tablet-lg:[&>div]:w-full">
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
          {/* End Title Section */}
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
          {/* End Social Button Login Section */}
          {/* Divider Section */}
          <div className="w-full flex justify-between items-center">
            <Separator className="w-1/3" />
            <TypographyMuted className="text-xs text-center">
              or continue with email
            </TypographyMuted>
            <Separator className="w-1/3" />
          </div>
          {/* End Divider Section */}
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
          {/* End Login Form Section */}
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-lg:p-10">
        <Image src={loginImage} alt="login" height={undefined} width={600} />
      </div>
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
    </div>
  );
}

export default LoginPage;
