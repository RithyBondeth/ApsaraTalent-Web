import { TResumeTemplate } from "@/utils/types/resume";
import { IBuildResume } from "@/utils/interfaces/resume";
import { IUser } from "@/utils/interfaces/user";

/**
 * Formats a date string to "Month YYYY" (e.g. "January 2022").
 * Falls back to the original string if parsing fails.
 */
function formatDateToMonthYear(dateString?: string | null): string | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Splits a description into a short summary and a list of achievements.
 * Lines that start with "-", "•", or "*" are treated as bullet-point achievements.
 * Everything else becomes the main description.
 */
function splitDescriptionAndAchievements(description?: string): {
  summary: string;
  achievements: string[];
} {
  if (!description) return { summary: "", achievements: [] };

  const lines = description
    .split(/\n|•|-\s/)
    .map((l) => l.trim())
    .filter(Boolean);

  const achievements: string[] = [];
  const summaryLines: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      achievements.push(line.replace(/^[•\-*]\s*/, "").trim());
    } else {
      summaryLines.push(line);
    }
  });

  return {
    summary: summaryLines.join(" ").trim(),
    achievements,
  };
}

/**
 * Extracts a 4-digit year from any date string.
 * Handles ISO datetimes ("2023-12-31T17:00:00.000Z" → "2023"),
 * date-only strings ("2023-12-31" → "2023"), and plain years ("2023" → "2023").
 */
function formatEduYear(year?: string | null): string | undefined {
  if (!year) return undefined;
  const match = year.match(/\d{4}/);
  return match ? match[0] : year;
}

export function buildResumePayloadFromUser(
  user: IUser,
  template: TResumeTemplate,
): IBuildResume {
  if (!user.employee)
    throw new Error("Employee data is required to build a resume");
  const employee = user.employee;

  // ─── Full Name ────────────────────────────────────────────────────────────
  const fullName =
    [employee.firstname || "", employee.lastname || ""].join(" ").trim() ||
    employee.username ||
    user.email?.split("@")[0] ||
    "";

  // ─── Social Links ─────────────────────────────────────────────────────────
  const socials: Record<string, string> = {};
  (employee.socials || []).forEach((social) => {
    const platform = social.platform?.toLowerCase().trim();
    if (!social.url) return;
    if (platform === "linkedin") socials.linkedin = social.url;
    else if (platform === "github") socials.github = social.url;
    else if (platform === "twitter" || platform === "x")
      socials.twitter = social.url;
    else if (
      platform === "website" ||
      platform === "portfolio" ||
      platform === "personal"
    )
      socials.portfolio = social.url;
    else if (platform === "instagram") socials.instagram = social.url;
    else if (platform === "dribbble") socials.dribbble = social.url;
    else if (platform === "behance") socials.behance = social.url;
    else socials[platform] = social.url; // preserve any other platforms
  });

  // ─── Work Experience ──────────────────────────────────────────────────────
  const experience = (employee.experiences || []).map((exp) => {
    const { summary, achievements } = splitDescriptionAndAchievements(
      exp.description,
    );
    return {
      company: "",
      position: exp.title || "",
      startDate: formatDateToMonthYear(exp.startDate) || "",
      endDate: exp.endDate ? formatDateToMonthYear(exp.endDate) : "Present",
      description: summary || exp.description || "",
      achievements,
    };
  });

  // ─── Education ────────────────────────────────────────────────────────────
  const educationLines = (employee.educations || [])
    .map((edu) => {
      const parts = [edu.degree, edu.school, formatEduYear(edu.year)]
        .filter(Boolean)
        .join(", ");
      return parts;
    })
    .filter(Boolean);
  const education =
    educationLines.length > 0 ? educationLines.join(" | ") : undefined;

  // ─── Skills ───────────────────────────────────────────────────────────────
  const skills = (employee.skills || [])
    .map((s) => s.name?.trim())
    .filter(Boolean) as string[];

  // ─── Career Scopes / Interests ────────────────────────────────────────────
  const careerScopes = (employee.careerScopes || [])
    .map((c) => c.name?.trim())
    .filter(Boolean) as string[];

  // ─── Professional Summary ─────────────────────────────────────────────────
  const summary = employee.description?.trim() || undefined;

  // ─── Age (calculated from dob) ─────────────────────────────────────────────
  const age = employee.dob
    ? (() => {
        const birth = new Date(employee.dob);
        if (isNaN(birth.getTime())) return undefined;
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
          years--;
        }
        return years > 0 ? years : undefined;
      })()
    : undefined;

  // ─── Build Final Payload ──────────────────────────────────────────────────
  const payload: IBuildResume = {
    personalInfo: {
      fullName,
      email: user.email || employee.email || "",
      phone: employee.phone || user.phone || undefined,
      location: employee.location || undefined,
      age,
      job: employee.job || undefined,
      profilePicture: employee.avatar || undefined,
      socials: Object.keys(socials).length > 0 ? socials : undefined,
    },
    summary,
    yearsOfExperience: employee.yearsOfExperience || undefined,
    availability: employee.availability || undefined,
    experience,
    skills,
    education,
    careerScopes: careerScopes.length > 0 ? careerScopes : undefined,
    template,
  };

  return payload;
}
