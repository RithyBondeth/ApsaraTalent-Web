import { PageState } from "@/components/utils/feedback/page-state";

export default function NotFound() {
  /* ------------------------------- Render UI ------------------------------ */
  return (
    <div className="flex min-h-screen items-center bg-background px-4">
      <div className="mx-auto w-full max-w-3xl">
        <PageState
          variant="empty"
          title="404 — Page not found"
          description="The page you are looking for does not exist or has been moved."
          action={{ label: "Back to Feed", href: "/feed" }}
        />
      </div>
    </div>
  );
}
