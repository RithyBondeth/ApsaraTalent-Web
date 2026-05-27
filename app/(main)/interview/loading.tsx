import { cookies } from "next/headers";
import InterviewLoadingSkeleton from "@/components/interview/skeleton";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default async function InterviewLoading() {
  // Get cookie store
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get role from token
  const role = getRoleFromJwt(token);
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
