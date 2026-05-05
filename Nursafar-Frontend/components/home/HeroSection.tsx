"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Play, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

import { StatsSection } from "./StatsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FeaturedToursSection } from "../sections/FeaturedToursSection";

const words = ["Umrah", "Pilgrimage", "Journey", "Experience"];

export function HeroSection({ locale }: { locale: string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [city, setCity] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky Background Layer - Stays fixed while sections 1-4 scroll over it */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        {/* Background - Live Kaaba Stream */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src="https://www.youtube.com/embed/bNY8a2BB5Gc?autoplay=1&mute=1&controls=0&loop=1&playlist=bNY8a2BB5Gc&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&playsinline=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{
              width: "100vw",
              height: "56.25vw", /* 16:9 aspect ratio */
              minHeight: "100vh",
              minWidth: "177.77vh", /* 16:9 aspect ratio */
              border: "none",
            }}
          ></iframe>
        </div>
        {/* Enhanced Dark Overlays for better contrast */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <div className="absolute inset-0 hero-grid opacity-20" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-amber-500/15 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />
      </div>

      {/* Scrollable Content Layer - This scrolls OVER the sticky video */}
      <div className="relative z-10 -mt-[100vh]">
        {/* Section 1: Main Hero Content */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white pt-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 glass-dark px-5 py-2 text-sm mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              Trusted by 10,000+ pilgrims worldwide
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight"
            >
              Your Sacred{" "}
              <span className="relative inline-block">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-gradient-gold"
                >
                  {words[wordIndex]}
                </motion.span>
              </span>
              <br />
              <span className="text-white">Starts Here</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Book premium Umrah packages, fund your parents' pilgrimage,
              and arrange seamless transit — all in one beautiful platform.
            </motion.p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Button
                size="xl"
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-white shadow-2xl shadow-amber-500/30 border-0 group"
              >
                <Link href={`/${locale}/tours`}>
                  Explore Tours
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur"
              >
                <Link href={`/${locale}/crowdfund`}>
                  <Users className="h-5 w-5" />
                  Parents' Umrah Fund
                </Link>
              </Button>
            </div>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 p-2 rounded-2xl glass-dark border border-white/20 shadow-2xl">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl">
                  <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search departure city (Dushanbe, Khujand...)"
                    className="bg-transparent text-white placeholder-white/50 outline-none w-full text-sm"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <Button
                  asChild
                  className="bg-amber-500 hover:bg-amber-600 text-white shrink-0 rounded-xl px-6 shadow-lg"
                >
                  <Link href={city ? `/${locale}/tours?city=${encodeURIComponent(city)}` : `/${locale}/tours`}>
                    Search
                  </Link>
                </Button>
              </div>
              <p className="text-white/40 text-xs mt-2">
                Popular: Dushanbe • Khujand • Kulob • Bokhtar
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Stats */}
        <StatsSection transparent />

        {/* Section 3: Featured Tours */}
        <FeaturedToursSection locale={locale} transparent />

        {/* Section 4: How It Works */}
        <HowItWorksSection locale={locale} transparent />
      </div>
    </div>
  );
}
