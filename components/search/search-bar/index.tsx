import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  availabilityConstant,
  locationConstant,
} from "@/utils/constants/ui.constant";
import { TLocations } from "@/utils/types/user";
import { SelectValue } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { FieldValues, Path } from "react-hook-form";
import { TSearchBarProps } from "./props";

export default function SearchBar<T extends FieldValues>(
  props: TSearchBarProps<T>,
) {
  /* -------------------------------- All States ------------------------------ */
  const [selectedLocation, setSelectionLocation] = useState<TLocations | "All">(
    props.initialLocation || "All",
  );
  const [selectedJobType, setSelectionJobType] = useState<string>(
    props.initialJobType || "all",
  );

  /* --------------------------------- Effects --------------------------------- */
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

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-start gap-2 p-2.5 sm:p-3 shadow-md rounded-md">
      {/* SeachBar Input Section */}
      <Input
        placeholder={
          props.isEmployee ? "Job title, keywords" : "Position title, keywords"
        }
        className="h-10 sm:h-11"
        {...props.register("keyword" as Path<T>)}
      />
      {/* Location and Job Type Section */}
      <div className="w-full flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3 sm:[&>div]:w-1/2">
        {/* Location Section */}
        <Select
          onValueChange={(value: TLocations) => {
            setSelectionLocation(value);
            props.setValue("location" as Path<T>, value as T[keyof T]);
          }}
          value={selectedLocation === "All" ? "All" : selectedLocation}
        >
          <SelectTrigger className="h-10 sm:h-12 text-muted-foreground">
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

        {/* Job Type Section */}
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
