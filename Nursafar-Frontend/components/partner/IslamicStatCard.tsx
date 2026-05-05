"use client";

import { motion } from "framer-motion";

interface IslamicStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

// Lightweight inline SVG arabesque pattern
function ArabesquePattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="islamic-star" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          {/* 8-pointed star (Rub el Hizb) */}
          <polygon
            points="20,2 23,14 35,8 28,18 38,23 26,24 30,36 20,28 10,36 14,24 2,23 12,18 5,8 17,14"
            fill="white"
          />
          <circle cx="20" cy="20" r="4" fill="none" stroke="white" strokeWidth="0.8" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="0.4" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="0.4" />
          <line x1="0" y1="0" x2="40" y2="40" stroke="white" strokeWidth="0.3" />
          <line x1="40" y1="0" x2="0" y2="40" stroke="white" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#islamic-star)" />
    </svg>
  );
}

export default function IslamicStatCard({ title, value, icon, gradient, delay = 0 }: IslamicStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}
    >
      <ArabesquePattern />
      {/* Glassy bottom reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/75 mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
