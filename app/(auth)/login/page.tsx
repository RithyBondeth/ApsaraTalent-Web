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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoComponent from "@/components/utils/logo";
import loginWhiteSvg from "@/assets/svg/login-white.svg";
import loginBlackSvg from "@/assets/svg/login-black.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, TLoginForm } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalLoginStore, useLoginStore, useSessionLoginStore } from "@/stores/apis/auth/login.store";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ClipLoader } from "react-spinners";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

function LoginPage() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();

  const { handleSubmit, register, formState: { errors }, reset, control} = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { accessToken, refreshToken, message, login, error, loading } =
    useLoginStore();

  const onSubmit = async (data: TLoginForm) => {
    await login(data.email, data.password, data.rememberMe!);
  };

  useEffect(() => {
    if (accessToken && refreshToken) {
      toast({
        description: <div className="flex items-center gap-2"> 
          <LucideCheck/>
          <TypographySmall className="font-medium">Logged in successfully</TypographySmall>
        </div>,
        duration: 1000,
      });
      router.push("/feed");
    }

    if (loading)
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ClipLoader />
            <TypographySmall className="font-medium">
              Logging in...
            </TypographySmall>
          </div>
        ),
      });

    if (error)
      toast({
        variant: "destructive",
        description: (
          <div className="flex flex-row items-center gap-2">
            <LucideInfo/>
            <TypographySmall className="font-medium leading-normal">
              {message}
            </TypographySmall>
          </div>
        ),
        action: (
          <ToastAction altText="Try again" onClick={() => reset()}>
            Retry
          </ToastAction>
        ),
      });
  }, [accessToken, refreshToken, error, message, loading]);

  useEffect(() => {
    const local = useLocalLoginStore.getState();
    const session = useSessionLoginStore.getState();
    const source = local.accessToken ? local : session;
  
    if (source.accessToken) {
      useLoginStore.setState({
        accessToken: source.accessToken,
        refreshToken: source.refreshToken,
        message: source.message,
        rememberMe: source === local,
      });
    }
  }, []);

  const currentTheme = resolvedTheme || "light";
  const loginImage = currentTheme === "dark" ? loginWhiteSvg : loginBlackSvg;

  return (
    <div className="h-screen w-screen flex justify-between items-stretch tablet-lg:flex-col tablet-lg:[&>div]:w-full">
      <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground tablet-lg:h-fit">
        <div className="size-[70%] flex flex-col items-start justify-center gap-3 tablet-md:w-[85%] tablet-md:py-10">
          {/* Title Section */}
          <div>
            <LogoComponent />
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
              />
              <SocialButton
                image={facebookIcon}
                label="Google"
                variant="outline"
                className="w-1/2"
              />
            </div>
            <div className="flex justify-between items-center gap-3">
              <SocialButton
                image={linkedinIcon}
                label="LinkedIn"
                variant="outline"
                className="w-1/2"
              />
              <SocialButton
                image={githubIcon}
                label="Github"
                variant="outline"
                className="w-1/2"
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
            <TypographyMuted className="text-xs">
              or continue with email
            </TypographyMuted>
            <Separator className="w-1/3" />
          </div>
          {/* End Divider Section */}
          {/* Login Form Section Section */}
          <form
            className="w-full flex flex-col items-stretch gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-5">
              <Input
                prefix={<LucideMail />}
                placeholder="Email"
                type="email"
                {...register("email")}
                validationMessage={errors.email?.message}
              />
              <Input
                prefix={<LucideLockKeyhole />}
                suffix={
                  passwordVisibility ? (
                    <LucideEyeClosed
                      onClick={() => setPasswordVisibility(false)}
                    />
                  ) : (
                    <LucideEye onClick={() => setPasswordVisibility(true)} />
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
            <Button type="submit" disabled={loading}>Login</Button>
            <div className="flex items-center gap-2 mx-auto">
              <TypographyMuted>Do not have account?</TypographyMuted>
              <Link href="/signup/option">
                <TypographySmall className="text-xs cursor-pointer hover:text-muted-foreground">
                  Create account
                </TypographySmall>
              </Link>
            </div>
          </form>
          {/* End Login Form Section Section */}
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-lg:p-10">
        <Image src={loginImage} alt="login" height={undefined} width={600} />
      </div>
    </div>
  );
}

export default LoginPage;
