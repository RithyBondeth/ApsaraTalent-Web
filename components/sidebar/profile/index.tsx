import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyP } from "@/components/utils/typography/typography-p";

export default function Profile() {
    return (
        <div className="flex items-center gap-3 mt-3">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <TypographyP className="!m-0 !text-sm">Rithy Bondeth</TypographyP>
        </div>
    )   
}