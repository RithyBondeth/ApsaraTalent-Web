import ResumeBuilderLoadingSkeleton from "@/components/resume-builder/skeleton";

export default function ResumeBuilderLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
      <ResumeBuilderLoadingSkeleton />
    </div>
  );
}
