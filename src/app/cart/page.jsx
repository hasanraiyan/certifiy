'use client';

import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Package, 
  X, 
  Plus, 
  Minus,
  ShoppingCart as ShoppingCartIcon,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, total, itemCount, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  // Helper function to determine if item is a bundle
  const isBundle = (product) => {
    return 'productIds' in product;
  };

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCartIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground mb-8">
            You need to add some tests to your cart before checking out.
          </p>
          
          <Button asChild size="lg">
            <Link href="/tests">Browse Test Library</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-16">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Continue Shopping
      </Button>
      
      <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center border-b pb-6 last:border-b-0">
                    <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center mr-4">
                      {isBundle(item.product) ? (
                        <Package className="h-6 w-6 text-accent" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.product.price.amount.toFixed(2)} each
                      </p>
                      
                      <div className="flex items-center mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          className="w-16 mx-2 h-8 text-center"
                        />
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-8 w-8"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <p className="font-medium">
                        ${(item.product.price.amount * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button asChild size="lg" className="w-full mt-6">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => router.push('/tests')}
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}