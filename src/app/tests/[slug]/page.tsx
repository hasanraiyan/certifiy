'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/ecommerce';
import * as mockApi from '@/lib/mock-api';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Clock, 
  Star, 
  ShoppingCart as ShoppingCartIcon,
  ArrowLeft,
  Check
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const foundProduct = await mockApi.products.findProductBySlug(params.slug);
        
        if (!foundProduct) {
          setError('Product not found');
          return;
        }
        
        setProduct(foundProduct);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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

  if (error || !product) {
    return notFound();
  }

  const getTypeBadge = () => {
    return (
      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-full text-base">
        {product.type === 'Exam' ? 'Full Mock Exam' : product.type === 'DomainQuiz' ? 'Domain Quiz' : 'Quiz'}
      </Badge>
    );
  };

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
            {getTypeBadge()}
            {product.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{product.description}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">What&apos;s Included</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{product.questionIds.length} practice questions</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Full-length timed exam experience</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Detailed performance analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Explanation for each answer</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Progress tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">About This Test</h2>
                  <p className="text-muted-foreground">
                    This {product.type.toLowerCase()} is designed to simulate the real PMP exam experience. 
                    It includes questions that cover all the domains and tasks outlined in the PMBOK Guide, 
                    helping you identify knowledge gaps and build confidence before your actual exam.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-extrabold text-primary">${product.price.amount}</span>
                    <span className="text-muted-foreground"> {product.price.currency}</span>
                  </div>
                  
                  <Button className="w-full mb-4" size="lg" onClick={() => product && addItem(product)}>
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button variant="outline" className="w-full mb-6" size="lg" asChild>
                    <Link href="/checkout">Buy Now</Link>
                  </Button>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">This test includes:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <BookOpen className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{product.questionIds.length} questions</span>
                      </li>
                      <li className="flex items-center">
                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{product.type === 'Exam' ? '180 minutes' : '60 minutes'} time limit</span>
                      </li>
                      <li className="flex items-center">
                        <Star className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>Performance analytics</span>
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