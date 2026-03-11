import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger
} from "@/components/ui/select";
import {
    availabilityConstant,
    locationConstant
} from "@/utils/constants/app.constant";
import { TLocations } from "@/utils/types/location.type";
import { SelectValue } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { FieldValues, Path } from "react-hook-form";
import { TSearchBarProps } from "./props";

export default function SearchBar<T extends FieldValues>(
  props: TSearchBarProps<T>,
) {
  const [selectedLocation, setSelectionLocation] = useState<TLocations | "All">(
    props.initialLocation || "All",
  );

  const [selectedJobType, setSelectionJobType] = useState<string>(
    props.initialJobType || "all",
  );

  useEffect(() => {
    if (props.initialLocation) {
      setSelectionLocation(props.initialLocation);
    }
  }, [props.initialLocation]);

  useEffect(() => {
    if (props.initialJobType) {
      setSelectionJobType(props.initialJobType);
    }
  }, [props.initialJobType]);

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
        <CreatableCombobox
          value={selectedJobType}
          onChange={(value) => {
            const newValue = value || "all";
            setSelectionJobType(newValue);
            props.setValue("jobType" as Path<T>, newValue as T[keyof T]);
          }}
          options={[{ label: "All", value: "all" }, ...availabilityConstant]}
          placeholder="Job Type"
          emptyText="Type job type..."
        />
      </div>
    </div>
  );
}
