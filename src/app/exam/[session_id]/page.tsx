'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  domain: string;
}

export default function TestModePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.session_id as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(4 * 60 * 60); // 4 hours in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

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
      domain: 'Project Framework'
    },
    {
      id: '3',
      text: 'What is the difference between a program and a project?',
      options: [
        'Programs are smaller than projects',
        'Programs are a group of related projects managed together',
        'Programs have shorter durations',
        'There is no difference'
      ],
      correctAnswer: 1,
      domain: 'Program Management'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmitExam]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSaveAndNext = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: parseInt(selectedAnswer)
      }));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]?.toString() || '');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]?.toString() || '');
    }
  };

  const handleSubmitExam = useCallback(() => {
    // Save current answer if any
    if (selectedAnswer) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: parseInt(selectedAnswer)
      }));
    }

    // Redirect to results page
    router.push(`/results/${sessionId}`);
  }, [selectedAnswer, currentQuestionIndex, router, sessionId]);

  const answeredCount = Object.keys(answers).length + (selectedAnswer ? 1 : 0);
  const isTimeRunningOut = timeRemaining < 300; // Less than 5 minutes

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Timer */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Test Mode</h1>
              <div className={`text-lg font-mono font-bold px-4 py-2 rounded ${
                isTimeRunningOut ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-gray-600">
                {answeredCount}/{questions.length} answered
              </span>
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
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
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
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <div className="space-x-3">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setShowSubmitDialog(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Exam
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((_, index) => {
                  const isAnswered = answers.hasOwnProperty(index) || (index === currentQuestionIndex && selectedAnswer);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        // Save current answer before navigating
                        if (selectedAnswer) {
                          setAnswers(prev => ({
                            ...prev,
                            [currentQuestionIndex]: parseInt(selectedAnswer)
                          }));
                        }
                        setCurrentQuestionIndex(index);
                        setSelectedAnswer(answers[index]?.toString() || '');
                      }}
                      className={`
                        w-10 h-10 rounded text-sm font-medium border-2 transition-colors
                        ${isCurrent 
                          ? 'border-blue-500 bg-blue-500 text-white' 
                          : isAnswered 
                            ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-green-500 bg-green-100 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Confirmation Dialog */}
          {showSubmitDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Submit Exam?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Are you sure you want to submit your exam? You have answered {answeredCount} out of {questions.length} questions.
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Once submitted, you cannot make any changes to your answers.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSubmitDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmitExam}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}