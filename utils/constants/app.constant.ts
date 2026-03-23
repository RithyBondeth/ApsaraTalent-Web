import FacebookIcon from "@/assets/socials/facebook.webp";
import GithubIcon from "@/assets/socials/github.png";
import GoogleIcon from "@/assets/socials/google.png";
import LinkedInIcon from "@/assets/socials/linkedin.png";
import { TLoadingStep } from "@/components/utils/dialogs/loading-dialog";

// Files
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const DOCUMENT_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const genderConstant = [
  { id: 1, label: "Male", value: "male" },
  { id: 2, label: "Female", value: "female" },
];

export const userRoleConstant = [
  { id: 1, label: "Employee or (Freelancer)", value: "employee" },
  { id: 2, label: "Company or (Employer)", value: "company" },
];

export const platformConstant = [
  { id: 1, label: "Facebook", value: "facebook" },
  { id: 2, label: "Instagram", value: "Instagram" },
  { id: 3, label: "Telegram", value: "telegram" },
  { id: 4, label: "LinkedIn", value: "linkedin" },
  { id: 5, label: "Github", value: "github" },
  { id: 6, label: "Website", value: "website" },
];

export const loginMethodConstant = [
  { id: 1, label: "Google", icon: GoogleIcon },
  { id: 2, label: "Facebook", icon: FacebookIcon },
  { id: 3, label: "LinkedIn", icon: LinkedInIcon },
  { id: 4, label: "Github", icon: GithubIcon },
];

export const availabilityConstant = [
  { id: 1, label: "Full Time", value: "full_time" },
  { id: 2, label: "Part Time", value: "part_time" },
  { id: 3, label: "Internship", value: "internship" },
  { id: 4, label: "Contract", value: "contract" },
  { id: 5, label: "Freelance", value: "freelance" },
  { id: 6, label: "Remote", value: "remote" },
];

export const yearOfExperienceConstant = [
  { id: 1, label: "No Experience", value: "No Experience" },
  { id: 2, label: "Less than 1 year", value: "Less than 1 year" },
  { id: 3, label: "1 - 2 years", value: "1 - 2 years" },
  { id: 4, label: "3 - 5 years", value: "3 - 5 years" },
  { id: 5, label: "6 - 10 years", value: "6 - 10 years" },
  { id: 6, label: "10+ years", value: "10+ years" },
];

export const locationConstant = [
  "Phnom Penh",
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tbong Khmum",
];

// Utils
export const badgeRandomColorsClass = [
  {
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  {
    bg: "bg-green-100",
    text: "text-green-800",
  },
  {
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
  {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    bg: "bg-pink-100",
    text: "text-pink-800",
  },
  {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
  },
  {
    bg: "bg-red-100",
    text: "text-red-800",
  },
  {
    bg: "bg-teal-100",
    text: "text-teal-800",
  },
  {
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
  },
  {
    bg: "bg-cyan-100",
    text: "text-cyan-800",
  },
  {
    bg: "bg-rose-100",
    text: "text-rose-800",
  },
];

// Search
export const SEARCH_DEBOUNCE_MS = 400;

// Messages
export const CHAT_TYPING_DEBOUNCE_MS = 1500;
export const CHAT_REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

// Resume
export const LIVE_RESUME_PREVIEW_DEBOUNCE_MS = 600;

export const DOWNLOAD_RESUME_STEPS: TLoadingStep[] = [
  { label: "Preparing your resume data", completeAt: 20 },
  { label: "Sending to AI engine", completeAt: 40 },
  { label: "Generating HTML layout", completeAt: 60 },
  { label: "Applying template styling", completeAt: 78 },
  { label: "Rendering PDF", completeAt: 92 },
  { label: "Finalising & compressing", completeAt: 99 },
];
