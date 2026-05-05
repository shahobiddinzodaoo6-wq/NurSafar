"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Map, Users, DollarSign, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import IslamicStatCard from "./IslamicStatCard";
import { useGetPartnerStatsQuery, useGetPartnerToursQuery } from "@/lib/api/partnerApi";
import { useAppSelector } from "@/lib/store/hooks";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function AgencyDashboard() {
  const t = useTranslations("partner");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const user = useAppSelector((s) => s.auth.user);
  const { data: stats, isLoading: statsLoading } = useGetPartnerStatsQuery();
  const { data: tours } = useGetPartnerToursQuery();

  return (
    <div className="max-w-5xl space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold">
          Assalamu Alaikum, {user?.name} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t("agency_portal")} — {t("dashboard")}</p>
      </motion.div>

      {/* Stat Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <IslamicStatCard
            title={t("active_tours")}
            value={stats?.activeTours ?? 0}
            icon={<Map className="h-5 w-5 text-white" />}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
            delay={0}
          />
          <IslamicStatCard
            title={t("total_clients")}
            value={stats?.totalClients ?? 0}
            icon={<Users className="h-5 w-5 text-white" />}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            delay={0.1}
          />
          <IslamicStatCard
            title={t("revenue")}
            value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5 text-white" />}
            gradient="bg-gradient-to-br from-violet-500 to-violet-700"
            delay={0.2}
          />
        </div>
      )}

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Link
            href={`/${locale}/partner/tours/new`}
            className="flex items-center gap-4 rounded-xl border bg-card p-5 hover:border-emerald-500/50 hover:shadow-md transition-all group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{t("add_tour")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Create a new Umrah package</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            href={`/${locale}/partner/clients`}
            className="flex items-center gap-4 rounded-xl border bg-card p-5 hover:border-blue-500/50 hover:shadow-md transition-all group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{t("clients")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">View pilgrim bookings</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Tours Preview */}
      {tours && tours.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent Tours</h2>
            <Link href={`/${locale}/partner/tours`} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-xl border bg-card divide-y overflow-hidden">
            {tours.slice(0, 3).map((tour) => (
              <div key={tour.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium">{tour.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tour.departureCity} · {tour.duration} days</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">${tour.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{tour._count.bookings} {t("bookings_count")}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
