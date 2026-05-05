"use client";

import { useState } from "react";
import { useSearchToursQuery } from "@/lib/api/toursApi";
import { useLocale } from "next-intl";
import { TourCard } from "@/components/tours/TourCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, Loader2, Search, SlidersHorizontal, X } from "lucide-react";

export default function ToursPage() {
  const locale = useLocale();
  const [filters, setFilters] = useState({
    departureCity: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minStars: undefined as number | undefined,
    maxDistance: undefined as number | undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tours, isLoading, isFetching } = useSearchToursQuery(filters);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  const clearFilters = () => {
    setFilters({
      departureCity: "",
      minPrice: undefined,
      maxPrice: undefined,
      minStars: undefined,
      maxDistance: undefined,
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-3">Umrah Tours</h1>
          <p className="text-white/80 text-lg">Find the perfect package for your pilgrimage</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by departure city..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFilters({ ...filters, departureCity: e.target.value });
              }}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="rounded-xl border bg-card p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Min Price ($)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max Price ($)</Label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Min Hotel Stars</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        minStars: filters.minStars === s ? undefined : s,
                      })
                    }
                    className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                      (filters.minStars ?? 0) >= s
                        ? "bg-amber-400 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Distance to Haram (km)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Any"
                value={filters.maxDistance ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, maxDistance: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading || isFetching ? (
              "Searching..."
            ) : (
              `${tours?.length ?? 0} tour${tours?.length !== 1 ? "s" : ""} found`
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !tours?.length ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No tours found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
