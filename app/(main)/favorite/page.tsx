import { cookies } from "next/headers";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";
import FavoritePageClient from "./_components/favorite-page-client";

export default async function FavoritePage() {
  // Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get role from token
  const role = getRoleFromJwt(token);
  const initialIsEmployee = role === "employee";

  return <FavoritePageClient initialIsEmployee={initialIsEmployee} />;
}
