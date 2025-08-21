"use client";

import { Skeleton } from "../../ui/skeleton";

export default function CompanyCardSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col items-start gap-6 p-3 rounded-lg shadow-sm border border-muted">
      {/* Profile Section Skeleton */}
      <div className="w-full flex items-start justify-between tablet-lg:flex-col tablet-lg:gap-4">
        <div className="flex items-center gap-3 tablet-lg:w-full tablet-lg:justify-center">
          {/* Avatar Skeleton - Match CachedAvatar */}
          <Skeleton className="size-24 rounded-md tablet-lg:size-20" />
          <div className="flex flex-col items-start gap-1 tablet-lg:items-center tablet-lg:flex-1">
            {/* Company Name Skeleton */}
            <Skeleton className="h-5 w-32 rounded tablet-lg:w-36" />
            {/* Company Size Skeleton */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-16 rounded tablet-lg:w-20" />
            </div>
            {/* Location Skeleton */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-24 rounded tablet-lg:w-28" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 tablet-xl:flex-col tablet-lg:flex-row tablet-lg:justify-center">
          {/* Action Buttons Skeleton */}
          <Skeleton className="size-12 rounded-md" />
          <Skeleton className="size-12 rounded-md" />
        </div>
      </div>

      {/* Industry Section Skeleton */}
      <div className="w-full flex flex-col gap-3 tablet-lg:items-center">
        {/* Industry Label Skeleton */}
        <Skeleton className="h-4 w-20 rounded" />
        {/* Description Skeleton */}
        <div className="space-y-2 tablet-lg:text-center tablet-lg:w-4/5">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded tablet-lg:mx-auto" />
          <Skeleton className="h-3 w-3/4 rounded tablet-lg:mx-auto" />
        </div>
      </div>

      {/* Open Positions Section Skeleton */}
      <div className="w-full flex flex-col gap-3 tablet-lg:items-center">
        {/* Open Positions Label Skeleton */}
        <Skeleton className="h-4 w-32 rounded" />
        {/* Position Tags Skeleton */}
        <div className="w-full flex flex-wrap gap-2 tablet-lg:justify-center">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>
        
      {/* Available Times Section Skeleton */}
      <div className="w-full flex flex-col gap-3 tablet-lg:items-center">
        {/* Available Times Label Skeleton */}
        <Skeleton className="h-4 w-28 rounded" />
        {/* Time Tags Skeleton */}
        <div className="w-full flex flex-wrap gap-2 tablet-lg:justify-center">
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-22 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Button Section Skeleton */}
      <div className="w-full flex items-center justify-end gap-3 tablet-lg:justify-center tablet-md:flex-col tablet-md:gap-2">
        {/* Save Button Skeleton */}
        <Skeleton className="h-9 w-20 rounded-md" />
        {/* View Button Skeleton */}
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}