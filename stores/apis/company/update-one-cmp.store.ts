import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPDATE_CMP_INFO_URL } from "@/utils/constants/apis/user-api/company.api.constant";
import {
  IBenefits,
  ICompany,
  IJobPosition,
  IValues,
} from "@/utils/interfaces/user/company.interface";
import { ICareerScope } from "@/utils/interfaces/user/career.interface";
import { ISocialLink } from "@/utils/interfaces/user/social.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Update One Company API Response ─────────────────────────────────
type TUpdateOneCompanyResponse = {
  message: string | null;
  company: ICompany | null;
};

// ── Update One Company Body ────────────────────────────────────────
export type TCompanyUpdateBody = Omit<
  Partial<Omit<ICompany, "id">>,
  "values"
> & {
  email?: string;
  coverImage?: string;
  values?: Array<IValues | string>;
  openPositions?: IJobPosition[];
  benefits?: IBenefits[];
  careerScopes?: ICareerScope[];
  socials?: ISocialLink[];
  // Delete arrays (match backend DTO/service)
  benefitIdsToDelete?: number[];
  valueIdsToDelete?: number[];
  jobIdsToDelete?: string[];
  careerScopeIdsToDelete?: string[];
  socialIdsToDelete?: string[];
};

// ── Update One Company State ────────────────────────────────────────
type TUpdateOneCompanyState = TUpdateOneCompanyResponse & {
  loading: boolean;
  error: string | null;
  updateOneCompany: (
    companyID: string,
    body: TCompanyUpdateBody,
  ) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useUpdateOneCompanyStore = create<TUpdateOneCompanyState>(
  (set) => ({
    message: null,
    company: null,
    error: null,
    loading: false,
    updateOneCompany: async (companyID: string, body: TCompanyUpdateBody) => {
      set({ loading: true, error: null });
      try {
        // Build the request body
        const requestBody: Record<string, unknown> = {};

        // Basic fields
        if (body.email !== undefined) requestBody.email = body.email;
        if (body.name !== undefined) requestBody.name = body.name;
        if (body.description !== undefined)
          requestBody.description = body.description;
        if (body.phone !== undefined) requestBody.phone = body.phone;
        if (body.industry !== undefined) requestBody.industry = body.industry;
        if (body.location !== undefined) requestBody.location = body.location;
        if (body.companySize !== undefined)
          requestBody.companySize = body.companySize;
        if (body.foundedYear !== undefined)
          requestBody.foundedYear = body.foundedYear;
        if (body.websiteUrl !== undefined)
          requestBody.websiteUrl = body.websiteUrl;
        if (body.companyType !== undefined)
          requestBody.companyType = body.companyType;

        // If you store these in ICompany
        if (body.avatar) requestBody.avatar = body.avatar;
        if (body.coverImage) requestBody.coverImage = body.coverImage;

        /*
         Jobs (O2M upsert)
         backend expects: jobs: [{ id?, title, description, type, experienceRequired, educationRequired, expireDate, skillsRequired, salaryMin, salaryMax, salaryCurrency, workMode, location, languagesRequired, openingsCount }]
        */
        if (body.openPositions) {
          requestBody.jobs = body.openPositions.map((job) => ({
            ...(job.id && { id: job.id }),
            title: job.title,
            description: job.description,
            type: job.type,
            experienceRequired: job.experience,
            educationRequired: job.education,
            salaryMin: job.salaryMin ?? null,
            salaryMax: job.salaryMax ?? null,
            salaryCurrency: job.salaryCurrency ?? "USD",
            workMode: job.workMode ?? null,
            location: job.location ?? null,
            languagesRequired: job.languagesRequired ?? [],
            openingsCount: job.openingsCount ?? null,
            expireDate: job.deadlineDate ?? null,
            skillsRequired: Array.isArray(job.skills)
              ? job.skills.join(", ")
              : job.skills || "",
          }));
        }

        if (body.jobIdsToDelete?.length) {
          requestBody.jobIdsToDelete = body.jobIdsToDelete;
        }

        /*
         Benefits (M2M)
         backend expects: benefits: [{ id?, label }]
        */
        if (body.benefits) {
          requestBody.benefits = body.benefits.map((benefit) => ({
            ...(benefit.id && { id: benefit.id }),
            label: benefit.label,
          }));
        }

        if (body.benefitIdsToDelete?.length) {
          requestBody.benefitIdsToDelete = body.benefitIdsToDelete;
        }

        /*
         Values (M2M)
         backend expects: values: [{ id?, label }]
        */
        if (body.values) {
          requestBody.values = body.values.map((value) => ({
            ...(typeof value !== "string" && value.id && { id: value.id }),
            label: typeof value === "string" ? value : value.label,
          }));
        }

        if (body.valueIdsToDelete?.length) {
          requestBody.valueIdsToDelete = body.valueIdsToDelete;
        }

        /*
         Career Scopes (M2M)
         backend expects: careerScopes: [{ id?, name, description? }]
        */
        if (body.careerScopes) {
          requestBody.careerScopes = body.careerScopes.map((cs) => ({
            ...(cs.id && { id: cs.id }),
            name: cs.name,
            description: cs.description,
          }));
        }

        if (body.careerScopeIdsToDelete?.length) {
          requestBody.careerScopeIdsToDelete = body.careerScopeIdsToDelete;
        }

        /*
         Socials (O2M upsert)
         backend expects: socials: [{ id?, platform, url }]
        */
        if (body.socials) {
          requestBody.socials = body.socials.map((social) => ({
            ...(social.id && { id: social.id }),
            platform: social.platform,
            url: social.url,
          }));
        }

        if (body.socialIdsToDelete?.length) {
          requestBody.socialIdsToDelete = body.socialIdsToDelete;
        }

        const response = await axios.patch<TUpdateOneCompanyResponse>(
          API_UPDATE_CMP_INFO_URL(companyID),
          requestBody,
        );

        set({
          message: response.data.message,
          company: response.data.company,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while updating company's information",
        );
        set({ loading: false, error: errorMessage, message: errorMessage });
        throw new Error(errorMessage);
      }
    },
  }),
);
