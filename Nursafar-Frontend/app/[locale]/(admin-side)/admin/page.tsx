"use client";

import { useTranslations } from "next-intl";
import { DollarSign, Map, Clock, Users } from "lucide-react";
import { useGetAdminStatsQuery } from "@/lib/api/adminApi";
import dynamic from "next/dynamic";

const RevenueChart = dynamic(() => import("@/components/admin/RevenueChart"), { ssr: false });

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 flex items-start gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("overview")}</p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">{tCommon("loading")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("total_revenue")}
            value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
            icon={DollarSign}
            color="bg-emerald-500"
          />
          <StatCard
            title={t("active_tours")}
            value={stats?.activeTours ?? 0}
            icon={Map}
            color="bg-blue-500"
          />
          <StatCard
            title={t("pending_approvals")}
            value={stats?.pendingApprovals ?? 0}
            icon={Clock}
            color="bg-amber-500"
          />
          <StatCard
            title={t("total_users")}
            value={stats?.totalUsers ?? 0}
            icon={Users}
            color="bg-violet-500"
          />
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold mb-4">{t("revenue_chart")}</h2>
        <RevenueChart />
      </div>
    </div>
  );
}
