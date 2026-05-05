"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const locales = [
  { code: "tj", label: "TJ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

interface LanguageSwitcherProps {
  scrolled?: boolean;
}

export function LanguageSwitcher({ scrolled = true }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg p-0.5 bg-black/10 dark:bg-white/10">
      {locales.map(({ code, label }) => (
        <motion.button
          key={code}
          whileTap={{ scale: 0.92 }}
          onClick={() => switchLocale(code)}
          className={`relative px-2.5 py-1 text-xs font-semibold rounded-md transition-colors z-10 ${
            locale === code
              ? "text-white"
              : !scrolled
              ? "text-white/70 hover:text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {locale === code && (
            <motion.div
              layoutId="lang-pill"
              className="absolute inset-0 bg-primary rounded-md"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          {label}
        </motion.button>
      ))}
    </div>
  );
}
