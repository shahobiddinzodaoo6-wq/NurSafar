"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetTourByIdQuery } from "@/lib/api/toursApi";
import { useAppSelector } from "@/lib/store/hooks";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  MapPin,
  Star,
  Users,
  CalendarDays,
  Building2,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";

// Masjid al-Haram (Kaaba) coordinates
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

function HotelMap({ distanceKm }: { distanceKm: number }) {
  // Build a bbox that expands with distance so the hotel radius is visible
  const delta = Math.max(0.015, distanceKm * 0.012);
  const bbox = [
    (KAABA_LON - delta).toFixed(4),
    (KAABA_LAT - delta).toFixed(4),
    (KAABA_LON + delta).toFixed(4),
    (KAABA_LAT + delta).toFixed(4),
  ].join(",");

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${KAABA_LAT},${KAABA_LON}`;

  return (
    <div className="rounded-xl overflow-hidden border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          Masjid al-Haram — Hotel is within{" "}
          <span className="text-primary font-bold">{distanceKm} km</span>
        </div>
        <a
          href={`https://www.openstreetmap.org/?mlat=${KAABA_LAT}&mlon=${KAABA_LON}#map=16/${KAABA_LAT}/${KAABA_LON}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
        >
          Open in maps ↗
        </a>
      </div>
      <iframe
        title="Hotel location near Masjid al-Haram"
        src={src}
        width="100%"
        height="380"
        style={{ border: 0, display: "block" }}
        loading="lazy"
      />
      <div className="px-4 py-2.5 bg-muted/30 text-xs text-muted-foreground flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-full bg-primary/70 shrink-0" />
        Pin marks the Kaaba. Your hotel is within {distanceKm} km of this point.
      </div>
    </div>
  );
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const { data: tour, isLoading } = useGetTourByIdQuery(id);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [showMap, setShowMap] = useState(false);

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

  const stats = [
    {
      key: "stars",
      icon: <Star className="h-5 w-5 text-amber-400 fill-amber-400" />,
      label: "Hotel Stars",
      value: `${tour.hotelStars} Stars`,
      clickable: false,
    },
    {
      key: "haram",
      icon: <MapPin className="h-5 w-5 text-primary" />,
      label: "To Haram",
      value: `${tour.distanceToHaram} km`,
      clickable: true,
    },
    {
      key: "duration",
      icon: <Clock className="h-5 w-5 text-primary" />,
      label: "Duration",
      value: `${tour.duration} days`,
      clickable: false,
    },
    {
      key: "bookings",
      icon: <Users className="h-5 w-5 text-primary" />,
      label: "Bookings",
      value: `${(tour as any)._count?.bookings || 0}`,
      clickable: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <Image
          src={tour.imageUrl || "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920&q=80"}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <Button variant="outline" size="sm" asChild className="bg-background/80 backdrop-blur">
            <Link href={`/${locale}/tours`}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-6 left-6 text-white">
          <Badge variant="gold" className="mb-2">{tour.departureCity}</Badge>
          <h1 className="text-4xl font-bold">{tour.title}</h1>
          <p className="text-white/80 mt-1">by {tour.partner.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) =>
                s.clickable ? (
                  <button
                    key={s.key}
                    onClick={() => setShowMap((v) => !v)}
                    className={`rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      showMap ? "border-primary ring-1 ring-primary/30 bg-primary/5" : ""
                    }`}
                  >
                    <div className="pt-4 pb-3 px-4 text-center">
                      <div className="flex justify-center mb-1">{s.icon}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                      <div className="font-semibold text-sm">{s.value}</div>
                      <div className="flex justify-center mt-1.5">
                        {showMap ? (
                          <ChevronUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                ) : (
                  <Card key={s.key}>
                    <CardContent className="pt-4 text-center">
                      <div className="flex justify-center mb-1">{s.icon}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                      <div className="font-semibold text-sm">{s.value}</div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>

            {/* Expandable map */}
            {showMap && (
              <HotelMap distanceKm={tour.distanceToHaram} />
            )}

            {tour.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
                <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
              </div>
            )}

            {/* Inclusions */}
            <div>
              <h2 className="text-2xl font-bold mb-4">What&apos;s Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Round-trip flights",
                  "Hotel accommodation",
                  "Visa processing",
                  "Airport transfers",
                  "Guided Umrah rituals",
                  "24/7 support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground">Price per person</div>
                  <div className="text-4xl font-bold text-primary">${tour.price.toLocaleString()}</div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{tour.hotelStars}-star hotel</span>
                  </div>
                  <button
                    onClick={() => setShowMap((v) => !v)}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors w-full text-left group"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>{tour.distanceToHaram} km from Haram</span>
                    <span className="text-xs text-primary ml-auto underline underline-offset-2">
                      {showMap ? "Hide map" : "Show map"}
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{tour.duration} days program</span>
                  </div>
                </div>

                {tour.isAvailable ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={isAuthenticated ? `/${locale}/tours/${id}/book` : `/${locale}/login`}>
                      <ShoppingBag className="h-4 w-4" />
                      {isAuthenticated ? "Book Now" : "Login to Book"}
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Not Available
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Secure booking • No hidden fees
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
