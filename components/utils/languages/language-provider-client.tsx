"use client";

import { useLanguageStore } from "@/stores/languages/language-store";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import enMessages from "@/language/en.json";
import kmMessages from "@/language/km.json";

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
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  // Sync Zustand store from cookie once on mount only.
  // Must NOT re-run when `language` changes — that would immediately
  // reverse a user-triggered toggle if the cookie hasn't updated yet.
  useEffect(() => {
    setLanguage(defaultLanguage as "en" | "km");
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeLocale = mounted ? language : (defaultLanguage as "en" | "km");

  return (
    <NextIntlClientProvider
      locale={activeLocale}
      messages={messages[activeLocale]}
    >
      {children}
    </NextIntlClientProvider>
  );
}
