"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Car, CheckCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import IslamicStatCard from "./IslamicStatCard";
import { useGetMyTripsQuery } from "@/lib/api/driverApi";

export default function DriverDashboard() {
  const t = useTranslations("partner");
  const locale = useLocale();
  const { data: trips, isLoading } = useGetMyTripsQuery();

  const today = new Date().toDateString();
  const todayTrips = trips?.filter((trip) => new Date(trip.pickupTime).toDateString() === today) ?? [];
  const completedTrips = trips?.filter((trip) => trip.status === "COMPLETED") ?? [];
  const pendingTrips = trips?.filter((trip) => trip.status !== "COMPLETED") ?? [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <IslamicStatCard
            title={t("today_trips")}
            value={todayTrips.length}
            icon={<Car className="h-5 w-5 text-white" />}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            delay={0}
          />
          <IslamicStatCard
            title={t("completed_trips")}
            value={completedTrips.length}
            icon={<CheckCircle className="h-5 w-5 text-white" />}
            gradient="bg-gradient-to-br from-teal-500 to-teal-700"
            delay={0.1}
          />
        </div>
      )}

      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">{t("today_trips")}</h2>
          <Link href={`/${locale}/partner/rides`} className="text-sm text-blue-600 flex items-center gap-1">
            All rides <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border bg-card p-4 text-center text-sm text-muted-foreground animate-pulse h-24" />
        ) : todayTrips.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">No trips scheduled today</p>
            <p className="text-xs text-muted-foreground mt-1">{t("no_trips")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTrips.slice(0, 2).map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-2xl border bg-card p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold">{trip.booking.user.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    trip.status === "COMPLETED"
                      ? "bg-green-500/10 text-green-600"
                      : trip.status === "IN_PROGRESS"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {trip.status === "PENDING" ? t("status_pending")
                      : trip.status === "IN_PROGRESS" ? t("status_in_progress")
                      : t("status_completed")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{trip.pickupAddress}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("pickup_at")} {new Date(trip.pickupTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upcoming count */}
      {pendingTrips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border bg-blue-500/5 border-blue-500/20 p-4 text-center"
        >
          <p className="text-sm font-medium text-blue-600">{pendingTrips.length} upcoming {pendingTrips.length === 1 ? "trip" : "trips"}</p>
          <Link href={`/${locale}/partner/rides`} className="text-xs text-blue-500 mt-1 inline-block hover:underline">
            View all rides →
          </Link>
        </motion.div>
      )}
    </div>
  );
}
