'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Check, CreditCard, Users, Clock, Star } from 'lucide-react';

// --- TYPES AND MOCK DATA ---
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  status: 'Active' | 'Draft' | 'Archived';
  features: string[];
  subscribers: number;
  revenue: number;
  isPopular?: boolean;
  testAccess: 'limited' | 'full';
  supportLevel: 'basic' | 'priority' | 'premium';
}

const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Free Plan',
    description: 'Perfect for getting started with basic practice tests',
    price: 0,
    billingPeriod: 'monthly',
    status: 'Active',
    features: ['5 practice tests per month', 'Basic score tracking', 'Community support'],
    subscribers: 1247,
    revenue: 0,
    testAccess: 'limited',
    supportLevel: 'basic'
  },
  {
    id: '2',
    name: 'Full Access - Monthly',
    description: 'Complete access to all tests and premium features',
    price: 29,
    billingPeriod: 'monthly',
    status: 'Active',
    features: ['Unlimited practice tests', 'Detailed analytics', 'Priority support', 'Mock exams', 'Study guides'],
    subscribers: 892,
    revenue: 25868,
    isPopular: true,
    testAccess: 'full',
    supportLevel: 'priority'
  },
  {
    id: '3',
    name: 'Full Access - Yearly',
    description: 'Best value with annual billing and bonus features',
    price: 279,
    billingPeriod: 'yearly',
    status: 'Active',
    features: ['Everything in Monthly', '2 months free', 'Premium support', 'Exclusive content', '1-on-1 coaching session'],
    subscribers: 456,
    revenue: 127224,
    testAccess: 'full',
    supportLevel: 'premium'
  },
  {
    id: '4',
    name: 'Enterprise',
    description: 'Custom solution for teams and organizations',
    price: 99,
    billingPeriod: 'monthly',
    status: 'Draft',
    features: ['Team management', 'Custom branding', 'API access', 'Dedicated support', 'Custom reporting'],
    subscribers: 0,
    revenue: 0,
    testAccess: 'full',
    supportLevel: 'premium'
  }
];

const planFeatures = [
  'Unlimited practice tests',
  'Mock exams',
  'Detailed analytics',
  'Study guides',
  'Priority support',
  'Premium support',
  'Community access',
  'Mobile app access',
  'Offline downloads',
  'Custom study plans',
  'Progress tracking',
  'Certificate of completion',
  '1-on-1 coaching session',
  'Team management',
  'Custom branding',
  'API access',
  'Custom reporting'
];

