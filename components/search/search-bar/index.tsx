import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideSearch } from "lucide-react";
import { TSearchBarProps } from "./props";
import { TEmployeeSearchSchema } from "@/app/(main)/search/employee/validation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { TLocations } from "@/utils/types/location.type";
import { SelectValue } from "@radix-ui/react-select";
import { locationConstant } from "@/utils/constants/app.constant";

export default function SearchBar(props: TSearchBarProps<TEmployeeSearchSchema>) {
    const [selectedLocation, setSelectionLocation] = useState<TLocations | null>(props.initialLocation || null);

    useEffect(() => {
        if (props.initialLocation) {
            setSelectionLocation(props.initialLocation);
        }
    }, [props.initialLocation]);

    return (
        <div className="w-full flex items-center gap-2 p-3 shadow-md rounded-md tablet-xl:flex-col">
            <Input
                placeholder="Job title, keywords"
                {...props.register('keyword')}
                prefix={<LucideSearch/>}
            />
            <Select
              onValueChange={(value: TLocations) => {
                setSelectionLocation(value);
                props.setValue("location", value);
              }}
              value={selectedLocation || ""}
            >
              <SelectTrigger className="h-12 text-muted-foreground">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locationConstant.map((location, index) => (
                  <SelectItem key={index} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="text-xs tablet-xl:w-full" type="submit">Search</Button>
        </div>
    )   
}