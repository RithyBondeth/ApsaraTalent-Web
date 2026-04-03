"use client";

import { useLanguageStore } from "@/stores/languages/language-store";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import enMessages from "@/language/en.json";
import kmMessages from "@/language/km.json";

/* ----------------------------------- Helper ---------------------------------- */
const messages = {
  en: enMessages,
  km: kmMessages,
};

export function LanguageProviderClient({
  children,
  defaultLanguage,
}: {
  children: React.ReactNode;
  defaultLanguage: string;
}) {
  /* ----------------------------- API Integration ---------------------------- */
  const { language, setLanguage } = useLanguageStore();
  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setLanguage(defaultLanguage as "en" | "km");
    setMounted(true);
  }, [defaultLanguage, setLanguage]);

  /* ---------------------------------- Utils --------------------------------- */
  const activeLocale = mounted ? language : (defaultLanguage as "en" | "km");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <NextIntlClientProvider
      locale={activeLocale}
      messages={messages[activeLocale]}
    >
      {children}
    </NextIntlClientProvider>
  );
}
