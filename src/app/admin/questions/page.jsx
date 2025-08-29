'use client';

import { useState, useMemo } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { useAdmin } from '@/context/admin-context'; // Import the useAdmin hook

// --- COMPONENT ---
export default function QuestionBankManagement() {
  // Get state and functions from the context
  const { questions, createQuestion, updateQuestion, deleteQuestion } = useAdmin();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const searchMatch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
      const domainMatch = filterDomain === 'all' || q.domain === filterDomain;
      const difficultyMatch = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
      return searchMatch && domainMatch && difficultyMatch;
    });
  }, [questions, searchTerm, filterDomain, filterDifficulty]);

  const handleOpenDrawer = (question = null) => {
    if (question) {
      setIsEditing(true);
      setCurrentQuestion({ ...question });
    } else {
      setIsEditing(false);
      setCurrentQuestion({ 
        type: 'MCQ', 
        domain: 'Process', 
        difficulty: 'Medium', 
        status: 'Draft', 
        options: ['', '', '', ''], 
        explanation: '' 
      });
    }
    setIsDrawerOpen(true);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterDomain('all');
    setFilterDifficulty('all');
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return "bg-green-100 text-green-700 hover:bg-green-100 border border-green-200";
      case 'Medium': return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border border-yellow-200";
      case 'Hard': return "bg-red-100 text-red-700 hover:bg-red-100 border border-red-200";
      default: return "bg-gray-100 text-gray-700 hover:bg-gray-100 border border-gray-200";
    }
  };

  const handleSave = () => {
    if (isEditing) {
      updateQuestion(currentQuestion.id, currentQuestion);
    } else {
      createQuestion(currentQuestion);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (questionId) => {
    deleteQuestion(questionId);
    setIsDrawerOpen(false);
  };

  return (
    <AuthGuard allowedRoles={['content_manager', 'admin', 'super_admin']}>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Question Bank</h1>
          <p className="mt-1 text-muted-foreground">Create, edit, and manage all exam questions.</p>
        </div>
        <Button onClick={() => handleOpenDrawer()}>
          <Plus className="w-5 h-5 mr-2" />
          Add Question
        </Button>
      </div>

      <Card className="mb-6 p-0">
        <CardContent className="p-4 rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="People">People</SelectItem>
                <SelectItem value="Process">Process</SelectItem>
                <SelectItem value="Business Environment">Business Environment</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters} className="w-full md:w-auto">Clear</Button>
          </div>
        </CardContent>
      </Card>
        
      <Card className='p-0'>
        <div className="overflow-x-auto rounded-xl">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800">
              <TableRow>
                <TableHead className="w-12 p-4"><Checkbox /></TableHead>
                <TableHead className="p-4 text-left font-semibold">Question</TableHead>
                <TableHead className="p-4 text-left font-semibold">Type</TableHead>
                <TableHead className="p-4 text-left font-semibold">Domain</TableHead>
                <TableHead className="p-4 text-left font-semibold">Difficulty</TableHead>
                <TableHead className="p-4 text-left font-semibold">Status</TableHead>
                <TableHead className="p-4 text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="p-4"><Checkbox /></TableCell>
                  <TableCell className="p-4 font-medium max-w-sm truncate" title={q.text}>{q.text}</TableCell>
                  <TableCell className="p-4"><Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">{q.type}</Badge></TableCell>
                  <TableCell className="p-4 text-muted-foreground">{q.domain}</TableCell>
                  <TableCell className="p-4"><Badge className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</Badge></TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${q.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>{q.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <Button variant="link" className="h-auto p-0 text-primary" onClick={() => handleOpenDrawer(q)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredQuestions.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No questions found matching your criteria.
          </div>
        )}
      </Card>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full max-w-2xl sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>{isEditing ? 'Edit Question' : 'Create New Question'}</SheetTitle>
            <SheetDescription>
              {isEditing ? 'Make changes to the question details below.' : 'Fill out the form to add a new question to the bank.'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-grow p-6 space-y-6 overflow-y-auto">
            <div>
              <div>
                <Label htmlFor="q-text" className="font-semibold">Question Text</Label>
                <Textarea 
                  id="q-text" 
                  value={currentQuestion.text || ''} 
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))} 
                  rows={4} 
                  className="mt-2" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="q-type" className="font-semibold">Question Type</Label>
                  <Select 
                    value={currentQuestion.type || 'MCQ'} 
                    onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="q-type" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MCQ">Multiple Choice</SelectItem>
                      <SelectItem value="Hotspot">Hotspot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="q-domain" className="font-semibold">Domain</Label>
                  <Select 
                    value={currentQuestion.domain || 'Process'} 
                    onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, domain: value }))}
                  >
                    <SelectTrigger id="q-domain" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="People">People</SelectItem>
                      <SelectItem value="Process">Process</SelectItem>
                      <SelectItem value="Business Environment">Business Environment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="q-difficulty" className="font-semibold">Difficulty</Label>
                  <Select 
                    value={currentQuestion.difficulty || 'Medium'} 
                    onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger id="q-difficulty" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="q-status" className="font-semibold">Status</Label>
                  <Select 
                    value={currentQuestion.status || 'Draft'} 
                    onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger id="q-status" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentQuestion.type === 'MCQ' && (
                <div>
                  <Label className="font-semibold">Options</Label>
                  <div className="space-y-3 mt-2">
                    {(currentQuestion.options || ['', '', '', '']).map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <RadioGroup 
                          value={String(currentQuestion.correctAnswer || 0)} 
                          onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(value) }))}
                          className="flex flex-col"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={String(index)} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`}>Correct</Label>
                          </div>
                        </RadioGroup>
                        <Input 
                          value={option} 
                          onChange={(e) => {
                            const newOptions = [...(currentQuestion.options || ['', '', '', ''])];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                          }} 
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="q-explanation" className="font-semibold">Explanation</Label>
                <Textarea 
                  id="q-explanation" 
                  value={currentQuestion.explanation || ''} 
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))} 
                  rows={3} 
                  className="mt-2" 
                />
              </div>
            </div>
          </div>
          
          <SheetFooter className="p-6 border-t flex-shrink-0">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onClick={handleSave}>Save Question</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </AuthGuard>
    );
  }