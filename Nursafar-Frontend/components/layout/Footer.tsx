"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, ArrowUpRight, Heart, Globe, Link2, MessageCircle,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export function Footer() {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const links = {
    services: [
      { label: "Umrah Tours", href: `/${locale}/tours` },
      { label: "Parents' Umrah Fund", href: `/${locale}/crowdfund` },
      { label: "Border Transit", href: `/${locale}/logistics` },
      { label: "Partner Portal", href: `/${locale}/partner` },
    ],
    company: [
      { label: "About NurSafar", href: "#" },
      { label: "How It Works", href: "#" },
      { label: "Verified Partners", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
    support: [
      { label: "FAQ", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
  };

  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative orb */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <motion.div {...fadeInUp} className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-block mb-5">
              {mounted ? (
                <Image
                  src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
                  alt="NurSafar"
                  width={160}
                  height={45}
                  className="h-11 w-auto object-contain"
                />
              ) : (
                <div className="h-11 w-40 bg-muted rounded" />
              )}
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Your complete digital companion for the sacred Umrah pilgrimage. Book tours, fund campaigns, and arrange transit — all in one place.
            </p>
            {/* Contact */}
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5 hover:text-foreground transition-colors cursor-pointer">
                <div className="flex h-7 w-7 rounded-lg bg-primary/10 items-center justify-center shrink-0">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                +992 000 000 000
              </div>
              <div className="flex items-center gap-2.5 hover:text-foreground transition-colors cursor-pointer">
                <div className="flex h-7 w-7 rounded-lg bg-primary/10 items-center justify-center shrink-0">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                info@nursafar.tj
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 rounded-lg bg-primary/10 items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                Dushanbe, Tajikistan
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { Icon: MessageCircle, href: "#", label: "WhatsApp" },
                { Icon: Send, href: "#", label: "Telegram" },
                { Icon: Globe, href: "#", label: "Website" },
                { Icon: Mail, href: "#", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                  className="flex h-9 w-9 rounded-xl bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary items-center justify-center transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              Services
            </h4>
            <ul className="space-y-2.5">
              {links.services.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 group transition-colors"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.15 }}>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5">
              {links.company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 group transition-colors"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2.5">
              {links.support.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 group transition-colors"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            © 2026 NurSafar. Made with{" "}
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            {" "}for pilgrims of Tajikistan.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
