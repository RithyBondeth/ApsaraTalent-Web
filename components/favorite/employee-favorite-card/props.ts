export interface IFavoriteEmployeeCardProps {
  id: string;
  avatar: string;
  name: string;
  username: string;
  description: string;
  position: string;
  experience: string;
  availability: string;
  location: string;
  skills: string[];
  onRemoveFromFavorite: () => void;
}
