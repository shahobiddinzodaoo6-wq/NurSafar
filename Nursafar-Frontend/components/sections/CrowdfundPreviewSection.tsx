"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGetCampaignsQuery } from "@/lib/api/crowdfundApi";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Loader2, Plus, Users } from "lucide-react";

export function CrowdfundPreviewSection({ locale }: { locale: string }) {
  const { data: campaigns, isLoading } = useGetCampaignsQuery();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-background to-amber-500/5" />
      <div className="absolute inset-0 hero-grid opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-rose-500 uppercase tracking-widest mb-2">
              <Heart className="h-4 w-4 fill-rose-500" />
              Community Support
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              Parents&apos; <span className="text-gradient">Umrah Fund</span>
            </h2>
            <div className="section-divider" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-3"
          >
            <Button variant="outline" asChild>
              <Link href={`/${locale}/crowdfund`}>View All</Link>
            </Button>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white group">
              <Link href={`/${locale}/crowdfund/create`}>
                <Plus className="h-4 w-4" />
                Start Campaign
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !campaigns?.length ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🕌</div>
            <p className="text-muted-foreground text-lg mb-6">No campaigns yet — be the first!</p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link href={`/${locale}/crowdfund/create`}>Create Campaign</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.slice(0, 3).map((campaign, i) => {
              const percent = Math.min(
                100,
                Math.round((campaign.currentAmount / campaign.targetAmount) * 100)
              );
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 transition-shadow duration-300"
                >
                  {/* Top gradient bar */}
                  <div
                    className="h-1.5"
                    style={{
                      background: campaign.isCompleted
                        ? "linear-gradient(90deg, #22c55e, #16a34a)"
                        : "linear-gradient(90deg, hsl(var(--primary)), #f59e0b)",
                    }}
                  />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="font-semibold text-[15px] line-clamp-2 flex-1 group-hover:text-primary transition-colors leading-snug">
                        {campaign.title}
                      </h3>
                      {campaign.isCompleted && (
                        <Badge className="bg-green-500/15 text-green-600 border-green-500/30 shrink-0 text-xs">
                          ✓ Funded
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">
                      by <span className="font-medium">{campaign.user.name}</span>
                    </p>

                    {campaign.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {campaign.description}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="space-y-2 mb-5">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-primary">${campaign.currentAmount.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs">of ${campaign.targetAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {campaign._count?.donations || 0} donors
                        </span>
                        <span className="font-semibold">{percent}% funded</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/${locale}/crowdfund/${campaign.id}`}>Details</Link>
                      </Button>
                      {!campaign.isCompleted && (
                        <Button size="sm" asChild className="flex-1 bg-rose-500 hover:bg-rose-600 text-white border-0">
                          <Link href={`/${locale}/crowdfund/${campaign.id}`}>
                            <Heart className="h-3.5 w-3.5" />
                            Donate
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
