import { beforeEach, describe, expect, it, vi } from "vitest";

const { clearAuthCookies, setSessionRole, clearUser } = vi.hoisted(() => ({
  clearAuthCookies: vi.fn(),
  setSessionRole: vi.fn(),
  clearUser: vi.fn(),
}));

vi.mock("@/utils/auth/cookie-manager", () => ({
  clearAuthCookies,
  setSessionRole,
}));
vi.mock("../../users/get-current-user.store", () => ({
  useGetCurrentUserStore: { getState: () => ({ clearUser }) },
}));
vi.mock("@/utils/constants/apis/auth.api.constant", () => ({
  API_AUTH_SOCIAL_FACEBOOK_URL: "https://api.example.com/social/facebook/login",
  API_AUTH_SOCIAL_GITHUB_URL: "https://api.example.com/social/github/login",
  API_AUTH_SOCIAL_GOOGLE_URL: "https://api.example.com/social/google/login",
  API_AUTH_SOCIAL_LINKEDIN_URL: "https://api.example.com/social/linkedin/login",
}));

import { useFacebookLoginStore } from "./facebook-login.store";
import { useGithubLoginStore } from "./github-login.store";
import { useGoogleLoginStore } from "./google-login.store";
import { useLinkedInLoginStore } from "./linkedin-login.store";

const providers = [
  {
    name: "Google",
    successType: "GOOGLE_AUTH_SUCCESS",
    login: () => useGoogleLoginStore.getState().googleLogin("true"),
    clear: () => useGoogleLoginStore.getState().clearToken(),
    state: () => useGoogleLoginStore.getState(),
    reset: () =>
      useGoogleLoginStore.setState({
        loading: false,
        error: null,
        isAuthenticated: false,
        role: null,
      }),
  },
  {
    name: "Facebook",
    successType: "FACEBOOK_AUTH_SUCCESS",
    login: () => useFacebookLoginStore.getState().facebookLogin("true"),
    clear: () => useFacebookLoginStore.getState().clearToken(),
    state: () => useFacebookLoginStore.getState(),
    reset: () =>
      useFacebookLoginStore.setState({
        loading: false,
        error: null,
        isAuthenticated: false,
        role: null,
      }),
  },
  {
    name: "LinkedIn",
    successType: "LINKEDIN_AUTH_SUCCESS",
    login: () => useLinkedInLoginStore.getState().linkedinLogin("true"),
    clear: () => useLinkedInLoginStore.getState().clearToken(),
    state: () => useLinkedInLoginStore.getState(),
    reset: () =>
      useLinkedInLoginStore.setState({
        loading: false,
        error: null,
        isAuthenticated: false,
        role: null,
      }),
  },
  {
    name: "GitHub",
    successType: "GITHUB_AUTH_SUCCESS",
    login: () => useGithubLoginStore.getState().githubLogin("true"),
    clear: () => useGithubLoginStore.getState().clearToken(),
    state: () => useGithubLoginStore.getState(),
    reset: () =>
      useGithubLoginStore.setState({
        loading: false,
        error: null,
        isAuthenticated: false,
        role: null,
      }),
  },
];

describe.each(providers)("$name social-login store", (provider) => {
  beforeEach(() => {
    provider.reset();
  });

  it("completes a trusted popup login and persists the role", () => {
    const popup = {
      closed: false,
      close() {
        this.closed = true;
      },
    };
    vi.spyOn(window, "open").mockReturnValueOnce(
      popup as unknown as Window,
    );

    provider.login();
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: window.location.origin,
        data: {
          type: provider.successType,
          remember: true,
          newUser: false,
          user: {
            role: "employee",
            email: "user@example.com",
            firstname: "Sokha",
            lastname: "Chan",
            username: "sokha",
            picture: "/avatar.jpg",
            provider: provider.name.toLowerCase(),
            lastLoginMethod: "google",
            lastLoginAt: "2026-07-23T00:00:00.000Z",
          },
        },
      }),
    );

    expect(popup.closed).toBe(true);
    expect(setSessionRole).toHaveBeenCalledWith("employee", true);
    expect(provider.state()).toMatchObject({
      loading: false,
      error: null,
      isAuthenticated: true,
      role: "employee",
      message: "Login successful",
    });
  });

  it("reports a blocked popup without leaving the store loading", () => {
    vi.spyOn(window, "open").mockReturnValueOnce(null);

    provider.login();

    expect(provider.state()).toMatchObject({
      loading: false,
      isAuthenticated: false,
      error: "Popup blocked. Please allow popups for this site.",
    });
  });

  it("clears cookies and current-user state", () => {
    provider.clear();

    expect(clearAuthCookies).toHaveBeenCalledOnce();
    expect(clearUser).toHaveBeenCalledOnce();
    expect(provider.state()).toMatchObject({
      loading: false,
      error: null,
      isAuthenticated: false,
      role: null,
      message: null,
    });
  });
});
