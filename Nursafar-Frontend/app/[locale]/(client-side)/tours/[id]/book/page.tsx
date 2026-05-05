"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetTourByIdQuery, useBookTourMutation } from "@/lib/api/toursApi";
import { useAppSelector } from "@/lib/store/hooks";
import type { AuthUser } from "@/lib/store/authSlice";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Star,
  Ticket,
  Users,
} from "lucide-react";

const INCLUSIONS = [
  { icon: "✈️", label: "Round-trip flights" },
  { icon: "🏨", label: "Hotel accommodation" },
  { icon: "📋", label: "Visa processing" },
  { icon: "🚌", label: "Airport transfers" },
  { icon: "🕌", label: "Guided Umrah rituals" },
  { icon: "📞", label: "24/7 support" },
];

const STEPS = ["Review", "Confirm", "Done"];

export default function BookTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const router = useRouter();
  const { data: tour, isLoading } = useGetTourByIdQuery(id);
  const [bookTour, { isLoading: isBooking }] = useBookTourMutation();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth) as { isAuthenticated: boolean; user: AuthUser | null };

  const [step, setStep] = useState(0); // 0=review, 1=confirm, 2=done
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  if (!isAuthenticated) {
    router.replace(`/${locale}/login`);
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold">Tour not found</h2>
        <Button asChild variant="outline">
          <Link href={`/${locale}/tours`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tours
          </Link>
        </Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setError("");
    try {
      const result = await bookTour(id).unwrap();
      setBookingId(result.id);
      setStep(2);
    } catch (err: any) {
      setError(err?.data?.message || "Booking failed. Please try again.");
    }
  };

  /* ─── Step 2: Success screen ─── */
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-green-500/15 animate-ping" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              May Allah accept your intention and grant you a blessed Umrah journey.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-medium text-xs">{bookingId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tour</span>
                <span className="font-medium text-right max-w-[55%]">{tour.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{tour.duration} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-primary">${tour.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-xs">Pending Confirmation</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 text-sm text-muted-foreground text-left space-y-1">
            <p className="font-medium text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" /> What happens next?
            </p>
            <ul className="space-y-1 pl-6 list-disc">
              <li>Our team will review your booking within 24 hours</li>
              <li>You will receive a confirmation once approved</li>
              <li>Travel documents will be sent 2 weeks before departure</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/${locale}/profile`}>
                <Ticket className="h-4 w-4" /> My Bookings
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/${locale}/tours`}>
                Browse More Tours
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 0 & 1: Review + Confirm ─── */
  return (
    <div className="min-h-screen">
      {/* Top progress bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/tours/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tour
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {STEPS.slice(0, 2).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${i === step ? "font-medium" : "text-muted-foreground"}`}>
                  {s}
                </span>
                {i < 1 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>
          <div className="w-24" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Left: Tour details */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {step === 0 ? "Review Your Tour" : "Confirm Your Booking"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {step === 0
                  ? "Check all the details before proceeding to confirmation."
                  : "Read the terms and confirm your booking."}
              </p>
            </div>

            {/* Tour card */}
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={tour.imageUrl || "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80"}
                  alt={tour.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge variant="gold" className="mb-1 text-xs">{tour.departureCity}</Badge>
                  <h2 className="text-xl font-bold leading-tight">{tour.title}</h2>
                  <p className="text-white/70 text-sm">by {tour.partner.name}</p>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { icon: <Star className="h-4 w-4 text-amber-400 fill-amber-400" />, label: "Stars", value: `${tour.hotelStars}★` },
                    { icon: <MapPin className="h-4 w-4 text-primary" />, label: "To Haram", value: `${tour.distanceToHaram} km` },
                    { icon: <Clock className="h-4 w-4 text-primary" />, label: "Duration", value: `${tour.duration} days` },
                    { icon: <Users className="h-4 w-4 text-primary" />, label: "Bookings", value: `${(tour as any)._count?.bookings || 0}` },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-muted/40 p-3">
                      <div className="flex justify-center mb-1">{s.icon}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</div>
                      <div className="font-semibold text-sm">{s.value}</div>
                    </div>
                  ))}
                </div>

                {tour.description && (
                  <p className="text-muted-foreground text-sm mt-4 leading-relaxed">{tour.description}</p>
                )}
              </CardContent>
            </Card>

            {/* What's included */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> What&apos;s Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INCLUSIONS.map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5 text-sm py-1.5 px-3 rounded-lg bg-green-500/5 border border-green-500/10">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-auto shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traveller info */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Traveller
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{user?.name || "You"}</div>
                    <div className="text-xs text-muted-foreground">{user?.email || ""}</div>
                  </div>
                  <Badge className="ml-auto text-xs" variant="outline">1 traveller</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Terms (only on step 1) */}
            {step === 1 && (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-sm">Terms & Conditions</h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                    <li>Full payment is required to confirm the booking.</li>
                    <li>Cancellations made 30+ days before departure receive a 50% refund.</li>
                    <li>Cancellations within 30 days of departure are non-refundable.</li>
                    <li>Valid passport (6+ months validity) and visa documents are required.</li>
                    <li>The partner operator reserves the right to adjust itineraries due to circumstances beyond their control.</li>
                  </ul>
                  <label className="flex items-start gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <span className="text-xs">
                      I have read and agree to the Terms & Conditions and understand the cancellation policy.
                    </span>
                  </label>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Price summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-bold text-lg">Price Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tour price (1 person)</span>
                    <span>${tour.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visa & processing</span>
                    <span className="text-green-600 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transfers</span>
                    <span className="text-green-600 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel ({tour.hotelStars}★, {tour.duration} nights)</span>
                    <span className="text-green-600 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">${tour.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    Secure & encrypted booking
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    {tour.hotelStars}-star hotel, {tour.distanceToHaram} km from Haram
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    {tour.duration}-day program from {tour.departureCity}
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                )}

                {step === 0 ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setStep(1)}
                    disabled={!tour.isAvailable}
                  >
                    Continue to Confirm
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={isBooking || !agreed}
                  >
                    {isBooking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Confirm Booking
                      </>
                    )}
                  </Button>
                )}

                {step === 1 && (
                  <button
                    onClick={() => setStep(0)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                  >
                    ← Back to Review
                  </button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  No hidden fees • Cancel anytime before departure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
