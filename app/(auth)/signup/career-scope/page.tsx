"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { careerOptions } from "@/data/data";
import { Label } from "@radix-ui/react-dropdown-menu";
import { LucideArrowLeft, LucideSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CareerScopePage() {
    const itemsPerPage = 10;
    const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(careerOptions.length / itemsPerPage);
    const router = useRouter();

    // Get paginated careers
    const paginatedCareers = careerOptions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to handle page changes
    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    // Determine dynamic page numbers with ellipsis
    const getPageNumbers = () => {
        const maxVisiblePages = 3; // Only show 3 consecutive pages
        const pages: (number | "...")[] = [];

        const startPage = Math.max(1, Math.min(currentPage, totalPages - maxVisiblePages));

        for (let i = startPage; i < startPage + maxVisiblePages && i <= totalPages; i++) {
        pages.push(i);
        }

        if (startPage + maxVisiblePages < totalPages) {
        pages.push("...");
        }

        if (!pages.includes(totalPages)) {
        pages.push(totalPages);
        }

        return pages;
    };


    return (
        <div className="size-[70%] flex flex-col items-stretch gap-8">
           {/* Navigate Button */}
           <Button preffix={<LucideArrowLeft/>} className="absolute top-5 left-5" onClick={() => router.push('/signup')}>Back</Button>
          
           {/* Title Section */}
            <div> 
                <TypographyH2>Choose Your Career Opportunity</TypographyH2>
                <TypographyMuted className="text-md">Connect with top professionals and explore new opportunities.</TypographyMuted>
            </div>

            {/* Search Section */}
            <Button variant="outline" preffix={<LucideSearch/>} onClick={() => setOpenSearchDialog(true)}>Search your career</Button>
            <CommandDialog open={openSearchDialog} onOpenChange={setOpenSearchDialog}>
                
                <DialogTitle className="sr-only">Search Careers</DialogTitle>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                    {careerOptions.slice(0, 5).map((item, index) => 
                        <CommandItem key={index} className="flex items-center gap-2">
                            <Checkbox className="size-5"/>
                            <Label className="text-sm">{item}</Label> 
                        </CommandItem>
                    )}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            
            <div className="w-full">
                {/* Career Option Section */}
                <div className="flex flex-wrap gap-3">
                {paginatedCareers.map((item, index) => (
                    <Card key={index} className="flex items-center gap-2 p-2 cursor-pointer duration-200 hover:scale-105">
                        <Checkbox/>
                        <Label className="text-sm">{item}</Label>
                    </Card>
                ))}
                </div>

                {/* Pagination Section */}
                <Pagination className="mt-5">
                    <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                        <PaginationPrevious
                        onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {/* Page Numbers with Ellipsis Logic */}
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

                    {/* Next Button */}
                    <PaginationItem>
                        <PaginationNext
                        onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}