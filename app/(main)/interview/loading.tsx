import { cookies } from "next/headers";
import InterviewLoadingSkeleton from "@/components/interview/skeleton";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";

export default async function InterviewLoading() {
  // Get cookie store
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get role from token
  const role = getRoleFromJwt(token);
  return (
    <InterviewLoadingSkeleton
      role={role === "employee" || role === "company" ? role : undefined}
    />
  );
}
