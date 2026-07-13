import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LearnContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ស្វែងយល់ — Apsara Talent" : "Learn — Apsara Talent",
    description:
      lang === "km"
        ? "រៀនពីរបៀបប្រើប្រាស់ Apsara Talent ឲ្យបានពេញលេញ — មគ្គុទ្ទេសក៍ វីដេអូណែនាំ និងធនធានសម្រាប់អ្នកស្វែងរកការងារ និងនិយោជក។"
        : "Learn how to get the most out of Apsara Talent — guides, tutorials, and resources for job seekers and employers.",
  };
}

export default function LearnPage() {
  return <LearnContent />;
}
