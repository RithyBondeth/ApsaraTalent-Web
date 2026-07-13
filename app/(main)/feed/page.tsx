import { cookies } from "next/headers";
import FeedPageClient from "./_components/feed-page-client";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

export default async function FeedPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_CONFIG.SESSION_ROLE)?.value;
  const initialIsEmployee = role === USER_ROLE.EMPLOYEE;

  return <FeedPageClient initialIsEmployee={initialIsEmployee} />;
}
