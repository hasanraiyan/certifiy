'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart as ShoppingCartIcon, 
  X, 
  Plus, 
  Minus,
  Package,
  BookOpen
} from 'lucide-react';

export function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, total, itemCount, removeItem, updateQuantity } = useCart();

  // Helper function to determine if item is a bundle
  const isBundle = (product: any): product is { productIds: string[] } => {
    return 'productIds' in product;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCartIcon className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            Your Cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-12">
            <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Browse our test library and add some practice tests to get started.
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/tests">Browse Tests</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center border-b pb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center mr-4">
                      {isBundle(item.product) ? (
                        <Package className="h-6 w-6 text-accent" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        ${item.product.price.amount.toFixed(2)} each
                      </p>
                      
                      <div className="flex items-center mt-2">
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
                          className="ml-auto h-8 w-8"
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
            </ScrollArea>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <Button 
                asChild 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}