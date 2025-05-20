import { API_AUTH_SIGNUP_URL } from "@/utils/constants/apis/auth_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";

type TEmployeeSignupResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

type TEmployeeSignupBody = Omit<IEmployee, 'id'> & {
  email: string;
  password: string;
};

type TEmployeeSignupState = TEmployeeSignupResponse & {
  loading: boolean;
  error: string | null;
  signup: (body: TEmployeeSignupBody) => Promise<string | undefined>;
};

export const useEmployeeSignupStore = create<TEmployeeSignupState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  message: null,
  loading: false,
  error: null,
  signup: async (body: TEmployeeSignupBody) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<TEmployeeSignupResponse & { user: IUser }>(
        API_AUTH_SIGNUP_URL.EMPLOYEE,
        {
          email: body.email,
          password: body.password,
          firstname: body.firstname,
          lastname: body.lastname,
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
          socials: body.socials?.map((social) => ({
            platform: social.platform,
            url: social.url,
          })) ?? [],
        }
      );

      const employee = response.data.user.employee;
      const employeeID = employee?.id;

      set({
        loading: false,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        error: null,
      });

      return employeeID;
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
          error: "An error occurred while signing up as employee",
        });
      }
    }
  },
}));