// --- COMPONENT ---
export default function PlansManagement() {
  const [plans] = useState<Plan[]>(mockPlans);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    name: '',
    description: '',
    price: 0,
    billingPeriod: 'monthly',
    status: 'Draft',
    features: [],
    testAccess: 'limited',
    supportLevel: 'basic'
  });

  const openCreateDrawer = () => {
    setIsCreating(true);
    setSelectedPlan(null);
    setNewPlan({
      name: '',
      description: '',
      price: 0,
      billingPeriod: 'monthly',
      status: 'Draft',
      features: [],
      testAccess: 'limited',
      supportLevel: 'basic'
    });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (plan: Plan) => {
    setIsCreating(false);
    setSelectedPlan(plan);
    setNewPlan(plan);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const getStatusBadgeVariant = (status: Plan['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'destructive';
      default: return 'secondary';
    }
  };

  const toggleFeature = (feature: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features?.includes(feature) 
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers, 0);
  const activePlans = plans.filter(plan => plan.status === 'Active').length;
  const avgRevenuePerUser = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plans & Pricing</h1>
          <p className="mt-1 text-muted-foreground">Manage subscription plans and pricing strategies.</p>
        </div>
        <Button onClick={openCreateDrawer} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Active Subscribers</h3>
            <p className="mt-2 text-3xl font-bold">{totalSubscribers.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Active Plans</h3>
            <p className="mt-2 text-3xl font-bold">{activePlans}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Avg. Revenue/User</h3>
            <p className="mt-2 text-3xl font-bold">${avgRevenuePerUser.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-0">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col relative m-0 p-0">
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-yellow-900 font-semibold px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardContent className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(plan.status)} className="text-xs">
                  {plan.status}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-muted-foreground">
                      /{plan.billingPeriod === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{plan.subscribers.toLocaleString()} subscribers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span>${plan.revenue.toLocaleString()} revenue</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{plan.testAccess} test access</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">FEATURES</h4>
                <div className="space-y-2">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{plan.features.length - 3} more features
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            
            <div className="p-4 bg-muted/30 rounded-b-xl border-t mt-auto">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => openEditDrawer(plan)}
              >
                Edit Plan
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Editor Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full max-w-lg p-0 flex flex-col">
          <SheetHeader className="p-6 border-b flex-shrink-0 flex flex-row justify-between items-center">
            <SheetTitle className="text-2xl font-bold">
              {isCreating ? 'Create New Plan' : 'Edit Plan'}
            </SheetTitle>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={closeDrawer}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90">
                {isCreating ? 'Create Plan' : 'Save Changes'}
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-grow p-8 space-y-6 overflow-y-auto">
            {/* Basic Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="planName" className="font-medium text-sm">Plan Name</Label>
                <Input 
                  id="planName" 
                  placeholder="e.g., Premium Plan" 
                  value={newPlan.name || ''} 
                  onChange={(e) => setNewPlan(prev => ({...prev, name: e.target.value}))}
                  className="w-full mt-1" 
                />
              </div>
              
              <div>
                <Label htmlFor="planDescription" className="font-medium text-sm">Description</Label>
                <Textarea 
                  id="planDescription" 
                  placeholder="Brief description of the plan..." 
                  value={newPlan.description || ''} 
                  onChange={(e) => setNewPlan(prev => ({...prev, description: e.target.value}))}
                  className="w-full mt-1" 
                  rows={3}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Pricing</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="font-medium text-sm">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={newPlan.price || 0} 
                    onChange={(e) => setNewPlan(prev => ({...prev, price: parseFloat(e.target.value) || 0}))}
                    className="w-full mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="billing" className="font-medium text-sm">Billing Period</Label>
                  <Select 
                    value={newPlan.billingPeriod || 'monthly'} 
                    onValueChange={(value: 'monthly' | 'yearly') => setNewPlan(prev => ({...prev, billingPeriod: value}))}
                  >
                    <SelectTrigger id="billing" className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Plan Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Plan Settings</h4>
              
              <div>
                <Label htmlFor="status" className="font-medium text-sm">Status</Label>
                <Select 
                  value={newPlan.status || 'Draft'} 
                  onValueChange={(value: 'Active' | 'Draft' | 'Archived') => setNewPlan(prev => ({...prev, status: value}))}
                >
                  <SelectTrigger id="status" className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="testAccess" className="font-medium text-sm">Test Access Level</Label>
                <Select 
                  value={newPlan.testAccess || 'limited'} 
                  onValueChange={(value: 'limited' | 'full') => setNewPlan(prev => ({...prev, testAccess: value}))}
                >
                  <SelectTrigger id="testAccess" className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limited">Limited Access</SelectItem>
                    <SelectItem value="full">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="support" className="font-medium text-sm">Support Level</Label>
                <Select 
                  value={newPlan.supportLevel || 'basic'} 
                  onValueChange={(value: 'basic' | 'priority' | 'premium') => setNewPlan(prev => ({...prev, supportLevel: value}))}
                >
                  <SelectTrigger id="support" className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Support</SelectItem>
                    <SelectItem value="priority">Priority Support</SelectItem>
                    <SelectItem value="premium">Premium Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="popular" 
                  checked={newPlan.isPopular || false}
                  onCheckedChange={(checked) => setNewPlan(prev => ({...prev, isPopular: checked}))}
                />
                <Label htmlFor="popular" className="text-sm">Mark as "Most Popular"</Label>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Plan Features</h4>
              <p className="text-sm text-muted-foreground">Select the features included in this plan:</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                {planFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={feature}
                      checked={newPlan.features?.includes(feature) || false}
                      onChange={() => toggleFeature(feature)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={feature} className="text-sm">{feature}</Label>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Selected: {newPlan.features?.length || 0} features
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AuthGuard>
  );
}