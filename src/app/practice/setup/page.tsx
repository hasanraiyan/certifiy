'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Target, BarChart3, CheckCircle, Clock, Lightbulb, Brain, Bookmark } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';

const examTypes = [
  {
    id: 'full-mock',
    name: 'Full Practice Exam',
    description: 'Complete 180-question practice exam with unlimited time',
    questions: 180,
    icon: <Target className="w-6 h-6" />,
    recommended: true
  },
  {
    id: 'domain-quiz',
    name: 'Domain Practice',
    description: 'Focus on specific knowledge areas with immediate feedback',
    questions: 60,
    icon: <BookOpen className="w-6 h-6" />,
    recommended: false
  },
  {
    id: 'knowledge-area',
    name: 'Knowledge Area Practice',
    description: 'Deep dive into specific PMBOK knowledge areas',
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

export default function PracticeSetupPage() {
  const router = useRouter();
  const [selectedExamType, setSelectedExamType] = useState('full-mock');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState('');
  const [practiceSettings, setPracticeSettings] = useState({
    showProgress: true,
    allowBookmarks: true,
    showExplanations: true,
    allowReview: true,
    saveProgress: true
  });

  const handleStartPractice = () => {
    // Generate a unique session ID
    const sessionId = `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create practice exam configuration
    const examConfig = {
      id: sessionId,
      type: 'practice' as const,
      examType: selectedExamType as 'full-mock' | 'domain-quiz' | 'knowledge-area',
      timeLimit: undefined, // No time limit in practice mode
      settings: {
        ...practiceSettings,
        showTimer: false, // Never show timer in practice mode
        showExplanations: true // Always show explanations in practice mode
      },
      domain: selectedDomain || undefined,
      knowledgeArea: selectedKnowledgeArea || undefined
    };
    
    // Store exam config in sessionStorage for the practice page
    sessionStorage.setItem(`examConfig_${sessionId}`, JSON.stringify(examConfig));
    
    // Navigate to the practice session page
    router.push(`/practice/${sessionId}`);
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
    <AuthGuard allowedRoles={['student']}>
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
                Practice Setup
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Set Up Your Practice Session
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Practice mode is designed for learning and skill building. Take your time, get immediate feedback, and build your confidence.
              </p>
            </div>

            {/* Practice Mode Benefits */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Lightbulb className="w-5 h-5" />
                  <span>Practice Mode Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Unlimited Time</h4>
                      <p className="text-sm text-green-700">Take as long as you need to think through each question</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Immediate Feedback</h4>
                      <p className="text-sm text-blue-700">See correct answers and detailed explanations right away</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Bookmark className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-800">Bookmark Questions</h4>
                      <p className="text-sm text-purple-700">Mark questions for review and focus on challenging areas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Progress Saving</h4>
                      <p className="text-sm text-orange-700">Pause and resume your practice session anytime</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Select Practice Type</span>
                </CardTitle>
                <CardDescription>
                  Choose the type of practice session that best fits your learning goals
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
                                  <span>Unlimited time</span>
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
                    Choose which domain you want to practice
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
                    Choose which PMBOK knowledge area to practice
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

            {/* Practice Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Practice Settings</CardTitle>
                <CardDescription>
                  Customize your practice experience for optimal learning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showProgress" 
                      checked={practiceSettings.showProgress}
                      onCheckedChange={(checked) => 
                        setPracticeSettings(prev => ({ ...prev, showProgress: checked as boolean }))
                      }
                    />
                    <Label htmlFor="showProgress">Show progress bar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allowBookmarks" 
                      checked={practiceSettings.allowBookmarks}
                      onCheckedChange={(checked) => 
                        setPracticeSettings(prev => ({ ...prev, allowBookmarks: checked as boolean }))
                      }
                    />
                    <Label htmlFor="allowBookmarks">Enable question bookmarks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showExplanations" 
                      checked={practiceSettings.showExplanations}
                      onCheckedChange={(checked) => 
                        setPracticeSettings(prev => ({ ...prev, showExplanations: checked as boolean }))
                      }
                    />
                    <Label htmlFor="showExplanations">Show explanations immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allowReview" 
                      checked={practiceSettings.allowReview}
                      onCheckedChange={(checked) => 
                        setPracticeSettings(prev => ({ ...prev, allowReview: checked as boolean }))
                      }
                    />
                    <Label htmlFor="allowReview">Allow question review</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saveProgress" 
                      checked={practiceSettings.saveProgress}
                      onCheckedChange={(checked) => 
                        setPracticeSettings(prev => ({ ...prev, saveProgress: checked as boolean }))
                      }
                    />
                    <Label htmlFor="saveProgress">Save progress automatically</Label>
                  </div>
                </div>
                
                {/* Settings explanations */}
                <div className="space-y-3 mt-6">
                  {practiceSettings.allowBookmarks && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Bookmark className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <span className="font-medium">Bookmark Feature:</span> Mark questions you want to review later. 
                          Bookmarked questions will be highlighted in the question navigator.
                        </div>
                      </div>
                    </div>
                  )}
                  {practiceSettings.saveProgress && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div className="text-sm text-green-800">
                          <span className="font-medium">Progress Saving:</span> Your answers and progress will be saved automatically. 
                          You can close the browser and resume later from where you left off.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Practice Summary */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Practice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Selected Practice</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Mode:</span>
                        <span className="font-medium">
                          Practice <span className="text-green-200 ml-1">(Learning)</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>{getSelectedExam()?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>Unlimited Time</span>
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
                    <h4 className="font-semibold mb-2">Practice Features</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(practiceSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-green-300" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-400" />
                          )}
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                        </div>
                      ))}
                      {/* Always enabled features */}
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-300" />
                        <span>Immediate feedback</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-300" />
                        <span>Unlimited time</span>
                      </div>
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
                onClick={handleStartPractice}
                disabled={!isExamReady()}
                className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Start Practice Session
              </Button>
            </div>

            {/* Practice Tips */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <h4 className="font-semibold mb-1">Practice Tips:</h4>
                    <ul className="space-y-1">
                      <li>• Read each question carefully and think through your reasoning</li>
                      <li>• Use the explanations to understand why answers are correct or incorrect</li>
                      <li>• Bookmark challenging questions to review them later</li>
                      <li>• Take breaks when needed - there's no time pressure</li>
                      <li>• Focus on understanding concepts rather than memorizing answers</li>
                      <li>• Review your bookmarked questions before moving to test mode</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}