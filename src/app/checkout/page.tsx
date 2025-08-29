'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Package, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import * as mockApi from '@/lib/mock-api';
import { getCurrentUser } from '@/lib/auth';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      router.push('/tests');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get current user
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create purchase records for each item
      const purchasePromises = items.map(async (item) => {
        const purchaseData = {
          userId: user.id,
          productId: 'productIds' in item.product ? undefined : item.product.id,
          bundleId: 'productIds' in item.product ? item.product.id : undefined,
          amount: { 
            amount: item.product.price.amount * item.quantity, 
            currency: 'USD' 
          },
          status: 'Completed' as const
        };
        
        return mockApi.purchases.create(purchaseData);
      });
      
      await Promise.all(purchasePromises);
      
      // Clear cart
      clearCart();
      
      // Show success
      setIsSuccess(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      // In a real app, we would show an error message to the user
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push('/tests');
  };

  // Handle view dashboard
  const handleViewDashboard = () => {
    router.push('/dashboard');
  };

  if (isSuccess) {
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

        {/* Success Content */}
        <main className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Successful!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. Your tests are now available in your dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleViewDashboard} size="lg">
                View My Tests
              </Button>
              <Button variant="outline" onClick={handleContinueShopping} size="lg">
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-border mt-auto">
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

  if (items.length === 0) {
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

        {/* Empty Cart Content */}
        <main className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-muted-foreground mb-8">
              You need to add some tests to your cart before checking out.
            </p>
            
            <Button onClick={handleContinueShopping} size="lg">
              Browse Test Library
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-border mt-auto">
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
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            
            <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Checkout Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                        
                        <div>
                          <Label htmlFor="billingAddress">Address</Label>
                          <Input
                            id="billingAddress"
                            name="billingAddress"
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label htmlFor="country">Country</Label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded-md"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay $${total.toFixed(2)}`
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center border-b pb-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center mr-4">
                            {'productIds' in item.product ? (
                              <Package className="h-5 w-5 text-accent" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          
                          <div className="flex-grow">
                            <h3 className="font-medium text-sm">{item.product.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              ${item.product.price.amount.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          
                          <div className="ml-4 text-right">
                            <p className="font-medium">
                              ${(item.product.price.amount * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">What happens after payment?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Instant access to all purchased tests</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Performance analytics for each test</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Progress tracking across all tests</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-border mt-auto">
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
  );
}