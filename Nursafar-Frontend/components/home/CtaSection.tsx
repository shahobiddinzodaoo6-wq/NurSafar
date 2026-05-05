"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1623073284804-d042d3a47c02?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-blue-700/90" />
      <div className="absolute inset-0 hero-grid opacity-20" />

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/10"
            style={{
              width: `${i * 200}px`,
              height: `${i * 200}px`,
              animation: `spin-slow ${15 + i * 5}s linear infinite ${i % 2 === 0 ? "reverse" : ""}`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm mb-6">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Start Your Journey Today
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Ready to Begin Your
            <br />
            <span className="text-amber-400">Sacred Journey?</span>
          </h2>

          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of Tajik pilgrims who've trusted NurSafar for their Umrah. Book today and get exclusive early-bird pricing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="xl"
                asChild
                className="bg-amber-500 hover:bg-amber-400 text-white shadow-2xl shadow-black/30 border-0 group"
              >
                <Link href={`/${locale}/tours`}>
                  Browse All Tours
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="xl"
                variant="outline"
                asChild
                className="border-white/40 text-white hover:bg-white/15 bg-transparent"
              >
                <Link href={`/${locale}/register`}>Create Free Account</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
