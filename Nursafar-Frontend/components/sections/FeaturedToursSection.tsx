"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGetToursQuery } from "@/lib/api/toursApi";
import { TourCard } from "@/components/tours/TourCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedToursSection({ locale, transparent = false }: { locale: string; transparent?: boolean }) {
  const { data: tours, isLoading } = useGetToursQuery();
  const locale_ = locale;

  return (
    <section className={`py-24 relative overflow-hidden ${transparent ? "bg-black/20 backdrop-blur-sm" : ""}`}>
      {/* Subtle background */}
      {!transparent && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-2">
              Top Packages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              Featured <span className="text-gradient">Umrah Tours</span>
            </h2>
            <div className="section-divider" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" asChild className="group">
              <Link href={`/${locale}/tours`}>
                View All Tours
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Loading tours...</p>
            </div>
          </div>
        ) : !tours?.length ? (
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-6xl mb-4">🕌</div>
            <p>No tours available yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tours.slice(0, 6).map((tour) => (
              <motion.div key={tour.id} variants={item}>
                <TourCard tour={tour} locale={locale} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
