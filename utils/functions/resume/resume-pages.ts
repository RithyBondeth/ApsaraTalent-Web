import { RESUME_EDITOR_A4_HEIGHT } from "@/utils/constants/resume.constant";

export interface IResumePageEstimate {
  /** Estimated number of printed A4 pages (always ≥ 1). */
  pageCount: number;
  /** Y-offsets (natural canvas coordinates) of each page boundary line. */
  pageBreaks: number[];
}

/**
 * Estimate how many printed pages a resume of `naturalHeight` px occupies and
 * where the page boundaries fall, so the editor can draw page-break guides.
 *
 * The `-1` epsilon keeps content that is exactly one page tall from being
 * counted as two (a full 1123px page shouldn't spill a break line at its foot).
 */
export function estimateResumePages(
  naturalHeight: number,
  pageHeight: number = RESUME_EDITOR_A4_HEIGHT,
): IResumePageEstimate {
  if (naturalHeight <= 0 || pageHeight <= 0) {
    return { pageCount: 1, pageBreaks: [] };
  }
  const pageCount = Math.max(1, Math.ceil((naturalHeight - 1) / pageHeight));
  const pageBreaks = Array.from(
    { length: pageCount - 1 },
    (_, index) => (index + 1) * pageHeight,
  );
  return { pageCount, pageBreaks };
}
