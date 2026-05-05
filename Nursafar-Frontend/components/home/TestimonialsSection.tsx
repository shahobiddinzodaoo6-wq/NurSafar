"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Murod Rahimov",
    role: "Pilgrim from Dushanbe",
    text: "NurSafar made our Umrah trip absolutely seamless. The 5-star hotel was right next to the Haram and the Tajik guide was incredibly helpful. Highly recommended!",
    rating: 5,
    avatar: "MR",
    color: "from-blue-500 to-primary",
  },
  {
    name: "Shahnoza Karimova",
    role: "Pilgrim from Khujand",
    text: "I used the Parents' Umrah Fund feature to send my parents on their dream journey. Within 2 weeks we collected the full amount from our family. Such a beautiful platform!",
    rating: 5,
    avatar: "SK",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Bahrom Tursunov",
    role: "Pilgrim from Kulob",
    text: "The border transit service was a lifesaver. Door-to-door from Kulob to the airport, everything was on time and the driver was professional. Will use again!",
    rating: 5,
    avatar: "BT",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Dilnoza Nazarova",
    role: "Pilgrim from Bokhtar",
    text: "Booked the Economy package and was amazed by the quality. The hotel was clean, the food was halal, and the tour guide knew everything about the holy sites.",
    rating: 5,
    avatar: "DN",
    color: "from-purple-500 to-pink-500",
  },
];

const marqueeItems = [...testimonials, ...testimonials];

export function TestimonialsSection() {
  return (
    <section className="py-24 overflow-hidden bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Pilgrims <span className="text-gradient">Say About Us</span>
          </h2>
          <div className="section-divider mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Real stories from real pilgrims</p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee w-max">
          {marqueeItems.map((t, i) => (
            <div
              key={i}
              className="w-80 shrink-0 rounded-2xl bg-card border p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
                <Quote className="h-5 w-5 text-primary/30 shrink-0" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{t.text}</p>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
