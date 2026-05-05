"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Pilgrims Served", color: "text-primary" },
  { value: 200, suffix: "+", label: "Tour Packages", color: "text-amber-500" },
  { value: 50, suffix: "+", label: "Partner Agencies", color: "text-primary" },
  { value: 2, prefix: "$", suffix: "M+", label: "Crowdfunds Raised", color: "text-amber-500" },
];

function AnimatedCounter({ value, prefix = "", suffix = "", color }: { value: number; prefix?: string; suffix?: string; color: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (v) => {
      if (ref.current) {
        const display = value >= 1000 ? (v / 1000).toFixed(0) + "K" : Math.floor(v).toString();
        ref.current.textContent = prefix + display + suffix;
      }
    });
  }, [springValue, value, prefix, suffix]);

  return (
    <span ref={ref} className={`text-4xl md:text-5xl font-bold ${color}`}>
      {prefix}0{suffix}
    </span>
  );
}

export function StatsSection({ transparent = false }: { transparent?: boolean }) {
  return (
    <section className={`relative py-16 overflow-hidden ${transparent ? "bg-black/40 backdrop-blur-md border-y border-white/5" : ""}`}>
      {/* Background gradient */}
      {!transparent ? (
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-blue-600 dark:from-primary/90 dark:to-blue-700" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />
      )}
      <div className="absolute inset-0 hero-grid opacity-20" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center text-white"
            >
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} color="text-white" />
              <div className="text-sm text-white/70 mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
