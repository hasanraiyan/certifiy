'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Target, BookOpen, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

const examTypes = [
  {
    id: 'full-mock',
    name: 'Full Mock Exam',
    description: 'Complete 180-question exam simulating the real PMP test',
    duration: '4 hours',
    questions: 180,
    icon: <Target className="w-6 h-6" />,
    recommended: true
  },
  {
    id: 'domain-quiz',
    name: 'Domain Quiz',
    description: 'Focus on specific knowledge areas (People, Process, Business Environment)',
    duration: '1-2 hours',
    questions: 60,
    icon: <BookOpen className="w-6 h-6" />,
    recommended: false
  },
  {
    id: 'knowledge-area',
    name: 'Knowledge Area Test',
    description: 'Deep dive into specific PMBOK knowledge areas',
    duration: '1 hour',
    questions: 50,
    icon: <BarChart3 className="w-6 h-6" />,
    recommended: false
  }
];

const domains = [
  { id: 'people', name: 'People (42%)', description: 'Leadership, team management, conflict resolution' },
  { id: 'process', name: 'Process (50%)', description: 'Project management processes, methodologies' },
  { id: 'business', name: 'Business Environment (8%)', description: 'Organizational factors, external influences' }
];

const knowledgeAreas = [
  { id: 'integration', name: 'Integration Management', description: 'Project charter, project plan, change management' },
  { id: 'scope', name: 'Scope Management', description: 'Requirements, WBS, scope control' },
  { id: 'schedule', name: 'Schedule Management', description: 'Activity definition, sequencing, critical path' },
  { id: 'cost', name: 'Cost Management', description: 'Budget planning, cost control, earned value' },
  { id: 'quality', name: 'Quality Management', description: 'Quality planning, assurance, control' },
  { id: 'resources', name: 'Resource Management', description: 'Team acquisition, development, management' },
  { id: 'communications', name: 'Communications Management', description: 'Stakeholder engagement, information distribution' },
  { id: 'risk', name: 'Risk Management', description: 'Risk identification, analysis, response planning' },
  { id: 'procurement', name: 'Procurement Management', description: 'Contract planning, source selection' },
  { id: 'stakeholders', name: 'Stakeholder Management', description: 'Stakeholder identification, engagement' }
];

