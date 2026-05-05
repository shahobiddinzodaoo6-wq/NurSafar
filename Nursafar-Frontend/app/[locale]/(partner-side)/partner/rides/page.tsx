"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Car, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
import { useGetMyTripsQuery, useUpdateTripStatusMutation, type DriverTrip, type LogisticsStatus } from "@/lib/api/driverApi";

function StatusBadge({ status }: { status: LogisticsStatus }) {
  const t = useTranslations("partner");
  const map: Record<LogisticsStatus, { label: string; className: string }> = {
    PENDING: { label: t("status_pending"), className: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    IN_PROGRESS: { label: t("status_in_progress"), className: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    COMPLETED: { label: t("status_completed"), className: "bg-green-500/15 text-green-600 border-green-500/30" },
  };
  const { label, className } = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${className}`}>
      {label}
    </span>
  );
}

function TripCard({ trip, onUpdateStatus }: { trip: DriverTrip; onUpdateStatus: (id: string, status: LogisticsStatus) => void }) {
  const t = useTranslations("partner");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);

  async function handleStatus(status: LogisticsStatus) {
    setLoading(true);
    try {
      await onUpdateStatus(trip.id, status);
    } finally {
      setLoading(false);
    }
  }

  const pickupDate = new Date(trip.pickupTime);
  const isToday = pickupDate.toDateString() === new Date().toDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`rounded-2xl border-2 bg-card overflow-hidden ${
        trip.status === "COMPLETED" ? "border-border opacity-75" : "border-border"
      }`}
    >
      {/* Top bar with status */}
      <div className={`flex items-center justify-between px-5 py-3 ${
        trip.status === "IN_PROGRESS"
          ? "bg-blue-500 text-white"
          : trip.status === "COMPLETED"
          ? "bg-green-500/10"
          : isToday
          ? "bg-amber-500/10"
          : "bg-muted/30"
      }`}>
        <div className="flex items-center gap-2">
          <Car className={`h-4 w-4 ${trip.status === "IN_PROGRESS" ? "text-white" : "text-muted-foreground"}`} />
          <span className={`text-sm font-semibold ${trip.status === "IN_PROGRESS" ? "text-white" : ""}`}>
            {trip.booking.tour.title}
          </span>
          {isToday && trip.status !== "COMPLETED" && (
            <span className="text-xs bg-amber-500 text-white rounded-full px-2 py-0.5 font-medium">TODAY</span>
          )}
        </div>
        <StatusBadge status={trip.status} />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Passenger info */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="text-lg font-bold">{trip.booking.user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-xl font-bold leading-tight">{trip.booking.user.name}</p>
            <a
              href={`tel:${trip.booking.user.phone}`}
              className="flex items-center gap-1.5 text-blue-600 font-semibold text-base mt-1 hover:underline"
            >
              <Phone className="h-4 w-4" />
              {trip.booking.user.phone}
            </a>
          </div>
        </div>

        {/* Pickup details */}
        <div className="rounded-xl bg-muted/50 p-4 space-y-2">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t("pickup_address")}</p>
              <p className="font-semibold text-base mt-0.5">{trip.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t("pickup_at")}</p>
              <p className="font-semibold text-base mt-0.5">
                {pickupDate.toLocaleDateString()} {pickupDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons — large, easy to tap */}
        {trip.status === "PENDING" && (
          <button
            onClick={() => handleStatus("IN_PROGRESS")}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-sm active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {loading ? tCommon("loading") : `🚗 ${t("btn_in_progress")}`}
          </button>
        )}
        {trip.status === "IN_PROGRESS" && (
          <button
            onClick={() => handleStatus("COMPLETED")}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-sm active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {loading ? tCommon("loading") : `✅ ${t("btn_completed")}`}
          </button>
        )}
        {trip.status === "COMPLETED" && (
          <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold">
            <CheckCircle2 className="h-5 w-5" />
            {t("status_completed")}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RidesPage() {
  const t = useTranslations("partner");
  const tCommon = useTranslations("common");
  const { data: trips, isLoading } = useGetMyTripsQuery();
  const [updateStatus] = useUpdateTripStatusMutation();

  async function handleUpdateStatus(id: string, status: LogisticsStatus) {
    await updateStatus({ id, status }).unwrap();
  }

  const active = trips?.filter((t) => t.status !== "COMPLETED") ?? [];
  const done = trips?.filter((t) => t.status === "COMPLETED") ?? [];

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">{t("rides")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {active.length} active · {done.length} completed
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : !trips || trips.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border-2 border-dashed p-16 text-center"
        >
          <Car className="h-14 w-14 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-semibold">{t("no_trips")}</p>
          <p className="text-sm text-muted-foreground mt-1">Your assigned rides will appear here</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {/* Active first */}
            {active.map((trip) => (
              <TripCard key={trip.id} trip={trip} onUpdateStatus={handleUpdateStatus} />
            ))}
            {/* Completed */}
            {done.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Completed ({done.length})
                </p>
                {done.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
