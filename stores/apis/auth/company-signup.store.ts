import { API_AUTH_SIGNUP_URL } from "@/utils/constants/apis/auth_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";

type TCompanySignupResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

type TCompanySignupBody = Omit<ICompany, "id"> & {
  email: string | null;
  password: string | null;
  authEmail: boolean;
};

type TCompanySignupState = TCompanySignupResponse & {
  loading: boolean;
  error: string | null;
  signup: (body: TCompanySignupBody) => Promise<string | undefined>;
};

export const useCompanySignupStore = create<TCompanySignupState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  message: null,
  loading: false,
  error: null,
  signup: async (body: TCompanySignupBody) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<
        TCompanySignupResponse & { user: IUser }
      >(API_AUTH_SIGNUP_URL.COMPANY, {
        authEmail: body.authEmail,
        email: body.email,
        password: body.password,
        name: body?.name,
        description: body?.description,
        phone: body?.phone,
        industry: body?.industry,
        location: body?.location,
        companySize: body?.companySize,
        foundedYear: body?.foundedYear,
        jobs: body?.openPositions.map((job) => ({
          title: job.title,
          description: job.description,
          type: job.type,
          experienceRequired: job.experience,
          educationRequired: job.education,
          salary: job.salary,
          expireDate: job.deadlineDate,
          skillsRequired: job.skills.join(", "),
        })),
        benefits: body?.benefits.map((benefit) => ({
          label: benefit.label,
        })),
        values: body?.values,
        careerScopes: body?.careerScopes.map((cs) => ({
          name: cs.name,
          description: cs.description ?? "",
        })),
        socials: body?.socials.map((social) => ({
          platform: social.platform,
          url: social.url,
        })),
      });

      const company = response.data.user.company;
      const companyID = company?.id;

      set({
        loading: false,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        message: response.data.message,
        error: null,
      });

      return companyID;
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
          error: "An error occurred while signing up as company.",
        });
      }
    }
  },
}));
