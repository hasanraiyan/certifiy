'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  HelpCircle, 
  ClipboardList, 
  CreditCard, 
  Users, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  { 
    name: 'Questions', 
    href: '/admin/questions', 
    icon: <HelpCircle className="w-5 h-5" />
  },
  { 
    name: 'Tests', 
    href: '/admin/tests', 
    icon: <ClipboardList className="w-5 h-5" />
  },
  { 
    name: 'Plans', 
    href: '/admin/plans', 
    icon: <CreditCard className="w-5 h-5" />
  },
  { 
    name: 'Users', 
    href: '/admin/users', 
    icon: <Users className="w-5 h-5" />
  },
  { 
    name: 'Reports', 
    href: '/admin/reports', 
    icon: <BarChart3 className="w-5 h-5" />
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 text-2xl font-bold text-primary p-4 border-b border-border">
            <CheckCircle2 className="h-8 w-8 text-accent" />
            <span>Certify</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-muted-foreground hover:bg-muted hover:text-primary'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-primary"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2 text-xl font-bold text-primary">
              <CheckCircle2 className="h-6 w-6 text-accent" />
              <span>Certify</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
