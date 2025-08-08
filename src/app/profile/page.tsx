'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  Shield, 
  CheckCircle, 
  FileText, 
  CheckCircle2, 
  Download,
  ChevronRight
} from 'lucide-react';

const sections = [
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: <User className="w-5 h-5" />
  },
  { 
    id: 'security', 
    label: 'Security', 
    icon: <Shield className="w-5 h-5" />
  },
  { 
    id: 'subscription', 
    label: 'Subscription', 
    icon: <CheckCircle className="w-5 h-5" />
  },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: <FileText className="w-5 h-5" />
  }
];

const billingHistory = [
  {
    date: 'Jan 15, 2025',
    description: 'Full Access - Yearly Plan',
    amount: '$279.00',
    invoice: '#INV-2025-001'
  },
  {
    date: 'Dec 01, 2024',
    description: 'Single Mock Exam',
    amount: '$15.00',
    invoice: '#INV-2024-012'
  }
];

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic
    console.log('Profile updated:', formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password update logic
    console.log('Password updated');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-xl font-bold text-primary">
            <CheckCircle2 className="h-6 w-6 text-accent" />
            <span>Certify</span>
          </div>
          <div className="relative group">
            <Button className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full font-bold text-sm">
              JD
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account, subscription, and billing information.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sidebar Navigation */}
          <aside className="md:w-1/4 md:sticky md:top-24 self-start">
            {/* Mobile Nav (Horizontal Scroll) */}
            <div className="md:hidden mb-6 border-b border-border">
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex-shrink-0 py-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                      activeSection === section.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Nav (Vertical) */}
            <nav className="hidden md:flex flex-col space-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full font-bold text-lg">
                  JD
                </div>
                <div>
                  <p className="font-bold text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">Full Access Plan</p>
                </div>
              </div>
              
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-primary'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Content Area */}
          <div className="w-full md:w-3/4 space-y-10">
            {/* Section 1: Profile */}
            <section 
              id="profile" 
              ref={(el) => {
                sectionRefs.current.profile = el;
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your name and email address.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        value={formData.email}
                        disabled
                        className="mt-1 bg-muted"
                      />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Section 2: Security */}
            <section 
              id="security" 
              ref={(el) => {
                sectionRefs.current.security = el;
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Choose a strong, new password for your account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium">
                        Current Password
                      </Label>
                      <Input
                        type="password"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Section 3: Subscription */}
            <section 
              id="subscription" 
              ref={(el) => {
                sectionRefs.current.subscription = el;
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    My Subscription
                  </CardTitle>
                  <CardDescription>
                    Manage your current plan and features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-6 rounded-lg border border-border">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div>
                        <h3 className="text-lg font-bold text-primary">
                          Full Access - Yearly Plan
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-muted-foreground">Active</span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 text-2xl font-bold text-foreground">
                        $279<span className="text-sm font-medium text-muted-foreground">/year</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Your plan renews on January 15, 2026.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                    <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                      <a href="/pricing">Change Plan</a>
                    </Button>
                    <Button variant="ghost" className="w-full sm:w-auto text-destructive hover:text-destructive">
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 4: Billing */}
            <section 
              id="billing" 
              ref={(el) => {
                sectionRefs.current.billing = el;
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Billing History
                  </CardTitle>
                  <CardDescription>
                    Review your past invoices and transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-sm font-semibold">Date</TableHead>
                              <TableHead className="text-sm font-semibold">Description</TableHead>
                              <TableHead className="text-sm font-semibold">Amount</TableHead>
                              <TableHead className="relative">
                                <span className="sr-only">Invoice</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {billingHistory.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="text-sm font-medium">
                                  {item.date}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {item.description}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {item.amount}
                                </TableCell>
                                <TableCell className="text-right text-sm font-medium">
                                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}