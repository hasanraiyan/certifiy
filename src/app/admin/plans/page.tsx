'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingType: 'one_time' | 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  includedTests: string[];
  isActive: boolean;
  maxUsers?: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductPlanManagement() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock plans data
  const plans: Plan[] = [
    {
      id: '1',
      name: 'Free Tier',
      description: 'Perfect for getting started with PMP preparation',
      price: 0,
      billingType: 'lifetime',
      features: [
        '50 practice questions',
        'Basic progress tracking',
        'Community support',
        'Limited explanations'
      ],
      includedTests: ['basic-quiz-1', 'basic-quiz-2'],
      isActive: true,
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '2',
      name: 'Pay-per-Test',
      description: 'Flexible option for focused practice',
      price: 19,
      billingType: 'one_time',
      features: [
        'Full mock exam (180 questions)',
        'Detailed explanations',
        'Performance analytics',
        'Domain-wise breakdown',
        '30-day access'
      ],
      includedTests: ['pmp-mock-1'],
      isActive: true,
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '3',
      name: 'Premium Bundle',
      description: 'Complete PMP preparation package',
      price: 99,
      billingType: 'lifetime',
      features: [
        'Unlimited practice questions',
        '10+ full mock exams',
        'Advanced analytics',
        'All question types',
        'Priority support',
        'Study guides & resources',
        'Mobile app access'
      ],
      includedTests: ['all'],
      isActive: true,
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01'
    }
  ];

  // Mock available tests
  const availableTests = [
    { id: 'pmp-mock-1', name: 'PMP Mock Exam #1' },
    { id: 'pmp-mock-2', name: 'PMP Mock Exam #2' },
    { id: 'agile-practice', name: 'Agile Practice Test' },
    { id: 'risk-mgmt', name: 'Risk Management Quiz' },
    { id: 'basic-quiz-1', name: 'Basic PMP Quiz #1' },
    { id: 'basic-quiz-2', name: 'Basic PMP Quiz #2' }
  ];

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: 0,
    billingType: 'one_time' as 'one_time' | 'monthly' | 'yearly' | 'lifetime',
    features: [''],
    includedTests: [] as string[],
    maxUsers: undefined as number | undefined
  });

  const handleCreatePlan = () => {
    // TODO: Implement plan creation
    console.log('Creating plan:', newPlan);
    // Reset form
    setNewPlan({
      name: '',
      description: '',
      price: 0,
      billingType: 'one_time' as 'one_time' | 'monthly' | 'yearly' | 'lifetime',
      features: [''],
      includedTests: [],
      maxUsers: undefined
    });
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleDeletePlan = (planId: string) => {
    // TODO: Implement plan deletion
    console.log('Deleting plan:', planId);
  };

  const handleToggleActive = (planId: string) => {
    // TODO: Implement toggle active status
    console.log('Toggling active status for plan:', planId);
  };

  const addFeature = () => {
    setNewPlan(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setNewPlan(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product & Plan Management</h1>
            <p className="text-gray-600">Create and manage monetization plans and pricing</p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Plans</TabsTrigger>
              <TabsTrigger value="create">Create Plan</TabsTrigger>
            </TabsList>

            {/* Browse Plans Tab */}
            <TabsContent value="browse">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Plans</CardTitle>
                  <CardDescription>Manage existing pricing plans and products</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="mb-6">
                    <Label htmlFor="search">Search Plans</Label>
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan) => (
                      <Card key={plan.id} className={`relative ${
                        plan.name === 'Premium Bundle' ? 'border-blue-500 shadow-lg' : ''
                      }`}>
                        {plan.name === 'Premium Bundle' && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}
                        
                        <CardHeader className="text-center">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <span className={`text-xs px-2 py-1 rounded ${
                              plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <CardDescription>{plan.description}</CardDescription>
                          <div className="mt-4">
                            <span className="text-3xl font-bold">${plan.price}</span>
                            <span className="text-gray-600">
                              /{plan.billingType === 'one_time' ? 'once' : 
                                plan.billingType === 'lifetime' ? 'lifetime' :
                                plan.billingType}
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Features:</h4>
                              <ul className="space-y-1 text-sm">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Included Tests:</h4>
                              <p className="text-sm text-gray-600">
                                {plan.includedTests.includes('all') 
                                  ? 'All available tests'
                                  : `${plan.includedTests.length} specific tests`
                                }
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditPlan(plan)}
                                className="flex-1"
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleToggleActive(plan.id)}
                                className="flex-1"
                              >
                                {plan.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeletePlan(plan.id)}
                              className="w-full"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredPlans.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No plans found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Plan Tab */}
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Plan</CardTitle>
                  <CardDescription>Configure a new pricing plan or product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        placeholder="e.g., Professional Plan"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing-type">Billing Type</Label>
                      <Select 
                        value={newPlan.billingType} 
                        onValueChange={(value: 'one_time' | 'monthly' | 'yearly' | 'lifetime') => 
                          setNewPlan(prev => ({ ...prev, billingType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_time">One Time</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this plan offers..."
                      value={newPlan.description}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="max-users">Max Users (optional)</Label>
                      <Input
                        id="max-users"
                        type="number"
                        min="1"
                        placeholder="Leave empty for unlimited"
                        value={newPlan.maxUsers || ''}
                        onChange={(e) => setNewPlan(prev => ({ 
                          ...prev, 
                          maxUsers: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="space-y-2 mt-2">
                      {newPlan.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Enter feature description"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            disabled={newPlan.features.length === 1}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFeature}
                      >
                        Add Feature
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Included Tests</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newPlan.includedTests.includes('all')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPlan(prev => ({ ...prev, includedTests: ['all'] }));
                            } else {
                              setNewPlan(prev => ({ ...prev, includedTests: [] }));
                            }
                          }}
                        />
                        <span className="text-sm font-medium">All Tests</span>
                      </label>
                      
                      {!newPlan.includedTests.includes('all') && availableTests.map(test => (
                        <label key={test.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newPlan.includedTests.includes(test.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewPlan(prev => ({ 
                                  ...prev, 
                                  includedTests: [...prev.includedTests, test.id] 
                                }));
                              } else {
                                setNewPlan(prev => ({ 
                                  ...prev, 
                                  includedTests: prev.includedTests.filter(id => id !== test.id) 
                                }));
                              }
                            }}
                          />
                          <span className="text-sm">{test.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleCreatePlan}>
                      Create Plan
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setNewPlan({
                        name: '',
                        description: '',
                        price: 0,
                        billingType: 'one_time',
                        features: [''],
                        includedTests: [],
                        maxUsers: undefined
                      });
                    }}>
                      Clear Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}