import Link from 'next/link';
import { PricingHeader } from '@/components/pricing/pricing-header';
import { PricingSection } from '@/components/landing/pricing-section';
import { FeatureComparison } from '@/components/pricing/feature-comparison';
import { FAQSection } from '@/components/pricing/faq-section';

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Certify</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-foreground">
            <Link href="/#features" className="hover:text-accent transition-colors">Features</Link>
            <Link href="/pricing" className="text-primary font-bold">Pricing</Link>
            <Link href="/login" className="hover:text-accent transition-colors">Login</Link>
            <Link href="/signup" className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all">
              Start Free Test
            </Link>
          </div>
          {/* Mobile Menu Button Placeholder */}
          <div className="md:hidden">
            <button className="text-primary focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <PricingHeader />
        <PricingSection />
        <FeatureComparison />
        <FAQSection />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              &copy; 2025 Certify. All Rights Reserved.
            </div>
            <div className="flex space-x-6 text-sm font-medium">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}