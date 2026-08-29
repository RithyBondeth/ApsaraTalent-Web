import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  currentUser: {
    role: "employee",
    employee: {
      id: "employee-1",
      firstname: "Dara",
      lastname: "Sok",
      username: "dara",
      skills: [{ name: "React" }],
    },
  },
  employeeStore: {
    currentEmployeeMatching: [] as Array<Record<string, unknown>>,
    loading: false,
    queryCurrentEmployeeMatching: vi.fn(),
    removeMatch: vi.fn(),
  },
  companyStore: {
    currentCompanyMatching: [] as Array<Record<string, unknown>>,
    loading: false,
    queryCurrentCompanyMatching: vi.fn(),
    removeMatch: vi.fn(),
  },
  initiateChat: vi.fn(),
  unmatch: vi.fn(),
  unmatchError: null as string | null,
  routerPush: vi.fn(),
  removeChat: vi.fn(),
  getRecentChats: vi.fn(),
  removeInterviews: vi.fn(),
  refetchInterviews: vi.fn(),
  markUnmatchInitiated: vi.fn(),
  markEmployeeSeen: vi.fn(),
  markCompanySeen: vi.fn(),
  toastLoading: vi.fn(() => "toast-1"),
  toastDismiss: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/hooks/utils/use-fetch-once", () => ({
  useFetchOnce: () => ({
    isEmployee: true,
    currentUser: mocks.currentUser,
  }),
}));
vi.mock("@/stores/apis/matching/get-current-employee-matching.store", () => ({
  useGetCurrentEmployeeMatchingStore: () => mocks.employeeStore,
}));
vi.mock("@/stores/apis/matching/get-current-company-matching.store", () => ({
  useGetCurrentCompanyMatchingStore: () => mocks.companyStore,
}));
vi.mock("@/stores/apis/chat/initiate-chat.store", () => ({
  useInitiateChatStore: () => ({ initiateChat: mocks.initiateChat }),
}));
vi.mock("@/stores/apis/matching/unmatch.store", () => {
  const useUnmatchStore = () => ({ unmatch: mocks.unmatch });
  useUnmatchStore.getState = () => ({ unmatchError: mocks.unmatchError });
  return { useUnmatchStore };
});
vi.mock("@/stores/features/chat/chat.store", () => ({
  useChatStore: (
    selector: (state: {
      removeChatByPartnerId: typeof mocks.removeChat;
      getRecentChats: typeof mocks.getRecentChats;
    }) => unknown,
  ) =>
    selector({
      removeChatByPartnerId: mocks.removeChat,
      getRecentChats: mocks.getRecentChats,
    }),
}));
vi.mock("@/stores/apis/matching/interview.store", () => ({
  useInterviewStore: (
    selector: (state: {
      removeInterviewsByPartnerId: typeof mocks.removeInterviews;
      silentRefetch: typeof mocks.refetchInterviews;
    }) => unknown,
  ) =>
    selector({
      removeInterviewsByPartnerId: mocks.removeInterviews,
      silentRefetch: mocks.refetchInterviews,
    }),
}));
vi.mock("@/stores/features/chat/socket-listeners", () => ({
  markUnmatchInitiated: mocks.markUnmatchInitiated,
}));
vi.mock("@/stores/apis/matching/count-current-employee-matching.store", () => ({
  useCountCurrentEmployeeMatchingStore: (
    selector: (state: {
      markAsSeen: typeof mocks.markEmployeeSeen;
      totalEmpMatching: number;
    }) => unknown,
  ) => selector({ markAsSeen: mocks.markEmployeeSeen, totalEmpMatching: 1 }),
}));
vi.mock("@/stores/apis/matching/count-current-company-matching.store", () => ({
  useCountCurrentCompanyMatchingStore: (
    selector: (state: {
      markAsSeen: typeof mocks.markCompanySeen;
      totalCmpMatching: number;
    }) => unknown,
  ) => selector({ markAsSeen: mocks.markCompanySeen, totalCmpMatching: 1 }),
}));
vi.mock("@/components/matching/matching-company-card", () => ({
  default: (props: {
    name: string;
    onChatNowClick: () => void;
    onScheduleClick: () => void;
    onUnmatch: () => void;
    isChatLoading: boolean;
    isUnmatching: boolean;
  }) => (
    <div>
      <span>{props.name}</span>
      <button disabled={props.isChatLoading} onClick={props.onChatNowClick}>
        Page chat
      </button>
      <button onClick={props.onScheduleClick}>Page schedule</button>
      <button disabled={props.isUnmatching} onClick={props.onUnmatch}>
        Page unmatch
      </button>
    </div>
  ),
}));
vi.mock("@/components/matching/matching-employee-card", () => ({
  default: () => null,
}));
vi.mock("@/components/matching/skeleton", () => ({
  MatchingLoadingSkeleton: () => <div>Matching loading</div>,
}));
vi.mock("@/components/utils/animations/count-up", () => ({
  CountUp: ({ to }: { to: number }) => <span>{to}</span>,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.routerPush }),
}));
vi.mock("next/image", () => ({
  default: (props: { alt: string }) => (
    <span role="img" aria-label={props.alt} />
  ),
}));
vi.mock("sonner", () => ({
  toast: {
    loading: mocks.toastLoading,
    dismiss: mocks.toastDismiss,
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import MatchingPageClient from "./matching-page-client";

const companyMatch = {
  id: "company-1",
  name: "Apsara Labs",
  avatar: "",
  industry: "Technology",
  description: "Product company",
  companySize: 20,
  foundedYear: 2020,
  openPositions: [],
  location: "phnom-penh",
  skillScore: 80,
};

describe("MatchingPageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.employeeStore.currentEmployeeMatching = [companyMatch];
    mocks.companyStore.currentCompanyMatching = [];
    mocks.unmatchError = null;
    mocks.initiateChat.mockResolvedValue({ id: "chat-1" });
    mocks.unmatch.mockResolvedValue(undefined);
  });

  it("opens chat, schedules an interview, and performs optimistic unmatch", async () => {
    const user = userEvent.setup();
    render(<MatchingPageClient initialIsEmployee />);
    expect(await screen.findByText("Apsara Labs")).toBeVisible();
    expect(mocks.markEmployeeSeen).toHaveBeenCalledWith("employee-1");

    await user.click(screen.getByRole("button", { name: "Page chat" }));
    await waitFor(() =>
      expect(mocks.routerPush).toHaveBeenCalledWith("/message?chatId=chat-1"),
    );
    await user.click(screen.getByRole("button", { name: "Page schedule" }));
    expect(mocks.routerPush).toHaveBeenCalledWith("/interview?with=company-1");

    await user.click(screen.getByRole("button", { name: "Page unmatch" }));
    await waitFor(() =>
      expect(mocks.unmatch).toHaveBeenCalledWith(
        "employee-1",
        "company-1",
        true,
      ),
    );
    expect(mocks.markUnmatchInitiated).toHaveBeenCalledOnce();
    expect(mocks.employeeStore.removeMatch).toHaveBeenCalledWith("company-1");
    /*
      The conversation must survive. Unmatching deletes the match row and the
      interviews; it never deletes messages, so removing the thread claimed
      something the server does not do — and it keyed on the wrong ID anyway,
      so it silently did nothing.
    */
    expect(mocks.removeChat).not.toHaveBeenCalled();
    expect(mocks.removeInterviews).toHaveBeenCalledWith("company-1");
    expect(mocks.toastDismiss).toHaveBeenCalledWith("toast-1");
    expect(mocks.toastSuccess).toHaveBeenCalledWith("unmatchSuccess");
  });

  it("restores matches and interviews when unmatch fails", async () => {
    mocks.unmatch.mockImplementation(async () => {
      mocks.unmatchError = "Server rejected unmatch";
    });
    const user = userEvent.setup();
    render(<MatchingPageClient initialIsEmployee />);

    await user.click(
      await screen.findByRole("button", { name: "Page unmatch" }),
    );
    await waitFor(() =>
      expect(
        mocks.employeeStore.queryCurrentEmployeeMatching,
      ).toHaveBeenCalledWith("employee-1"),
    );
    // Nothing to restore in the sidebar — the thread was never removed.
    expect(mocks.getRecentChats).not.toHaveBeenCalled();
    expect(mocks.refetchInterviews).toHaveBeenCalledWith(
      "employee-1",
      "employee",
    );
    expect(mocks.toastError).toHaveBeenCalledWith("unmatchError");
  });
});
