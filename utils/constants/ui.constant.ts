import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  LinkedInIcon,
} from "@/utils/constants/asset.constant";
import { StaticImageData } from "next/image";

export const genderConstant: {
  id: number;
  label: string;
  value: string;
}[] = [
  { id: 1, label: "Male", value: "male" },
  { id: 2, label: "Female", value: "female" },
] as const;

export const userRoleConstant: {
  id: number;
  label: string;
  value: string;
}[] = [
  { id: 1, label: "Employee or (Freelancer)", value: "employee" },
  { id: 2, label: "Company or (Employer)", value: "company" },
] as const;

export const platformConstant: {
  id: number;
  label: string;
  value: string;
}[] = [
  { id: 1, label: "Facebook", value: "facebook" },
  { id: 2, label: "Instagram", value: "Instagram" },
  { id: 3, label: "Telegram", value: "telegram" },
  { id: 4, label: "LinkedIn", value: "linkedin" },
  { id: 5, label: "Github", value: "github" },
  { id: 6, label: "Website", value: "website" },
] as const;

export const loginMethodConstant: {
  id: number;
  label: string;
  icon: StaticImageData;
}[] = [
  { id: 1, label: "Google", icon: GoogleIcon },
  { id: 2, label: "Facebook", icon: FacebookIcon },
  { id: 3, label: "LinkedIn", icon: LinkedInIcon },
  { id: 4, label: "Github", icon: GithubIcon },
] as const;

export const availabilityConstant: {
  id: number;
  label: string;
  value: string;
}[] = [
  { id: 1, label: "Full Time", value: "full_time" },
  { id: 2, label: "Part Time", value: "part_time" },
  { id: 3, label: "Internship", value: "internship" },
  { id: 4, label: "Contract", value: "contract" },
  { id: 5, label: "Freelance", value: "freelance" },
  { id: 6, label: "Remote", value: "remote" },
] as const;

export const yearOfExperienceConstant: {
  id: number;
  label: string;
  value: string;
}[] = [
  { id: 1, label: "No Experience", value: "No Experience" },
  { id: 2, label: "Less than 1 year", value: "Less than 1 year" },
  { id: 3, label: "1 - 2 years", value: "1 - 2 years" },
  { id: 4, label: "3 - 5 years", value: "3 - 5 years" },
  { id: 5, label: "6 - 10 years", value: "6 - 10 years" },
  { id: 6, label: "10+ years", value: "10+ years" },
] as const;

export const locationConstant: string[] = [
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
] as const;

export const badgeRandomColorsClass: { bg: string; text: string }[] = [
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-green-100", text: "text-green-800" },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-yellow-100", text: "text-yellow-800" },
  { bg: "bg-pink-100", text: "text-pink-800" },
  { bg: "bg-indigo-100", text: "text-indigo-800" },
  { bg: "bg-red-100", text: "text-red-800" },
  { bg: "bg-teal-100", text: "text-teal-800" },
  { bg: "bg-orange-100", text: "text-orange-800" },
  { bg: "bg-emerald-100", text: "text-emerald-800" },
  { bg: "bg-cyan-100", text: "text-cyan-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
] as const;

