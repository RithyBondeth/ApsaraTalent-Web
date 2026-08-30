"use client";

import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { useEffect, useRef, useState } from "react";
import { IStepFormProps } from "../props";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideSearch,
} from "lucide-react";
import { careerScopesListConstant } from "@/utils/constants/ui.constant";
import { getPaginationPages } from "@/utils/functions/ui";
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
  const pageNumbers = getPaginationPages({ currentPage, totalPages });

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
    <div className="flex w-full flex-col items-stretch gap-8">
      {/* Title and SubTite Section */}
      <div className="phone-xl:mt-10">
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
            {careerScopesListConstant.slice(0, 5).map((item, index) => (
              <CommandItem key={index} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCareers.includes(item.value)}
                  onCheckedChange={() => toggleCareer(item.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">{item.label}</Label>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Career Options Grid Section */}
      <div className="flex flex-wrap gap-3">
        {paginatedCareers.map((item, index) => {
          const isChecked = selectedCareers.includes(item.value);
          return (
            <Card
              key={index}
              className={`flex cursor-pointer items-center gap-2 p-2 transition-all hover:scale-105 ${
                isChecked ? "border-primary" : ""
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleCareer(item.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Label className="text-sm">{item.label}</Label>
            </Card>
          );
        })}
      </div>

      {/* Validation Message Section */}
      {errors?.careerScopes && (
        <ErrorMessage>{errors.careerScopes.message}</ErrorMessage>
      )}

      {/* Pagination Section */}
      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              onClick={() => goToPage(Math.max(currentPage - 1, 1))}
              className={`gap-1 pl-2.5 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            >
              <LucideChevronLeft className="h-4 w-4" />
              <span>{tCommon("previous")}</span>
            </PaginationLink>
          </PaginationItem>

          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => goToPage(Number(page))}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationLink
              onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
              className={`gap-1 pr-2.5 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
            >
              <span>{tCommon("next")}</span>
              <LucideChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
