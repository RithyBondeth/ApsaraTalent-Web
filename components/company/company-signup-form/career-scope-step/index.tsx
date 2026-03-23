"use client";

import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ErrorMessage from "@/components/utils/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { careerScopesListConstant } from "@/utils/constants/ui.constant";
import { LucideArrowLeft, LucideSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CompanyCareerScopeStepForm({
  register,
  getValues,
  setValue,
  errors,
}: IStepFormProps<TCompanySignup>) {
  // Utils
  const router = useRouter();
  const hasMounted = useRef<boolean>(false);

  // CareerScope Helpers
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(careerScopesListConstant.length / itemsPerPage);

  // Register field and sync initial value ONCE
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    register("careerScopes");
    const initial = getValues?.("careerScopes") || [];
    if (Array.isArray(initial)) {
      setSelectedCareers(initial);
    }
  }, []);

  // Handle Toggle Career
  const toggleCareer = (career: string) => {
    setSelectedCareers((prev) => {
      const updated = prev.includes(career)
        ? prev.filter((c) => c !== career)
        : [...prev, career];
      setValue?.("careerScopes", updated, { shouldValidate: true });
      return updated;
    });
  };

  // Handle Pagination
  const paginatedCareers = careerScopesListConstant.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (page: number) => setCurrentPage(page);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisiblePages = 1;
    const startPage = Math.max(1, currentPage);

    for (
      let i = startPage;
      i < startPage + maxVisiblePages && i <= totalPages;
      i++
    ) {
      pages.push(i);
    }

    if (startPage + maxVisiblePages < totalPages) pages.push("...");
    if (!pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="w-full flex flex-col items-stretch gap-8">
      {/* Back Button Section */}
      <Button
        type="button"
        className="absolute top-5 left-5"
        onClick={() => router.push("/signup")}
      >
        <LucideArrowLeft />
        Back
      </Button>

      {/* Title Section */}
      <div className="phone-xl:mt-10">
        <TypographyH4>Choose Your Career Opportunity</TypographyH4>
        <TypographyMuted className="text-md">
          Connect with top professionals and explore new opportunities.
        </TypographyMuted>
      </div>

      {/* Search Section */}
      <Button
        variant="outline"
        type="button"
        onClick={() => setOpenSearchDialog(true)}
      >
        <LucideSearch />
        Search your career
      </Button>

      {/* Search Dialog Section */}
      <CommandDialog open={openSearchDialog} onOpenChange={setOpenSearchDialog}>
        <DialogTitle className="sr-only">Search Careers</DialogTitle>
        <CommandInput placeholder="Search for a career..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
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
              className={`flex items-center gap-2 p-2 transition-all hover:scale-105 cursor-pointer ${
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
            <PaginationPrevious
              onClick={() => goToPage(Math.max(currentPage - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
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
            <PaginationNext
              onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
