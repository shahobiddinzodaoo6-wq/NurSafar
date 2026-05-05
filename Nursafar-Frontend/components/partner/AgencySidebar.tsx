"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LayoutDashboard, Map, PlusCircle, Users, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/store/authSlice";

export default function AgencySidebar() {
  const t = useTranslations("partner");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const navItems = [
    { href: `/${locale}/partner`, label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { href: `/${locale}/partner/tours`, label: t("my_tours"), icon: Map, exact: true },
    { href: `/${locale}/partner/tours/new`, label: t("add_tour"), icon: PlusCircle, exact: true },
    { href: `/${locale}/partner/clients`, label: t("clients"), icon: Users, exact: true },
  ];

  function handleLogout() {
    dispatch(logout());
    router.push(`/${locale}/login`);
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow">
          NS
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">NurSafar</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{t("agency_portal")}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }, i) => {
          const isActive = exact
            ? pathname === href || pathname === href + "/"
            : pathname.startsWith(href);
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t p-3 space-y-1">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold truncate">{user?.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {tNav("logout")}
        </button>
      </div>
    </aside>
  );
}
