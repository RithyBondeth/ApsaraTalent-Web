import { describe, expect, it } from "vitest";

import en from "@/language/en.json";
import km from "@/language/km.json";
import type { TAdminAction } from "./admin.type";

/* ---------------------------------------------------------------------------
 * Every audit action the API can emit needs a label in both catalogues.
 *
 * The audit log and the account detail page both render an action through
 * `t(\`admin.userDetail.action.${action}\`)`. A new action added to the API
 * without a matching catalogue entry renders as the raw key path — the audit
 * log showed "admin.userDetail.action.job_hidden" to an administrator, in a
 * build where every existing test passed.
 *
 * The catalogue parity test could not catch it: it checks en and km carry the
 * same keys as each other, and both were equally missing the new one.
 *
 * The Record below is the mechanism. It is typed by TAdminAction, so adding a
 * member to that union without adding it here fails to compile — the reminder
 * arrives at the type level, before the test even runs.
 * ------------------------------------------------------------------------- */
const EVERY_ACTION: Record<TAdminAction, true> = {
  user_suspended: true,
  user_banned: true,
  user_reinstated: true,
  report_status_changed: true,
  job_hidden: true,
  job_restored: true,
};

describe("admin audit action labels", () => {
  const actions = Object.keys(EVERY_ACTION) as TAdminAction[];

  it.each(actions)("en carries a label for %s", (action) => {
    const label = (
      en.admin.userDetail.action as Record<string, string | undefined>
    )[action];
    expect(label, `missing en label for ${action}`).toBeTruthy();
    // A label that is just the key back would render as gibberish too.
    expect(label).not.toContain("admin.");
  });

  it.each(actions)("km carries a label for %s", (action) => {
    const label = (
      km.admin.userDetail.action as Record<string, string | undefined>
    )[action];
    expect(label, `missing km label for ${action}`).toBeTruthy();
    expect(label).not.toContain("admin.");
  });
});
