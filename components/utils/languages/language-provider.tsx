import { cookies } from "next/headers";
import { LanguageProviderClient } from "@/components/utils/languages/language-provider-client";

export async function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = (await cookies()).get("language")?.value || "en";

  return (
    <LanguageProviderClient defaultLanguage={language}>
      {children}
    </LanguageProviderClient>
  );
}
