import { cookies } from "next/headers";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";
import FeedPageClient from "./_components/feed-page-client";

export default async function FeedPage() {
  // Get Token From Cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get Role From Token
  const role = getRoleFromJwt(token);
  const initialIsEmployee = role === "employee";

  return <FeedPageClient initialIsEmployee={initialIsEmployee} />;
}
