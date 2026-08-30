import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPDATE_EMP_INFO_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Update One Employee API Response ──────────────────────────────────
type TUpdateOneEmployeeResponse = {
  message: string | null;
  employee: IEmployee | null;
};

// ── Update One Employee Body ──────────────────────────────────────────
export type TEmployeeUpdateBody = Partial<Omit<IEmployee, "id">> & {
  email?: string;
  // Delete arrays (match backend DTO/service)
  skillIdsToDelete?: string[];
  careerScopeIdsToDelete?: string[];
  experienceIdsToDelete?: string[];
  educationIdsToDelete?: string[];
  socialIdsToDelete?: string[];
};

// ── Update One Employee State ────────────────────────────────────────
type TUpdateOneEmployeeState = TUpdateOneEmployeeResponse & {
  loading: boolean;
  error: string | null;
  updateOneEmployee: (
    employeeID: string,
    body: TEmployeeUpdateBody,
  ) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
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
        // Build the request body
        const requestBody: Record<string, unknown> = {};

        // Basic fields
        if (body.email !== undefined) requestBody.email = body.email;
        if (body.firstname !== undefined)
          requestBody.firstname = body.firstname;
        if (body.lastname !== undefined) requestBody.lastname = body.lastname;
        if (body.dob !== undefined) requestBody.dob = body.dob;
        if (body.username !== undefined) requestBody.username = body.username;
        if (body.gender !== undefined) requestBody.gender = body.gender;

        if (body.job !== undefined) requestBody.job = body.job;
        if (body.yearsOfExperience !== undefined)
          requestBody.yearsOfExperience = body.yearsOfExperience;

        if (body.availability !== undefined)
          requestBody.availability = body.availability;
        if (body.description !== undefined)
          requestBody.description = body.description;
        if (body.location !== undefined) requestBody.location = body.location;
        if (body.phone !== undefined) requestBody.phone = body.phone;

        if (body.workMode !== undefined) requestBody.workMode = body.workMode;
        if (body.noticePeriod !== undefined)
          requestBody.noticePeriod = body.noticePeriod;
        if (body.portfolioUrl !== undefined)
          requestBody.portfolioUrl = body.portfolioUrl;
        if (body.linkedinUrl !== undefined)
          requestBody.linkedinUrl = body.linkedinUrl;
        if (body.languages !== undefined)
          requestBody.languages = body.languages;
        if (body.isHide !== undefined) requestBody.isHide = body.isHide;

        // If you store these in IEmployee
        if (body.avatar) requestBody.avatar = body.avatar;
        if (body.resume) requestBody.resume = body.resume;
        if (body.coverLetter) requestBody.coverLetter = body.coverLetter;

        /*
         Skills (M2M)
         backend expects: skills: [{ id?, name, description? }]
        */
        if (body.skills) {
          requestBody.skills = body.skills.map((s) => ({
            ...(s.id && { id: s.id }),
            name: s.name,
            description: s.description,
          }));
        }

        if (body.skillIdsToDelete?.length) {
          requestBody.skillIdsToDelete = body.skillIdsToDelete;
        }

        /*
         Career Scopes (M2M)
         backend expects: careerScopes: [{ id?, name, description? }]
        */
        if (body.careerScopes) {
          requestBody.careerScopes = body.careerScopes.map((cs) => ({
            ...(cs.id && { id: cs.id }),
            name: cs.name,
            description: cs.description,
          }));
        }

        if (body.careerScopeIdsToDelete?.length) {
          requestBody.careerScopeIdsToDelete = body.careerScopeIdsToDelete;
        }

        /*
         Experiences (O2M upsert)
         backend expects: experiences: [{ id?, title, description, startDate, endDate? }]
        */
        if (body.experiences) {
          requestBody.experiences = body.experiences.map((exp) => ({
            ...(exp.id && { id: exp.id }),
            title: exp.title,
            company: exp.company,
            description: exp.description,
            startDate: exp.startDate, // should be ISO string or Date -> axios will serialize
            ...(exp.endDate ? { endDate: exp.endDate } : {}),
          }));
        }

        if (body.experienceIdsToDelete?.length) {
          requestBody.experienceIdsToDelete = body.experienceIdsToDelete;
        }

        /*
         Educations (O2M upsert)
         backend expects: educations: [{ id?, school, degree, year }]
        */
        if (body.educations) {
          requestBody.educations = body.educations.map((edu) => ({
            ...(edu.id && { id: edu.id }),
            school: edu.school,
            degree: edu.degree,
            year: edu.year,
          }));
        }

        if (body.educationIdsToDelete?.length) {
          requestBody.educationIdsToDelete = body.educationIdsToDelete;
        }

        /*
         Socials (O2M upsert)
         backend expects: socials: [{ id?, platform, url }]
        */
        if (body.socials) {
          requestBody.socials = body.socials.map((social) => ({
            ...(social.id && { id: social.id }),
            platform: social.platform,
            url: social.url,
          }));
        }

        if (body.socialIdsToDelete?.length) {
          requestBody.socialIdsToDelete = body.socialIdsToDelete;
        }

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
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while updating employee's information",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
        throw new Error(errorMessage);
      }
    },
  }),
);
