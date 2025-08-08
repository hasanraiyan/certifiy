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

interface Test {
  id: string;
  name: string;
  description: string;
  type: 'full_exam' | 'domain_focus' | 'knowledge_area';
  questionCount: number;
  duration: number; // in minutes
  domains: string[];
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestManagement() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock tests data
  const tests: Test[] = [
    {
      id: '1',
      name: 'PMP Mock Exam #1',
      description: 'Complete PMP certification practice exam covering all domains',
      type: 'full_exam',
      questionCount: 180,
      duration: 240, // 4 hours
      domains: ['People', 'Process', 'Business Environment'],
      difficulty: 'mixed',
      isActive: true,
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '2',
      name: 'Agile Practice Test',
      description: 'Focused test on Agile and Scrum methodologies',
      type: 'domain_focus',
      questionCount: 60,
      duration: 90,
      domains: ['Agile'],
      difficulty: 'mixed',
      isActive: true,
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '3',
      name: 'Risk Management Quiz',
      description: 'Knowledge area specific test for Risk Management',
      type: 'knowledge_area',
      questionCount: 40,
      duration: 60,
      domains: ['Risk Management'],
      difficulty: 'medium',
      isActive: true,
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01'
    }
  ];

  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    type: 'knowledge_area' as 'full_exam' | 'domain_focus' | 'knowledge_area',
    questionCount: 50,
    duration: 60,
    domains: [] as string[],
    difficulty: 'mixed' as 'mixed' | 'easy' | 'medium' | 'hard'
  });

  const availableDomains = [
    'Integration Management',
    'Scope Management', 
    'Schedule Management',
    'Cost Management',
    'Quality Management',
    'Resource Management',
    'Communications Management',
    'Risk Management',
    'Procurement Management',
    'Stakeholder Management',
    'Agile',
    'People',
    'Process',
    'Business Environment'
  ];

  const handleCreateTest = () => {
    // TODO: Implement test creation
    console.log('Creating test:', newTest);
    // Reset form
    setNewTest({
      name: '',
      description: '',
      type: 'knowledge_area',
      questionCount: 50,
      duration: 60,
      domains: [],
      difficulty: 'mixed'
    });
  };

  const handleEditTest = (test: Test) => {
    setSelectedTest(test);
  };

  const handleDeleteTest = (testId: string) => {
    // TODO: Implement test deletion
    console.log('Deleting test:', testId);
  };

  const handleToggleActive = (testId: string) => {
    // TODO: Implement toggle active status
    console.log('Toggling active status for test:', testId);
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || test.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test & Mock Exam Management</h1>
            <p className="text-gray-600">Create and manage test structures and configurations</p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Tests</TabsTrigger>
              <TabsTrigger value="create">Create Test</TabsTrigger>
            </TabsList>

            {/* Browse Tests Tab */}
            <TabsContent value="browse">
              <Card>
                <CardHeader>
                  <CardTitle>Test Library</CardTitle>
                  <CardDescription>Manage existing tests and mock exams</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="search">Search Tests</Label>
                      <Input
                        id="search"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type-filter">Test Type</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="full_exam">Full Exam</SelectItem>
                          <SelectItem value="domain_focus">Domain Focus</SelectItem>
                          <SelectItem value="knowledge_area">Knowledge Area</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button onClick={() => {
                        setSearchTerm('');
                        setFilterType('all');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Tests List */}
                  <div className="space-y-4">
                    {filteredTests.map((test) => (
                      <Card key={test.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {test.type.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                  test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  test.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {test.difficulty}
                                </span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  test.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {test.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              
                              <h3 className="font-bold text-lg mb-1">{test.name}</h3>
                              <p className="text-gray-600 mb-2">{test.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Questions:</span> {test.questionCount}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span> {Math.floor(test.duration / 60)}h {test.duration % 60}m
                                </div>
                                <div>
                                  <span className="font-medium">Domains:</span> {test.domains.length}
                                </div>
                                <div>
                                  <span className="font-medium">Created:</span> {new Date(test.createdAt).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="mt-2">
                                <span className="text-sm font-medium">Domains: </span>
                                <span className="text-sm text-gray-600">{test.domains.join(', ')}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditTest(test)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleToggleActive(test.id)}
                              >
                                {test.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteTest(test.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredTests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No tests found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Test Tab */}
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Test</CardTitle>
                  <CardDescription>Configure a new test or mock exam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="test-name">Test Name</Label>
                      <Input
                        id="test-name"
                        placeholder="e.g., PMP Mock Exam #3"
                        value={newTest.name}
                        onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="test-type">Test Type</Label>
                      <Select 
                        value={newTest.type} 
                        onValueChange={(value: 'full_exam' | 'domain_focus' | 'knowledge_area') => 
                          setNewTest(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_exam">Full Exam (180 questions)</SelectItem>
                          <SelectItem value="domain_focus">Domain Focus (60-100 questions)</SelectItem>
                          <SelectItem value="knowledge_area">Knowledge Area (30-60 questions)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this test covers..."
                      value={newTest.description}
                      onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="question-count">Question Count</Label>
                      <Input
                        id="question-count"
                        type="number"
                        min="10"
                        max="200"
                        value={newTest.questionCount}
                        onChange={(e) => setNewTest(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 50 }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="15"
                        max="300"
                        value={newTest.duration}
                        onChange={(e) => setNewTest(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select 
                        value={newTest.difficulty} 
                        onValueChange={(value: 'mixed' | 'easy' | 'medium' | 'hard') => 
                          setNewTest(prev => ({ ...prev, difficulty: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Domains to Include</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {availableDomains.map(domain => (
                        <label key={domain} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newTest.domains.includes(domain)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTest(prev => ({ ...prev, domains: [...prev.domains, domain] }));
                              } else {
                                setNewTest(prev => ({ ...prev, domains: prev.domains.filter(d => d !== domain) }));
                              }
                            }}
                          />
                          <span className="text-sm">{domain}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleCreateTest}>
                      Create Test
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setNewTest({
                        name: '',
                        description: '',
                        type: 'knowledge_area',
                        questionCount: 50,
                        duration: 60,
                        domains: [],
                        difficulty: 'mixed'
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