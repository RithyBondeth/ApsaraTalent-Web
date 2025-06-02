// components/company-detail-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function CompanyDetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Cover Section */}
      <div className="relative h-80 w-full flex items-end p-5 bg-muted">
        <div className="relative flex items-center gap-5">
          {/* Company Logo */}
          <Skeleton className="size-32 rounded-md bg-primary-foreground" />
          
          {/* Company Info */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-48 bg-primary-foreground" />
            <Skeleton className="h-4 w-32 bg-primary-foreground" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-36 bg-primary-foreground" />
              <Skeleton className="h-4 w-36 bg-primary-foreground" />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute right-3 bottom-3 flex gap-3">
          <Skeleton className="h-10 w-32 bg-primary-foreground" />
          <Skeleton className="h-10 w-24 bg-primary-foreground" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-5">
        {/* Left Column (2/3 width) */}
        <div className="w-2/3 flex flex-col gap-5">
          {/* About Section */}
          <div className="border border-muted p-5 rounded-md">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex gap-3">
              <Skeleton className="w-2 h-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="border border-muted p-5 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-muted p-4 rounded-md mb-4">
                <Skeleton className="h-5 w-48 mb-3" />
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-24 mt-3" />
                </div>
              </div>
            ))}
          </div>

          {/* Careers */}
          <div className="border border-muted p-5 rounded-md">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>

          {/* Company Images */}
          <div className="border border-muted p-5 rounded-md">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex gap-4 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-64 rounded-md flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="w-1/3 flex flex-col gap-5">
          {/* Company Info */}
          <div className="border border-muted p-5 rounded-md">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </div>

          {/* Culture */}
          <div className="border border-muted p-5 rounded-md">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Benefits */}
          <div className="border border-muted p-5 rounded-md">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="border border-muted p-5 rounded-md">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}