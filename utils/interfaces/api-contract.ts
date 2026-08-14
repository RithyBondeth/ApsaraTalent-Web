/**
 * Compile-time bridge between the hand-written interfaces and the API's real
 * contract.
 *
 * The interfaces under `utils/interfaces/**` are consumed by hundreds of call
 * sites, so replacing them wholesale with the generated types would be a large
 * and risky change. This asserts they stay *compatible* instead: if the API
 * changes shape, `npm run typecheck` fails here rather than in production.
 *
 * Regenerate the source of truth with `npm run api:types`.
 *
 * To migrate an interface properly, re-export the generated type from its file
 * and delete the hand-written body — then its entry here becomes redundant.
 */
import type { components } from "./generated/api";
import type { IUser } from "./user/user.interface";

type Schemas = components["schemas"];

/**
 * Fails to compile unless a value of the API's type can be used where the
 * web's interface is expected — i.e. the web never claims a field the API
 * does not send, and never claims a narrower type than the API returns.
 */
type AssertApiSatisfies<Web, Api extends Web> = Api;

/* --------------------------- Contract assertions --------------------------- */
// Each line pins one hand-written interface to its generated counterpart.
// A failure here means the API contract moved — regenerate, then reconcile.
export type UserContract = AssertApiSatisfies<
  Omit<IUser, "role" | "employee" | "company">,
  Omit<Schemas["UserResponseDTO"], "role" | "employee" | "company">
>;

// `role`, `employee` and `company` are excluded above and checked separately:
// the web narrows `role` to the roles it actually renders, and its IEmployee /
// ICompany carry extra optional fields that only the matching endpoints return
// (skillScore). Those are deliberate divergences, so only the scalar surface is
// pinned — which is where the drift that caused `company: {}` actually lived.
