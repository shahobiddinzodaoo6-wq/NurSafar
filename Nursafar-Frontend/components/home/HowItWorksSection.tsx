"use client";

import { motion } from "framer-motion";
import { Search, CreditCard, Plane, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search & Compare",
    desc: "Browse hundreds of Umrah packages filtered by price, hotel stars, and distance to Haram.",
    color: "from-blue-500 to-primary",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Book Securely",
    desc: "Reserve your spot with a simple, secure booking process. No hidden fees, ever.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Plane,
    step: "03",
    title: "Prepare & Travel",
    desc: "Receive all documents, visa assistance, and transit arrangements from us.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Star,
    step: "04",
    title: "Complete Your Journey",
    desc: "Perform Umrah with peace of mind knowing every detail is taken care of.",
    color: "from-purple-500 to-pink-500",
  },
];

export function HowItWorksSection({ locale, transparent = false }: { locale: string; transparent?: boolean }) {
  return (
    <section className={`py-24 relative overflow-hidden ${transparent ? "bg-black/20 backdrop-blur-sm" : ""}`}>
      {!transparent && <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-background" />}

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <div className="section-divider mx-auto mb-4" />
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your Umrah journey in 4 simple steps
          </p>
        </motion.div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 via-green-500 to-purple-500 opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, step, title, desc, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl`}
                  >
                    <Icon className="h-9 w-9 text-white" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {step}
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
