"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  useGetCampaignByIdQuery,
  useDonateMutation,
} from "@/lib/api/crowdfundApi";
import { useAppSelector } from "@/lib/store/hooks";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  Loader2,
  Users,
} from "lucide-react";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const { data: campaign, isLoading } = useGetCampaignByIdQuery(id);
  const [donate, { isLoading: isDonating }] = useDonateMutation();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [donated, setDonated] = useState(false);
  const [error, setError] = useState("");

  const handleDonate = async () => {
    if (!isAuthenticated) {
      window.location.href = `/${locale}/login`;
      return;
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    try {
      await donate({ campaignId: id, amount: parsed, message: message || undefined }).unwrap();
      setDonated(true);
      setAmount("");
      setMessage("");
    } catch (err: any) {
      setError(err?.data?.message || "Donation failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold">Campaign not found</h2>
        <Button asChild variant="outline">
          <Link href={`/${locale}/crowdfund`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Campaigns
          </Link>
        </Button>
      </div>
    );
  }

  const percent = Math.min(
    100,
    Math.round((campaign.currentAmount / campaign.targetAmount) * 100)
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" size="sm" asChild className="bg-background/80 backdrop-blur">
            <Link href={`/${locale}/crowdfund`}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm mb-3">
            <Heart className="h-4 w-4 text-red-400 fill-red-400" /> Community-powered pilgrimage
          </div>
          <h1 className="text-3xl md:text-4xl font-bold line-clamp-2">{campaign.title}</h1>
          <p className="text-white/70 mt-1 text-sm">by {campaign.user.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      ${campaign.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                      of ${campaign.targetAmount.toLocaleString()} goal
                    </span>
                  </div>
                  {campaign.isCompleted && (
                    <Badge className="bg-green-500/15 text-green-600 border-green-500/30">
                      ✓ Fully Funded
                    </Badge>
                  )}
                </div>
                <Progress value={percent} className="h-3 mb-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {campaign._count?.donations || campaign.donations?.length || 0} donors
                  </span>
                  <span className="font-semibold">{percent}% funded</span>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {campaign.description && (
              <div>
                <h2 className="text-xl font-bold mb-3">About This Campaign</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {campaign.description}
                </p>
              </div>
            )}

            {/* Donor list */}
            {campaign.donations && campaign.donations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Recent Donors</h2>
                <div className="space-y-3">
                  {campaign.donations.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-start gap-3 p-4 rounded-xl border bg-card"
                    >
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary text-sm">
                        {d.donor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{d.donor.name}</span>
                          <span className="text-primary font-semibold text-sm">
                            ${d.amount.toLocaleString()}
                          </span>
                        </div>
                        {d.message && (
                          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                            {d.message}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs mt-1">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Donate sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-5">
                {campaign.isCompleted ? (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="font-semibold text-green-600">Campaign Fully Funded!</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      This campaign has reached its goal. Thank you to all donors!
                    </div>
                  </div>
                ) : donated ? (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="font-semibold text-green-600">Thank You!</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Your donation has been recorded. May Allah accept it.
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => setDonated(false)}
                    >
                      Donate Again
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Make a Donation</h3>
                      <p className="text-muted-foreground text-sm">
                        Help this family perform Umrah
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[10, 25, 50, 100, 250, 500].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setAmount(String(preset))}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            amount === String(preset)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:border-primary hover:text-primary"
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        Custom Amount ($)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        Message (optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Leave an encouraging message..."
                        rows={3}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                      />
                    </div>

                    {error && (
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleDonate}
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                      size="lg"
                      disabled={isDonating}
                    >
                      {isDonating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Heart className="h-4 w-4" />
                          {isAuthenticated ? "Donate Now" : "Login to Donate"}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Secure donation • May Allah reward your generosity
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
