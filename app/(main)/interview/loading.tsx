import { cookies } from "next/headers";
import InterviewLoadingSkeleton from "@/components/interview/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

export default async function InterviewLoading() {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_CONFIG.SESSION_ROLE)?.value;
  return (
    <InterviewLoadingSkeleton
      role={
        role === USER_ROLE.EMPLOYEE || role === USER_ROLE.COMPANY
          ? role
          : undefined
      }
    />
  );
}
