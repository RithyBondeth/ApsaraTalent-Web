import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateCardSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col items-center rounded-lg shadow-sm border border-muted">
      {/* Image & Badge Placeholder */}
      {/* <div className="w-full h-60 flex items-center justify-center bg-primary-foreground rounded-tr-lg rounded-tl-lg relative">
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-16 rounded-xl" />
        </div>
        <Skeleton className="h-full w-1/2" />
        <div className="absolute inset-0 rounded-tr-lg rounded-tl-lg flex items-center justify-center bg-black/30">
          <div className="p-3 rounded-full bg-secondary-foreground">
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </div> */}

      {/* Text and Button Placeholder */}
      <div className="w-full p-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="w-full flex justify-end mt-3">
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}