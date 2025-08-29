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

// --- MOCK DATA ---

const initialTests = [
  { id: '1', name: 'PMP Mock Exam #1', type: 'Full Exam', questionCount: 180, status: 'Active' },
  { id: '2', name: 'Agile Practice Test', type: 'Domain Quiz', questionCount: 60, status: 'Active' },
  { id: '3', name: 'Risk Management Quiz', type: 'Knowledge Area', questionCount: 40, status: 'Draft' },
];

const allQuestions = [
  { id: 'q101', text: 'What is the primary purpose of a project charter?', domain: 'Process', difficulty: 'Easy' },
  { id: 'q102', text: 'Which leadership style is most effective in a crisis?', domain: 'People', difficulty: 'Medium' },
  { id: 'q103', text: 'Calculate the SPI if EV is $500 and PV is $600.', domain: 'Process', difficulty: 'Medium' },
  { id: 'q104', text: 'What is the key output of the "Identify Risks" process?', domain: 'Process', difficulty: 'Hard' },
  { id: 'q105', text: 'Describe the concept of "servant leadership" in Agile.', domain: 'Agile', difficulty: 'Easy' },
  { id: 'q106', text: 'How does organizational culture impact project management?', domain: 'Business Environment', difficulty: 'Medium' },
  { id: 'q107', text: 'What is the main difference between a risk and an issue?', domain: 'Process', difficulty: 'Easy' },
  { id: 'q108', text: 'A key stakeholder is resistant to change. What is the first step?', domain: 'People', difficulty: 'Medium' },
];

// --- COMPONENT ---

export default function TestManagement() {
  const [tests, setTests] = useState(initialTests);
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
    setSelectedQuestions([allQuestions[0], allQuestions[2], allQuestions[5]]); // Mock selected questions for editing
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
    return allQuestions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = filterDomain === 'all' || q.domain === filterDomain;
      return matchesSearch && matchesDomain;
    });
  }, [searchTerm, filterDomain]);
  
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

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
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

      {/* Editor Sheet for Test Creation/Editing */}
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
                      <p className="text-sm text-muted-foreground">Create a balanced test instantly based on a blueprint.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Build */}
            {currentStep === 2 && (
                <>
                {testDetails.method === 'manual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 h-full overflow-hidden">
                    <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-6 flex flex-col">
                      <h3 className="font-bold text-lg mb-4">Available Questions</h3>
                      <div className="flex gap-2 mb-4">
                        <Input type="text" placeholder="Search questions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow" />
                        <Select value={filterDomain} onValueChange={setFilterDomain}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Domains" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Domains</SelectItem>
                            <SelectItem value="People">People</SelectItem>
                            <SelectItem value="Process">Process</SelectItem>
                            <SelectItem value="Business Environment">Business Env.</SelectItem>
                            <SelectItem value="Agile">Agile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                        {filteredAvailableQuestions.map(q => (
                          <div key={q.id} className="bg-muted p-3 rounded-lg border flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold truncate max-w-xs">{q.text}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="secondary">{q.domain}</Badge>
                                    <Badge variant="outline">{q.difficulty}</Badge>
                                </div>
                            </div>
                            <Button 
                              onClick={() => addQuestion(q)} 
                              disabled={selectedQuestions.some(sq => sq.id === q.id)} 
                              size="sm"
                              variant="outline"
                              className="text-sm font-bold"
                            >
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 p-6 flex flex-col bg-muted/30">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Test Blueprint</h3>
                        <p className="font-semibold text-lg">{`${selectedQuestions.length} / ${testDetails.count}`}</p>
                      </div>
                      <div className="space-y-3 mt-4">
                          <h4 className="text-sm font-semibold mb-2">Domain Breakdown</h4>
                          {domainBlueprint.map(d => (
                              <div key={d.name}>
                                  <div className="flex justify-between text-xs mb-1">
                                      <span>{d.name}</span>
                                      <span>{`${getDomainCount(d.name)} / ${d.target}`}</span>
                                  </div>
                                  <Progress value={(getDomainCount(d.name) / d.target) * 100} className="h-1.5" />
                              </div>
                          ))}
                      </div>
                      <div className="flex-grow overflow-y-auto space-y-2 mt-4 border-t pt-4">
                        {selectedQuestions.map(q => (
                          <div key={q.id} className="bg-white p-2 rounded-lg border flex justify-between items-center cursor-grab">
                            <p className="text-sm font-semibold truncate max-w-[200px]">{q.text}</p>
                            <Button onClick={() => removeQuestion(q.id)} variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-500/10">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 space-y-8">
                      <div>
                          <h3 className="font-semibold text-lg">Define Test Blueprint</h3>
                          <p className="text-sm text-muted-foreground">The system will generate a test by randomly selecting questions that match these rules.</p>
                      </div>
                      <div className="space-y-4">
                          <h4 className="font-bold">Domain Percentages</h4>
                          <div><Label>People (42%)</Label><Input type="range" defaultValue="42" className="w-full mt-1" /></div>
                          <div><Label>Process (50%)</Label><Input type="range" defaultValue="50" className="w-full mt-1" /></div>
                          <div><Label>Business Environment (8%)</Label><Input type="range" defaultValue="8" className="w-full mt-1" /></div>
                      </div>
                      <div className="space-y-4">
                          <h4 className="font-bold">Difficulty Mix</h4>
                          <div><Label>Easy (25%)</Label><Input type="range" defaultValue="25" className="w-full mt-1" /></div>
                          <div><Label>Medium (50%)</Label><Input type="range" defaultValue="50" className="w-full mt-1" /></div>
                          <div><Label>Hard (25%)</Label><Input type="range" defaultValue="25" className="w-full mt-1" /></div>
                      </div>
                  </div>
                )}
                </>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="p-8">
                  <h3 className="text-xl font-bold mb-4">Review & Publish</h3>
                  <div className="bg-muted p-6 rounded-lg border space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm text-muted-foreground">Test Name</p><p className="font-semibold">{testDetails.name || "Untitled Test"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Question Count</p><p className="font-semibold">{selectedQuestions.length} Questions</p></div>
                      </div>
                      <div>
                          <p className="text-sm text-muted-foreground mb-2">Final Blueprint Analysis</p>
                          <div className="space-y-2">
                              {domainBlueprint.map(d => (
                                  <div key={d.name}>
                                      <div className="flex justify-between text-xs mb-1">
                                          <span className="font-medium">{d.name}</span>
                                          <span>{`${getDomainCount(d.name)} questions (${selectedQuestions.length > 0 ? ((getDomainCount(d.name)/selectedQuestions.length)*100).toFixed(0) : 0}%)`}</span>
                                      </div>
                                      <Progress value={selectedQuestions.length > 0 ? (getDomainCount(d.name) / selectedQuestions.length) * 100 : 0} className="h-2" />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                  <div className="mt-6 flex items-center space-x-3">
                      <Checkbox id="confirm" checked={isConfirmed} onCheckedChange={(checked) => setIsConfirmed(checked)} />
                      <Label htmlFor="confirm" className="text-sm">I have reviewed the test and confirm it is ready for publishing.</Label>
                  </div>
                  {testDetails.method === 'auto' && <Button variant="link" className="mt-4 px-0">Re-generate Questions</Button>}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-background flex justify-between items-center flex-shrink-0">
            {currentStep > 1 ? (
              <Button variant="ghost" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : <div></div>}
            
            <div className="flex gap-4">
              {currentStep < 3 ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                    disabled={!isConfirmed} 
                    className="bg-green-600 hover:bg-green-700"
                >
                  Publish Test
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AuthGuard>
  );
}