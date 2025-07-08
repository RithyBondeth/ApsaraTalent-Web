import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";
import { useEffect } from "react";

export const useInitializeAuth = () => {
  const stores = [
    useLoginStore(),
    useVerifyOTPStore(),
    useGoogleLoginStore(),
    useGithubLoginStore(),
    useLinkedInLoginStore(),
    useFacebookLoginStore(),
  ];

  useEffect(() => stores.forEach((store) => store.initialize()), []);
};
