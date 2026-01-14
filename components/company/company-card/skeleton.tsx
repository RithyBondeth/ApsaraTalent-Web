"use client";

import { Skeleton } from "../../ui/skeleton";

export default function CompanyCardSkeleton() {
  return (
    <div className="h-fit w-full min-w-0 flex flex-col items-start gap-6 p-3 rounded-lg shadow-sm border border-muted cursor-pointer">
      {/* Profile Section Skeleton - Match exact structure */}
      <div className="w-full flex items-start justify-between phone-xl:flex-col phone-xl:gap-5">
        <div className="flex items-center gap-3">
          {/* Avatar Skeleton - Match exact size */}
          <Skeleton className="size-24 rounded-md" />
          <div className="flex flex-col items-start gap-1">
            {/* Company Name Skeleton */}
            <Skeleton className="h-5 w-28 rounded" />
            {/* Company Size Skeleton */}
            <div className="flex items-center gap-1">
              <Skeleton className="size-3 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            {/* Location Skeleton */}
            <div className="flex items-center gap-1">
              <Skeleton className="size-3 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 tablet-xl:flex-col tablet-lg:!flex-row">
          {/* Action Buttons Skeleton - Match actual rounded-md buttons */}
          <Skeleton className="size-12 rounded-md" />
          <Skeleton className="size-12 rounded-md" />
        </div>
      </div>

      {/* Industry Section Skeleton */}
      <div className="w-full flex flex-col gap-3">
        {/* Industry Label Skeleton */}
        <Skeleton className="h-4 w-16 rounded" />
        {/* Enhanced Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>
      </div>

      {/* Open Positions Section Skeleton */}
      <div className="w-full flex flex-col gap-3">
        {/* Open Positions Label Skeleton */}
        <Skeleton className="h-4 w-32 rounded" />
        {/* Enhanced Position Tags Skeleton */}
        <div className="w-full flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-22 rounded-full" />
        </div>
      </div>

      {/* Available Times Section Skeleton */}
      <div className="w-full flex flex-col gap-3">
        {/* Available Times Label Skeleton */}
        <Skeleton className="h-4 w-28 rounded" />
        {/* Enhanced Time Tags Skeleton */}
        <div className="w-full flex flex-wrap gap-2">
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-22 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Company Culture Section Skeleton */}
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-4 w-24 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      </div>

      {/* Button Section Skeleton */}
      <div className="w-full flex items-center justify-end gap-3">
        {/* Save Button Skeleton */}
        <Skeleton className="h-9 w-16 rounded-md" />
        {/* View Button Skeleton */}
        <Skeleton className="h-9 w-16 rounded-md" />
      </div>
    </div>
  );
}
