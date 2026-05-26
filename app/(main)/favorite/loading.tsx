import { cookies } from "next/headers";
import { FavoriteLoadingSkeleton } from "@/components/favorite/skeleton/index";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";

export default async function FavoriteLoading() {
  // Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get role from token
  const role = getRoleFromJwt(token);
  const isEmployee = role === "employee";

  return <FavoriteLoadingSkeleton isEmployee={isEmployee} />;
}
