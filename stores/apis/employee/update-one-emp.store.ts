import { API_UPDATE_EMP_INFO_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TUpdateOneEmployeeResponse = {
  message: string | null;
  employee: IEmployee | null;
};

type TUpdateOneEmployeeUpdateBody = Omit<IEmployee, "id"> & {
  email: string;
  password: string;
  skillIdsToDelete?: number[];
  careerScopeIdsToDelete?: number[];
  socialIdsToDelete?: number[];
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
      body: TUpdateOneEmployeeUpdateBody
    ) => {
      set({ loading: true, error: null });
      try {
        const requestBody: any = {};
        if (body.email) requestBody.email = body.email;
        if (body.password) requestBody.password = body.password;
        if (body.firstname) requestBody.firstname = body.firstname;
        if (body.lastname) requestBody.lastname = body.lastname;
        if (body.username) requestBody.username = body.username;
        if (body.gender) requestBody.gender = body.gender;
        if (body.job) requestBody.job = body.job;
        if (body.yearsOfExperience)
          requestBody.yearsOfExperience = body.yearsOfExperience;
        if (body.availability) requestBody.availability = body.availability;
        if (body.description) requestBody.description = body.description;
        if (body.location) requestBody.location = body.location;
        if (body.phone) requestBody.phone = body.phone;
        if (body.educations)
          requestBody.educations = body.educations.map((edu) => ({
            school: edu.school,
            degree: edu.degree,
            year: edu.year,
          }));
        if (body.experiences)
          requestBody.experiences = body.experiences.map((exp) => ({
            title: exp.title,
            description: exp.description,
            startDate: exp.startDate,
            endDate: exp.endDate,
          }));
        if (body.skills)
          requestBody.skills = body.skills.map((skill) => ({
            name: skill.name,
            description: skill.description,
          }));
        if (body.careerScopes)
          requestBody.careerScopes = body.careerScopes.map((cs) => ({
            name: cs.name,
            description: cs.description,
          }));
        if (body.socials)
          requestBody.socials = body.socials.map((social) => ({
            platform: social.platform,
            url: social.url,
          }));

        if (body.skillIdsToDelete && body.skillIdsToDelete.length > 0) {
          requestBody.skillIdsToDelete = body.skillIdsToDelete;
        }
        if (
          body.careerScopeIdsToDelete &&
          body.careerScopeIdsToDelete.length > 0
        ) {
          requestBody.careerScopeIdsToDelete = body.careerScopeIdsToDelete;
        }
        if (body.socialIdsToDelete && body.socialIdsToDelete.length > 0) {
          requestBody.socialIdsToDelete = body.socialIdsToDelete;
        }

        console.log("Request Body to Backend:", requestBody);

        const response = await axios.patch(
          API_UPDATE_EMP_INFO_URL(employeeID),
          requestBody
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
