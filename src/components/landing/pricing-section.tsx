import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const products = [
  {
    name: 'Free Sample Test',
    price: '$0',
    description: 'A perfect starting point.',
    features: [
      '1 Free Sample Test',
      'Basic Answer Review'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Full Access Bundle',
    price: '$49',
    description: 'One-time payment for complete access.',
    features: [
      'Everything in Free, plus:',
      'Unlimited Practice Exams',
      'Complete 1,000+ Question Bank',
      'Detailed Performance Analytics',
      '90-Day Access'
    ],
    cta: 'Get Full Access',
    popular: true
  },
  {
    name: 'Single Practice Test',
    price: '$15',
    description: 'For focused preparation.',
    features: [
      '1 Full-Length Exam',
      'Detailed Analytics for Test'
    ],
    cta: 'Buy Test',
    popular: false
  }
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Choose Your Preparation Path</h2>
                <p className="mt-4 text-lg text-muted-foreground">Select the option that fits your study needs. Start with our free sample.</p>
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {products.map((product) => (
                        <Card 
                            key={product.name} 
                            className={`relative flex flex-col hover:shadow-xl transition-all duration-300 ${
                                product.popular 
                                    ? 'bg-primary text-primary-foreground shadow-2xl transform lg:scale-105 border-primary' 
                                    : 'bg-muted/30 hover:shadow-lg'
                            }`}
                        >
                            {product.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-accent text-accent-foreground font-bold px-4 py-1">
                                        BEST VALUE
                                    </Badge>
                                </div>
                            )}
                            
                            <CardHeader className="text-center">
                                <CardTitle className={`text-xl font-semibold ${product.popular ? 'text-primary-foreground' : 'text-primary'}`}>
                                    {product.name}
                                </CardTitle>
                                <div className="mt-4">
                                    <span className={`text-4xl lg:text-5xl font-extrabold ${product.popular ? 'text-primary-foreground' : 'text-foreground'}`}>
                                        {product.price}
                                    </span>
                                </div>
                                <CardDescription className={product.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                                    {product.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-grow">
                                <ul className="space-y-3 text-left">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <Check className={`w-5 h-5 mr-3 ${product.popular ? 'text-accent' : 'text-green-500'}`} />
                                            <span className={`${index === 0 && product.popular ? 'font-bold' : ''} ${product.popular ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button asChild className={`w-full font-bold py-3 transition-all ${
                                    product.popular 
                                        ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
                                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                                }`} variant={product.popular ? 'default' : 'outline'}>
                                    <Link href="/tests">{product.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}