export const careerScopesListConstant: {
  label: string;
  value: string;
  description: string;
}[] = [
  // --- CORE SOFTWARE & APP DEVELOPMENT ---
  {
    label: "Software Engineering",
    value: "Software Engineering",
    description:
      "Highly sought after. Banks, telecom companies, and a growing startup ecosystem in Phnom Penh are constantly hiring developers.",
  },
  {
    label: "Frontend Development",
    value: "Frontend Development",
    description:
      "Vital for local tech agencies and businesses building sleek, responsive web applications. React and Vue.js are highly requested.",
  },
  {
    label: "Backend Development",
    value: "Backend Development",
    description:
      "The backbone of Cambodia's booming Fintech and e-commerce sectors, building secure, scalable APIs for massive daily transactions.",
  },
  {
    label: "Mobile App Development",
    value: "Mobile App Development",
    description:
      "Extremely high demand. Cambodia is a mobile-first market, heavily relying on Flutter, iOS, and Android developers for banking and delivery apps.",
  },
  {
    label: "Full Stack Development",
    value: "Full Stack Development",
    description:
      "Incredibly valuable for local startups and international outsourcing firms that require versatile developers.",
  },
  {
    label: "UI/UX Design",
    value: "UI/UX Design",
    description:
      "Booming demand. Every new local delivery, banking, or e-commerce app competes heavily on user experience.",
  },
  {
    label: "Game Development",
    value: "Game Development",
    description:
      "A small but passionate community, driven mostly by indie studios focusing on mobile gaming.",
  },

  // --- DATA, AI & CLOUD INFRASTRUCTURE ---
  {
    label: "Data Science",
    value: "Data Science",
    description:
      "Growing demand, particularly in Fintech and banking, to analyze consumer data and improve financial services.",
  },
  {
    label: "Cloud Computing",
    value: "Cloud Computing",
    description:
      "Essential as local enterprises and government ministries transition their legacy systems to the cloud.",
  },
  {
    label: "DevOps Engineering",
    value: "DevOps Engineering",
    description:
      "Rapidly growing necessity as local platforms scale up their cloud infrastructure and ensure zero downtime.",
  },
  {
    label: "Cybersecurity",
    value: "Cybersecurity",
    description:
      "Becoming critical as Cambodian institutions digitize and face increasing regional cyber threats.",
  },
  {
    label: "Ethical Hacking & Penetration Testing",
    value: "Ethical Hacking & Penetration Testing",
    description:
      "Niche but growing necessity for financial institutions ensuring their new digital platforms are secure.",
  },
  {
    label: "Artificial Intelligence & Machine Learning",
    value: "Artificial Intelligence & Machine Learning",
    description:
      "Increasingly integrated into local customer service bots, banking algorithms, and operational automation.",
  },
  {
    label: "Machine Learning Engineering",
    value: "Machine Learning Engineering",
    description:
      "A niche role locally, mostly found in top-tier tech firms or pursued as remote work for global companies.",
  },
  {
    label: "Blockchain Development",
    value: "Blockchain Development",
    description:
      "Limited locally due to strict government regulations on crypto, but pursued by local devs for remote international jobs.",
  },
  {
    label: "Quantum Computing Research",
    value: "Quantum Computing Research",
    description:
      "Non-existent in Cambodia. Requires advanced study and employment in foreign tech hubs.",
  },

  // --- BUSINESS, FINANCE & MANAGEMENT ---
  {
    label: "Finance & Accounting",
    value: "Finance & Accounting",
    description:
      "A massive, stable sector driven by Cambodia's robust banking and microfinance institution (MFI) networks.",
  },
  {
    label: "Sales & Business Development",
    value: "Sales & Business Development",
    description:
      "Universally needed across all sectors to drive revenue and manage B2B client relationships.",
  },
  {
    label: "Human Resources (HR)",
    value: "Human Resources (HR)",
    description:
      "Crucial for compliance with local labor laws and managing talent in a highly competitive market.",
  },
  {
    label: "Project Management",
    value: "Project Management",
    description:
      "High demand in construction, tech, and the massive NGO sector to ensure deliverables are met on time.",
  },
  {
    label: "Product Management",
    value: "Product Management",
    description:
      "Vital for tech startups and banks developing new digital applications for the local market.",
  },
  {
    label: "Entrepreneurship & Startups",
    value: "Entrepreneurship & Startups",
    description:
      "A vibrant scene heavily supported by local incubators and youth-driven business ventures.",
  },
  {
    label: "Customer Support & Service",
    value: "Customer Support & Service",
    description:
      "A massive employment sector, especially for telecommunications, internet providers, and retail.",
  },
  {
    label: "Investment Banking",
    value: "Investment Banking",
    description:
      "A developing field as the Cambodia Securities Exchange (CSX) matures and attracts more corporate listings.",
  },
  {
    label: "Insurance & Risk Management",
    value: "Insurance & Risk Management",
    description:
      "A rapidly expanding market as the middle class grows and seeks life, health, and property insurance.",
  },
  {
    label: "Actuarial Science",
    value: "Actuarial Science",
    description:
      "Rare but increasingly necessary skill set for the growing domestic insurance industry.",
  },
  {
    label: "Market Research & Consumer Behavior",
    value: "Market Research & Consumer Behavior",
    description:
      "Growing importance as foreign investors need data on Cambodian purchasing habits before entering.",
  },

  // --- MARKETING, MEDIA & DESIGN ---
  {
    label: "Digital Marketing",
    value: "Digital Marketing",
    description:
      "Absolute necessity. The Cambodian market is heavily driven by Facebook, TikTok, and Telegram advertising.",
  },
  {
    label: "Social Media Management",
    value: "Social Media Management",
    description:
      "One of the most common roles for young professionals helping local businesses maintain an online presence.",
  },
  {
    label: "Graphic Design",
    value: "Graphic Design",
    description:
      "Core requirement for the thriving local advertising, printing, and digital media sectors.",
  },
  {
    label: "Content Writing & Copywriting",
    value: "Content Writing & Copywriting",
    description:
      "High demand for bilingual (Khmer/English) writers to craft marketing materials and corporate communications.",
  },
  {
    label: "Public Relations (PR)",
    value: "Public Relations (PR)",
    description:
      "Important for managing brand image, especially for international companies operating in Cambodia.",
  },
  {
    label: "Photography & Videography",
    value: "Photography & Videography",
    description:
      "A lucrative freelance and agency field, heavily utilized for weddings, events, and brand marketing.",
  },
  {
    label: "Film & Video Production",
    value: "Film & Video Production",
    description:
      "A thriving local entertainment scene producing commercials, music videos, and domestic cinema.",
  },
  {
    label: "Journalism & Media",
    value: "Journalism & Media",
    description:
      "An established sector covering local news, requiring strong navigation of the local regulatory landscape.",
  },
  {
    label: "Music Production & Sound Engineering",
    value: "Music Production & Sound Engineering",
    description:
      "Supports a vibrant local music industry that blends traditional Khmer sounds with modern hip-hop and pop.",
  },
  {
    label: "Fashion Design & Merchandising",
    value: "Fashion Design & Merchandising",
    description:
      "Tied to local boutique culture and the massive garment manufacturing sector.",
  },
  {
    label: "Voice Acting & Dubbing",
    value: "Voice Acting & Dubbing",
    description:
      "A popular niche industry dedicated to localizing foreign media into Khmer.",
  },
  {
    label: "Esports & Gaming Industry",
    value: "Esports & Gaming Industry",
    description:
      "Rapidly growing due to a massive youth demographic heavily invested in competitive mobile gaming.",
  },

  // --- ENGINEERING, CONSTRUCTION & REAL ESTATE ---
  {
    label: "Civil Engineering",
    value: "Civil Engineering",
    description:
      "Massive demand driven by continuous infrastructure projects, road building, and commercial real estate.",
  },
  {
    label: "Architecture",
    value: "Architecture",
    description:
      "Essential for urban expansion, balancing modern design with local climatic needs.",
  },
  {
    label: "Interior Design",
    value: "Interior Design",
    description:
      "High demand closely tied to the real estate boom, outfitting new homes, cafes, and office spaces.",
  },
  {
    label: "Real Estate & Property Management",
    value: "Real Estate & Property Management",
    description:
      "A booming sector focused on managing the surge of new condominiums, boreys, and commercial towers.",
  },
  {
    label: "Electrical Engineering",
    value: "Electrical Engineering",
    description:
      "Crucial for expanding urban grids, commercial building maintenance, and national power projects.",
  },
  {
    label: "Mechanical Engineering",
    value: "Mechanical Engineering",
    description:
      "Needed in the growing manufacturing, garment, and industrial sectors.",
  },
  {
    label: "Renewable Energy Engineering",
    value: "Renewable Energy Engineering",
    description:
      "Gaining serious traction as Cambodia invests heavily in solar farms and sustainable power solutions.",
  },
  {
    label: "Automobile Engineering",
    value: "Automobile Engineering",
    description:
      "A growing field as major automotive brands open local assembly plants.",
  },
  {
    label: "Robotics Engineering",
    value: "Robotics Engineering",
    description:
      "Very early stages in Cambodia; mostly limited to academic settings or light industrial automation.",
  },
  {
    label: "Aerospace Engineering",
    value: "Aerospace Engineering",
    description:
      "No local industry; requires international study and relocation.",
  },

  // --- LOGISTICS, E-COMMERCE & HOSPITALITY ---
  {
    label: "E-commerce Management",
    value: "E-commerce Management",
    description:
      "Booming sector as online shopping and localized delivery apps become the norm.",
  },
  {
    label: "Logistics & Supply Chain Management",
    value: "Logistics & Supply Chain Management",
    description:
      "Critical infrastructure for the garment export industry and the rapidly expanding local e-commerce market.",
  },
  {
    label: "Hospitality & Tourism",
    value: "Hospitality & Tourism",
    description:
      "A foundational pillar of the economy, providing vast employment in hotels, tours, and services.",
  },
  {
    label: "Event Planning & Management",
    value: "Event Planning & Management",
    description:
      "A highly active industry managing everything from large corporate expos to extravagant local weddings.",
  },
  {
    label: "Culinary Arts & Food Science",
    value: "Culinary Arts & Food Science",
    description:
      "A growing professional field supporting the massive restaurant, cafe, and hospitality sectors.",
  },

  // --- HEALTHCARE, MEDICAL & WELLNESS ---
  {
    label: "Healthcare & Nursing",
    value: "Healthcare & Nursing",
    description:
      "Constant, critical demand in both public hospitals and the rapidly growing private clinic sector.",
  },
  {
    label: "Dentistry",
    value: "Dentistry",
    description:
      "A highly lucrative and popular private practice career, especially in urban centers.",
  },
  {
    label: "Dermatology & Skincare",
    value: "Dermatology & Skincare",
    description:
      "Extremely popular due to a booming local aesthetics, beauty clinic, and imported skincare market.",
  },
  {
    label: "Mental Health Therapy",
    value: "Mental Health Therapy",
    description:
      "Slowly gaining societal recognition; roles are primarily found in specialized NGOs and private clinics.",
  },
  {
    label: "Speech Therapy & Audiology",
    value: "Speech Therapy & Audiology",
    description:
      "A niche healthcare field, often supported by international NGOs or specialized pediatric clinics.",
  },
  {
    label: "Veterinary Medicine",
    value: "Veterinary Medicine",
    description:
      "Growing demand for domestic pet care in cities, alongside traditional agricultural livestock needs.",
  },
  {
    label: "Geriatric & Elderly Care",
    value: "Geriatric & Elderly Care",
    description:
      "Traditionally handled by family, but specialized professional care is slowly emerging.",
  },
  {
    label: "Fitness & Personal Training",
    value: "Fitness & Personal Training",
    description:
      "A booming urban trend with gyms and wellness centers opening rapidly across major cities.",
  },
  {
    label: "Sports Management",
    value: "Sports Management",
    description:
      "Growing significantly with increased investment in local leagues like football and Kun Khmer.",
  },
  {
    label: "Pharmaceutical Research",
    value: "Pharmaceutical Research",
    description:
      "Locally focused on pharmaceutical import, distribution, and sales rather than lab research.",
  },
  {
    label: "Biotechnology & Biomedical Science",
    value: "Biotechnology & Biomedical Science",
    description:
      "Limited local scope, mostly confined to basic medical laboratory testing.",
  },
  {
    label: "Food Technology & Nutrition Science",
    value: "Food Technology & Nutrition Science",
    description:
      "Important for improving agricultural exports and local public health standards.",
  },

  // --- EDUCATION, LAW, NGOS & PUBLIC SERVICE ---
  {
    label: "Education & Teaching",
    value: "Education & Teaching",
    description:
      "High demand, particularly for English language instructors and educators in international private schools.",
  },
  {
    label: "Law & Legal Consulting",
    value: "Law & Legal Consulting",
    description:
      "Vital for navigating local business compliance, real estate transactions, and foreign direct investment.",
  },
  {
    label: "Nonprofit & NGO Management",
    value: "Nonprofit & NGO Management",
    description:
      "A massive, well-established sector providing a wealth of professional and development jobs.",
  },
  {
    label: "Political Science & Public Administration",
    value: "Political Science & Public Administration",
    description:
      "A common pathway for careers within government ministries or international policy organizations.",
  },
  {
    label: "Linguistics & Translation Services",
    value: "Linguistics & Translation Services",
    description:
      "Constant demand for Khmer, English, and Chinese translators across business and NGO sectors.",
  },
  {
    label: "Disaster Management & Humanitarian Aid",
    value: "Disaster Management & Humanitarian Aid",
    description:
      "Essential due to seasonal flooding and climate vulnerabilities; heavily managed by NGOs.",
  },
  {
    label: "Military & Defense Services",
    value: "Military & Defense Services",
    description:
      "A traditional and respected government career path focusing on national security.",
  },
  {
    label: "Firefighting & Emergency Response",
    value: "Firefighting & Emergency Response",
    description:
      "A developing public service sector, modernizing as urban high-rises become more common.",
  },
  {
    label: "Forensic Science & Criminology",
    value: "Forensic Science & Criminology",
    description:
      "A restricted field primarily managed internally by government law enforcement agencies.",
  },
  {
    label: "Ethnography & Anthropology",
    value: "Ethnography & Anthropology",
    description:
      "Mainly an academic or NGO research field preserving indigenous cultures and local histories.",
  },

  // --- AGRICULTURE, ENVIRONMENT & CONSERVATION ---
  {
    label: "Agricultural Science & Farming",
    value: "Agricultural Science & Farming",
    description:
      "A foundational economic pillar, increasingly integrating agritech to improve crop yields.",
  },
  {
    label: "Environmental Science & Sustainability",
    value: "Environmental Science & Sustainability",
    description:
      "Crucial for managing ecological impacts of rapid development and conserving resources.",
  },
  {
    label: "Forestry & Wildlife Conservation",
    value: "Forestry & Wildlife Conservation",
    description:
      "Vital for protecting Cambodia's natural reserves; heavily supported by international NGOs.",
  },
  {
    label: "Marine Biology & Oceanography",
    value: "Marine Biology & Oceanography",
    description:
      "Niche field focused on coastal conservation in southern regions like Kep and Koh Rong.",
  },
  {
    label: "Wildlife Photography & Nature Conservation",
    value: "Wildlife Photography & Nature Conservation",
    description:
      "Tied to eco-tourism promotion and NGO environmental awareness campaigns.",
  },

  // --- SPECIALIZED TECH, POLICY & FUTURE INDUSTRIES ---
  {
    label: "Legal Tech & Compliance",
    value: "Legal Tech & Compliance",
    description:
      "Emerging field as the government modernizes tax systems and enforces stricter compliance.",
  },
  {
    label: "HR Tech & Talent Acquisition",
    value: "HR Tech & Talent Acquisition",
    description:
      "Growing as the recruitment industry digitizes with new job portals and matching systems.",
  },
  {
    label: "Cyberlaw & Digital Ethics",
    value: "Cyberlaw & Digital Ethics",
    description:
      "In its infancy as the government drafts new digital frameworks and internet regulations.",
  },
  {
    label: "AI Ethics & Policy Making",
    value: "AI Ethics & Policy Making",
    description:
      "Currently non-existent as a standalone career locally, but will emerge as tech evolves.",
  },
  {
    label: "Smart Cities & Urban Planning",
    value: "Smart Cities & Urban Planning",
    description:
      "Critical future need as Phnom Penh and Sihanoukville rapidly urbanize.",
  },
  {
    label: "Drone Technology & UAV Operations",
    value: "Drone Technology & UAV Operations",
    description:
      "Emerging locally for agricultural surveying, real estate, and infrastructure mapping.",
  },
  {
    label: "3D Printing & Additive Manufacturing",
    value: "3D Printing & Additive Manufacturing",
    description:
      "Small-scale adoption for local prototyping, educational purposes, and custom crafts.",
  },
  {
    label: "Virtual Reality (VR) & Augmented Reality (AR)",
    value: "Virtual Reality (VR) & Augmented Reality (AR)",
    description:
      "Used lightly in high-end real estate virtual tours and experimental marketing.",
  },
  {
    label: "Metaverse Development",
    value: "Metaverse Development",
    description:
      "No local industry footprint; pursued strictly as remote freelance work.",
  },
  {
    label: "NFT Development & Crypto Trading",
    value: "NFT Development & Crypto Trading",
    description:
      "Highly restricted by the government; exists only as an informal, individual pursuit.",
  },
  {
    label: "Crowdfunding & Startup Investment",
    value: "Crowdfunding & Startup Investment",
    description:
      "Handled mostly by small venture capital firms and angel networks rather than public platforms.",
  },
  {
    label: "Nanotechnology & Materials Science",
    value: "Nanotechnology & Materials Science",
    description:
      "Virtually non-existent in the local market; remains a purely academic pursuit abroad.",
  },
  {
    label: "Bioinformatics & Computational Biology",
    value: "Bioinformatics & Computational Biology",
    description:
      "Extremely rare locally; requires working remotely or relocating to international hubs.",
  },
  {
    label: "Space Exploration & Satellite Engineering",
    value: "Space Exploration & Satellite Engineering",
    description:
      "Non-existent locally; requires international study and relocation.",
  },
  {
    label: "Space Science & Astronomy",
    value: "Space Science & Astronomy",
    description: "Non-existent locally as a career path.",
  },
  {
    label: "Astrobiology & Space Medicine",
    value: "Astrobiology & Space Medicine",
    description: "Non-existent locally as a career path.",
  },
] as const;
