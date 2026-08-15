"use client";

import { Check, ChevronsUpDown } from "lucide-react";
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
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

interface CreatableComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  required?: boolean;
  contentClassName?: string;
  triggerClassName?: string;
  triggerId?: string;
  ariaLabel?: string;
  /**
   * Whether typing a value not in `options` offers to use it. Set false for a
   * closed list that still needs the search box — a long one such as founding
   * year, where a plain Select would mean scrolling a hundred-odd items.
   */
  allowCreate?: boolean;
}

export function CreatableCombobox({
  options,
  value,
  onChange,
  placeholder = "Select or type...",
  emptyText = "Type to create...",
  disabled = false,
  icon,
  required = false,
  contentClassName,
  triggerClassName,
  triggerId,
  ariaLabel,
  allowCreate = true,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={disabled ? undefined : setOpen}
    >
      {/* Combobox Trigger Section */}
      <PopoverTrigger asChild>
        <Button
          id={triggerId}
          type="button"
          variant="outline"
          role="combobox"
          aria-label={ariaLabel ?? placeholder}
          aria-expanded={open}
          aria-required={required}
          disabled={disabled}
          className={cn(
            "h-12 w-full justify-between overflow-hidden font-normal text-muted-foreground",
            triggerClassName,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {icon && (
              <span className="shrink-0 text-muted-foreground [&_svg]:size-[18px]">
                {icon}
              </span>
            )}
            <span className="truncate">
              {selectedOption ? selectedOption.label : value || placeholder}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Combobox Options Section */}
      <PopoverContent
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          contentClassName,
        )}
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            onValueChange={setInputValue}
          />
          <CommandList>
            {/* Empty and Create Option Section */}
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 px-2 py-4">
                <TypographyMuted className="text-sm text-muted-foreground">
                  {emptyText}
                </TypographyMuted>
                {allowCreate && inputValue && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onChange(inputValue);
                      setOpen(false);
                    }}
                  >
                    Use &quot;{inputValue}&quot;
                  </Button>
                )}
              </div>
            </CommandEmpty>

            {/* Existing Options Section */}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(currentValue) => {
                    const matchedOption = options.find(
                      (opt) =>
                        opt.label.toLowerCase() === currentValue.toLowerCase(),
                    );
                    // With creation off, an unmatched label would otherwise
                    // slip a raw search string into a closed list.
                    if (!matchedOption && !allowCreate) return;
                    onChange(
                      matchedOption ? matchedOption.value : currentValue,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {allowCreate &&
                inputValue &&
                !options.some(
                  (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
                ) && (
                  <CommandItem
                    value={inputValue}
                    onSelect={() => {
                      onChange(inputValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === inputValue ? "opacity-100" : "opacity-0",
                      )}
                    />
                    Use &quot;{inputValue}&quot;
                  </CommandItem>
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
