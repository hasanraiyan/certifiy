'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bundle, Product } from '@/types/ecommerce';
import * as mockApi from '@/lib/mock-api';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, 
  BookOpen, 
  Clock, 
  Star, 
  ShoppingCart as ShoppingCartIcon,
  ArrowLeft,
  Check
} from 'lucide-react';

export default function BundleDetailPage({ params }: { params: { slug: string } }) {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setLoading(true);
        const foundBundle = await mockApi.bundles.findBundleBySlug(params.slug);
        
        if (!foundBundle) {
          setError('Bundle not found');
          return;
        }
        
        setBundle(foundBundle);
        
        // Fetch products included in the bundle
        const products = await Promise.all(
          foundBundle.productIds.map(id => 
            mockApi.products.fetchAllProducts().then(products => 
              products.find(p => p.id === id)
            )
          )
        );
        
        // Filter out any undefined products
        setBundleProducts(products.filter((p): p is Product => p !== undefined));
      } catch (err) {
        console.error('Failed to fetch bundle:', err);
        setError('Failed to load bundle');
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
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
              <Link href="/tests" className="text-primary font-bold">Test Library</Link>
              <Link href="/login" className="hover:text-accent transition-colors">Login</Link>
              <Link href="/signup" className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all">
                Start Free Test
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-primary focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </nav>
        </header>

        {/* Loading Content */}
        <main className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-1/4 mb-6"></div>
              <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-64 bg-muted rounded mb-6"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/6 mb-6"></div>
                </div>
                <div>
                  <div className="h-64 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !bundle) {
    return notFound();
  }

  // Calculate individual product prices for comparison
  const individualPricesTotal = bundleProducts.reduce((sum, product) => sum + product.price.amount, 0);
  const savings = individualPricesTotal - bundle.price.amount;
  const savingsPercentage = individualPricesTotal > 0 ? Math.round((savings / individualPricesTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
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
            <Link href="/tests" className="text-primary font-bold">Test Library</Link>
            <Link href="/login" className="hover:text-accent transition-colors">Login</Link>
            <Link href="/signup" className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all">
              Start Free Test
            </Link>
          </div>
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
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Test Library
          </Button>
          
          <div className="mb-8">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1 rounded-full text-base">
              Bundle
            </Badge>
            {bundle.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {bundle.discountPercentage && bundle.discountPercentage > 0 && (
              <Badge className="bg-green-100 text-green-800 font-bold ml-2">
                SAVE {bundle.discountPercentage}%
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{bundle.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{bundle.description}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Bundle Contents</h2>
                  <div className="space-y-4">
                    {bundleProducts.map((product) => (
                      <div key={product.id} className="flex items-center p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${product.price.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span>Individual Prices Total:</span>
                      <span className="line-through text-muted-foreground">${individualPricesTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Bundle Price:</span>
                      <span className="font-bold text-lg">${bundle.price.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>You Save:</span>
                      <span>${savings.toFixed(2)} ({savingsPercentage}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Why Choose This Bundle?</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Complete exam preparation with multiple practice tests</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Track your progress across all tests</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Identify knowledge gaps with comprehensive analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Save {savingsPercentage}% compared to buying tests individually</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-extrabold text-primary">${bundle.price.amount}</span>
                    <span className="text-muted-foreground"> {bundle.price.currency}</span>
                    {savings > 0 && (
                      <div className="mt-2 text-green-600 font-bold">
                        Save ${savings.toFixed(2)} ({savingsPercentage}%)
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mb-4" size="lg" onClick={() => bundle && addItem(bundle)}>
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button variant="outline" className="w-full mb-6" size="lg" asChild>
                    <Link href="/checkout">Buy Now</Link>
                  </Button>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">This bundle includes:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Package className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{bundle.productIds.length} practice tests</span>
                      </li>
                      <li className="flex items-center">
                        <BookOpen className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{bundleProducts.reduce((sum, p) => sum + p.questionIds.length, 0)} total questions</span>
                      </li>
                      <li className="flex items-center">
                        <Star className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>Performance analytics for all tests</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
    </div>
  );
}