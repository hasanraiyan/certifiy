import Link from 'next/link';
import { PricingHeader } from '@/components/pricing/pricing-header';
import { PricingSection } from '@/components/landing/pricing-section';
import { FeatureComparison } from '@/components/pricing/feature-comparison';
import { FAQSection } from '@/components/pricing/faq-section';

export default function PricingPage() {
  return (
    <main>
      <PricingHeader />
      <PricingSection />
      <FeatureComparison />
      <FAQSection />
    </main>
  );
}
