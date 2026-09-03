/** Mirrors `PublicJobDetailDTO` / `PublicCompanyInJobDTO` in the API. */
export type TPublicJobCompany = {
  id: string;
  name: string;
  avatar: string | null;
  industry: string | null;
  location: string | null;
  companySize: number | null;
};

export type TPublicJob = {
  id: string;
  title: string;
  description: string;
  type: string;
  experienceRequired: string;
  educationRequired: string;
  skills: string[];
  salary: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  workMode: string | null;
  location: string | null;
  languagesRequired: string[];
  openingsCount: number | null;
  /** ISO 8601, or null when the posting does not expire. */
  expireDate: string | null;
  /** ISO 8601. */
  createdAt: string;
  company: TPublicJobCompany;
};

export type TPublicJobSitemapEntry = {
  id: string;
  updatedAt: string;
};
