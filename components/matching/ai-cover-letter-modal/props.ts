export interface IAiCoverLetterModalProps {
  employeeName: string;
  employeeJob?: string;
  employeeSkills: string[];
  employeeExperience?: string;
  employeeDescription?: string;
  companyName: string;
  companyIndustry?: string;
  companyDescription?: string;
  openPositions: string[];
  /** When true the trigger shows icon-only on mobile (< sm) and full label on sm+. */
  compact?: boolean;
}
