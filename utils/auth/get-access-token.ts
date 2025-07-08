import {
  useLocalLoginStore,
  useLoginStore,
  useSessionLoginStore,
} from "@/stores/apis/auth/login.store";
import {
  useFacebookLoginStore,
  useLocalFacebookLoginStore,
  useSessionFacebookLoginStore,
} from "@/stores/apis/auth/socials/facebook-login.store";
import {
  useGithubLoginStore,
  useLocalGithubLoginStore,
  useSessionGithubLoginStore,
} from "@/stores/apis/auth/socials/github-login.store";
import {
  useGoogleLoginStore,
  useLocalGoogleLoginStore,
  useSessionGoogleLoginStore,
} from "@/stores/apis/auth/socials/google-login.store";
import {
  useLinkedInLoginStore,
  useLocalLinkedInLoginStore,
  useSessionLinkedInLoginStore,
} from "@/stores/apis/auth/socials/linkedin-login.store";
import {
  useLocalVerifyOTPStore,
  useSessionVerifyOTPStore,
  useVerifyOTPStore,
} from "@/stores/apis/auth/verify-otp.store";

const extractToken = (store: any) => store.getState().accessToken;

export const getUnifiedAccessToken = () => {
  const tokens = [
    extractToken(useLoginStore),
    extractToken(useLocalLoginStore),
    extractToken(useSessionLoginStore),
    extractToken(useVerifyOTPStore),
    extractToken(useLocalVerifyOTPStore),
    extractToken(useSessionVerifyOTPStore),
    extractToken(useGoogleLoginStore),
    extractToken(useLocalGoogleLoginStore),
    extractToken(useSessionGoogleLoginStore),
    extractToken(useFacebookLoginStore),
    extractToken(useLocalFacebookLoginStore),
    extractToken(useSessionFacebookLoginStore),
    extractToken(useGithubLoginStore),
    extractToken(useLocalGithubLoginStore),
    extractToken(useSessionGithubLoginStore),
    extractToken(useLinkedInLoginStore),
    extractToken(useLocalLinkedInLoginStore),
    extractToken(useSessionLinkedInLoginStore),
  ];

  return tokens.find((token) => !!token);
};