export default function ExamSetupPage() {
  const router = useRouter();
  const [selectedExamMode, setSelectedExamMode] = useState('practice'); // practice or test
  const [selectedExamType, setSelectedExamType] = useState('full-mock');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState('');
  const [examSettings, setExamSettings] = useState({
    showTimer: true,
    showProgress: true,
    allowReview: true,
    showExplanations: true,
    allowBookmarks: true
  });

  // Effect to adjust settings based on selected mode
  useEffect(() => {
    if (selectedExamMode === 'test') {
      // In test mode, timer is mandatory and explanations are disabled during exam
      setExamSettings(prev => ({
        ...prev,
        showTimer: true,
        showExplanations: false
      }));
    } else {
      // In practice mode, restore default settings
      setExamSettings(prev => ({
        ...prev,
        showExplanations: true
      }));
    }
  }, [selectedExamMode]);

  const handleStartExam = () => {
    // Generate a unique session ID
    const sessionId = `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create exam configuration
    const examConfig = {
      id: sessionId,
      type: selectedExamMode,
      examType: selectedExamType,
      timeLimit: selectedExamMode === 'test' ? getSelectedExam()?.duration === '4 hours' ? 14400 : 
                 getSelectedExam()?.duration === '1-2 hours' ? 7200 : 3600 : undefined,
      settings: examSettings,
      domain: selectedDomain || undefined,
      knowledgeArea: selectedKnowledgeArea || undefined
    };
    
    // Store exam config in sessionStorage for the exam page
    sessionStorage.setItem(`examConfig_${sessionId}`, JSON.stringify(examConfig));
    
    // Navigate to the exam page with session ID
    router.push(`/exam/${sessionId}`);
  };

  const getSelectedExam = () => {
    return examTypes.find(exam => exam.id === selectedExamType);
  };

  const isExamReady = () => {
    const exam = getSelectedExam();
    if (exam?.id === 'domain-quiz' && !selectedDomain) return false;
    if (exam?.id === 'knowledge-area' && !selectedKnowledgeArea) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold text-primary">Certify</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Exam Setup
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Set Up Your Exam
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your exam mode and configure your test settings. Take your time to review the options before starting.
            </p>
          </div>

          {/* Exam Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Select Exam Mode</span>
              </CardTitle>
              <CardDescription>
                Choose between practice mode for learning or test mode for assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedExamMode} onValueChange={setSelectedExamMode} className="space-y-4">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="practice" id="practice" className="mt-1" />
                  <Label htmlFor="practice" className="flex-1 cursor-pointer">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-foreground">Practice Mode</span>
                        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                          LEARNING
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Unlimited time with immediate feedback and explanations after each question. Perfect for learning and skill building.
                      </p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Features:</span> Immediate feedback, explanations, unlimited time, progress saving
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="test" id="test" className="mt-1" />
                  <Label htmlFor="test" className="flex-1 cursor-pointer">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-foreground">Test Mode</span>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                          ASSESSMENT
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Timed exam that simulates the real certification test experience. No immediate feedback during the exam.
                      </p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Features:</span> Time limits, no immediate feedback, final score, pass/fail status
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Exam Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Select Exam Type</span>
              </CardTitle>
              <CardDescription>
                Choose the type of exam that best fits your study needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedExamType} onValueChange={setSelectedExamType} className="space-y-4">
                {examTypes.map((exam) => (
                  <div key={exam.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={exam.id} id={exam.id} className="mt-1" />
                    <Label htmlFor={exam.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-accent">{exam.icon}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-foreground">{exam.name}</span>
                              {exam.recommended && (
                                <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded">
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{exam.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{exam.duration}</span>
                              </span>
                              <span>{exam.questions} questions</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Domain Selection (for Domain Quiz) */}
          {selectedExamType === 'domain-quiz' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Domain</CardTitle>
                <CardDescription>
                  Choose which domain you want to focus on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedDomain} onValueChange={setSelectedDomain} className="space-y-4">
                  {domains.map((domain) => (
                    <div key={domain.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={domain.id} id={domain.id} className="mt-1" />
                      <Label htmlFor={domain.id} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-semibold text-foreground">{domain.name}</div>
                          <p className="text-sm text-muted-foreground mt-1">{domain.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Knowledge Area Selection (for Knowledge Area Test) */}
          {selectedExamType === 'knowledge-area' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Knowledge Area</CardTitle>
                <CardDescription>
                  Choose which PMBOK knowledge area to test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedKnowledgeArea} onValueChange={setSelectedKnowledgeArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a knowledge area" />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeAreas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        <div>
                          <div className="font-semibold">{area.name}</div>
                          <div className="text-sm text-muted-foreground">{area.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Exam Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Settings</CardTitle>
              <CardDescription>
                Configure your exam experience based on the selected mode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showTimer" 
                    checked={examSettings.showTimer}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, showTimer: checked }))
                    }
                    disabled={selectedExamMode === 'test'} // Timer is mandatory in test mode
                  />
                  <Label htmlFor="showTimer" className={selectedExamMode === 'test' ? 'text-muted-foreground' : ''}>
                    Show timer during exam
                    {selectedExamMode === 'test' && <span className="text-xs ml-1">(Required in test mode)</span>}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showProgress" 
                    checked={examSettings.showProgress}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, showProgress: checked }))
                    }
                  />
                  <Label htmlFor="showProgress">Show progress bar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allowReview" 
                    checked={examSettings.allowReview}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, allowReview: checked }))
                    }
                  />
                  <Label htmlFor="allowReview">Allow question review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showExplanations" 
                    checked={examSettings.showExplanations}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, showExplanations: checked }))
                    }
                    disabled={selectedExamMode === 'test'} // Explanations not shown during test mode
                  />
                  <Label htmlFor="showExplanations" className={selectedExamMode === 'test' ? 'text-muted-foreground' : ''}>
                    Show explanations immediately
                    {selectedExamMode === 'test' && <span className="text-xs ml-1">(Only after completion in test mode)</span>}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allowBookmarks" 
                    checked={examSettings.allowBookmarks}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, allowBookmarks: checked }))
                    }
                  />
                  <Label htmlFor="allowBookmarks">Enable question bookmarks</Label>
                </div>
              </div>
              
              {/* Bookmark explanation */}
              {examSettings.allowBookmarks && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Bookmark Feature:</span> Mark questions you want to review later. 
                      Bookmarked questions will be highlighted in the question navigator, and you can filter to show only bookmarked questions.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exam Summary */}
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-primary-foreground">Exam Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Selected Exam</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mode:</span>
                      <span className="capitalize font-medium">
                        {selectedExamMode}
                        {selectedExamMode === 'practice' && <span className="text-blue-200 ml-1">(Learning)</span>}
                        {selectedExamMode === 'test' && <span className="text-red-200 ml-1">(Assessment)</span>}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{getSelectedExam()?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>
                        {selectedExamMode === 'practice' ? 'Unlimited' : getSelectedExam()?.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>{getSelectedExam()?.questions}</span>
                    </div>
                    {selectedDomain && (
                      <div className="flex justify-between">
                        <span>Domain:</span>
                        <span>{domains.find(d => d.id === selectedDomain)?.name}</span>
                      </div>
                    )}
                    {selectedKnowledgeArea && (
                      <div className="flex justify-between">
                        <span>Knowledge Area:</span>
                        <span>{knowledgeAreas.find(k => k.id === selectedKnowledgeArea)?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Settings</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(examSettings).map(([key, value]) => {
                      const isDisabledInTestMode = selectedExamMode === 'test' && (key === 'showExplanations');
                      const isMandatoryInTestMode = selectedExamMode === 'test' && key === 'showTimer';
                      
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          {value || isMandatoryInTestMode ? (
                            <CheckCircle className="w-4 h-4 text-green-300" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-300" />
                          )}
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            {isDisabledInTestMode && <span className="text-yellow-200 ml-1">(After completion)</span>}
                            {isMandatoryInTestMode && <span className="text-green-200 ml-1">(Required)</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex-1 sm:flex-none"
            >
              Go Back
            </Button>
            <Button 
              onClick={handleStartExam}
              disabled={!isExamReady()}
              className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Start Exam
            </Button>
          </div>

          {/* Important Notes */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <h4 className="font-semibold mb-1">Important Notes:</h4>
                  <ul className="space-y-1">
                    {selectedExamMode === 'practice' ? (
                      <>
                        <li>• Practice mode allows unlimited time and immediate feedback</li>
                        <li>• You can pause and resume your progress at any time</li>
                        <li>• Explanations will be shown after each question</li>
                        <li>• Your progress will be saved automatically</li>
                        <li>• Use bookmarks to mark questions for review</li>
                      </>
                    ) : (
                      <>
                        <li>• Test mode simulates the real certification exam</li>
                        <li>• You cannot pause the exam once started</li>
                        <li>• No immediate feedback or explanations during the exam</li>
                        <li>• Time limit will be strictly enforced</li>
                        <li>• Ensure you have a stable internet connection</li>
                        <li>• Close other browser tabs to avoid distractions</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}