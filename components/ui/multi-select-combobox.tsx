"use client";

import { LucideCheck } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectComboboxProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  contentClassName?: string;
  triggerClassName?: string;
  triggerId?: string;
  ariaLabel?: string;
}

/**
 * Closed-list multi-select over a searchable popover. Used wherever both sides
 * of a match pick from the same vocabulary — a candidate's languages and a
 * role's required languages — so the two stay directly comparable.
 */
export function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  emptyText = "No option found.",
  searchPlaceholder,
  disabled = false,
  icon,
  contentClassName,
  triggerClassName,
  triggerId,
  ariaLabel,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = value ?? [];

  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  };

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={disabled ? undefined : setOpen}
    >
      {/* Trigger Section */}
      <PopoverTrigger asChild>
        <Button
          id={triggerId}
          type="button"
          variant="outline"
          role="combobox"
          aria-label={ariaLabel ?? placeholder}
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-12 w-full justify-start overflow-hidden font-normal text-muted-foreground",
            triggerClassName,
          )}
        >
          {icon && (
            <span className="shrink-0 text-muted-foreground [&_svg]:size-[18px]">
              {icon}
            </span>
          )}
          <span className="truncate">
            {selected.length > 0 ? selected.join(", ") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      {/* Options Section */}
      <PopoverContent
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          contentClassName,
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder ?? placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => toggle(option)}
                >
                  <LucideCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
