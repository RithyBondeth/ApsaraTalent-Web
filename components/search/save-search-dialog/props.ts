import { TSavedSearchFrequency } from "@/utils/interfaces/saved-search/saved-search.interface";

export interface ISaveSearchDialogProps {
  open: boolean;
  /**
   * Called at submit time to build the filters payload from whatever the
   * page's live form values are, so the dialog never has to duplicate that
   * mapping. Return the same shape you would pass to the search endpoint.
   */
  buildFilters: () => Record<string, unknown>;
  /** Reasonable seed for the name field; usually the current keyword. */
  suggestedName?: string;
  defaultFrequency?: TSavedSearchFrequency;
  onClose: () => void;
  onSaved?: () => void;
}
