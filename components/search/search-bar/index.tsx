"use client";

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
import { TLocations } from "@/utils/types/user/location.type";
import { SelectValue } from "@radix-ui/react-select";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FieldValues, Path, UseFormRegisterReturn } from "react-hook-form";
import { TSearchBarProps } from "./props";

export default function SearchBar<T extends FieldValues>(
  props: TSearchBarProps<T>,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("searchBar");

  /* -------------------------------- All States ------------------------------ */
  const [selectedLocation, setSelectionLocation] = useState<TLocations | "all">(
    props.initialLocation || "all",
  );
  const [selectedJobType, setSelectionJobType] = useState<string>(
    props.initialJobType || "all",
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ----------------------------- React Hook Form ----------------------------- */
  // Merge react-hook-form's ref with our local inputRef
  const { ref: registerRef, ...registerRest } = props.register(
    "keyword" as Path<T>,
  ) as UseFormRegisterReturn;

  /* --------------------------------- Effects --------------------------------- */
  // Initial Location Effect
  useEffect(() => {
    if (props.initialLocation) {
      setSelectionLocation(props.initialLocation);
    }
  }, [props.initialLocation]);

  // Initial Job Type Effect
  useEffect(() => {
    if (props.initialJobType) {
      setSelectionJobType(props.initialJobType);
    }
  }, [props.initialJobType]);

  // ⌘K / Ctrl+K Global Shortcut - Focus this search input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-start gap-2 p-2.5 sm:p-3 shadow-md rounded-md">
      {/* SeachBar Input Section */}
      <div className="relative w-full group">
        <Input
          placeholder={
            props.isEmployee ? t("jobTitleKeywords") : t("positionKeywords")
          }
          className="h-10 sm:h-11 pr-16"
          ref={(el) => {
            registerRef(el);
            inputRef.current = el;
          }}
          {...registerRest}
        />
        {/* ⌘K Shortcut Hint Section (Hides when input is focused via CSS focus-within) */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 group-focus-within:opacity-0 transition-opacity duration-150">
          <kbd className="inline-flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>
      {/* Location and Job Type Section */}
      <div className="w-full flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3 sm:[&>div]:w-1/2">
        {/* Location Section */}
        <Select
          onValueChange={(value: TLocations) => {
            setSelectionLocation(value);
            props.setValue("location" as Path<T>, value as T[keyof T]);
          }}
          value={selectedLocation}
        >
          <SelectTrigger className="h-10 sm:h-12 text-muted-foreground">
            <SelectValue placeholder={t("location")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-location" value="all">
              {t("all")}
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
          options={[
            { label: t("all"), value: "all" },
            ...availabilityConstant.map((a) => ({
              ...a,
              label:
                (
                  {
                    full_time: t("fullTime"),
                    part_time: t("partTime"),
                    internship: t("internship"),
                    contract: t("contract"),
                    freelance: t("freelance"),
                    remote: t("remote"),
                  } as Record<string, string>
                )[a.value] ?? a.label,
            })),
          ]}
          placeholder={t("jobType")}
          emptyText={t("typeJobType")}
        />
      </div>
    </div>
  );
}
