'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ExamSetupPage() {
  const [selectedTest, setSelectedTest] = useState('');
  const [testMode, setTestMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Mock available tests
  const availableTests = [
    { id: 'pmp-mock-1', name: 'PMP Mock Exam #1', questions: 180, duration: '4 hours', type: 'Full Exam' },
    { id: 'pmp-mock-2', name: 'PMP Mock Exam #2', questions: 180, duration: '4 hours', type: 'Full Exam' },
    { id: 'agile-practice', name: 'Agile Practice Test', questions: 60, duration: '1.5 hours', type: 'Domain Focus' },
    { id: 'integration-mgmt', name: 'Integration Management', questions: 50, duration: '1 hour', type: 'Knowledge Area' },
    { id: 'risk-mgmt', name: 'Risk Management', questions: 40, duration: '45 min', type: 'Knowledge Area' },
    { id: 'stakeholder-mgmt', name: 'Stakeholder Management', questions: 35, duration: '40 min', type: 'Knowledge Area' }
  ];

  const handleStartTest = async () => {
    if (!selectedTest || !testMode) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Create test session in backend
      const sessionId = `session_${Date.now()}`;
      
      // Redirect based on test mode
      if (testMode === 'practice') {
        router.push(`/practice/${sessionId}`);
      } else {
        router.push(`/exam/${sessionId}`);
      }
    } catch (error) {
      console.error('Failed to start test:', error);
      setIsLoading(false);
    }
  };

  const selectedTestData = availableTests.find(test => test.id === selectedTest);

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Setup</h1>
            <p className="text-gray-600">Configure your test preferences before starting</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Test Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Test</CardTitle>
                  <CardDescription>Choose which test you want to take</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedTest} onValueChange={setSelectedTest}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a test..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTests.map((test) => (
                        <SelectItem key={test.id} value={test.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{test.name}</span>
                            <span className="text-sm text-gray-500">
                              {test.questions} questions • {test.duration} • {test.type}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Test Mode Selection */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Test Mode</CardTitle>
                  <CardDescription>Choose how you want to take the test</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={testMode} onValueChange={setTestMode}>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="practice" id="practice" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="practice" className="text-base font-medium cursor-pointer">
                            Practice Mode
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Get instant feedback after each question. Perfect for learning and understanding concepts.
                          </p>
                          <div className="flex items-center mt-2 text-sm text-green-600">
                            <span className="mr-2">✓</span> Immediate explanations
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <span className="mr-2">✓</span> No time pressure
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="test" id="test" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="test" className="text-base font-medium cursor-pointer">
                            Test Mode
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Simulate the real PMP exam experience. Results and explanations shown at the end.
                          </p>
                          <div className="flex items-center mt-2 text-sm text-blue-600">
                            <span className="mr-2">⏱️</span> Timed exam
                          </div>
                          <div className="flex items-center text-sm text-blue-600">
                            <span className="mr-2">📊</span> Detailed results at end
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Test Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Test Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTestData ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">{selectedTestData.name}</h4>
                        <p className="text-sm text-gray-600">{selectedTestData.type}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Questions:</span>
                          <span className="font-medium">{selectedTestData.questions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{selectedTestData.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mode:</span>
                          <span className="font-medium capitalize">
                            {testMode || 'Not selected'}
                          </span>
                        </div>
                      </div>

                      <Button 
                        onClick={handleStartTest}
                        disabled={!selectedTest || !testMode || isLoading}
                        className="w-full"
                      >
                        {isLoading ? 'Starting Test...' : 'Start Test'}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Select a test to see details
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Use Practice Mode to learn and understand concepts</p>
                  <p>• Use Test Mode to simulate real exam conditions</p>
                  <p>• Take breaks between long tests</p>
                  <p>• Review explanations carefully</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}