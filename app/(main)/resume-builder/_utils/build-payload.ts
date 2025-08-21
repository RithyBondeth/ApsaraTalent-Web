import { BuildResume, ResumeTemplate } from "../_apis/generate-resume.api";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";

function formatDateToMMDDYYYY(dateString?: string | null): string | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // fallback to original
  }
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function buildResumePayloadFromUser(
  user: IUser,
  template: ResumeTemplate
): BuildResume {
  const employee = user.employee!;

  const fullName = [employee.firstname || "", employee.lastname || ""]
    .join(" ")
    .trim() || employee.username || user.email?.split("@")[0] || "";

  const socials: Record<string, string> = {};
  (employee.socials || []).forEach((social) => {
    const platform = social.platform?.toLowerCase();
    if (platform === "linkedin") socials.linkedin = social.url;
    else if (platform === "github") socials.github = social.url;
    else if (platform === "twitter") socials.twitter = social.url;
    else if (platform === "website") socials.portfolio = social.url;
  });

  const experience = (employee.experiences || []).map((exp) => ({
    company: "", // Company not available in schema
    position: exp.title,
    startDate: formatDateToMMDDYYYY(exp.startDate) || "",
    endDate: formatDateToMMDDYYYY(exp.endDate),
    description: exp.description,
    achievements: [],
  }));

  const topEducation = (employee.educations || [])[0];
  const education = topEducation
    ? `${topEducation.degree}, ${topEducation.school} (${topEducation.year})`
    : undefined;

  const skills = (employee.skills || []).map((s) => s.name);

  const payload: BuildResume = {
    personalInfo: {
      fullName,
      email: user.email,
      job: employee.job,
      phone: employee.phone,
      location: employee.location || undefined,
      profilePicture: employee.avatar || undefined,
      socials: Object.keys(socials).length ? socials : undefined,
    },
    experience,
    skills,
    education,
    template,
  };

  return payload;
}


