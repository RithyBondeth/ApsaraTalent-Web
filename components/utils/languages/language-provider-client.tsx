"use client";

import { useLanguageStore } from "@/stores/languages/language-store";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import enMessages from "@/messages/en.json";
import kmMessages from "@/messages/km.json";

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

  useEffect(() => {
    setMounted(true);
    if (language === "en" && defaultLanguage === "km") {
      setLanguage("km");
    }
  }, [defaultLanguage, language, setLanguage]);

  const activeLocale = mounted ? language : (defaultLanguage as "en" | "km");

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages[activeLocale]}>
      {children}
    </NextIntlClientProvider>
  );
}
