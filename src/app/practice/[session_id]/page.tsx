'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: string;
}

export default function PracticeModePage() {
  const params = useParams();
  const sessionId = params.session_id as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Mock questions data
  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the primary purpose of a project charter?',
      options: [
        'To define the project scope in detail',
        'To formally authorize the project and provide the project manager with authority',
        'To create the work breakdown structure',
        'To establish the project budget'
      ],
      correctAnswer: 1,
      explanation: 'The project charter formally authorizes the project and gives the project manager the authority to apply organizational resources to project activities. It is created during the Initiating process group.',
      domain: 'Integration Management'
    },
    {
      id: '2',
      text: 'Which of the following is NOT a characteristic of a project?',
      options: [
        'Temporary endeavor',
        'Creates a unique product or service',
        'Ongoing operations',
        'Has a definite beginning and end'
      ],
      correctAnswer: 2,
      explanation: 'Projects are temporary endeavors with a definite beginning and end, creating unique products or services. Ongoing operations are not projects but rather repetitive activities that sustain the organization.',
      domain: 'Project Framework'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    if (!showFeedback) {
      setSelectedAnswer(value);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      setShowFeedback(true);
      setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    }
  };

  const isCorrect = showFeedback && parseInt(selectedAnswer) === currentQuestion.correctAnswer;

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Practice Mode</h1>
              <div className="text-sm text-gray-600">
                Session: {sessionId}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {currentQuestion.domain}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6">{currentQuestion.text}</p>

              <RadioGroup 
                value={selectedAnswer} 
                onValueChange={handleAnswerSelect}
                disabled={showFeedback}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let optionClass = "flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50";
                    
                    if (showFeedback) {
                      if (index === currentQuestion.correctAnswer) {
                        optionClass += " bg-green-50 border-green-200";
                      } else if (parseInt(selectedAnswer) === index && index !== currentQuestion.correctAnswer) {
                        optionClass += " bg-red-50 border-red-200";
                      }
                    }

                    return (
                      <div key={index} className={optionClass}>
                        <RadioGroupItem 
                          value={index.toString()} 
                          id={`option-${index}`}
                          className="mt-1"
                        />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="flex-1 cursor-pointer"
                        >
                          {option}
                          {showFeedback && index === currentQuestion.correctAnswer && (
                            <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                          )}
                          {showFeedback && parseInt(selectedAnswer) === index && index !== currentQuestion.correctAnswer && (
                            <span className="ml-2 text-red-600 font-medium">✗ Incorrect</span>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>

              {/* Feedback Section */}
              {showFeedback && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-700">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <div></div>
                <div className="space-x-3">
                  {!showFeedback ? (
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex >= questions.length - 1}
                    >
                      {currentQuestionIndex >= questions.length - 1 ? 'Practice Complete' : 'Next Question'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{answeredQuestions.size}</div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-400">{questions.length - answeredQuestions.size}</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}