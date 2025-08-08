import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free Tier',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '50 practice questions',
        'Basic progress tracking',
        'Community support',
        'Limited explanations'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Pay-per-Test',
      price: '$19',
      period: 'per test',
      description: 'Flexible option for focused practice',
      features: [
        'Full mock exam (180 questions)',
        'Detailed explanations',
        'Performance analytics',
        'Domain-wise breakdown',
        '30-day access'
      ],
      buttonText: 'Buy Single Test',
      buttonVariant: 'default' as const,
      popular: false
    },
    {
      name: 'Premium Bundle',
      price: '$99',
      period: 'lifetime',
      description: 'Complete PMP preparation package',
      features: [
        'Unlimited practice questions',
        '10+ full mock exams',
        'Advanced analytics',
        'All question types',
        'Priority support',
        'Study guides & resources',
        'Mobile app access'
      ],
      buttonText: 'Get Premium',
      buttonVariant: 'default' as const,
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your PMP certification journey. 
            All plans include our comprehensive question bank and detailed explanations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <Link href="/signup">{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">All Plans Include</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🔒</span>
              </div>
              <p className="font-medium">Secure Platform</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">📱</span>
              </div>
              <p className="font-medium">Mobile Friendly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">⚡</span>
              </div>
              <p className="font-medium">Instant Access</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🎯</span>
              </div>
              <p className="font-medium">Updated Content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}