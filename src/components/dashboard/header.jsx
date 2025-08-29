'use client';

import Link from 'next/link';
import { CheckCircle, Calendar, Settings, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DashboardHeader() {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-border">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
          <CheckCircle className="h-6 w-6 text-accent" />
          <span>Certify</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                JD
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-bold text-foreground">John Doe</p>
                <p className="text-sm text-muted-foreground truncate">john.doe@example.com</p>
              </div>
              <div className="py-1">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center w-full">
                    <Calendar className="w-5 h-5 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center w-full">
                    <Settings className="w-5 h-5 mr-2" />
                    Profile & Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="flex items-center w-full">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Subscription & Billing
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}