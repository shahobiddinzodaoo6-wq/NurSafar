"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateCampaignMutation } from "@/lib/api/crowdfundApi";
import { useAppSelector } from "@/lib/store/hooks";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Heart, Loader2 } from "lucide-react";

export default function CreateCampaignPage() {
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [createdId, setCreatedId] = useState("");

  if (!isAuthenticated) {
    router.replace(`/${locale}/login`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(targetAmount);
    if (!title.trim()) {
      setError("Campaign title is required.");
      return;
    }
    if (!amount || amount <= 0) {
      setError("Please enter a valid target amount.");
      return;
    }

    try {
      const result = await createCampaign({
        title: title.trim(),
        description: description.trim() || undefined,
        targetAmount: amount,
      }).unwrap();
      setCreated(true);
      setCreatedId(result.id);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create campaign. Please try again.");
    }
  };

  if (created) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Campaign Created!</h2>
            <p className="text-muted-foreground">
              Your campaign is now live. Share it with friends and family to start receiving donations.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                asChild
              >
                <Link href={`/${locale}/crowdfund/${createdId}`}>
                  <Heart className="h-4 w-4" /> View My Campaign
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${locale}/crowdfund`}>
                  <ArrowLeft className="h-4 w-4" /> All Campaigns
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
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
            <Heart className="h-4 w-4 text-red-400 fill-red-400" /> Start a Campaign
          </div>
          <h1 className="text-3xl font-bold">Create Your Campaign</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-1">Campaign Details</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Fill in the information below to launch your Parents&apos; Umrah Fund campaign.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Campaign Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Help my parents perform Umrah"
                  maxLength={120}
                  className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">{title.length}/120</p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell your story — why does this campaign matter? How will the funds be used?"
                  rows={5}
                  className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Fundraising Goal ($) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="4000"
                    className="w-full rounded-md border bg-background pl-7 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[1000, 2000, 3000, 4000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetAmount(String(preset))}
                      className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                        targetAmount === String(preset)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary hover:text-primary"
                      }`}
                    >
                      ${preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Heart className="h-4 w-4" /> Launch Campaign
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By creating a campaign you agree to our community guidelines. May Allah bless your efforts.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
