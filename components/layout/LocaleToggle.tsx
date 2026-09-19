"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

export function LocaleToggle({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const router = useRouter();
  const [current, setCurrent] = useState<Locale>(locale);

  useEffect(() => {
    const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${LOCALE_COOKIE}=`));
    if (cookie?.split("=")[1] === "fr") setCurrent("fr");
    document.documentElement.lang = current;
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";
  }, [current]);

  function toggleLocale() {
    const next: Locale = current === "ar" ? "fr" : DEFAULT_LOCALE;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setCurrent(next);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={current === "ar" ? "Changer la langue en français" : "تغيير اللغة إلى العربية"}
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-brand-400 hover:text-brand-800"
    >
      <span aria-hidden>文</span>
      {current === "ar" ? "Français" : "العربية"}
    </button>
  );
}