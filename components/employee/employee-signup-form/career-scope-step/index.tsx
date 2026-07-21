"use client";

import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { useEffect, useRef, useState } from "react";
import { IStepFormProps } from "../props";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { ChevronLeft, ChevronRight, LucideSearch } from "lucide-react";
import { careerScopesListConstant } from "@/utils/constants/ui.constant";
import { useTranslations } from "next-intl";

export default function EmployeeCareerScopeStepForm({
  register,
  getValues,
  setValue,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const itemsPerPage = 10;
  const totalPages = Math.ceil(careerScopesListConstant.length / itemsPerPage);

  /* -------------------------------- All States ------------------------------ */
  const hasMounted = useRef<boolean>(false);
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    register("careerScopes");
    const initial = getValues?.("careerScopes") || [];
    if (Array.isArray(initial)) {
      setSelectedCareers(initial);
    }
  }, [getValues, register]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Toggle Career ─────────────────────────────────────────
  const toggleCareer = (career: string) => {
    setSelectedCareers((prev) => {
      const updated = prev.includes(career)
        ? prev.filter((c) => c !== career)
        : [...prev, career];
      setValue?.("careerScopes", updated, { shouldValidate: true });
      return updated;
    });
  };

  // ── Go To Page ─────────────────────────────────────────
  const goToPage = (page: number) => setCurrentPage(page);

  // ── Paginated Careers ───────────────────────────────────
  const paginatedCareers = careerScopesListConstant.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="auth-step-section flex w-full flex-col items-stretch gap-5">
      {/* Title and SubTite Section */}
      <div>
        <TypographyH4>{t("careerScopeTitle")}</TypographyH4>
        <TypographyMuted className="text-md">
          {t("careerScopeSubtitle")}
        </TypographyMuted>
      </div>

      {/* Search Section */}
      <Button variant="outline" onClick={() => setOpenSearchDialog(true)}>
        <LucideSearch />
        {t("careerScopeSearchBtn")}
      </Button>

      {/* Search Dialog Section */}
      <CommandDialog open={openSearchDialog} onOpenChange={setOpenSearchDialog}>
        <DialogTitle className="sr-only">
          {t("careerScopeSearchDialogTitle")}
        </DialogTitle>
        <CommandInput placeholder={t("careerScopeSearchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{tCommon("noResultsFound")}</CommandEmpty>
          <CommandGroup heading={t("careerScopeSuggestions")}>
            {careerScopesListConstant.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                className="flex items-center gap-2"
                onSelect={() => toggleCareer(item.value)}
              >
                <Checkbox
                  checked={selectedCareers.includes(item.value)}
                  onCheckedChange={() => toggleCareer(item.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-none"
                />
                <span className="text-sm">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Career Options Grid Section */}
      <div className="grid grid-cols-2 gap-2 tablet-sm:grid-cols-1">
        {paginatedCareers.map((item) => {
          const isChecked = selectedCareers.includes(item.value);
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isChecked}
              onClick={() => toggleCareer(item.value)}
              className={`auth-career-option flex min-h-11 items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                isChecked
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-foreground/25"
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleCareer(item.value)}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-none"
              />
              <span className="text-sm leading-5">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Validation Message Section */}
      {errors?.careerScopes && (
        <ErrorMessage>{errors.careerScopes.message}</ErrorMessage>
      )}

      {/* Pagination Section */}
      <div className="auth-career-pagination flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => goToPage(Math.max(currentPage - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="tablet-sm:hidden">{tCommon("previous")}</span>
        </Button>
        <span className="text-xs font-medium text-muted-foreground">
          {t("careerScopePage", { current: currentPage, total: totalPages })}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
        >
          <span className="tablet-sm:hidden">{tCommon("next")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
