import { cookies } from "next/headers";
import MatchingPageClient from "./_components/matching-page-client";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

export default async function MatchingPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_CONFIG.SESSION_ROLE)?.value;
  const initialIsEmployee = role === USER_ROLE.EMPLOYEE;

  return <MatchingPageClient initialIsEmployee={initialIsEmployee} />;
}
