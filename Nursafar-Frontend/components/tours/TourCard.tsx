"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tour } from "@/lib/api/toursApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, ArrowRight, Users } from "lucide-react";

interface TourCardProps {
  tour: Tour;
  locale: string;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80";

export function TourCard({ tour, locale }: TourCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <Image
          src={tour.imageUrl || fallbackImage}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className="bg-primary/90 text-white border-0 text-xs backdrop-blur-sm">
            {tour.departureCity}
          </Badge>
          {tour.hotelStars === 5 && (
            <Badge className="bg-amber-500/90 text-white border-0 text-xs backdrop-blur-sm">
              ★ VIP
            </Badge>
          )}
        </div>

        {/* Bottom stars */}
        <div className="absolute bottom-3 left-3 flex items-center gap-0.5">
          {Array.from({ length: tour.hotelStars }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400 drop-shadow" />
          ))}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 glass-dark rounded-lg px-3 py-1.5">
          <span className="text-white font-bold text-lg">${tour.price.toLocaleString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[15px] mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">
          {tour.title}
        </h3>

        {tour.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
            {tour.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            {tour.distanceToHaram} km to Haram
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            {tour.duration} days
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="text-xl font-bold text-primary">${tour.price.toLocaleString()}</div>
          </div>
          <Button asChild size="sm" className="group/btn shrink-0">
            <Link href={`/${locale}/tours/${tour.id}`}>
              Details
              <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
