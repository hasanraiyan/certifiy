'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Home
} from 'lucide-react';
import { ExamResults, QuestionResult, Question } from '@/lib/exam/types';

interface PracticeResultsProps {
  results: ExamResults;
  questions: Question[];
  onRetakePractice?: () => void;
  onBackToDashboard?: () => void;
  className?: string;
}

interface QuestionWithResult extends Question {
  result: QuestionResult;
  isCorrect: boolean;
}

export function PracticeResults({ 
  results, 
  questions,
  onRetakePractice, 
  onBackToDashboard,
  className 
}: PracticeResultsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Combine questions with their results
  const questionsWithResults: QuestionWithResult[] = questions.map(question => {
    const result = results.questionResults.find(r => r.questionId === question.id);
    return {
      ...question,
      result: result || {
        questionId: question.id,
        correct: false,
        selectedAnswer: [],
        correctAnswer: Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer],
        timeSpent: 0,
        domain: question.domain
      },
      isCorrect: result?.correct || false
    };
  });

  // Group questions by domain
  const questionsByDomain = questionsWithResults.reduce((acc, question) => {
    if (!acc[question.domain]) {
      acc[question.domain] = [];
    }
    acc[question.domain].push(question);
    return acc;
  }, {} as Record<string, QuestionWithResult[]>);

  // Calculate domain performance
  const domainPerformance = Object.entries(questionsByDomain).map(([domain, domainQuestions]) => {
    const correct = domainQuestions.filter(q => q.isCorrect).length;
    const total = domainQuestions.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    
    return {
      domain,
      correct,
      total,
      percentage: Math.round(percentage),
      questions: domainQuestions
    };
  });

  // Get weak areas (domains with < 70% score)
  const weakAreas = domainPerformance.filter(d => d.percentage < 70);
  const strongAreas = domainPerformance.filter(d => d.percentage >= 80);

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const expandAllQuestions = () => {
    setExpandedQuestions(new Set(questions.map(q => q.id)));
  };

  const collapseAllQuestions = () => {
    setExpandedQuestions(new Set());
  };

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index); // A, B, C, D...

  const renderQuestionOption = (option: string, index: number, question: QuestionWithResult) => {
    const isSelected = question.result.selectedAnswer.includes(index);
    const isCorrect = question.result.correctAnswer.includes(index);
    
    let optionClass = 'p-3 border rounded-lg ';
    if (isCorrect && isSelected) {
      optionClass += 'bg-green-50 border-green-200 text-green-800';
    } else if (isCorrect) {
      optionClass += 'bg-green-50 border-green-200 text-green-700';
    } else if (isSelected) {
      optionClass += 'bg-red-50 border-red-200 text-red-800';
    } else {
      optionClass += 'bg-gray-50 border-gray-200';
    }

    return (
      <div key={index} className={optionClass}>
        <div className="flex items-start gap-3">
          <span className="font-semibold text-sm">
            {getOptionLetter(index)}.
          </span>
          <span className="flex-1">{option}</span>
          <div className="flex items-center gap-1">
            {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            {isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Practice Results</h2>
          <p className="text-muted-foreground">Review your answers and learn from explanations</p>
        </div>
        <div className="flex gap-2">
          {onRetakePractice && (
            <Button onClick={onRetakePractice} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Practice
            </Button>
          )}
          {onBackToDashboard && (
            <Button variant="outline" onClick={onBackToDashboard} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Overall Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Practice Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{results.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {results.answeredQuestions - results.correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{Math.round(results.score)}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
          </div>
          
          <Progress value={results.score} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="review" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="review">Question Review</TabsTrigger>
          <TabsTrigger value="domains">Domain Analysis</TabsTrigger>
          <TabsTrigger value="study">Study Plan</TabsTrigger>
        </TabsList>

        {/* Question Review Tab */}
        <TabsContent value="review" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Questions ({questions.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAllQuestions}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAllQuestions}>
                Collapse All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {questionsWithResults.map((question, index) => (
              <Card key={question.id} className={`${question.isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                <Collapsible
                  open={expandedQuestions.has(question.id)}
                  onOpenChange={() => toggleQuestionExpansion(question.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Q{index + 1}</span>
                            {question.isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {question.domain}
                          </Badge>
                          <Badge variant={question.difficulty === 'easy' ? 'secondary' : question.difficulty === 'medium' ? 'default' : 'destructive'} className="text-xs">
                            {question.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.round(question.result.timeSpent)}s
                          </span>
                          {expandedQuestions.has(question.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Question Text */}
                        <div className="prose prose-sm max-w-none">
                          <p className="font-medium">{question.text}</p>
                          {question.imageUrl && (
                            <img 
                              src={question.imageUrl} 
                              alt="Question diagram" 
                              className="max-w-full h-auto rounded-lg border"
                            />
                          )}
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Answer Options:</h4>
                          {question.options.map((option, optionIndex) => 
                            renderQuestionOption(option, optionIndex, question)
                          )}
                        </div>

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
                                <p className="text-blue-700 text-sm">{question.explanation}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Performance Indicator */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                          <span>Knowledge Area: {question.knowledgeArea}</span>
                          <span>
                            {question.isCorrect ? 'Correct' : 'Incorrect'} • 
                            Time: {Math.round(question.result.timeSpent)}s
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Domain Analysis Tab */}
        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance by Domain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainPerformance.map((domain) => (
                  <div key={domain.domain} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{domain.domain}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {domain.correct}/{domain.total}
                        </span>
                        <Badge variant={domain.percentage >= 70 ? 'default' : 'destructive'}>
                          {domain.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={domain.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Incorrect Questions by Domain */}
          <Card>
            <CardHeader>
              <CardTitle>Questions to Review by Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(questionsByDomain).map(([domain, domainQuestions]) => {
                  const incorrectQuestions = domainQuestions.filter(q => !q.isCorrect);
                  if (incorrectQuestions.length === 0) return null;

                  return (
                    <div key={domain} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{domain}</h4>
                        <Badge variant="destructive">
                          {incorrectQuestions.length} to review
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {incorrectQuestions.map((question) => (
                          <div key={question.id} className="text-sm text-muted-foreground">
                            • Question {questions.findIndex(q => q.id === question.id) + 1}: {question.text.substring(0, 80)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Plan Tab */}
        <TabsContent value="study" className="space-y-6">
          {/* Weak Areas */}
          {weakAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Priority Study Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weakAreas.map((area) => (
                    <div key={area.domain} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-red-800">{area.domain}</h4>
                        <Badge variant="destructive">{area.percentage}%</Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-3">
                        You got {area.correct} out of {area.total} questions correct. 
                        Focus on this area to improve your overall score.
                      </p>
                      <div className="text-sm text-red-600">
                        <strong>Recommended actions:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Review the explanations for incorrect questions in this domain</li>
                          <li>Study additional materials on {area.domain}</li>
                          <li>Take focused practice tests on this topic</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strong Areas */}
          {strongAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Strong Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {strongAreas.map((area) => (
                    <div key={area.domain} className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                      <div>
                        <span className="font-medium text-green-800">{area.domain}</span>
                        <p className="text-sm text-green-600">
                          Great job! You scored {area.percentage}% in this area.
                        </p>
                      </div>
                      <Badge className="bg-green-600">{area.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Study Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Immediate Actions</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Review all incorrect answers above</li>
                      <li>• Focus on explanations you didn&apos;t understand</li>
                      <li>• Note patterns in your mistakes</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Long-term Study</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Create study schedule for weak domains</li>
                      <li>• Take more practice tests</li>
                      <li>• Join study groups or forums</li>
                    </ul>
                  </div>
                </div>

                {/* Overall Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Overall Recommendation</h4>
                  <p className="text-blue-700 text-sm">
                    {results.score >= 80 
                      ? "Excellent work! You&apos;re ready for the certification exam. Consider taking a few more practice tests to maintain your performance level."
                      : results.score >= 70
                      ? "Good progress! Focus on your weak areas and take more practice tests. You&apos;re close to being ready for the certification exam."
                      : "Keep studying! Focus heavily on the priority areas identified above. Take more practice tests and review fundamental concepts before attempting the certification exam."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}