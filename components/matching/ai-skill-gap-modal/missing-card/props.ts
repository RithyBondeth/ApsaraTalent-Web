export interface IMissingCardProps {
  t: "missing";
  skill: string;
  criticality: "high" | "medium" | "low";
  positions: string[];
  tip: string;
}
