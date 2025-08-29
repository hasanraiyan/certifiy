'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle , AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, MoreHorizontal, X, FileQuestion, Filter } from 'lucide-react';
import { useAdmin } from '@/context/admin-context';

// --- COMPONENT ---
export default function QuestionBankManagement() {
  const { questions, createQuestion, updateQuestion, deleteQuestion } = useAdmin();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Smartly cleans up the question state when the type changes in the form.
  useEffect(() => {
    if (!currentQuestion) return;

    setCurrentQuestion(prev => {
      const newQuestion = { ...prev };
      
      if (newQuestion.type === 'MCQ') {
        delete newQuestion.imageUrl;
        delete newQuestion.hotspotArea;
        if (!newQuestion.options || !Array.isArray(newQuestion.options)) {
          newQuestion.options = ['', '', '', ''];
          newQuestion.correctAnswer = 0;
        }
      } 
      else if (newQuestion.type === 'Hotspot') {
        delete newQuestion.options;
        delete newQuestion.correctAnswer;
        if (!newQuestion.hotspotArea) {
          newQuestion.hotspotArea = { x: 50, y: 50, width: 100, height: 100 };
        }
        if(!newQuestion.imageUrl) {
            newQuestion.imageUrl = '';
        }
      }
      return newQuestion;
    });
  }, [currentQuestion?.type]);


  const filteredQuestions = useMemo(() => {
    // Ensure questions is defined and is an array before filtering
    if (!questions || !Array.isArray(questions)) {
      return [];
    }
    
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
      setCurrentQuestion(JSON.parse(JSON.stringify(question)));
    } else {
      setIsEditing(false);
      setCurrentQuestion({ 
        text: '', type: 'MCQ', domain: 'Process', difficulty: 'Medium', status: 'Draft', 
        options: ['', '', '', ''], correctAnswer: 0, explanation: '' 
      });
    }
    setIsDrawerOpen(true);
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddOption = () => {
    setCurrentQuestion(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const handleRemoveOption = (index) => {
    if (currentQuestion.options.length <= 2) {
      toast.error("A question must have at least two options.");
      return;
    }
    if (currentQuestion.correctAnswer === index) {
      toast.error("You cannot remove the correct answer.");
      return;
    }
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    const newCorrectAnswer = currentQuestion.correctAnswer > index ? currentQuestion.correctAnswer - 1 : currentQuestion.correctAnswer;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions, correctAnswer: newCorrectAnswer }));
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return "bg-green-100 text-green-800 border-green-200";
      case 'Medium': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'Hard': return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return "bg-green-100 text-green-800 border-green-200";
      case 'Draft': return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSave = () => {
    if (!currentQuestion.text.trim()) {
      toast.error("Question text cannot be empty.");
      return;
    }
    if (isEditing) {
      updateQuestion(currentQuestion.id, currentQuestion);
      toast.success("Question updated successfully!");
    } else {
      createQuestion(currentQuestion);
      toast.success("Question created successfully!");
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (questionId) => {
    deleteQuestion(questionId);
    toast.success("Question deleted.");
    setIsDeleteDialogOpen(false);
    setQuestionToDelete(null);
    setIsDrawerOpen(false); // Also close the edit drawer if deleting from there
  };
  
  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? (filteredQuestions || []).map(q => q.id) : []);
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    selectedRows.forEach(id => deleteQuestion(id));
    toast.success(`${selectedRows.length} question(s) deleted.`);
    setSelectedRows([]);
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Question Bank</h1>
          <p className="mt-1 text-muted-foreground">Create, edit, and manage all exam questions.</p>
        </div>
      </div>
      
      <Card className={"m-0 p-0"}>
        <CardHeader className="p-4 border-b">
          <div className="flex items-center gap-2 ">
            {selectedRows.length > 0 ? (
              <div className="flex items-center gap-2 w-full">
                <span className="text-sm font-medium text-muted-foreground">{selectedRows.length} selected</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete {selectedRows.length} questions.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <>
                <Input placeholder="Search questions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow"/>
                <div className="hidden md:flex items-center gap-2">
                  <Select value={filterDomain} onValueChange={setFilterDomain}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Domains</SelectItem>
                        <SelectItem value="People">People</SelectItem>
                        <SelectItem value="Process">Process</SelectItem>
                        <SelectItem value="Business Environment">Business Environment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsFilterDrawerOpen(true)}><Filter className="w-4 h-4" /></Button>
                <Button onClick={() => handleOpenDrawer()} className="hidden sm:flex"><Plus className="w-5 h-5 mr-2" /> Add Question</Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow>
                    <TableHead className="w-12 p-4"><Checkbox checked={selectedRows.length > 0 && selectedRows.length === (filteredQuestions || []).length} onCheckedChange={handleSelectAll}/></TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredQuestions || []).length > 0 && (filteredQuestions || []).map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="p-4"><Checkbox checked={selectedRows.includes(q.id)} onCheckedChange={() => handleRowSelect(q.id)}/></TableCell>
                      <TableCell className="font-medium max-w-sm truncate" title={q.text}>{q.text}</TableCell>
                      <TableCell><Badge variant="outline">{q.type}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{q.domain}</TableCell>
                      <TableCell><Badge variant="outline" className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={getStatusBadge(q.status)}>{q.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenDrawer(q)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => {setQuestionToDelete(q.id); setIsDeleteDialogOpen(true);}}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            
            <div className="md:hidden p-4 space-y-4">
              {(filteredQuestions || []).length > 0 && (filteredQuestions || []).map((q) => (
                <Card key={q.id} className="relative">
                  <div className="absolute top-4 left-4"><Checkbox checked={selectedRows.includes(q.id)} onCheckedChange={() => handleRowSelect(q.id)}/></div>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDrawer(q)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => {setQuestionToDelete(q.id); setIsDeleteDialogOpen(true);}}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardHeader><CardTitle className="text-base pr-8">{q.text}</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p><strong>Domain:</strong> {q.domain}</p>
                    <p><strong>Type:</strong> {q.type}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Badge variant="outline" className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</Badge>
                    <Badge variant="outline" className={getStatusBadge(q.status)}>{q.status}</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {(filteredQuestions || []).length === 0 && (
              <div className="text-center p-12">
                <div className="flex flex-col items-center gap-4">
                    <FileQuestion className="w-16 h-16 text-muted-foreground/30" />
                    <h3 className="font-semibold">No questions found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or create a new question.</p>
                    <Button onClick={() => handleOpenDrawer()}><Plus className="w-4 h-4 mr-2" /> Add Question</Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete this question.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setQuestionToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(questionToDelete)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full max-w-3xl sm:max-w-3xl p-0 flex flex-col">
            <SheetHeader className="p-6 border-b">
                <SheetTitle>{isEditing ? 'Edit Question' : 'Create New Question'}</SheetTitle>
                <SheetDescription>{isEditing ? 'Make changes to the question details.' : 'Fill out the form to add a new question.'}</SheetDescription>
            </SheetHeader>
          
          <div className="flex-grow p-6 space-y-4 overflow-y-auto">
            <div className="space-y-2">
                <Label htmlFor="q-text" className="font-semibold">Question Text</Label>
                <Textarea id="q-text" value={currentQuestion?.text || ''} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))} rows={4} placeholder="What is the primary role of a project manager?"/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="q-type" className="font-semibold">Question Type</Label>
                <Select value={currentQuestion?.type || 'MCQ'} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger id="q-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">Multiple Choice</SelectItem>
                    <SelectItem value="Hotspot">Hotspot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-domain" className="font-semibold">Domain</Label>
                <Select value={currentQuestion?.domain || 'Process'} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, domain: value }))}>
                  <SelectTrigger id="q-domain"><SelectValue /></SelectTrigger>
                  <SelectContent>
                     <SelectItem value="People">People</SelectItem>
                     <SelectItem value="Process">Process</SelectItem>
                     <SelectItem value="Business Environment">Business Environment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentQuestion?.type === 'MCQ' && (
              <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                <Label className="font-semibold">Options & Correct Answer</Label>
                <p className="text-sm text-muted-foreground">Select the radio button for the correct answer.</p>
                <RadioGroup value={String(currentQuestion.correctAnswer)} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(value) }))} className="space-y-3 mt-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <RadioGroupItem value={String(index)} id={`option-${index}`} />
                        <Input value={option} onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`}/>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </RadioGroup>
                <Button variant="outline" size="sm" onClick={handleAddOption} className="mt-2"><Plus className="w-4 h-4 mr-2" /> Add Option</Button>
              </div>
            )}

            {currentQuestion?.type === 'Hotspot' && (
              <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="q-image-url" className="font-semibold">Image URL</Label>
                  <Input id="q-image-url" value={currentQuestion.imageUrl || ''} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="https://example.com/image.png"/>
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold">Correct Area Coordinates</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="hs-x" className="text-xs">X</Label>
                            <Input type="number" id="hs-x" value={currentQuestion.hotspotArea?.x || 0} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, hotspotArea: {...prev.hotspotArea, x: parseInt(e.target.value)} }))} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="hs-y" className="text-xs">Y</Label>
                            <Input type="number" id="hs-y" value={currentQuestion.hotspotArea?.y || 0} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, hotspotArea: {...prev.hotspotArea, y: parseInt(e.target.value)} }))} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="hs-w" className="text-xs">Width</Label>
                            <Input type="number" id="hs-w" value={currentQuestion.hotspotArea?.width || 0} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, hotspotArea: {...prev.hotspotArea, width: parseInt(e.target.value)} }))} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="hs-h" className="text-xs">Height</Label>
                            <Input type="number" id="hs-h" value={currentQuestion.hotspotArea?.height || 0} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, hotspotArea: {...prev.hotspotArea, height: parseInt(e.target.value)} }))} />
                        </div>
                    </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="q-explanation" className="font-semibold">Explanation</Label>
                <Textarea id="q-explanation" value={currentQuestion?.explanation || ''} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))} rows={3} placeholder="Provide a detailed explanation..."/>
            </div>
          </div>
          
          <SheetFooter className="p-6 border-t flex-shrink-0">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
              <div>
                {isEditing && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this question.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(currentQuestion.id)}>Continue</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Question</Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader className="text-left"><SheetTitle>Filter Questions</SheetTitle><SheetDescription>Apply filters to find specific questions.</SheetDescription></SheetHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
                <Label>Domain</Label>
                <Select value={filterDomain} onValueChange={setFilterDomain}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All Domains</SelectItem><SelectItem value="People">People</SelectItem><SelectItem value="Process">Process</SelectItem><SelectItem value="Business Environment">Business Environment</SelectItem></SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All Difficulties</SelectItem><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent>
                </Select>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={() => setIsFilterDrawerOpen(false)} className="w-full">Done</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AuthGuard>
  );
}