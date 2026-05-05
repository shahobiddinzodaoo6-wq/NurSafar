"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/lib/store/hooks";

export default function PartnerGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
    } else if (user && !["PARTNER", "DRIVER", "ADMIN"].includes(user.role)) {
      router.replace(`/${locale}`);
    }
  }, [isAuthenticated, user, locale, router]);

  if (!isAuthenticated || !user) return null;
  if (!["PARTNER", "DRIVER", "ADMIN"].includes(user.role)) return null;

  return <>{children}</>;
}
