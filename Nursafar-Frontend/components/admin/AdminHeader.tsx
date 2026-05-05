"use client";

import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/store/hooks";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { User } from "lucide-react";

export default function AdminHeader() {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="text-sm">
            <p className="font-medium leading-none">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
