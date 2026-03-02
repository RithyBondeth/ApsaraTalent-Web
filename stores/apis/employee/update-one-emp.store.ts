import { API_UPDATE_EMP_INFO_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TUpdateOneEmployeeResponse = {
  message: string | null;
  employee: IEmployee | null;
};

export type TEmployeeUpdateBody = Partial<Omit<IEmployee, "id">> & {
  email?: string;

  // delete arrays (match backend DTO/service)
  skillIdsToDelete?: string[];
  careerScopeIdsToDelete?: string[];
  experienceIdsToDelete?: string[];
  educationIdsToDelete?: string[];
  socialIdsToDelete?: string[];
};

type TUpdateOneEmployeeState = TUpdateOneEmployeeResponse & {
  loading: boolean;
  error: string | null;
  updateOneEmployee: (
    employeeID: string,
    body: TEmployeeUpdateBody,
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
      body: TEmployeeUpdateBody,
    ) => {
      set({ loading: true, error: null });

      try {
        const requestBody: any = {};

        /* =========================
         Basic scalar fields
      ========================= */
        if (body.email) requestBody.email = body.email;
        if (body.firstname) requestBody.firstname = body.firstname;
        if (body.lastname) requestBody.lastname = body.lastname;
        if (body.username) requestBody.username = body.username;
        if (body.gender) requestBody.gender = body.gender;

        if (body.job) requestBody.job = body.job;
        if (body.yearsOfExperience !== undefined)
          requestBody.yearsOfExperience = body.yearsOfExperience;

        if (body.availability) requestBody.availability = body.availability;
        if (body.description) requestBody.description = body.description;
        if (body.location) requestBody.location = body.location;
        if (body.phone) requestBody.phone = body.phone;

        // If you store these in IEmployee
        if ((body as any).avatar) requestBody.avatar = (body as any).avatar;
        if ((body as any).resume) requestBody.resume = (body as any).resume;
        if ((body as any).coverLetter)
          requestBody.coverLetter = (body as any).coverLetter;

        /* =========================
         Skills (M2M)
         backend expects: skills: [{ id?, name, description? }]
      ========================= */
        if ((body as any).skills) {
          requestBody.skills = (body as any).skills.map((s: any) => ({
            ...(s.id && { id: s.id }),
            name: s.name,
            description: s.description,
          }));
        }

        if (body.skillIdsToDelete?.length) {
          requestBody.skillIdsToDelete = body.skillIdsToDelete;
        }

        /* =========================
         Career Scopes (M2M)
         backend expects: careerScopes: [{ id?, name, description? }]
      ========================= */
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

        /* =========================
         Experiences (O2M upsert)
         backend expects: experiences: [{ id?, title, description, startDate, endDate? }]
        ========================= */
        if ((body as any).experiences) {
          requestBody.experiences = (body as any).experiences.map(
            (exp: any) => ({
              ...(exp.id && { id: exp.id }),
              title: exp.title,
              description: exp.description,
              startDate: exp.startDate, // should be ISO string or Date -> axios will serialize
              endDate: exp.endDate ?? null,
            }),
          );
        }

        if (body.experienceIdsToDelete?.length) {
          requestBody.experienceIdsToDelete = body.experienceIdsToDelete;
        }

        /* =========================
         Educations (O2M upsert)
         backend expects: educations: [{ id?, school, degree, year }]
      ========================= */
        if ((body as any).educations) {
          requestBody.educations = (body as any).educations.map((edu: any) => ({
            ...(edu.id && { id: edu.id }),
            school: edu.school,
            degree: edu.degree,
            year: edu.year,
          }));
        }

        if (body.educationIdsToDelete?.length) {
          requestBody.educationIdsToDelete = body.educationIdsToDelete;
        }

        /* =========================
         Socials (O2M upsert)
         backend expects: socials: [{ id?, platform, url }]
      ========================= */
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

        console.log("Request Body to Backend (Employee):", requestBody);

        const response = await axios.patch<TUpdateOneEmployeeResponse>(
          API_UPDATE_EMP_INFO_URL(employeeID),
          requestBody,
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

          set({ loading: false, error: errorMessage, message: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while updating employee's information",
            message: "An error occurred while updating employee's information",
          });
        }
      }
    },
  }),
);
