'use client';

import { useState, useMemo } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/admin-context'; // Import the useAdmin hook

// --- COMPONENT ---

export default function TestManagement() {
  // Get state and functions from the context
  const { tests, questions, createTest, updateTest } = useAdmin();
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const [testDetails, setTestDetails] = useState({ name: '', count: 180, method: 'manual' });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');

  const openNewTestSheet = () => {
    setIsEditing(false);
    setCurrentStep(1);
    setIsConfirmed(false);
    setTestDetails({ name: '', count: 180, method: 'manual' });
    setSelectedQuestions([]);
    setIsSheetOpen(true);
  };
  
  const editTest = (test) => {
    setIsEditing(true);
    setCurrentStep(1);
    setIsConfirmed(false);
    setTestDetails({ name: test.name, count: test.questionCount, method: 'manual' });
    setSelectedQuestions([questions[0], questions[2], questions[5]]); // Mock selected questions for editing
    setIsSheetOpen(true);
  };

  const nextStep = () => { if (currentStep < 3) setCurrentStep(s => s + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

  const addQuestion = (q) => {
    if (!selectedQuestions.some(sq => sq.id === q.id)) {
      setSelectedQuestions(prev => [...prev, q]);
    }
  };
  
  const removeQuestion = (id) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== id));
  };
  
  const filteredAvailableQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = filterDomain === 'all' || q.domain === filterDomain;
      return matchesSearch && matchesDomain;
    });
  }, [questions, searchTerm, filterDomain]);
  
  const getDomainCount = (domain) => selectedQuestions.filter(q => q.domain === domain).length;

  const domainBlueprint = [
    { name: 'People', target: 76, color: 'bg-blue-500' },
    { name: 'Process', target: 90, color: 'bg-green-500' },
    { name: 'Business Environment', target: 14, color: 'bg-yellow-500' },
  ];
  
  const StepIndicator = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span className={`p-2 rounded-md ${currentStep >= 1 ? 'font-semibold text-primary' : ''} ${currentStep === 1 ? 'bg-primary/10' : ''}`}>
            1. Details & Method
        </span>
        <span className="text-gray-300">&rarr;</span>
        <span className={`p-2 rounded-md ${currentStep >= 2 ? 'font-semibold text-primary' : ''} ${currentStep === 2 ? 'bg-primary/10' : ''}`}>
            2. Build Test
        </span>
        <span className="text-gray-300">&rarr;</span>
        <span className={`p-2 rounded-md ${currentStep >= 3 ? 'font-semibold text-primary' : ''} ${currentStep === 3 ? 'bg-primary/10' : ''}`}>
            3. Review & Publish
        </span>
    </div>
  );

  const handleSaveTest = () => {
    if (isEditing) {
      updateTest(testDetails.id, { 
        ...testDetails, 
        questionCount: selectedQuestions.length,
        status: 'Active'
      });
    } else {
      createTest({ 
        ...testDetails, 
        questionCount: selectedQuestions.length,
        status: 'Active'
      });
    }
    setIsSheetOpen(false);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Test & Exam Library</h1>
            <p className="mt-1 text-muted-foreground">Assemble questions into structured tests and mock exams.</p>
          </div>
          <Button onClick={openNewTestSheet} className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create Test
          </Button>
        </div>

        {/* Test Library Table */}
        <Card className='p-0'>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-semibold">{test.name}</TableCell>
                      <TableCell><Badge variant="outline">{test.type}</Badge></TableCell>
                      <TableCell>{test.questionCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${test.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span>{test.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => editTest(test)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full min-w-[960px] max-w-7xl p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-2xl">{isEditing ? 'Edit Test' : 'Create New Test'}</SheetTitle>
            <SheetDescription asChild>
              <StepIndicator />
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-grow overflow-y-auto">
            {/* Step 1: Details & Method */}
            {currentStep === 1 && (
              <div className="p-8 space-y-8">
                <div>
                  <Label className="font-semibold text-lg">Test Details</Label>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="test-name" className="text-sm font-medium">Test Name</Label>
                      <Input id="test-name" placeholder="e.g., PMP Mock Exam #3" value={testDetails.name} onChange={(e) => setTestDetails(p => ({...p, name: e.target.value}))} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="q-count" className="text-sm font-medium">Target Question Count</Label>
                      <Input id="q-count" type="number" value={testDetails.count} onChange={(e) => setTestDetails(p => ({...p, count: parseInt(e.target.value)}))} className="mt-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold text-lg">Creation Method</Label>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div onClick={() => setTestDetails(p => ({...p, method: 'manual'}))} className={`p-4 border-2 rounded-lg cursor-pointer ${testDetails.method === 'manual' ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary'}`}>
                      <h4 className="font-bold">Build Manually</h4>
                      <p className="text-sm text-muted-foreground">Hand-pick every question for full control.</p>
                    </div>
                    <div onClick={() => setTestDetails(p => ({...p, method: 'auto'}))} className={`p-4 border-2 rounded-lg cursor-pointer ${testDetails.method === 'auto' ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary'}`}>
                      <h4 className="font-bold">Auto-Generate</h4>
                      <p className="text-sm text-muted-foreground">Let the system select questions based on domain blueprint.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Build Test */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Selected Questions */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">Selected Questions ({selectedQuestions.length})</h3>
                      <Button variant="outline" size="sm" onClick={() => setSelectedQuestions([])}>Clear All</Button>
                    </div>
                    
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {selectedQuestions.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                          No questions selected yet. Add questions from the pool on the right.
                        </div>
                      ) : (
                        selectedQuestions.map((q) => (
                          <Card key={q.id} className="p-4">
                            <div className="flex justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{q.text}</div>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="secondary">{q.domain}</Badge>
                                  <Badge variant="outline">{q.difficulty}</Badge>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeQuestion(q.id)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Question Pool */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">Question Pool</h3>
                      <div className="text-sm text-muted-foreground">{filteredAvailableQuestions.length} available</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input 
                        placeholder="Search questions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Select value={filterDomain} onValueChange={setFilterDomain}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Domains</SelectItem>
                          <SelectItem value="People">People</SelectItem>
                          <SelectItem value="Process">Process</SelectItem>
                          <SelectItem value="Business Environment">Business Environment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {filteredAvailableQuestions.map((q) => (
                        <Card 
                          key={q.id} 
                          className={`p-4 cursor-pointer hover:border-primary ${selectedQuestions.some(sq => sq.id === q.id) ? 'border-primary ring-1 ring-primary' : ''}`}
                          onClick={() => addQuestion(q)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox 
                              checked={selectedQuestions.some(sq => sq.id === q.id)} 
                              className="mt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{q.text}</div>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">{q.domain}</Badge>
                                <Badge variant="outline">{q.difficulty}</Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Publish */}
            {currentStep === 3 && (
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Test Summary</h3>
                  <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-muted-foreground">Test Name</Label>
                        <div className="font-medium mt-1">{testDetails.name}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Question Count</Label>
                        <div className="font-medium mt-1">{selectedQuestions.length}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Creation Method</Label>
                        <div className="font-medium mt-1 capitalize">{testDetails.method}</div>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Domain Distribution</h3>
                  <Card className="p-6">
                    <div className="space-y-4">
                      {domainBlueprint.map((domain) => {
                        const actualCount = getDomainCount(domain.name);
                        const percentage = domain.target > 0 ? Math.round((actualCount / domain.target) * 100) : 0;
                        return (
                          <div key={domain.name}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{domain.name}</span>
                              <span className="text-muted-foreground">{actualCount}/{domain.target} ({percentage}%)</span>
                            </div>
                            <Progress value={Math.min(percentage, 100)} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Selected Questions</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Domain</TableHead>
                          <TableHead>Difficulty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQuestions.map((q) => (
                          <TableRow key={q.id}>
                            <TableCell className="font-medium max-w-md truncate">{q.text}</TableCell>
                            <TableCell><Badge variant="secondary">{q.domain}</Badge></TableCell>
                            <TableCell><Badge variant="outline">{q.difficulty}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800">Confirm Test Creation</h4>
                    <p className="text-sm text-yellow-700">Please review all details before publishing. Once published, the test will be available to users.</p>
                  </div>
                  <Checkbox 
                    id="confirm-publish" 
                    checked={isConfirmed}
                    onCheckedChange={setIsConfirmed}
                  />
                  <Label htmlFor="confirm-publish" className="ml-2 text-yellow-800">I confirm all details are correct</Label>
                </div>
              </div>
            )}
          </div>
          
          {/* Sheet Footer with Navigation */}
          <div className="p-6 border-t flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} className="mr-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep < 3 ? (
                <Button onClick={nextStep} disabled={currentStep === 1 && !testDetails.name}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSaveTest}
                  disabled={!isConfirmed}
                >
                  {isEditing ? 'Update Test' : 'Publish Test'}
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
