import { TPublicJob } from "@/utils/types/job/public-job.type";

export interface IPublicJobDetailProps {
  job: TPublicJob;
  /**
   * The `auth-session-role` cookie, read on the server. Decides whether the
   * primary action says "Apply" or "Sign in to apply" — a guest who is sent to
   * a login screen by a button labelled Apply has been misled, and this page's
   * whole job is to convert people arriving cold from a search result.
   */
  sessionRole: string | null;
}
