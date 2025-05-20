import { API_UPDATE_EMP_INFO_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "axios";
import { create } from "zustand";

type TUpdateOneEmployeeResponse = {
  message: string | null;
  employee: IEmployee | null;
};

type TUpdateOneEmployeeUpdateBody = Omit<IEmployee, "id"> & {
  email: string;
  password: string;
};

type TUpdateOneEmployeeState = TUpdateOneEmployeeResponse & {
  loading: boolean;
  error: string | null;
  updateOneEmployee: (
    employeeID: string,
    body: TUpdateOneEmployeeUpdateBody,
    token: string
  ) => Promise<void>;
};

export const useUpdateOneEmployeeStore = create<TUpdateOneEmployeeState>(
  (set) => ({
    message: null,
    employee: null,
    error: null,
    loading: false,
    updateOneEmployee: async (
      employeeID: string,
      body: TUpdateOneEmployeeUpdateBody,
      token: string
    ) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.patch(
          API_UPDATE_EMP_INFO_URL(employeeID),
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
            education: body.educations.map((edu) => ({
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
            socials: body.socials.map((social) => ({
              platform: social.platform,
              url: social.url,
            })),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        set({
          message: response.data.message,
          employee: response.data.employee,
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
            error: "An error occurred while updating employee's information",
          });
        }
      }
    },
  })
);
