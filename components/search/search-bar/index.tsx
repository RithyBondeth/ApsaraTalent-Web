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
import { BriefcaseBusiness, MapPin, Search } from "lucide-react";
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
    <div className="grid w-full grid-cols-[minmax(0,1.35fr)_minmax(170px,0.78fr)_minmax(170px,0.78fr)] gap-3 tablet-md:grid-cols-1">
      {/* Search Keyword Section */}
      <div className="group relative min-w-0 border border-border bg-background">
        <Input
          placeholder={
            props.isEmployee ? t("jobTitleKeywords") : t("positionKeywords")
          }
          prefix={<Search />}
          className="h-12 rounded-none border-0 pr-16 focus-visible:ring-0 focus-visible:ring-offset-0"
          ref={(el) => {
            registerRef(el);
            inputRef.current = el;
          }}
          {...registerRest}
        />
        {/* ⌘K Shortcut Hint Section (Hides when input is focused via CSS focus-within) */}
        <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 transition-opacity duration-150 group-focus-within:opacity-0 sm:flex">
          <kbd className="inline-flex h-5 select-none items-center rounded-none border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Location Section */}
      <div className="min-w-0 border border-border bg-background">
        <Select
          onValueChange={(value: TLocations) => {
            setSelectionLocation(value);
            props.setValue("location" as Path<T>, value as T[keyof T]);
          }}
          value={selectedLocation}
        >
          <SelectTrigger className="h-12 justify-start rounded-none border-0 text-muted-foreground focus:ring-0 [&>span]:flex-1 [&>span]:text-left">
            <MapPin className="mr-2 size-[18px] shrink-0" />
            <SelectValue placeholder={t("location")} />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border shadow-[5px_5px_0_hsl(var(--foreground)/0.08)] [&_[role=option]]:rounded-none">
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
      </div>

      {/* Job Type Section */}
      <div className="min-w-0 border border-border bg-background">
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
          icon={<BriefcaseBusiness />}
          triggerClassName="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          contentClassName="rounded-none border-border shadow-[5px_5px_0_hsl(var(--foreground)/0.08)] [&_*]:rounded-none"
        />
      </div>
    </div>
  );
}
