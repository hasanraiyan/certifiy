'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QuestionResult {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number | null;
  explanation: string;
  domain: string;
  isCorrect: boolean;
}

export default function TestResultsPage() {
  const params = useParams();
  const sessionId = params.session_id as string;

  // Mock results data
  const testResults = {
    sessionId,
    testName: 'PMP Mock Exam #1',
    completedAt: '2025-01-15T14:30:00Z',
    duration: '3h 45m',
    totalQuestions: 180,
    correctAnswers: 142,
    score: 79,
    passingScore: 75,
    passed: true,
    domainBreakdown: [
      { domain: 'People', total: 42, correct: 35, percentage: 83 },
      { domain: 'Process', total: 50, correct: 38, percentage: 76 },
      { domain: 'Business Environment', total: 88, correct: 69, percentage: 78 }
    ]
  };

  // Mock question results
  const questionResults: QuestionResult[] = [
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
      userAnswer: 1,
      explanation: 'The project charter formally authorizes the project and gives the project manager the authority to apply organizational resources to project activities.',
      domain: 'Integration Management',
      isCorrect: true
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
      userAnswer: 0,
      explanation: 'Projects are temporary endeavors with a definite beginning and end, creating unique products or services. Ongoing operations are not projects.',
      domain: 'Project Framework',
      isCorrect: false
    }
  ];

  const scoreColor = testResults.passed ? 'text-green-600' : 'text-red-600';
  const scoreBgColor = testResults.passed ? 'bg-green-100' : 'bg-red-100';

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
            <p className="text-gray-600">{testResults.testName} • Completed on {new Date(testResults.completedAt).toLocaleDateString()}</p>
          </div>

          {/* Overall Score Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${scoreBgColor} mb-4`}>
                  <span className={`text-4xl font-bold ${scoreColor}`}>
                    {testResults.score}%
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {testResults.passed ? 'Congratulations! You Passed!' : 'Keep Studying!'}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  You scored {testResults.correctAnswers} out of {testResults.totalQuestions} questions correctly
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{testResults.score}%</div>
                    <div className="text-sm text-gray-600">Your Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{testResults.passingScore}%</div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{testResults.correctAnswers}</div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{testResults.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="domains">Domain Breakdown</TabsTrigger>
              <TabsTrigger value="questions">Question Review</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Overall Score</span>
                        <span className="font-bold">{testResults.score}%</span>
                      </div>
                      <Progress value={testResults.score} className="h-2" />
                      
                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Correct Answers:</span>
                          <span className="font-medium text-green-600">{testResults.correctAnswers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Incorrect Answers:</span>
                          <span className="font-medium text-red-600">{testResults.totalQuestions - testResults.correctAnswers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Questions:</span>
                          <span className="font-medium">{testResults.totalQuestions}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testResults.passed ? (
                        <>
                          <p className="text-green-600 font-medium">Great job! You&apos;re ready for the PMP exam.</p>
                          <ul className="space-y-2 text-sm">
                            <li>• Review any incorrect answers</li>
                            <li>• Take additional practice tests</li>
                            <li>• Schedule your official PMP exam</li>
                            <li>• Continue studying weak areas</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p className="text-orange-600 font-medium">Keep studying! Focus on your weak areas.</p>
                          <ul className="space-y-2 text-sm">
                            <li>• Review all incorrect answers</li>
                            <li>• Focus on domains with low scores</li>
                            <li>• Take more practice tests</li>
                            <li>• Study the PMBOK Guide thoroughly</li>
                          </ul>
                        </>
                      )}
                      
                      <div className="pt-4 space-y-2">
                        <Button asChild className="w-full">
                          <Link href="/exam/setup">Take Another Test</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Domain Breakdown Tab */}
            <TabsContent value="domains">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Domain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {testResults.domainBreakdown.map((domain, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{domain.domain}</h4>
                          <span className="text-sm text-gray-600">
                            {domain.correct}/{domain.total} ({domain.percentage}%)
                          </span>
                        </div>
                        <Progress value={domain.percentage} className="h-2" />
                        <p className="text-sm text-gray-600 mt-1">
                          {domain.percentage >= 75 ? 'Strong performance' : 
                           domain.percentage >= 60 ? 'Needs improvement' : 'Requires significant study'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Question Review Tab */}
            <TabsContent value="questions">
              <div className="space-y-4">
                {questionResults.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {question.domain}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded font-medium ${
                            question.isCorrect 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {question.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg mb-4">{question.text}</p>
                      
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optionIndex) => {
                          let optionClass = "p-3 border rounded";
                          
                          if (optionIndex === question.correctAnswer) {
                            optionClass += " bg-green-50 border-green-200";
                          } else if (question.userAnswer === optionIndex && optionIndex !== question.correctAnswer) {
                            optionClass += " bg-red-50 border-red-200";
                          }

                          return (
                            <div key={optionIndex} className={optionClass}>
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                <div className="flex items-center gap-2">
                                  {optionIndex === question.correctAnswer && (
                                    <span className="text-green-600 font-medium">✓ Correct</span>
                                  )}
                                  {question.userAnswer === optionIndex && optionIndex !== question.correctAnswer && (
                                    <span className="text-red-600 font-medium">Your Answer</span>
                                  )}
                                  {question.userAnswer === optionIndex && optionIndex === question.correctAnswer && (
                                    <span className="text-green-600 font-medium">Your Answer ✓</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <h5 className="font-medium mb-2">Explanation:</h5>
                        <p className="text-gray-700">{question.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}