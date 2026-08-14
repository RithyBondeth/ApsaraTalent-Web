export interface INewChatCandidate {
  /** Profile id (company id or employee id), used to start the conversation. */
  id: string;
  name: string;
  avatar?: string;
  /** Secondary line — industry for a company, job title for an employee. */
  subtitle?: string;
}

export interface INewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** People the current user is matched with, so already allowed to message. */
  candidates: INewChatCandidate[];
  /** True while matches are still being fetched. */
  loading?: boolean;
  /** Id of the candidate whose conversation is currently being opened. */
  startingId?: string | null;
  onSelect: (candidate: INewChatCandidate) => void;
}
