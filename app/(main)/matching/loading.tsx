import { cookies } from "next/headers";
import { MatchingLoadingSkeleton } from "@/components/matching/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

export default async function MatchingLoading() {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_CONFIG.SESSION_ROLE)?.value;
  const isEmployee = role === USER_ROLE.EMPLOYEE;

  return <MatchingLoadingSkeleton isEmployee={isEmployee} />;
}
