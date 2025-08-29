'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    id: 'faq1',
    question: 'Is this a one-time payment or a subscription?',
    answer: 'All our products are one-time purchases. There are no recurring subscriptions. You can purchase individual tests or bundles as needed.'
  },
  {
    id: 'faq2',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal through our secure payment processor, Stripe.'
  },
  {
    id: 'faq3',
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'Yes, we offer a 14-day money-back guarantee on all purchases. If you\'re not satisfied, just contact support within 14 days of purchase for a full refund.'
  }
];

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState('faq1');

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-foreground mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center p-4 bg-muted/30 rounded-lg text-left font-semibold hover:bg-muted/50 transition-colors"
              >
                <span>{faq.question}</span>
                {openFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === faq.id && (
                <div className="p-4 text-muted-foreground bg-white border border-border rounded-b-lg">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}