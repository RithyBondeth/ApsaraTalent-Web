import { PageBanner } from "@/components/utils/layout/page-banner";
import { ISearchPageHeroProps } from "./props";

/**
 * Thin wrapper over PageBanner that keeps the search pages' existing prop
 * shape (subtitle + supportingText arrive as separate strings) and hands the
 * filter controls to the banner's children slot.
 */
export default function SearchPageHero(props: ISearchPageHeroProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <PageBanner
      eyebrow={props.eyebrow}
      title={props.title}
      subtitle={`${props.subtitle} ${props.supportingText}`}
      stats={props.stats}
    >
      {props.children}
    </PageBanner>
  );
}
