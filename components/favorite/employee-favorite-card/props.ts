export interface IFavoriteEmployeeCardProps {
    avatar: string;
    name: string;
    username: string;
    description: string;
    position: string;
    experience: number;
    availability: string;
    location: string;
    skills: string[];
    onViewClick: () => void; 
  }