import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideSearch } from "lucide-react";
import { TSearchBarProps } from "./props";
import { TEmployeeSearchSchema } from "@/app/(main)/search/employee/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { TLocations } from "@/utils/types/location.type";
import { SelectValue } from "@radix-ui/react-select";
import { availabilityConstant, locationConstant } from "@/utils/constants/app.constant";
import { TAvailability } from "@/utils/types/availability.type";

export default function SearchBar(
  props: TSearchBarProps<TEmployeeSearchSchema>
) {
  const [selectedLocation, setSelectionLocation] = useState<TLocations | null>(
    props.initialLocation || null
  );

  const [selectedJobType, setSelectionJobType] = useState<TAvailability | null>(
    props.initialJobType || null
  );

  useEffect(() => {
    if (props.initialLocation) {
      setSelectionLocation(props.initialLocation);
    }
  }, [props.initialLocation]);

  return (
    <div className="w-full flex flex-col items-start gap-2 p-3 shadow-md rounded-md">
      <Input
        placeholder={props.isEmployee ? "Job title, keywords" : "Position title, keywords"}
        {...props.register("keyword")}
      />
      <div className="w-full flex items-center gap-3 [&>div]:w-1/2">
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
        <Select
          onValueChange={(value: TAvailability) => {
            setSelectionJobType(value);
            props.setValue("jobType", value);
          }}
          value={selectedJobType || ""}
        >
          <SelectTrigger className="h-12 text-muted-foreground">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            {availabilityConstant.map((jobType, index) => (
              <SelectItem key={index} value={jobType.value}>
                {jobType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant={"secondary"}
        className="w-full text-xs tablet-xl:w-full"
        type="submit"
      >
        <LucideSearch />
        Search
      </Button>
    </div>
  );
}
