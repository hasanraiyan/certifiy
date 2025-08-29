'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PracticeMode } from '@/components/exam/practice-mode';
import { TestMode } from '@/components/exam/test-mode';
import { ExamErrorBoundary } from '@/components/exam/exam-error-boundary';
import { NetworkErrorHandler } from '@/components/exam/network-error-handler';
import { SessionRecoveryDialog, useSessionRecovery } from '@/components/exam/session-recovery-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ExamSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.session_id;

  const [examConfig, setExamConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examSession, setExamSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Session recovery hook
  const { 
    hasRecoverableSessions, 
    showRecoveryDialog, 
    openRecoveryDialog, 
    closeRecoveryDialog 
  } = useSessionRecovery();

  // Initialize exam configuration and questions
  useEffect(() => {
    const initializeExam = async () => {
      try {
        setIsLoading(true);
        
        // Check for session recovery first
        if (hasRecoverableSessions) {
          return; // Let recovery dialog handle initialization
        }
        
        // Get exam config from sessionStorage (set by exam setup page)
        const configData = sessionStorage.getItem(`examConfig_${sessionId}`);
        if (!configData) {
          setError('Exam configuration not found. Please start from the exam setup page.');
          return;
        }

        const config = JSON.parse(configData);
        setExamConfig(config);

        // Load questions based on exam configuration
        const loadedQuestions = await loadQuestionsForExam(config);
        setQuestions(loadedQuestions);

      } catch (err) {
        console.error('Failed to initialize exam:', err);
        setError('Failed to load exam. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      initializeExam();
    }
  }, [sessionId, hasRecoverableSessions]);

  // Mock function to load questions - in a real app this would be an API call
  const loadQuestionsForExam = async (config) => {
    // Mock questions data based on exam type
    const allQuestions = [
      {
        id: '1',
        text: 'What is the primary purpose of a project charter?',
        type: 'multiple-choice',
        options: [
          'To define the project scope in detail',
          'To formally authorize the project and provide the project manager with authority',
          'To create the work breakdown structure',
          'To establish the project budget'
        ],
        correctAnswer: 1,
        explanation: 'A project charter formally authorizes the project and provides the project manager with the authority to apply organizational resources to project activities.',
        domain: 'Integration Management',
        knowledgeArea: 'integration',
        difficulty: 'medium'
      },
      {
        id: '2',
        text: 'Which of the following is NOT a characteristic of a project?',
        type: 'multiple-choice',
        options: [
          'Temporary endeavor',
          'Creates a unique product or service',
          'Ongoing operations',
          'Has a definite beginning and end'
        ],
        correctAnswer: 2,
        explanation: 'Projects are temporary endeavors with definite beginnings and ends that create unique products or services. Ongoing operations are not projects.',
        domain: 'Project Framework',
        knowledgeArea: 'integration',
        difficulty: 'easy'
      },
      {
        id: '3',
        text: 'What is the difference between a program and a project?',
        type: 'multiple-choice',
        options: [
          'Programs are smaller than projects',
          'Programs are a group of related projects managed together',
          'Programs have shorter durations',
          'There is no difference'
        ],
        correctAnswer: 1,
        explanation: 'A program is a group of related projects, subsidiary programs, and program activities managed in a coordinated manner to obtain benefits not available from managing them individually.',
        domain: 'Program Management',
        knowledgeArea: 'integration',
        difficulty: 'medium'
      }
    ];

    // Filter questions based on exam configuration
    let filteredQuestions = allQuestions;

    if (config.domain) {
      filteredQuestions = filteredQuestions.filter(q => q.domain.toLowerCase().includes(config.domain.toLowerCase()));
    }

    if (config.knowledgeArea) {
      filteredQuestions = filteredQuestions.filter(q => q.knowledgeArea === config.knowledgeArea);
    }

    // Return the appropriate number of questions based on exam type
    const questionCount = config.examType === 'full-mock' ? 180 : 
                         config.examType === 'domain-quiz' ? 60 : 50;
    
    // For demo purposes, repeat questions if we don't have enough
    const questions = [];
    for (let i = 0; i < questionCount; i++) {
      questions.push({
        ...filteredQuestions[i % filteredQuestions.length],
        id: `${filteredQuestions[i % filteredQuestions.length].id}_${i}`
      });
    }

    return questions;
  };

  const handleExamComplete = (completedSessionId) => {
    // Navigate to results page
    router.push(`/results/${completedSessionId}`);
  };

  const handleSessionRecovered = (session, recoveredQuestions) => {
    // Validate recovered session
    const validation = validateExamSession(session, recoveredQuestions);
    
    if (!validation.canRecover) {
      setError('Recovered session data is corrupted and cannot be used.');
      return;
    }

    // Apply any necessary recovery actions
    let fixedSession = session;
    if (validation.recoveryActions && validation.recoveryActions.length > 0) {
      fixedSession = applyRecoveryActions(session, validation.recoveryActions);
      console.log('Applied recovery actions to fix session data');
    }

    // Set the recovered data
    setExamSession(fixedSession);
    setExamConfig(fixedSession.examConfig);
    setQuestions(recoveredQuestions);
    setIsLoading(false);
  };

  const handleNewSession = () => {
    // Continue with normal initialization
    setIsLoading(false);
  };

  const handleNetworkRecovered = () => {
    console.log('Network connection restored');
    // Optionally sync any pending data
  };

  const handleOfflineModeEnabled = () => {
    console.log('Offline mode enabled for exam');
    // Update UI to show offline status
  };

  // Loading state
  if (isLoading) {
    return (
      <AuthGuard allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Loading Exam</h3>
                  <p className="text-sm text-gray-600">Preparing your exam session...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  // Error state
  if (error || !examConfig) {
    return (
      <AuthGuard allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{error || 'Failed to load exam configuration.'}</p>
              <button
                onClick={() => router.push('/exam/setup')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Return to Exam Setup
              </button>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  // Render the appropriate exam mode component
  return (
    <AuthGuard allowedRoles={['student']}>
      <ExamErrorBoundary sessionId={sessionId}>
        <NetworkErrorHandler
          examSession={examSession}
          questions={questions}
          onNetworkRecovered={handleNetworkRecovered}
          onOfflineModeEnabled={handleOfflineModeEnabled}
          allowOfflineMode={true}
        >
          <SessionRecoveryDialog
            isOpen={showRecoveryDialog}
            onClose={closeRecoveryDialog}
            onSessionRecovered={handleSessionRecovered}
            onNewSession={handleNewSession}
            currentSessionId={sessionId}
          />
          
          {examConfig.type === 'practice' ? (
            <PracticeMode
              sessionId={sessionId}
              examConfig={examConfig}
              questions={questions}
              onExamComplete={handleExamComplete}
            />
          ) : (
            <TestMode
              sessionId={sessionId}
              examConfig={examConfig}
              questions={questions}
              onExamComplete={handleExamComplete}
            />
          )}
        </NetworkErrorHandler>
      </ExamErrorBoundary>
    </AuthGuard>
  );
}