import { API_AUTH_SIGNUP_URL } from "@/utils/constants/apis/auth_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TCompanySignupResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

type TCompanySignupState = TCompanySignupResponse & {
  loading: boolean;
  error: string | null;
  signup: (body: IUser) => Promise<void>;
};

export const useCompanySignupStore = create<TCompanySignupState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      message: null,
      loading: false,
      error: null,
      signup: async (body: IUser) => {
        set({ loading: true, error: null });

        const companyBody = body.company;
        try {
          const response = await axios.post<TCompanySignupResponse>(
            API_AUTH_SIGNUP_URL.COMPANY,
            {
              email: body.email,
              password: body.password,
              name: companyBody?.name,
              description: companyBody?.description,
              phone: companyBody?.phone,
              industry: companyBody?.industry,
              location: companyBody?.location,
              companySize: companyBody?.companySize,
              foundedYear: companyBody?.foundedYear,
              jobs: companyBody?.openPositions.map((job) => ({
                title: job.title,
                description: job.description,
                type: job.type,
                experienceRequired: job.experience,
                educationRequired: job.education,
                salary: job.salary,
                expireDate: job.deadlineDate,
                skillsRequired: job.skills,
              })),
              benefits: companyBody?.benefits.map((benefit) => ({
                label: benefit.label,
              })),
              values: companyBody?.values.map((value) => ({
                label: value,
              })),
              careerScopes: companyBody?.careerScopes.map((cs) => ({
                name: cs.name,
                description: cs.description,
              })),
              socials: companyBody?.socials.map((social) => ({
                platform: social.platform,
                url: social.url,
              })),
            }
          );
          set({
            loading: false,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
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
              error: "An error occurred while signing up as company",
            });
          }
        }
      },
    }),
    {
      name: "CompanySignupStore",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        message: state.message,
      }),
    }
  )
);
