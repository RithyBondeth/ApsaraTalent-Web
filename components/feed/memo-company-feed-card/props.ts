import { ICompany } from "@/utils/interfaces/user/company.interface";

export interface IMemoCompanyFeedCardProps {
  company: ICompany;
  employeeId: string;
  isLiking: boolean;
  isFavorite: boolean;
  onView: (id: string) => void;
  onLike: (employeeId: string, companyId: string) => void;
  onSave: (employeeId: string, companyId: string, name: string) => void;
  onProfileImageClick: (e: React.MouseEvent) => void;
  onSetProfileImage: (url: string) => void;
}
