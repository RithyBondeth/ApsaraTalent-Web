import { cookies } from "next/headers";
import { FavoriteLoadingSkeleton } from "@/components/favorite/skeleton/index";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

export default async function FavoriteLoading() {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_CONFIG.SESSION_ROLE)?.value;
  const isEmployee = role === USER_ROLE.EMPLOYEE;

  return <FavoriteLoadingSkeleton isEmployee={isEmployee} />;
}
