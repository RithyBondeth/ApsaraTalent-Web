import { IJobPosition } from "@/utils/interfaces/user-interface/company.interface";

export interface IFavoriteCompanyCardProps {
  id: string;
  avatar: string;
  name: string;
  industry: string;
  foundedYear: number;
  description: string;
  openPosition: IJobPosition[];
  companySize: number;
  location: string;
  onRemoveFromFavorite: () => void;
}
