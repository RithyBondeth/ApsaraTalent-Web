export interface IAdminPaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Disables both controls while a fetch is in flight. */
  busy?: boolean;
}
