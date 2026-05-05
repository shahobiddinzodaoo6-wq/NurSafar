import { getLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { CrowdfundPreviewSection } from "@/components/sections/CrowdfundPreviewSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaSection } from "@/components/home/CtaSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <div className="flex flex-col overflow-hidden">
      <HeroSection locale={locale} />
      <WhyChooseUsSection />
      <CrowdfundPreviewSection locale={locale} />
      <TestimonialsSection />
      <CtaSection locale={locale} />
    </div>
  );
}
