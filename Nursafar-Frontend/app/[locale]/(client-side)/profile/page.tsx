"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/authSlice";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  CLIENT: "Pilgrim",
  PARTNER: "Travel Partner",
  DRIVER: "Driver",
};

export default function ProfilePage() {
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, locale, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-card shadow-sm p-8"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Shield className="h-3 w-3" />
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </div>

          {/* Info rows */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</p>
                <p className="text-sm font-medium text-foreground">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
