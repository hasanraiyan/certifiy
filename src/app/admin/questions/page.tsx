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

interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'hotspot' | 'drag_drop';
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function QuestionBankManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'mcq' as 'mcq' | 'hotspot' | 'drag_drop',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    domain: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: [] as string[]
  });
  
  const handleCreateQuestion = () => {
    // TODO: Implement question creation
    console.log('Creating question:', newQuestion);
    // Reset form
    setNewQuestion({
      text: '',
      type: 'mcq',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      domain: '',
      difficulty: 'medium',
      tags: [] as string[]
    });
  };

  // Mock questions data
  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the primary purpose of a project charter?',
      type: 'mcq',
      options: [
        'To define the project scope in detail',
        'To formally authorize the project and provide the project manager with authority',
        'To create the work breakdown structure',
        'To establish the project budget'
      ],
      correctAnswer: 1,
      explanation: 'The project charter formally authorizes the project and gives the project manager the authority to apply organizational resources to project activities.',
      domain: 'Integration Management',
      difficulty: 'medium',
      tags: []
    },
    {
      id: '2',
      text: 'Which of the following is NOT a characteristic of a project?',
      type: 'mcq',
      options: [
        'Temporary endeavor',
        'Creates a unique product or service',
        'Ongoing operations',
        'Has a definite beginning and end'
      ],
      correctAnswer: 2,
      explanation: 'Projects are temporary endeavors with a definite beginning and end, creating unique products or services. Ongoing operations are not projects.',
      domain: 'Project Framework',
      difficulty: 'easy',
      tags: []
    }
  ];

  const domains = [
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
    'Project Framework',
    'Agile'
  ];

  const handleEditQuestion = (question: Question) => {
    // TODO: Implement edit functionality
    console.log('Editing question:', question.id);
  };

  const handleDeleteQuestion = (questionId: string) => {
    // TODO: Implement question deletion
    console.log('Deleting question:', questionId);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || question.domain === filterDomain;
    const matchesDifficulty = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
    
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  return (
    <AuthGuard allowedRoles={['content_manager', 'admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Bank Management</h1>
            <p className="text-gray-600">Create, edit, and manage all exam questions</p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Questions</TabsTrigger>
              <TabsTrigger value="create">Create Question</TabsTrigger>
            </TabsList>

            {/* Browse Questions Tab */}
            <TabsContent value="browse">
              <Card>
                <CardHeader>
                  <CardTitle>Question Library</CardTitle>
                  <CardDescription>Search and manage existing questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <Label htmlFor="search">Search Questions</Label>
                      <Input
                        id="search"
                        placeholder="Search by text or domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="domain-filter">Domain</Label>
                      <Select value={filterDomain} onValueChange={setFilterDomain}>
                        <SelectTrigger>
                          <SelectValue placeholder="All domains" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Domains</SelectItem>
                          {domains.map(domain => (
                            <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty-filter">Difficulty</Label>
                      <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                        <SelectTrigger>
                          <SelectValue placeholder="All difficulties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Difficulties</SelectItem>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button onClick={() => {
                        setSearchTerm('');
                        setFilterDomain('all');
                        setFilterDifficulty('all');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {filteredQuestions.map((question) => (
                      <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {question.domain}
                                </span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {question.difficulty}
                                </span>
                                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                  {question.type.toUpperCase()}
                                </span>
                              </div>
                              
                              <p className="font-medium mb-2">{question.text}</p>
                              
                              <div className="text-sm text-gray-600 space-y-1">
                                {question.options.map((option, index) => (
                                  <div key={index} className={`${
                                    index === question.correctAnswer ? 'font-medium text-green-600' : ''
                                  }`}>
                                    {String.fromCharCode(65 + index)}. {option}
                                    {index === question.correctAnswer && ' ✓'}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-2 text-sm text-gray-500">
                                Tags: {question.tags.join(', ')}
                              </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditQuestion(question)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No questions found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Question Tab */}
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Question</CardTitle>
                  <CardDescription>Add a new question to the question bank</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="question-type">Question Type</Label>
                      <Select 
                        value={newQuestion.type} 
                        onValueChange={(value: 'mcq' | 'hotspot' | 'drag_drop') => 
                          setNewQuestion(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">Multiple Choice</SelectItem>
                          <SelectItem value="hotspot">Hotspot</SelectItem>
                          <SelectItem value="drag_drop">Drag & Drop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="domain">Domain</Label>
                      <Select 
                        value={newQuestion.domain} 
                        onValueChange={(value) => setNewQuestion(prev => ({ ...prev, domain: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {domains.map(domain => (
                            <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question-text">Question Text</Label>
                    <Textarea
                      id="question-text"
                      placeholder="Enter the question text..."
                      value={newQuestion.text}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Answer Options</Label>
                    <div className="space-y-3">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="correct-answer"
                            checked={newQuestion.correctAnswer === index}
                            onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: index }))}
                          />
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion(prev => ({ ...prev, options: newOptions }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Explain why the correct answer is correct..."
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select 
                        value={newQuestion.difficulty} 
                        onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                          setNewQuestion(prev => ({ ...prev, difficulty: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., charter, authorization, project-manager"
                        value={Array.isArray(newQuestion.tags) ? newQuestion.tags.join(', ') : newQuestion.tags}
                        onChange={(e) => {
                          const tagsValue = e.target.value;
                          const tagsArray = tagsValue.split(',').map(tag => tag.trim()).filter(Boolean);
                          setNewQuestion(prev => ({
                            ...prev,
                            tags: tagsArray
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleCreateQuestion}>
                      Create Question
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setNewQuestion({
                        text: '',
                        type: 'mcq',
                        options: ['', '', '', ''],
                        correctAnswer: 0,
                        explanation: '',
                        domain: '',
                        difficulty: 'medium',
                        tags: [] as string[]
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