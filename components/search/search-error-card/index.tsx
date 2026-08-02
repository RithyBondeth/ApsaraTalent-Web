import { PageState } from "@/components/utils/feedback/page-state";
import { ISearchErrorCardProps } from "./props";

export function SearchErrorCard(props: ISearchErrorCardProps) {
  /* --------------------------------- Props Section --------------------------------- */
  const { title, description, retryLabel, onRetry } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <PageState
      variant="error"
      title={title}
      description={description}
      compact
      action={{ label: retryLabel, onClick: onRetry }}
    />
  );
}
