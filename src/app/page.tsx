import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { FeaturedTests } from '@/components/landing/featured-tests';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        
        <HowItWorksSection />

        <FeaturesSection />

        <FeaturedTests />

        {/* Final CTA Banner */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Earn Your PMP Certification?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">Stop guessing and start preparing with data-driven tools. Your first test is on us.</p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 px-10 text-lg shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <Link href="/signup">Claim Your Free Test</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-sm text-muted-foreground">
                    &copy; 2025 Certify. All Rights Reserved.
                </div>
                <div className="flex space-x-6 text-sm font-medium">
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                </div>
            </div>
        </div>
      </footer>
    </>
  );
}