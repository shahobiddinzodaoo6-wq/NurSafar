"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Clock, HeadphonesIcon, Award, Users, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Verified",
    desc: "All tour agencies and drivers are rigorously verified and certified.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Our multilingual support team is available around the clock.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: HeadphonesIcon,
    title: "Tajik-Speaking Guides",
    desc: "Native Tajik guides accompany you throughout the entire journey.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    desc: "We match or beat any comparable offer on the market.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Users,
    title: "Community Powered",
    desc: "Join 10,000+ pilgrims who've trusted NurSafar for their Umrah.",
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: Globe,
    title: "3 Languages",
    desc: "Full support in Tajik, Russian, and English.",
    color: "bg-cyan-500/10 text-cyan-500",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=900&q=80"
                alt="Masjid al-Haram"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 glass rounded-2xl p-5 shadow-2xl max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {["🧔", "👩", "🧕"].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm border-2 border-background">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-xs text-muted-foreground">Happy Pilgrims</div>
              <div className="flex items-center gap-0.5 mt-1">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} className="text-amber-400 text-xs">{s}</span>
                ))}
              </div>
            </motion.div>

            {/* Second floating card */}
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-5 -left-5 glass rounded-2xl p-4 shadow-2xl"
            >
              <div className="text-2xl font-bold text-amber-500">$2M+</div>
              <div className="text-xs text-muted-foreground">Crowdfunds Raised</div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Why NurSafar
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Everything You Need for a{" "}
              <span className="text-gradient">Perfect Umrah</span>
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              We built NurSafar to solve every challenge Tajik pilgrims face — from finding the right package to getting safely to the airport.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 group"
                >
                  <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">{title}</div>
                    <div className="text-muted-foreground text-xs leading-relaxed">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
