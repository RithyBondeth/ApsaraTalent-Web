import { TRecentMatch } from "@/stores/apis/matching/analytics.store";

export interface IRecentMatchesListProps {
  matches: TRecentMatch[];
  isEmployee: boolean;
}
