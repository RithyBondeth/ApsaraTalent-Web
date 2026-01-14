import { Input } from "@/components/ui/input";
import { TSearchBarProps } from "./props";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { TLocations } from "@/utils/types/location.type";
import { SelectValue } from "@radix-ui/react-select";
import {
  availabilityConstant,
  locationConstant,
} from "@/utils/constants/app.constant";
import { TAvailability } from "@/utils/types/availability.type";
import { FieldValues, Path } from "react-hook-form";

export default function SearchBar<T extends FieldValues>(
  props: TSearchBarProps<T>
) {
  const [selectedLocation, setSelectionLocation] = useState<TLocations | "All">(
    props.initialLocation || "All"
  );

  const [selectedJobType, setSelectionJobType] = useState<
    TAvailability | "All"
  >(props.initialJobType || "All");

  useEffect(() => {
    if (props.initialLocation) {
      setSelectionLocation(props.initialLocation);
    }
  }, [props.initialLocation]);

  return (
    <div className="w-full flex flex-col items-start gap-2 p-3 shadow-md rounded-md">
      <Input
        placeholder={
          props.isEmployee ? "Job title, keywords" : "Position title, keywords"
        }
        {...props.register("keyword" as Path<T>)}
      />
      <div className="w-full flex items-center gap-3 [&>div]:w-1/2">
        <Select
          onValueChange={(value: TLocations) => {
            setSelectionLocation(value);
            props.setValue("location" as Path<T>, value as T[keyof T]);
          }}
          value={selectedLocation === "All" ? "All" : selectedLocation}
        >
          <SelectTrigger className="h-12 text-muted-foreground">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-location" value="all">
              All
            </SelectItem>
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
            props.setValue("jobType" as Path<T>, value as T[keyof T]);
          }}
          value={selectedJobType === "All" ? "All" : selectedJobType}
        >
          <SelectTrigger className="h-12 text-muted-foreground">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-jobType" value="all">
              All
            </SelectItem>
            {availabilityConstant.map((jobType, index) => (
              <SelectItem key={index} value={jobType.value}>
                {jobType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
