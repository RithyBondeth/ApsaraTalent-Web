export type TTemplateCardProps = {
    isPremium: boolean;
    image: string;
    title: string;
    description: string;
    price?: number;
    onUseTemplate: () => void;
    selected?: boolean;
}