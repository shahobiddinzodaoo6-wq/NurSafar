"use client";

import { useAppSelector } from "@/lib/store/hooks";
import AgencyDashboard from "@/components/partner/AgencyDashboard";
import DriverDashboard from "@/components/partner/DriverDashboard";

export default function PartnerPage() {
  const user = useAppSelector((s) => s.auth.user);
  return user?.role === "DRIVER" ? <DriverDashboard /> : <AgencyDashboard />;
}
