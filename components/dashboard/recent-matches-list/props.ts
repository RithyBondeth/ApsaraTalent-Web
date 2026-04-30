import { IRecentMatch } from "@/utils/interfaces/analytics/analytics.interface";

export interface IRecentMatchesListProps {
  matches: IRecentMatch[];
  isEmployee: boolean;
}
