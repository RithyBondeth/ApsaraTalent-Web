import ResumeTemplateSkeleton from "@/components/resume-builder/template/skeleton";

export default function ResumeBuilderLoading() {
  return (
    <div className="w-full flex flex-col gap-5 p-5">
      <ResumeTemplateSkeleton />
    </div>
  );
}
