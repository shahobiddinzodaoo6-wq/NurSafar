"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import PartnerGuard from "./PartnerGuard";
import AgencySidebar from "./AgencySidebar";
import AgencyHeader from "./AgencyHeader";
import DriverLayout from "./DriverLayout";

export default function PartnerShell({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing until client has mounted — prevents server/client
  // Redux auth-state mismatch (server has no localStorage, client does).
  if (!mounted) return null;

  return (
    <PartnerGuard>
      {user?.role === "DRIVER" ? (
        <DriverLayout>{children}</DriverLayout>
      ) : (
        <div className="flex h-screen overflow-hidden bg-background">
          <AgencySidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AgencyHeader />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      )}
    </PartnerGuard>
  );
}
