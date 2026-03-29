export type TPaginationPageItem = number | "...";

type TGetPaginationPagesOptions = {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
};

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
