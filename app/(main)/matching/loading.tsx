import { cookies } from "next/headers";
import { MatchingLoadingSkeleton } from "@/components/matching/skeleton";
import { getRoleFromJwt } from "@/utils/functions/auth/get-role-from-jwt";

export default async function MatchingLoading() {
  // Get Cookie Store
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value ?? "";

  // Get Role From JWT
  const role = getRoleFromJwt(token);
  const isEmployee = role === "employee";

  return <MatchingLoadingSkeleton isEmployee={isEmployee} />;
}
