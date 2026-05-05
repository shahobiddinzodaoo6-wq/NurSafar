"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LayoutDashboard, Car, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/store/authSlice";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

function DriverHeader() {
  const t = useTranslations("partner");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow">
          NS
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">{user?.name}</p>
          <p className="text-[11px] text-muted-foreground">{t("driver_portal")}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <LanguageSwitcher />
        <ThemeToggle />
        <button
          onClick={() => { dispatch(logout()); router.push(`/${locale}/login`); }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function DriverBottomNav() {
  const t = useTranslations("partner");
  const locale = useLocale();
  const pathname = usePathname();

  const items = [
    { href: `/${locale}/partner`, label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { href: `/${locale}/partner/rides`, label: t("rides"), icon: Car },
  ];

  return (
    <nav className="border-t bg-card shrink-0 safe-area-bottom">
      <div className="flex">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href || pathname === href + "/"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                isActive ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-6 w-6" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <DriverHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-md px-4 py-6">{children}</div>
      </main>
      <DriverBottomNav />
    </div>
  );
}
