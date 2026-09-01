import { USER_ROLE } from "@/utils/constants/auth.constant";
import type { TUserRole } from "@/utils/types/auth/role.type";

/**
 * Where the admin panel starts. Local to this module — the default landing
 * route for everyone else is whatever callback the sign-in flow resolved, so
 * there is no matching constant for it to pair with.
 */
const ADMIN_HOME = "/admin";

/* --------------------------------- Method ---------------------------------- */
/**
 * Where to send someone once they are signed in.
 *
 * Sign-in resolves its destination on the client, so the middleware's role
 * routing never runs for it — an administrator was landing on /feed, a page
 * built entirely around an employee or company profile they do not have.
 *
 * An explicit callback under /admin is honoured, so "you must sign in first"
 * on a deep admin link still returns the admin to the page they asked for.
 * Any other callback is discarded for an administrator: it can only point at
 * the parts of the app their role has no profile for.
 *
 * @param callbackUrl - The callback the sign-in flow resolved, already
 *   validated as a same-origin path by the caller.
 * @param role - The role of the account that just signed in.
 */
export function resolveLandingRoute(
  callbackUrl: string,
  role: TUserRole | null | undefined,
): string {
  if (role !== USER_ROLE.ADMIN) return callbackUrl;

  const isAdminPath =
    callbackUrl === ADMIN_HOME || callbackUrl.startsWith(`${ADMIN_HOME}/`);

  return isAdminPath ? callbackUrl : ADMIN_HOME;
}
