"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, MapPin, Hotel, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePartnerTourMutation } from "@/lib/api/partnerApi";

interface FormData {
  title: string;
  description: string;
  departureCity: string;
  duration: number;
  hotelStars: number;
  distanceToHaram: number;
  imageUrl: string;
  price: number;
  isAvailable: boolean;
}

const STEPS = ["step_basic", "step_hotel", "step_pricing"] as const;

const stepIcons = [MapPin, Hotel, DollarSign];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
};

export default function NewTourPage() {
  const t = useTranslations("partner");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [createTour, { isLoading }] = useCreatePartnerTourMutation();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    departureCity: "",
    duration: 14,
    hotelStars: 4,
    distanceToHaram: 0.5,
    imageUrl: "",
    price: 1500,
    isAvailable: true,
  });

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function goNext() {
    if (step === 0 && (!form.title.trim() || !form.departureCity.trim())) {
      setError("Title and Departure City are required.");
      return;
    }
    if (step === 1 && (form.hotelStars < 1 || form.hotelStars > 5 || form.distanceToHaram < 0)) {
      setError("Hotel stars must be 1–5 and distance must be ≥ 0.");
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goPrev() {
    setDirection(-1);
    setStep((s) => s - 1);
    setError("");
  }

  async function handleSubmit() {
    if (form.price <= 0) { setError("Price must be greater than 0."); return; }
    setError("");
    try {
      await createTour({
        title: form.title,
        description: form.description || undefined,
        departureCity: form.departureCity,
        duration: form.duration,
        hotelStars: form.hotelStars,
        distanceToHaram: form.distanceToHaram,
        imageUrl: form.imageUrl || undefined,
        price: form.price,
        isAvailable: form.isAvailable,
      }).unwrap();
      router.push(`/${locale}/partner/tours`);
    } catch {
      setError(tCommon("error"));
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("add_tour")}</h1>
        <p className="text-sm text-muted-foreground mt-1">Create a new Umrah package in 3 steps</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((stepKey, i) => {
          const Icon = stepIcons[i];
          const isCompleted = i < step;
          const isActive = i === step;
          return (
            <div key={stepKey} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted ? "rgb(16 185 129)" : isActive ? "rgb(16 185 129)" : "hsl(var(--muted))",
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </motion.div>
                <span className={`text-xs mt-1.5 font-medium ${isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {t(stepKey)}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  animate={{ backgroundColor: i < step ? "rgb(16 185 129)" : "hsl(var(--border))" }}
                  transition={{ duration: 0.4 }}
                  className="h-0.5 flex-1 mx-2 mt-[-18px]"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8 space-y-5"
          >
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="title">{t("tour_title")} *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Premium Umrah Package 2026"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="desc">{t("description")}</Label>
                  <Textarea
                    id="desc"
                    placeholder="Describe this package..."
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">{t("departure_city")} *</Label>
                    <Input
                      id="city"
                      placeholder="e.g. Dushanbe"
                      value={form.departureCity}
                      onChange={(e) => set("departureCity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="duration">{t("duration_days")}</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={1}
                      max={60}
                      value={form.duration}
                      onChange={(e) => set("duration", Number(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 1: Hotel & Location */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="stars">{t("hotel_stars")}</Label>
                    <Input
                      id="stars"
                      type="number"
                      min={1}
                      max={5}
                      value={form.hotelStars}
                      onChange={(e) => set("hotelStars", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="distance">{t("distance_haram")}</Label>
                    <Input
                      id="distance"
                      type="number"
                      min={0}
                      step={0.1}
                      value={form.distanceToHaram}
                      onChange={(e) => set("distanceToHaram", Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="image">{t("image_url")}</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://..."
                    value={form.imageUrl}
                    onChange={(e) => set("imageUrl", e.target.value)}
                  />
                  {form.imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 rounded-xl overflow-hidden h-36 bg-muted"
                    >
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </motion.div>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Pricing */}
            {step === 2 && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="price">{t("price_usd")} *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">$</span>
                    <Input
                      id="price"
                      type="number"
                      min={1}
                      className="pl-7"
                      value={form.price}
                      onChange={(e) => set("price", Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Availability toggle */}
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="text-sm font-medium">{t("available")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pilgrims can book immediately
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set("isAvailable", !form.isAvailable)}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${
                      form.isAvailable ? "bg-emerald-500" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                        form.isAvailable ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-muted/50 p-4 space-y-2 text-sm">
                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Review</p>
                  <div className="flex justify-between"><span className="text-muted-foreground">Title</span><span className="font-medium">{form.title}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">From</span><span className="font-medium">{form.departureCity}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{form.duration} days</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Hotel</span><span className="font-medium">{form.hotelStars}★ · {form.distanceToHaram}km to Haram</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-bold text-emerald-600">${form.price.toLocaleString()}</span></div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-8 pb-4 text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t px-8 py-5">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground border hover:bg-accent transition-colors disabled:invisible"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("prev")}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {isLoading ? tCommon("loading") : (
                <>
                  <Check className="h-4 w-4" />
                  {t("create_tour")}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
