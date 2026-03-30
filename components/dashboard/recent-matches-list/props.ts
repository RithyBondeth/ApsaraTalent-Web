import { IRecentMatch } from "@/utils/interfaces/analytics.interface";

export interface IRecentMatchesListProps {
  matches: IRecentMatch[];
  isEmployee: boolean;
}
