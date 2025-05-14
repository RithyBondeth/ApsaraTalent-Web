import { API_UPDATE_EMP_INFO_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";

type TUpdateOneEmployeeResponse = {
  message: string | null;
  employee: IEmployee | null;
};

type TUpdateOneEmployeeState = TUpdateOneEmployeeResponse & {
  loading: boolean;
  error: string | null;
  updateOneEmployee: (employeeID: string, body: IUser, token: string) => Promise<void>;
};

export const useUpdateOneEmployeeStore = create<TUpdateOneEmployeeState>(
  (set) => ({
    message: null,
    employee: null,
    error: null,
    loading: false,
    updateOneEmployee: async (employeeID: string, body: IUser, token: string) => {
      set({ loading: true, error: null });

      const employeeBody = body.employee;
      try {
        const response = await axios.patch(
          API_UPDATE_EMP_INFO_URL(employeeID),
          {
            email: body.email,
            password: body.password,
            firstname: employeeBody?.firstname,
            lastname: employeeBody?.lastname,
            username: employeeBody?.username,
            gender: employeeBody?.gender,
            job: employeeBody?.job,
            yearsOfExperience: employeeBody?.yearsOfExperience,
            availability: employeeBody?.availability,
            description: employeeBody?.description,
            location: employeeBody?.location,
            phone: employeeBody?.phone,
            education: employeeBody?.educations.map((edu) => ({
              school: edu.school,
              degree: edu.degree,
              year: edu.year,
            })),
            experiences: employeeBody?.experiences.map((exp) => ({
              title: exp.title,
              description: exp.description,
              startDate: exp.startDate,
              endDate: exp.endDate,
            })),
            skills: employeeBody?.skills.map((skill) => ({
              name: skill.name,
              description: skill.description,
            })),
            careerScopes: employeeBody?.careerScopes.map((cs) => ({
              name: cs.name,
              description: cs.description,
            })),
            socials: employeeBody?.socials.map((social) => ({
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
            error: "An error occurred while updating an employee",
          });
        }
      }
    },
  })
);
