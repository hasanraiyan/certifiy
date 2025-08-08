import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        
        <HowItWorksSection />

        <FeaturesSection />

        <PricingSection />

        {/* Final CTA Banner */}
        <section className="bg-gradient-to-r from-primary to-blue-800 text-white">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Earn Your PMP Certification?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">Stop guessing and start preparing with data-driven tools. Your first test is on us.</p>
            <div className="mt-8">
              <Link href="/signup" className="bg-accent hover:bg-amber-600 text-blue-900 font-bold py-4 px-10 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                Claim Your Free Test
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-sm text-gray-600">
                    &copy; 2025 Certify. All Rights Reserved.
                </div>
                <div className="flex space-x-6 text-sm font-medium">
                    <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy</Link>
                    <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Terms</Link>
                    <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Contact</Link>
                </div>
            </div>
        </div>
      </footer>
    </>
  );
}