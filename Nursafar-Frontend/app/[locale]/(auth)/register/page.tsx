"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterMutation } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/store/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { useTheme } from "next-themes";
import {
  Eye, EyeOff, Loader2, Lock, Mail, User, Phone, ArrowRight, Building2, CarFront
} from "lucide-react";

const STEPS_IMG = [
  "/images/medina-bg.png",
];

const ROLES = [
  { value: "CLIENT", label: "Pilgrim", icon: User, desc: "Book Umrah packages" },
  { value: "PARTNER", label: "Tour Agency", icon: Building2, desc: "List and manage tours" },
  { value: "DRIVER", label: "Driver", icon: CarFront, desc: "Provide transit services" },
] as const;

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();
  const [register, { isLoading }] = useRegisterMutation();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CLIENT" as "CLIENT" | "PARTNER" | "DRIVER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await register(form).unwrap();
      dispatch(setCredentials(result));
      if (result.user.role === "PARTNER" || result.user.role === "DRIVER") {
        router.push(`/${locale}/partner`);
      } else {
        router.push(`/${locale}`);
      }
    } catch (err: any) {
      const msg = err?.data?.message;
      if (Array.isArray(msg)) setError(msg[0]);
      else if (msg) setError(msg);
      else if (err?.status === "FETCH_ERROR") setError("Cannot reach server. Make sure the backend is running on port 3001.");
      else setError(`Registration failed (${err?.status ?? "unknown error"})`);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white dark:bg-[#0d1117]">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[58%] relative flex-col overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${STEPS_IMG[0]}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2818]/85 via-[#0d2818]/60 to-[#163823]/40" />

        <div className="relative z-10 flex flex-col h-full p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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

          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
                Begin Your{" "}
                <span className="text-amber-400">Sacred</span>{" "}
                Journey Today.
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-md">
                Create your NurSafar account and unlock access to hundreds of verified Umrah packages, crowdfunding tools, and border transit services.
              </p>
            </motion.div>

            {/* Progress steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 space-y-4"
            >
              {[
                { n: 1, label: "Personal Information", sub: "Name, email, phone" },
                { n: 2, label: "Account Setup", sub: "Password & role selection" },
              ].map(({ n, label, sub }) => (
                <div key={n} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${step > n
                      ? "bg-amber-400 text-[#0d2818]"
                      : step === n
                        ? "bg-white text-[#0d2818]"
                        : "border-2 border-white/30 text-white/50"
                    }`}>
                    {step > n ? "✓" : n}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${step >= n ? "text-white" : "text-white/40"}`}>{label}</div>
                    <div className="text-xs text-white/40">{sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {["Free to join", "No hidden fees", "Instant booking", "Tajik support"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
                "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=60&q=80",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&q=80",
              ].map((src, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0d2818] overflow-hidden">
                  <Image src={src} alt="pilgrim" width={36} height={36} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <div className="text-white/70 text-sm">
              <span className="text-amber-400 font-semibold">50,000+</span> pilgrims already joined
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-[42%] flex flex-col justify-center relative min-h-screen overflow-y-auto">
        {/* Hexagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
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
          <div className="mb-8">
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
          <div className="mb-7">
            <h2 className="text-3xl font-bold text-foreground mb-1.5">
              {step === 1 ? "Create your account" : "Almost there!"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {step === 1
                ? "Your pilgrimage journey starts with a single step."
                : "Set your password and choose your account type."}
            </p>
          </div>

          {/* Step indicator (mobile) */}
          <div className="flex gap-2 mb-7 lg:hidden">
            {[1, 2].map((n) => (
              <div key={n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= n ? "bg-[#1a4a30] dark:bg-amber-500" : "bg-border"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* STEP 1 */
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNext}
                className="space-y-5"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Firuz Toshmatov"
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1a4a30] dark:focus:ring-amber-500/50 focus:border-transparent transition-all"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1a4a30] dark:focus:ring-amber-500/50 focus:border-transparent transition-all"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+992 90 123 45 67"
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1a4a30] dark:focus:ring-amber-500/50 focus:border-transparent transition-all"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-13 rounded-xl bg-[#1a3a28] hover:bg-[#143020] dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#1a3a28]/30 dark:shadow-amber-500/30"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.form>
            ) : (
              /* STEP 2 */
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      className="w-full h-12 pl-10 pr-12 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1a4a30] dark:focus:ring-amber-500/50 focus:border-transparent transition-all"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="flex gap-1 mt-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${form.password.length > i * 2 + 1 ? i < 2 ? "bg-red-400" : i < 3 ? "bg-amber-400" : "bg-green-400" : "bg-border"}`} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Role selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">I am a...</label>
                  <div className="space-y-2">
                    {ROLES.map(({ value, label, icon: RoleIcon, desc }) => (
                      <motion.button
                        key={value}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setForm({ ...form, role: value })}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${form.role === value
                            ? "border-[#1a4a30] dark:border-amber-500 bg-[#1a4a30]/8 dark:bg-amber-500/10 shadow-sm"
                            : "border-border hover:border-[#1a4a30]/50 dark:hover:border-amber-500/30"
                          }`}
                      >
                        <div className={`p-2 rounded-lg ${form.role === value ? "bg-[#1a4a30] dark:bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
                          <RoleIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-foreground">{label}</div>
                          <div className="text-xs text-muted-foreground">{desc}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${form.role === value ? "border-[#1a4a30] dark:border-amber-500" : "border-border"
                          }`}>
                          {form.role === value && (
                            <div className="w-2 h-2 rounded-full bg-[#1a4a30] dark:bg-amber-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

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

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-xl border border-border bg-background hover:bg-accent text-foreground font-semibold text-sm transition-colors"
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.98 }}
                    className="flex-[2] h-12 rounded-xl bg-[#1a3a28] hover:bg-[#143020] dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-lg shadow-[#1a3a28]/30 dark:shadow-amber-500/30"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Create Account <ArrowRight className="h-4 w-4" /></>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="mt-8 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href={`/${locale}/login`} className="text-[#1a6b3c] dark:text-amber-400 font-semibold hover:underline">
              Sign in here
            </Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
