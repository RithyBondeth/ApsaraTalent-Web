"use client";

import { BenefitValueChip } from "@/components/utils/data-display/benefit-value-chip";

/* The remove control takes a handler, and this page is a server component, so
   the removable variant needs a client island — same reason ThemeToggle is its
   own file. */
export function BenefitValueRemovableDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <BenefitValueChip
        kind="benefit"
        label="Removable benefit"
        onRemove={() => {}}
      />
      <BenefitValueChip
        kind="value"
        label="Removable value"
        onRemove={() => {}}
      />
    </div>
  );
}
