import { API_UPDATE_CMP_INFO_URL } from "@/utils/constants/apis/company_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TUpdateOneCompanyResponse = {
  message: string | null;
  company: ICompany | null;
};

export type TCompanyUpdateBody = Partial<Omit<ICompany, "id">> & {
  email?: string;
  benefitIdsToDelete?: number[];
  valueIdsToDelete?: number[];
  jobIdsToDelete?: string[];
  careerScopeIdsToDelete?: string[];
  socialIdsToDelete?: number[];
};

type TUpdateOneCompanyState = TUpdateOneCompanyResponse & {
  loading: boolean;
  error: string | null;
  updateOneCompany: (
    companyID: string,
    body: TCompanyUpdateBody
  ) => Promise<void>;
};

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

        // Jobs (with IDs for update/create)
        if (body.openPositions) {
          requestBody.jobs = body.openPositions.map((job) => ({
            ...(job.id && { id: job.id }), // Include ID if exists for update
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

        // Job IDs to delete
        if (body.jobIdsToDelete && body.jobIdsToDelete.length > 0) {
          requestBody.jobIdsToDelete = body.jobIdsToDelete;
        }

        // Benefits (with IDs for update/create)
        if (body.benefits) {
          requestBody.benefits = body.benefits.map((benefit) => ({
            ...(benefit.id && { id: benefit.id }), // Include ID if exists
            label: benefit.label,
          }));
        }

        // Benefit IDs to delete
        if (body.benefitIdsToDelete && body.benefitIdsToDelete.length > 0) {
          requestBody.benefitIdsToDelete = body.benefitIdsToDelete;
        }

        // Values (with IDs for update/create)
        if (body.values) {
          requestBody.values = body.values.map((value) => ({
            ...(value.id && { id: value.id }), // Include ID if exists
            label: typeof value === "string" ? value : value.label,
          }));
        }

        // Value IDs to delete
        if (body.valueIdsToDelete && body.valueIdsToDelete.length > 0) {
          requestBody.valueIdsToDelete = body.valueIdsToDelete;
        }

        // Career Scopes (with IDs for update/create)
        if (body.careerScopes) {
          requestBody.careerScopes = body.careerScopes.map((cs) => ({
            ...(cs.id && { id: cs.id }), // Include ID if exists
            name: cs.name,
            description: cs.description,
          }));
        }

        // Career Scope IDs to delete
        if (
          body.careerScopeIdsToDelete &&
          body.careerScopeIdsToDelete.length > 0
        ) {
          requestBody.careerScopeIdsToDelete = body.careerScopeIdsToDelete;
        }

        // Socials (with IDs for update/create)
        if (body.socials) {
          requestBody.socials = body.socials.map((social) => ({
            ...(social.id && { id: social.id }), // Include ID if exists
            platform: social.platform,
            url: social.url,
          }));
        }

        // Social IDs to delete
        if (body.socialIdsToDelete && body.socialIdsToDelete.length > 0) {
          requestBody.socialIdsToDelete = body.socialIdsToDelete;
        }

        console.log("Request Body to Backend:", requestBody);

        const response = await axios.patch<TUpdateOneCompanyResponse>(
          API_UPDATE_CMP_INFO_URL(companyID),
          requestBody
        );

        set({
          message: response.data.message,
          company: response.data.company,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.join(", ")
              : error.response?.data?.message || error.message;
          set({ loading: false, error: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while updating company's information",
          });
        }
      }
    },
  })
);
