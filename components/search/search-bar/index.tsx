import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideMapPin, LucideSearch } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="w-full flex items-center gap-2 p-3 shadow-md rounded-md tablet-xl:flex-col">
            <Input
                placeholder="Job title, keywords"
                prefix={<LucideSearch/>}
            />
            <Input
                placeholder="Location"
                prefix={<LucideMapPin/>}
            />
            <Button className="text-xs tablet-xl:w-full">Search</Button>
        </div>
    )   
}