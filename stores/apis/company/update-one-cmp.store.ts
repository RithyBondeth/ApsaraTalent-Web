import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPDATE_CMP_INFO_URL } from "@/utils/constants/apis/company_url";
import { ICompany } from "@/utils/interfaces/user/company.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Update One Company API Response ─────────────────────────────────
type TUpdateOneCompanyResponse = {
  message: string | null;
  company: ICompany | null;
};

// ── Update One Company Body ────────────────────────────────────────
export type TCompanyUpdateBody = Partial<Omit<ICompany, "id">> & {
  email?: string;
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
        const requestBody: any = {};

        // Basic fields
        if (body.email) requestBody.email = body.email;
        if (body.name) requestBody.name = body.name;
        if (body.description) requestBody.description = body.description;
        if (body.phone) requestBody.phone = body.phone;
        if (body.industry) requestBody.industry = body.industry;
        if (body.location) requestBody.location = body.location;
        if (body.companySize) requestBody.companySize = body.companySize;
        if (body.foundedYear) requestBody.foundedYear = body.foundedYear;

        // If you store these in ICompany
        if ((body as any).avatar) requestBody.avatar = (body as any).avatar;
        if ((body as any).coverImage)
          requestBody.coverImage = (body as any).coverImage;

        /*
         Jobs (O2M upsert)
         backend expects: jobs: [{ id?, title, description, type, experienceRequired, educationRequired, salary, expireDate, skillsRequired }]
        */
        if ((body as any).openPositions) {
          requestBody.jobs = (body as any).openPositions.map((job: any) => ({
            ...(job.id && { id: job.id }),
            title: job.title,
            description: job.description,
            type: job.type,
            experienceRequired: job.experience,
            educationRequired: job.education,
            salary: job.salary,
            expireDate: job.deadlineDate,
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
        if ((body as any).benefits) {
          requestBody.benefits = (body as any).benefits.map((benefit: any) => ({
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
        if ((body as any).values) {
          requestBody.values = (body as any).values.map((value: any) => ({
            ...(value.id && { id: value.id }),
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
        if ((body as any).careerScopes) {
          requestBody.careerScopes = (body as any).careerScopes.map(
            (cs: any) => ({
              ...(cs.id && { id: cs.id }),
              name: cs.name,
              description: cs.description,
            }),
          );
        }

        if (body.careerScopeIdsToDelete?.length) {
          requestBody.careerScopeIdsToDelete = body.careerScopeIdsToDelete;
        }

        /*
         Socials (O2M upsert)
         backend expects: socials: [{ id?, platform, url }]
        */
        if ((body as any).socials) {
          requestBody.socials = (body as any).socials.map((social: any) => ({
            ...(social.id && { id: social.id }),
            platform: social.platform,
            url: social.url,
          }));
        }

        if (body.socialIdsToDelete?.length) {
          requestBody.socialIdsToDelete = body.socialIdsToDelete;
        }

        console.log("Request Body to Backend (Company):", requestBody);

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
      }
    },
  }),
);
