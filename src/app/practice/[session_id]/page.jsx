'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PracticeMode } from '@/components/exam/practice-mode';

// Mock questions data - in a real app, this would come from an API
const mockQuestions = [
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
    explanation: 'The project charter formally authorizes the project and gives the project manager the authority to apply organizational resources to project activities. It is created during the Initiating process group.',
    domain: 'Integration Management',
    knowledgeArea: 'Integration Management',
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
    explanation: 'Projects are temporary endeavors with a definite beginning and end, creating unique products or services. Ongoing operations are not projects but rather repetitive activities that sustain the organization.',
    domain: 'Project Framework',
    knowledgeArea: 'Integration Management',
    difficulty: 'easy'
  },
  {
    id: '3',
    text: 'What is the critical path in project scheduling?',
    type: 'multiple-choice',
    options: [
      'The shortest path through the project network',
      'The path with the most resources assigned',
      'The longest path through the project network that determines the minimum project duration',
      'The path with the highest risk activities'
    ],
    correctAnswer: 2,
    explanation: 'The critical path is the longest path through the project network diagram that determines the minimum project duration. Any delay in critical path activities will delay the entire project.',
    domain: 'Process',
    knowledgeArea: 'Schedule Management',
    difficulty: 'medium'
  },
  {
    id: '4',
    text: 'Which conflict resolution technique involves finding solutions that bring some degree of satisfaction to all parties?',
    type: 'multiple-choice',
    options: [
      'Forcing',
      'Smoothing',
      'Compromising',
      'Collaborating'
    ],
    correctAnswer: 3,
    explanation: 'Collaborating (also called problem-solving) involves finding solutions that bring some degree of satisfaction to all parties in order to temporarily or partially resolve the conflict. It requires a give-and-take attitude and open dialogue.',
    domain: 'People',
    knowledgeArea: 'Resource Management',
    difficulty: 'hard'
  },
  {
    id: '5',
    text: 'What is earned value management (EVM) primarily used for?',
    type: 'multiple-choice',
    options: [
      'Quality control',
      'Risk assessment',
      'Performance measurement and project control',
      'Stakeholder communication'
    ],
    correctAnswer: 2,
    explanation: 'Earned Value Management (EVM) is a methodology that combines scope, schedule, and resource measurements to assess project performance and progress. It provides objective performance measurement data.',
    domain: 'Process',
    knowledgeArea: 'Cost Management',
    difficulty: 'medium'
  },
  {
    id: '6',
    text: 'Which of the following are key components of a risk register? (Select all that apply)',
    type: 'multiple-select',
    options: [
      'Risk description',
      'Risk probability',
      'Risk impact',
      'Risk owner',
      'Project budget'
    ],
    correctAnswer: [0, 1, 2, 3],
    explanation: 'A risk register typically includes risk description, probability, impact, risk owner, and response strategies. Project budget is not a component of the risk register itself, though it may be affected by risks.',
    domain: 'Process',
    knowledgeArea: 'Risk Management',
    difficulty: 'hard'
  },
  {
    id: '7',
    text: 'Agile project management emphasizes individuals and interactions over processes and tools.',
    type: 'true-false',
    options: [
      'True',
      'False'
    ],
    correctAnswer: 0,
    explanation: 'This is one of the four values stated in the Agile Manifesto: "Individuals and interactions over processes and tools." While processes and tools are important, Agile values people and their interactions more highly.',
    domain: 'Process',
    knowledgeArea: 'Integration Management',
    difficulty: 'easy'
  },
  {
    id: '8',
    text: 'What is the primary focus of the Business Environment domain in PMP?',
    type: 'multiple-choice',
    options: [
      'Technical project management skills',
      'Leadership and team management',
      'Organizational strategy and external factors',
      'Quality assurance processes'
    ],
    correctAnswer: 2,
    explanation: 'The Business Environment domain focuses on organizational strategy, compliance, and external factors that influence projects. It represents about 8% of the PMP exam content.',
    domain: 'Business Environment',
    knowledgeArea: 'Integration Management',
    difficulty: 'medium'
  }
];

export default function PracticeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.session_id;
  
  const [examConfig, setExamConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load exam configuration from sessionStorage
    const configKey = `examConfig_${sessionId}`;
    const storedConfig = sessionStorage.getItem(configKey);
    
    if (!storedConfig) {
      setError('Practice session configuration not found. Please start a new practice session.');
      setIsLoading(false);
      return;
    }

    try {
      const config = JSON.parse(storedConfig);
      setExamConfig(config);
      
      // Filter questions based on exam configuration
      let filteredQuestions = [...mockQuestions];
      
      if (config.domain) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.domain.toLowerCase().includes(config.domain.toLowerCase())
        );
      }
      
      if (config.knowledgeArea) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.knowledgeArea.toLowerCase().includes(config.knowledgeArea.toLowerCase())
        );
      }
      
      // Limit questions based on exam type
      const questionLimit = config.examType === 'full-mock' ? 180 : 
                           config.examType === 'domain-quiz' ? 60 : 50;
      
      // For demo purposes, repeat questions if we don't have enough
      while (filteredQuestions.length < questionLimit && filteredQuestions.length > 0) {
        filteredQuestions = [...filteredQuestions, ...filteredQuestions];
      }
      
      filteredQuestions = filteredQuestions.slice(0, questionLimit);
      
      // Shuffle questions if enabled
      if (config.settings.shuffleQuestions) {
        filteredQuestions = shuffleArray(filteredQuestions);
      }
      
      setQuestions(filteredQuestions);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load practice session configuration.');
      setIsLoading(false);
    }
  }, [sessionId]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleExamComplete = (sessionId) => {
    // Navigate to practice results page
    router.push(`/results/${sessionId}`);
  };

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={['student']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading practice session...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !examConfig) {
    return (
      <AuthGuard allowedRoles={['student']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The practice session could not be loaded.'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/practice/setup')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
              >
                Start New Practice
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (questions.length === 0) {
    return (
      <AuthGuard allowedRoles={['student']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="text-yellow-500 text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h1>
            <p className="text-gray-600 mb-6">
              No questions were found for the selected configuration. Please try a different practice type.
            </p>
            <button
              onClick={() => router.push('/practice/setup')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Configure Practice Session
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['student']}>
      <PracticeMode
        sessionId={sessionId}
        examConfig={examConfig}
        questions={questions}
        onExamComplete={handleExamComplete}
      />
    </AuthGuard>
  );
}