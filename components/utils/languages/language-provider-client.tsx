"use client";

import { useLanguageStore } from "@/stores/languages/language-store";
import { FONT_STACK } from "@/utils/constants/ui.constant";
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

  // Mirror the locale onto <html lang>. The server renders it from the cookie;
  // this keeps it honest after an in-page switch, which is what the Khmer
  // typography rules in globals.css key off.
  useEffect(() => {
    document.documentElement.lang = activeLocale;
    document.body.style.fontFamily = FONT_STACK[activeLocale];
  }, [activeLocale]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <NextIntlClientProvider
      locale={activeLocale}
      messages={messages[activeLocale]}
      timeZone="Asia/Phnom_Penh"
    >
      {children}
    </NextIntlClientProvider>
  );
}
