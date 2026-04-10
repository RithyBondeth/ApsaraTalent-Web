import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_AUTH_SIGNUP_URL } from "@/utils/constants/apis/auth.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { IUser } from "@/utils/interfaces/user/user.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Employee Signup API Response ─────────────────────────────────
type TEmployeeSignupResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

// ── Employee Signup API Request ─────────────────────────────────
type TEmployeeSignupBody = Omit<IEmployee, "id"> & {
  email: string | null;
  password: string | null;
  authEmail: boolean;
};

// ── Employee Signup State ────────────────────────────────────────
type TEmployeeSignupState = TEmployeeSignupResponse & {
  loading: boolean;
  error: string | null;
  signup: (body: TEmployeeSignupBody) => Promise<string | undefined>;
};

/* ---------------------------------- Store --------------------------------- */
export const useEmployeeSignupStore = create<TEmployeeSignupState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  message: null,
  loading: false,
  error: null,
  signup: async (body: TEmployeeSignupBody) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<
        TEmployeeSignupResponse & { user: IUser }
      >(API_AUTH_SIGNUP_URL.EMPLOYEE, {
        authEmail: body.authEmail,
        email: body.email,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
        dob: body.dob ?? undefined,
        username: body.username,
        gender: body.gender,
        job: body.job,
        yearsOfExperience: body.yearsOfExperience,
        availability: body.availability,
        description: body.description,
        location: body.location,
        phone: body.phone,
        educations: body.educations.map((edu) => ({
          school: edu.school,
          degree: edu.degree,
          year: edu.year,
        })),
        experiences: body.experiences.map((exp) => ({
          title: exp.title,
          description: exp.description,
          startDate: exp.startDate,
          endDate: exp.endDate,
        })),
        skills: body.skills.map((skill) => ({
          name: skill.name,
          description: skill.description,
        })),
        careerScopes: body.careerScopes.map((cs) => ({
          name: cs.name,
          description: cs.description,
        })),
        socials:
          body.socials?.map((social) => ({
            platform: social.platform,
            url: social.url,
          })) ?? [],
      });

      const employee = response.data.user.employee;
      const employeeID = employee?.id;

      set({
        loading: false,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        message: response.data.message,
        error: null,
      });

      return employeeID;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while signing up as employee",
      );

      set({ loading: false, error: errorMessage, message: errorMessage });
    }
  },
}));
