import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ------------------------------- Meta Data ------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ផ្ទៀងផ្ទាត់ OTP" : "Verify OTP",
    description:
      lang === "km"
        ? "ផ្ទៀងផ្ទាត់លេខកូដ OTP ដែលបានផ្ញើទៅកាន់លេខទូរស័ព្ទរបស់អ្នក"
        : "Verify the OTP code sent to your phone number",
  };
}

/* ------------------------------ Main Layout ------------------------------ */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
