"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeDetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Personal Information Skeleton */}
      <div className="w-full flex justify-between border border-muted py-5 px-10 tablet-xl:flex-col tablet-xl:[&>div]:w-full tablet-xl:gap-5">
        <div className="flex flex-col items-center gap-5">
          <Skeleton className="size-40 tablet-xl:size-52 rounded-md" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex flex-col items-start gap-5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start gap-5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
          ))}
        </div>
      </div>

      {/* Description, Education, Experience, Skills */}
      <div className="flex gap-5 tablet-xl:flex-col tablet-xl:[&>div]:w-full">
        <div className="w-2/3 flex flex-col gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 border border-muted p-5"
            >
              <Skeleton className="h-6 w-32" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Resume, Contact, Socials */}
        <div className="w-1/3 flex flex-col gap-5">
          {/* Resume */}
          <div className="border border-muted p-5 flex flex-col gap-5">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 bg-muted rounded-md"
              >
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="border border-muted p-5 flex flex-col gap-5">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-52" />
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="border border-muted p-5 flex flex-col gap-5">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
