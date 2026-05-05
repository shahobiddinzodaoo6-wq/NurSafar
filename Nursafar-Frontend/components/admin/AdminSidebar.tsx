"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LayoutDashboard, Users, DollarSign, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/authSlice";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const t = useTranslations("admin");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const navItems = [
    { href: `/${locale}/admin`, label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { href: `/${locale}/admin/partners`, label: t("partners"), icon: ShieldCheck },
    { href: `/${locale}/admin/financials`, label: t("financials"), icon: DollarSign },
    { href: `/${locale}/admin/users`, label: t("users"), icon: Users },
  ];

  function handleLogout() {
    dispatch(logout());
    router.push(`/${locale}/login`);
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          NS
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">NurSafar</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href || pathname === href + "/"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {tNav("logout")}
        </button>
      </div>
    </aside>
  );
}
