import { cookies } from "next/headers";
import ApplicationPageClient from "./_components/application-page-client";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

export default async function ApplicationPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_CONFIG.SESSION_ROLE)?.value;
  const initialIsEmployee = role === USER_ROLE.EMPLOYEE;

  return <ApplicationPageClient initialIsEmployee={initialIsEmployee} />;
}
