"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import logoDark from "../../public/logo-dark.png"
import logoLight from "../../public/logo-light.png"
import {
  LogOut, User, Menu, X, Package, Users, MapPin, ChevronDown,
} from "lucide-react";

const navLinks = [
  { key: "tours", href: "/tours", icon: Package },
  { key: "crowdfund", href: "/crowdfund", icon: Users },
];

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}`);
  };

  const isActive = (href: string) => pathname.includes(href);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/60"
            : "bg-transparent"
          }`}
      >
        <div className="container mx-auto flex h-18 items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
            {mounted ? (
              <Image
                src={resolvedTheme === 'dark' ? logoDark : logoLight}
                alt="NurSafar"
                className="h-10 w-auto object-contain w-[200px] h-[60px]"
                priority
              />
            ) : (
              <div className="h-10 w-36 rounded" />
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, href, icon: Icon }) => (
              <Link
                key={key}
                href={`/${locale}${href}`}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group ${isActive(href)
                    ? "text-primary bg-primary/10"
                    : scrolled
                      ? "text-foreground/80 hover:text-foreground hover:bg-accent"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {t(key as any)}
                {isActive(href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher scrolled={scrolled} />
            <ThemeToggle scrolled={scrolled} />

            {!mounted ? (
              <div className="ml-1 h-9 w-[120px]" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={!scrolled ? "text-white hover:bg-white/10" : ""}
                >
                  <Link href={`/${locale}/profile`}>
                    <div className="flex h-7 w-7 rounded-full bg-primary items-center justify-center text-primary-foreground text-xs font-bold mr-1">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    {user?.name?.split(" ")[0]}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className={`h-9 w-9 ${!scrolled ? "text-white hover:bg-white/10" : ""}`}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={!scrolled ? "text-white hover:bg-white/10" : ""}
                >
                  <Link href={`/${locale}/login`}>{t("login")}</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/30"
                >
                  <Link href={`/${locale}/register`}>{t("register")}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle scrolled={scrolled} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg transition-colors ${!scrolled ? "text-white hover:bg-white/10" : "hover:bg-accent"
                }`}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b shadow-xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map(({ key, href, icon: Icon }) => (
                <Link
                  key={key}
                  href={`/${locale}${href}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {t(key as any)}
                </Link>
              ))}
              <div className="border-t my-2" />
              <LanguageSwitcher scrolled={true} />
              <div className="flex gap-2 pt-1">
                {!mounted ? (
                  <div className="h-9 flex-1" />
                ) : isAuthenticated ? (
                  <Button variant="outline" className="flex-1" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> {t("logout")}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/${locale}/login`}>{t("login")}</Link>
                    </Button>
                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" asChild>
                      <Link href={`/${locale}/register`}>{t("register")}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
