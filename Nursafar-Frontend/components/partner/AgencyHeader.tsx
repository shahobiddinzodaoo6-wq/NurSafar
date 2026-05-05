"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function AgencyHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/50 backdrop-blur-sm px-6">
      <div />
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
