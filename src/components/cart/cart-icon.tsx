'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative p-2">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}