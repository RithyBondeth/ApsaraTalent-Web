import { cookies } from "next/headers";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";
import MatchingPageClient from "./_components/matching-page-client";

export default async function MatchingPage() {
  // Get Cookie Store
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get Role From JWT
  const role = getRoleFromJwt(token);
  const initialIsEmployee = role === "employee";

  return <MatchingPageClient initialIsEmployee={initialIsEmployee} />;
}
