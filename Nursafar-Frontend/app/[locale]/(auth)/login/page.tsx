"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginMutation } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/store/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { useTheme } from "next-themes";
import {
  Eye, EyeOff, Loader2, Lock, Mail, ArrowRight, CheckSquare, Square,
} from "lucide-react";

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
  "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=60&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&q=80",
];

const PARTNERS = ["Qatar Airways", "Saudia", "flydubai", "Fly Emirates", "Mahan Air"];

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();
  const [login, { isLoading }] = useLoginMutation();
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login(form).unwrap();
      dispatch(setCredentials(result));
      if (result.user.role === "ADMIN") router.push(`/${locale}/admin`);
      else if (result.user.role === "PARTNER" || result.user.role === "DRIVER") router.push(`/${locale}/partner`);
      else router.push(`/${locale}`);
    } catch (err: any) {
      const msg = err?.data?.message;
      if (Array.isArray(msg)) setError(msg[0]);
      else if (msg) setError(msg);
      else if (err?.status === "FETCH_ERROR") setError("Cannot reach server. Make sure the backend is running on port 3001.");
      else setError(`Login failed (${err?.status ?? "unknown error"})`);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white dark:bg-[#0d1117]">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[58%] relative flex-col overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1400&q=90')`,
          }}
        />
        {/* Dark green overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2818]/85 via-[#0d2818]/60 to-[#1a4a30]/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Top logo text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/logo-dark.png"
              alt="NurSafar"
              width={150}
              height={42}
              className="h-10 w-auto"
              priority
            />
          </motion.div>

        {/* Center headline */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              Your Spiritual Journey,{" "}
              <span className="text-amber-400">Perfected</span>{" "}
              by Technology.
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-md">
              Experience a seamless Umrah pilgrimage with our elite travel sanctuary. We guide you through every step with precision and serenity.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-8"
          >
            {["Verified Agencies", "Tajik Guides", "24/7 Support", "Best Prices"].map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom — social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((src, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0d2818] overflow-hidden">
                  <Image src={src} alt="pilgrim" width={36} height={36} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <div className="text-white/80 text-sm">
              Joined by <span className="text-amber-400 font-semibold">50,000+</span> pilgrims this season
            </div>
          </div>

          {/* Partner logos marquee */}
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-marquee w-max opacity-40">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <span key={i} className="text-white text-sm font-medium tracking-wide whitespace-nowrap">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>

      {/* ── RIGHT PANEL ── */ }
  <div className="w-full lg:w-[42%] flex flex-col justify-center relative min-h-screen">
    {/* Hexagonal pattern background */}
    <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v31l26 15z' fill='%23000'/%3E%3C/svg%3E")`,
        backgroundSize: "56px 100px",
      }}
    />

    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative z-10 w-full max-w-md mx-auto px-8 py-12"
    >
      {/* Logo */}
      <div className="mb-9">
        {mounted ? (
          <Image
            src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
            alt="NurSafar"
            width={150}
            height={42}
            className="h-10 w-auto object-contain"
            priority
          />
        ) : (
          <div className="h-10 w-36 rounded bg-muted animate-pulse" />
        )}
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Welcome back to NurSafar
        </h2>
        <p className="text-muted-foreground text-sm">
          Please enter your details to access your pilgrimage portal.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Email or Phone Number
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1a4a30] dark:focus:ring-amber-500/50 focus:border-transparent transition-all"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Password
            </label>
            <button type="button" className="text-xs text-[#1a6b3c] dark:text-amber-400 hover:underline font-medium">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full h-12 pl-10 pr-12 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1a4a30] dark:focus:ring-amber-500/50 focus:border-transparent transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <button
          type="button"
          onClick={() => setRemember(!remember)}
          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${remember ? "bg-[#1a4a30] border-[#1a4a30] dark:bg-amber-500 dark:border-amber-500" : "border-border"}`}>
            {remember && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          Keep me signed in for 30 days
        </button>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 px-4 py-3 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.98 }}
          className="w-full h-13 rounded-xl bg-[#1a3a28] hover:bg-[#143020] dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-lg shadow-[#1a3a28]/30 dark:shadow-amber-500/30"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Sign In to Sanctuary
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="h-11 rounded-xl border border-border bg-background hover:bg-accent flex items-center justify-center gap-2.5 text-sm font-medium text-foreground transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="h-11 rounded-xl border border-border bg-background hover:bg-accent flex items-center justify-center gap-2.5 text-sm font-medium text-foreground transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple ID
          </motion.button>
        </div>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-sm text-center text-muted-foreground">
        New to NurSafar?{" "}
        <Link
          href={`/${locale}/register`}
          className="text-[#1a6b3c] dark:text-amber-400 font-semibold hover:underline"
        >
          Begin your journey here
        </Link>
      </p>

      {/* Bottom links */}
      <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        <span>•</span>
        <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
      </div>
    </motion.div>
  </div>
    </div >
  );
}
