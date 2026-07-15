import { describe, expect, it } from "vitest";
import { estimateResumePages } from "./resume-pages";

describe("estimateResumePages", () => {
  const PAGE = 1123;

  it("treats empty or short content as a single page with no breaks", () => {
    expect(estimateResumePages(0)).toEqual({ pageCount: 1, pageBreaks: [] });
    expect(estimateResumePages(500)).toEqual({ pageCount: 1, pageBreaks: [] });
  });

  it("does not count an exactly-one-page resume as two", () => {
    const result = estimateResumePages(PAGE);
    expect(result.pageCount).toBe(1);
    expect(result.pageBreaks).toEqual([]);
  });

  it("adds a break line once content spills past one page", () => {
    const result = estimateResumePages(PAGE + 200);
    expect(result.pageCount).toBe(2);
    expect(result.pageBreaks).toEqual([PAGE]);
  });

  it("places a break at every page boundary for tall resumes", () => {
    const result = estimateResumePages(PAGE * 3 - 50);
    expect(result.pageCount).toBe(3);
    expect(result.pageBreaks).toEqual([PAGE, PAGE * 2]);
  });

  it("guards against a zero page height", () => {
    expect(estimateResumePages(2000, 0)).toEqual({
      pageCount: 1,
      pageBreaks: [],
    });
  });
});
