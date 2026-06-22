/* ----------------------------------- Types ---------------------------------- */
export type TPaginationPageItem = number | "...";

type TGetPaginationPagesOptions = {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
};

/* --------------------------------- Methods ---------------------------------- */
/**
 * Generates an array of pagination elements (numbers or "...") based on the
 * current page window and max boundaries. Calculates the visible slice
 * to show around the current page without overflowing the container bounds.
 *
 * @param options - currentPage, totalPages, maxVisiblePages
 * @returns Array mixed with numeric page indexes and string ellipses ("...")
 */
export function getPaginationPages(
  options: TGetPaginationPagesOptions,
): TPaginationPageItem[] {
  const { currentPage, totalPages, maxVisiblePages = 1 } = options;

  if (totalPages < 1) return [];

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const pages: TPaginationPageItem[] = [];

  for (
    let page = safeCurrentPage;
    page < safeCurrentPage + maxVisiblePages && page <= totalPages;
    page++
  ) {
    pages.push(page);
  }

  if (safeCurrentPage + maxVisiblePages < totalPages) {
    pages.push("...");
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}
