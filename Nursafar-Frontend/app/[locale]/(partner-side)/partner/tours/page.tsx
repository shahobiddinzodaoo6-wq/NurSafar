"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PlusCircle, Map, Trash2, ToggleLeft, ToggleRight, Star } from "lucide-react";
import { useGetPartnerToursQuery, useDeletePartnerTourMutation, useUpdatePartnerTourMutation } from "@/lib/api/partnerApi";
import { useToast } from "@/lib/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

function Toast({ message, variant }: { message: string; variant: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-xl ${
        variant === "success" ? "bg-emerald-600 text-white" : "bg-destructive text-destructive-foreground"
      }`}
    >
      {message}
    </motion.div>
  );
}

export default function ToursPage() {
  const t = useTranslations("partner");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data: tours, isLoading } = useGetPartnerToursQuery();
  const [deleteTour] = useDeletePartnerTourMutation();
  const [updateTour] = useUpdatePartnerTourMutation();
  const { toasts, toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setProcessingId(id);
    try {
      await deleteTour(id).unwrap();
      toast(t("tour_deleted"), "success");
    } catch {
      toast(tCommon("error"), "error");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    setProcessingId(id);
    try {
      await updateTour({ id, body: { isAvailable: !current } }).unwrap();
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("my_tours")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tours?.length ?? 0} tours</p>
        </div>
        <Link
          href={`/${locale}/partner/tours/new`}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          {t("add_tour")}
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : !tours || tours.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border-2 border-dashed p-16 text-center"
        >
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">{t("no_tours")}</p>
          <Link
            href={`/${locale}/partner/tours/new`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            {t("add_tour")}
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid gap-3">
            {tours.map((tour, i) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="rounded-2xl border bg-card overflow-hidden"
              >
                <div className="flex gap-4">
                  {/* Image stripe */}
                  {tour.imageUrl && (
                    <div
                      className="w-24 shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${tour.imageUrl})` }}
                    />
                  )}
                  {!tour.imageUrl && (
                    <div className="w-24 shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                      <Map className="h-8 w-8 text-white/60" />
                    </div>
                  )}

                  <div className="flex-1 py-4 pr-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{tour.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tour.departureCity} · {tour.duration} days ·{" "}
                          {Array.from({ length: tour.hotelStars }).map((_, j) => (
                            <Star key={j} className="inline h-3 w-3 text-amber-400 fill-amber-400" />
                          ))}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-emerald-600">${tour.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{tour._count.bookings} {t("bookings_count")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={tour.isAvailable ? "success" : "secondary"}>
                        {tour.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                      <button
                        onClick={() => handleToggle(tour.id, tour.isAvailable)}
                        disabled={processingId === tour.id}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        title={t("toggle_available")}
                      >
                        {tour.isAvailable
                          ? <ToggleRight className="h-4 w-4 text-emerald-500" />
                          : <ToggleLeft className="h-4 w-4" />}
                        Toggle
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => handleDelete(tour.id, tour.title)}
                        disabled={processingId === tour.id}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {tCommon("delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} variant={t.variant as "success" | "error"} />
        ))}
      </AnimatePresence>
    </div>
  );
}
