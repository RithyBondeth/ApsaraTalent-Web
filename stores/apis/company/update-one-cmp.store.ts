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
  password?: string;
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
        const response = await axios.patch<TUpdateOneCompanyResponse>(
          API_UPDATE_CMP_INFO_URL(companyID),
          {
            ...(body.email && { email: body.email }),
            ...(body.name && { name: body.name }),
            ...(body.description && { description: body.description }),
            ...(body.phone && { phone: body.phone }),
            ...(body.industry && { industry: body.industry }),
            ...(body.location && { location: body.location }),
            ...(body.companySize && { companySize: body.companySize }),
            ...(body.foundedYear && { foundedYear: body.foundedYear }),
            ...(body.openPositions && {
              jobs: body.openPositions.map((job) => ({
                title: job.title,
                description: job.description,
                type: job.type,
                experienceRequired: job.experience,
                educationRequired: job.education,
                salary: job.salary,
                expireDate: job.deadlineDate,
                skillsRequired: job.skills,
              })),
            }),
            ...(body.benefits && {
              benefits: body.benefits.map((benefit) => ({
                label: benefit.label,
              })),
            }),
            ...(body.values && {
              values: body.values.map((value) => ({
                label: value,
              })),
            }),
            ...(body.careerScopes && {
              careerScopes: body.careerScopes.map((cs) => ({
                name: cs.name,
                description: cs.description,
              })),
            }),
            ...(body.socials && {
              socials: body.socials.map((social) => ({
                platform: social.platform,
                url: social.url,
              })),
            }),
          }
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