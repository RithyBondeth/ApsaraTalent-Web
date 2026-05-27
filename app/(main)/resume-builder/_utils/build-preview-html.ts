import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { RESUME_COLOR } from "@/utils/constants/resume-colors.constant";

/**
 * Generates a clean, professional HTML string from a BuildResume payload.
 * Used for the live client-side preview inside the editor (sandboxed iframe).
 * This is NOT the final PDF — it is a visual approximation for editing convenience.
 */
export function buildPreviewHTML(data: IBuildResume): string {
  const {
    personalInfo,
    summary,
    experience,
    skills,
    education,
    careerScopes,
    yearsOfExperience,
    availability,
  } = data;

  const socialLinks = personalInfo.socials
    ? Object.entries(personalInfo.socials)
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<a href="${esc(v)}" style="color:${RESUME_COLOR.ACCENT};text-decoration:none;font-size:11px;margin-right:10px;">${esc(capitalize(k))}</a>`,
        )
        .join("")
    : "";

  const experienceHTML = (experience || [])
    .map((exp) => {
      const achievements = (exp.achievements || [])
        .filter(Boolean)
        .map(
          (a) =>
            `<li style="margin:2px 0;font-size:12px;color:${RESUME_COLOR.TEXT_SECONDARY};">${esc(a)}</li>`,
        )
        .join("");
      return `
        <div style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-weight:600;font-size:13px;color:${RESUME_COLOR.TEXT_PRIMARY};">${esc(exp.position || "Position")}</div>
              ${exp.company ? `<div style="font-size:12px;color:${RESUME_COLOR.TEXT_MUTED};">${esc(exp.company)}</div>` : ""}
            </div>
            <div style="font-size:11px;color:${RESUME_COLOR.TEXT_SUBTLE};white-space:nowrap;margin-left:8px;">
              ${esc(exp.startDate || "")}${exp.endDate ? ` – ${esc(exp.endDate)}` : ""}
            </div>
          </div>
          ${exp.description ? `<p style="margin:4px 0;font-size:12px;color:${RESUME_COLOR.TEXT_SECONDARY};line-height:1.5;">${esc(exp.description)}</p>` : ""}
          ${achievements ? `<ul style="margin:4px 0 0 16px;padding:0;">${achievements}</ul>` : ""}
        </div>`;
    })
    .join("");

  const skillsHTML = (skills || [])
    .filter(Boolean)
    .map(
      (s) =>
        `<span style="display:inline-block;background:${RESUME_COLOR.ACCENT_LIGHT};color:${RESUME_COLOR.ACCENT};font-size:11px;padding:2px 8px;border-radius:99px;margin:2px 3px;">${esc(s)}</span>`,
    )
    .join("");

  const careerScopesHTML = (careerScopes || [])
    .filter(Boolean)
    .map(
      (c) =>
        `<span style="display:inline-block;background:${RESUME_COLOR.CAREER_SCOPE_BG};color:${RESUME_COLOR.CAREER_SCOPE_TEXT};font-size:11px;padding:2px 8px;border-radius:99px;margin:2px 3px;">${esc(c)}</span>`,
    )
    .join("");

  const metaItems = [
    yearsOfExperience ? `${esc(yearsOfExperience)} yrs exp.` : null,
    availability ? `Available: ${esc(availability)}` : null,
  ]
    .filter(Boolean)
    .map(
      (t) =>
        `<span style="font-size:11px;color:${RESUME_COLOR.TEXT_MUTED};margin-right:12px;">${t}</span>`,
    )
    .join("");

  return `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { font-family: 'Segoe UI', Arial, sans-serif; background: ${RESUME_COLOR.WHITE}; color: ${RESUME_COLOR.TEXT_PRIMARY}; padding: 32px 36px; font-size: 13px; line-height: 1.6; }
              h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${RESUME_COLOR.ACCENT}; margin: 18px 0 8px; border-bottom: 1.5px solid ${RESUME_COLOR.ACCENT_LIGHT}; padding-bottom: 3px; }
              a { color: ${RESUME_COLOR.ACCENT}; }
            </style>
          </head>
          <body>

            <!-- Header -->
            <div style="border-bottom:2px solid ${RESUME_COLOR.ACCENT};padding-bottom:14px;margin-bottom:16px;">
              <div style="font-size:22px;font-weight:700;color:${RESUME_COLOR.TEXT_PRIMARY};letter-spacing:-0.3px;">${esc(personalInfo.fullName || "Your Name")}</div>
              ${personalInfo.job ? `<div style="font-size:13px;color:${RESUME_COLOR.ACCENT};font-weight:500;margin-top:2px;">${esc(personalInfo.job)}</div>` : ""}
              <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:0;">
                ${personalInfo.email ? `<span style="font-size:11px;color:${RESUME_COLOR.TEXT_MUTED};margin-right:14px;">✉ ${esc(personalInfo.email)}</span>` : ""}
                ${personalInfo.phone ? `<span style="font-size:11px;color:${RESUME_COLOR.TEXT_MUTED};margin-right:14px;">📞 ${esc(personalInfo.phone)}</span>` : ""}
                ${personalInfo.location ? `<span style="font-size:11px;color:${RESUME_COLOR.TEXT_MUTED};margin-right:14px;">📍 ${esc(personalInfo.location)}</span>` : ""}
              </div>
              ${metaItems ? `<div style="margin-top:4px;">${metaItems}</div>` : ""}
              ${socialLinks ? `<div style="margin-top:6px;">${socialLinks}</div>` : ""}
            </div>

            <!-- Summary -->
            ${summary ? `<h2>Professional Summary</h2><p style="font-size:12px;color:${RESUME_COLOR.TEXT_SECONDARY};line-height:1.6;">${esc(summary)}</p>` : ""}

            <!-- Experience -->
            ${experience && experience.length > 0 ? `<h2>Work Experience</h2>${experienceHTML}` : ""}

            <!-- Skills -->
            ${skills && skills.length > 0 ? `<h2>Skills</h2><div style="margin-top:4px;">${skillsHTML}</div>` : ""}

            <!-- Education -->
            ${education ? `<h2>Education</h2><p style="font-size:12px;color:${RESUME_COLOR.TEXT_SECONDARY};">${esc(education)}</p>` : ""}

            <!-- Career Interests -->
            ${careerScopes && careerScopes.length > 0 ? `<h2>Career Interests</h2><div style="margin-top:4px;">${careerScopesHTML}</div>` : ""}

          </body>
          </html>`;
}

/** Escape special HTML characters to prevent XSS in the sandboxed preview. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
