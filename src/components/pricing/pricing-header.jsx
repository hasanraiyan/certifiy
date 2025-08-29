'use client';

import { useState } from 'react';

export function PricingHeader() {
  const [billing, setBilling] = useState('monthly');

  return (
    <section className="bg-muted/30 pt-20 pb-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
          Find the Perfect Plan for Your PMP Goal
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
          Simple, transparent pricing. No hidden fees. Start for free today.
        </p>
        
        {/* Billing Cycle Toggle */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className={billing === 'monthly' ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            Pay Monthly
          </span>
          <button 
            onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary"
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billing === 'monthly' ? 'translate-x-1' : 'translate-x-6'
              }`}
            />
          </button>
          <span className={billing === 'yearly' ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            Pay Yearly
          </span>
          <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
            Save 20%
          </span>
        </div>
      </div>
    </section>
  );
}