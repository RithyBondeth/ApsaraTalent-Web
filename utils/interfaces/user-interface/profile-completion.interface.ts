export interface IProfileCompletionResult {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
}

export interface IFieldCheck {
  label: string;
  weight: number;
  isFilled: boolean;
}
