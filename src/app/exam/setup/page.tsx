'use client';

import { useState } from 'react';
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
  const [selectedExamType, setSelectedExamType] = useState('full-mock');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState('');
  const [examSettings, setExamSettings] = useState({
    showTimer: true,
    showProgress: true,
    allowReview: true,
    showExplanations: true
  });

  const handleStartExam = () => {
    // Generate a unique session ID
    const sessionId = `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
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
              Choose your exam type and configure your test settings. Take your time to review the options before starting.
            </p>
          </div>

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
                Configure your exam experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showTimer" 
                    checked={examSettings.showTimer}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, showTimer: checked as boolean }))
                    }
                  />
                  <Label htmlFor="showTimer">Show timer during exam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showProgress" 
                    checked={examSettings.showProgress}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, showProgress: checked as boolean }))
                    }
                  />
                  <Label htmlFor="showProgress">Show progress bar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allowReview" 
                    checked={examSettings.allowReview}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, allowReview: checked as boolean }))
                    }
                  />
                  <Label htmlFor="allowReview">Allow question review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showExplanations" 
                    checked={examSettings.showExplanations}
                    onCheckedChange={(checked) => 
                      setExamSettings(prev => ({ ...prev, showExplanations: checked as boolean }))
                    }
                  />
                  <Label htmlFor="showExplanations">Show explanations after</Label>
                </div>
              </div>
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
                      <span>Type:</span>
                      <span>{getSelectedExam()?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{getSelectedExam()?.duration}</span>
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
                    {Object.entries(examSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        {value ? (
                          <CheckCircle className="w-4 h-4 text-green-300" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-300" />
                        )}
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                      </div>
                    ))}
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
                    <li>• You cannot pause the exam once started</li>
                    <li>• Ensure you have a stable internet connection</li>
                    <li>• Close other browser tabs to avoid distractions</li>
                    <li>• Your progress will be saved automatically</li>
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