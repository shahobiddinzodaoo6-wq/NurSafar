"use client";

import Link from "next/link";
import { useGetCampaignsQuery } from "@/lib/api/crowdfundApi";
import { useLocale } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Loader2, Plus, Users } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";

export default function CrowdfundPage() {
  const locale = useLocale();
  const { data: campaigns, isLoading } = useGetCampaignsQuery();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm mb-3">
            <Heart className="h-4 w-4 text-red-400 fill-red-400" /> Community-powered pilgrimages
          </div>
          <h1 className="text-5xl font-bold mb-2">Parents&apos; Umrah Fund</h1>
          <p className="text-white/80">Help beloved parents complete their sacred journey</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Header actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Active Campaigns</h2>
            <p className="text-muted-foreground">{campaigns?.length || 0} campaigns seeking support</p>
          </div>
          <Button variant="gold" asChild>
            <Link href={isAuthenticated ? `/${locale}/crowdfund/create` : `/${locale}/login`}>
              <Plus className="h-4 w-4" /> Start a Campaign
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !campaigns?.length ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🕌</div>
            <h3 className="text-2xl font-bold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to start a campaign for your parents</p>
            <Button variant="gold" asChild>
              <Link href={isAuthenticated ? `/${locale}/crowdfund/create` : `/${locale}/login`}>
                <Heart className="h-4 w-4" /> Create First Campaign
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const percent = Math.min(
                100,
                Math.round((campaign.currentAmount / campaign.targetAmount) * 100)
              );
              return (
                <Card
                  key={campaign.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div
                    className="h-2"
                    style={{
                      background: campaign.isCompleted
                        ? "linear-gradient(to right, #22c55e, #16a34a)"
                        : "linear-gradient(to right, hsl(var(--primary)), #f59e0b)",
                    }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                        {campaign.title}
                      </h3>
                      {campaign.isCompleted && <Badge variant="success" className="ml-2 shrink-0">Funded!</Badge>}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">by {campaign.user.name}</p>

                    {campaign.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{campaign.description}</p>
                    )}

                    <div className="space-y-2 mb-5">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-primary">${campaign.currentAmount.toLocaleString()}</span>
                        <span className="text-muted-foreground">of ${campaign.targetAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={percent} className="h-2.5" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {campaign._count?.donations || 0} donors
                        </span>
                        <span className="font-medium">{percent}% funded</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/${locale}/crowdfund/${campaign.id}`}>View Details</Link>
                      </Button>
                      {!campaign.isCompleted && (
                        <Button size="sm" variant="gold" asChild className="flex-1">
                          <Link href={`/${locale}/crowdfund/${campaign.id}`}>
                            <Heart className="h-3.5 w-3.5" /> Donate
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
