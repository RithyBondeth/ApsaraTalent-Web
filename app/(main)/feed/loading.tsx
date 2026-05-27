import { cookies } from "next/headers";
import FeedPageLoadingSkeleton from "@/components/feed/skeleton/index";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default async function FeedLoading() {
  // Get Token From Cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get Role From Token
  const role = getRoleFromJwt(token);
  const isEmployee = role === USER_ROLE.EMPLOYEE;
  return <FeedPageLoadingSkeleton isEmployee={isEmployee} />;
}
