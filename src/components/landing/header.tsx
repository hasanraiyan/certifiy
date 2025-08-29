'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CheckCircle, Menu } from 'lucide-react';
import { CartIcon } from '@/components/cart/cart-icon';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
          <CheckCircle className="h-6 w-6 text-accent" />
          <span>Certify</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-foreground">
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="/tests" className="hover:text-accent transition-colors">Test Library</Link>
          <Link href="/login" className="hover:text-accent transition-colors">Login</Link>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm">
            <Link href="/signup">Start Free Test</Link>
          </Button>
          <CartIcon />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link 
                  href="#features" 
                  className="text-lg font-medium hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/tests" 
                  className="text-lg font-medium hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Test Library
                </Link>
                <Link 
                  href="/login" 
                  className="text-lg font-medium hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/cart" 
                  className="text-lg font-medium hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cart
                </Link>
                <div className="pt-4">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Start Free Test
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
