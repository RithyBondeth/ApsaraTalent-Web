export interface IAdminListSkeletonProps {
  /**
   * How many placeholder rows to draw. Defaults to 5 — enough to fill the
   * viewport on the standard admin list page (page size 25) without
   * over-committing to a shape the data might not fill.
   *
   * The compact audit table passes a larger value; every other list page
   * takes the default.
   */
  count?: number;
  /**
   * Height of each row placeholder, as a Tailwind class. Match the height the
   * real row will render at — a placeholder that is 40px shorter than its row
   * still reflows the page when data lands. Defaults to `h-24` (a middleweight
   * card, correct for the users list); other pages pass their own.
   */
  rowClassName?: string;
}
