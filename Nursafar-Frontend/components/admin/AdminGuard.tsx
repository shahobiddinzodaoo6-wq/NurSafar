"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/lib/store/hooks";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
    } else if (user && user.role !== "ADMIN") {
      router.replace(`/${locale}`);
    }
  }, [mounted, isAuthenticated, user, locale, router]);

  if (!mounted || !isAuthenticated || !user || user.role !== "ADMIN") return null;

  return <>{children}</>;
}
