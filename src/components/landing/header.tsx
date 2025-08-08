'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
          <CheckCircle className="h-6 w-6 text-accent" />
          <span>Certify</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-900">
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-accent transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-accent transition-colors">Login</Link>
          <Link href="/signup" className="bg-primary hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all">
            Start Free Test
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <Link href="#features" className="block py-3 px-6 text-sm font-medium hover:bg-gray-50">Features</Link>
          <Link href="#pricing" className="block py-3 px-6 text-sm font-medium hover:bg-gray-50">Pricing</Link>
          <Link href="/login" className="block py-3 px-6 text-sm font-medium hover:bg-gray-50">Login</Link>
          <div className="p-4">
            <Link href="/signup" className="block text-center bg-primary hover:bg-blue-800 w-full text-white font-bold py-3 px-5 rounded-lg">
              Start Free Test
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
