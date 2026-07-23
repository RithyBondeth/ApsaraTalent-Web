import { beforeEach, describe, expect, it } from "vitest";
import { useTemplateSelectionStore } from "./template-selection.store";

describe("template-selection store", () => {
  beforeEach(() => {
    useTemplateSelectionStore.setState({ selectedTemplate: null });
  });

  it.each(["modern", "classic", "professional"] as const)(
    "selects the %s template",
    (template) => {
      useTemplateSelectionStore.getState().setSelectedTemplate(template);

      expect(useTemplateSelectionStore.getState().selectedTemplate).toBe(
        template,
      );
    },
  );
});
