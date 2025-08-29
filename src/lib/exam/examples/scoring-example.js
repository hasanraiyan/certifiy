/**
 * Example usage of the exam scoring service
 * This file demonstrates how to use the scoring functionality
 */

import {
  createExamScoringService
} from '../index';

/**
 * Example exam configuration
 */
const examConfig = {
  id: 'aws-saa-c03',
  type: 'test',
  examType: 'full-mock',
  timeLimit: 10800, // 3 hours
  settings: {
    showTimer: true,
    showProgress: true,
    allowReview: true,
    showExplanations: false,
    allowBookmarks: true,
    shuffleQuestions: false,
    shuffleAnswers: false
  }
};

/**
 * Example questions
 */
const sampleQuestions = [
  {
    id: 'q1',
    text: 'Which AWS service provides object storage?',
    type: 'multiple-choice',
    options: ['EC2', 'S3', 'RDS', 'Lambda'],
    correctAnswer: 1, // S3
    explanation: 'Amazon S3 (Simple Storage Service) provides object storage.',
    domain: 'Storage',
    knowledgeArea: 'Object Storage',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    text: 'Which services can be used for serverless computing? (Select all that apply)',
    type: 'multiple-select',
    options: ['Lambda', 'Fargate', 'EC2', 'Step Functions'],
    correctAnswer: [0, 1, 3], // Lambda, Fargate, Step Functions
    explanation: 'Lambda, Fargate, and Step Functions are serverless services.',
    domain: 'Compute',
    knowledgeArea: 'Serverless',
    difficulty: 'medium'
  },
  {
    id: 'q3',
    text: 'Is AWS CloudFormation a Infrastructure as Code service?',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 0, // True
    explanation: 'CloudFormation allows you to define infrastructure as code.',
    domain: 'Management',
    knowledgeArea: 'Infrastructure as Code',
    difficulty: 'easy'
  }
];

/**
 * Example exam session with answers
 */
const examSession = {
  id: 'session-123',
  userId: 'user-456',
  examConfig,
  startTime: new Date('2024-01-01T10:00:00Z'),
  endTime: new Date('2024-01-01T12:30:00Z'), // 2.5 hours
  currentQuestionIndex: 2,
  answers: new Map([
    [0, {
      questionId: 'q1',
      selectedOptions: [1], // Correct answer (S3)
      timestamp: new Date('2024-01-01T10:05:00Z'),
      timeSpent: 45
    }],
    [1, {
      questionId: 'q2',
      selectedOptions: [0, 1], // Partial answer (Lambda, Fargate) - missing Step Functions
      timestamp: new Date('2024-01-01T10:10:00Z'),
      timeSpent: 120
    }],
    [2, {
      questionId: 'q3',
      selectedOptions: [0], // Correct answer (True)
      timestamp: new Date('2024-01-01T10:12:00Z'),
      timeSpent: 30
    }]
  ]),
  bookmarkedQuestions: new Set([1]), // Bookmarked the multiple-select question
  status: 'completed'
};

/**
 * Example usage of the scoring service
 */
export function demonstrateScoring() {
  console.log('=== Exam Scoring Service Demo ===\n');

  // Create scoring service
  const scoringService = createExamScoringService(examConfig);
  
  console.log('1. Scoring Configuration:');
  console.log(JSON.stringify(scoringService.getScoringConfig(), null, 2));
  console.log('\n');

  console.log('2. Certification Requirements:');
  console.log(JSON.stringify(scoringService.getCertificationRequirements(), null, 2));
  console.log('\n');

  // Score the exam
  console.log('3. Scoring Exam...');
  const results = scoringService.scoreExam(examSession, sampleQuestions);
  
  console.log('Exam Results:');
  console.log(`- Total Questions: ${results.totalQuestions}`);
  console.log(`- Answered Questions: ${results.answeredQuestions}`);
  console.log(`- Correct Answers: ${results.correctAnswers}`);
  console.log(`- Overall Score: ${results.score}%`);
  console.log(`- Time Spent: ${Math.floor(results.timeSpent / 60)} minutes`);
  console.log('\n');

  // Determine pass/fail
  console.log('4. Pass/Fail Determination:');
  const passFailResult = scoringService.determinePassFail(results, sampleQuestions);
  console.log(`- Passed: ${passFailResult.passed}`);
  console.log(`- Score: ${passFailResult.overallScore}% (Required: ${passFailResult.requiredScore}%)`);
  
  if (passFailResult.failureReasons.length > 0) {
    console.log('- Failure Reasons:');
    passFailResult.failureReasons.forEach(reason => {
      console.log(`  * ${reason}`);
    });
  }
  console.log('\n');

  // Calculate performance metrics
  console.log('5. Performance Metrics:');
  const metrics = scoringService.calculatePerformanceMetrics(results, sampleQuestions, examSession);
  console.log(`- Overall Score: ${metrics.overallScore}%`);
  console.log(`- Accuracy Rate: ${metrics.accuracyRate}%`);
  console.log(`- Completion Rate: ${metrics.completionRate}%`);
  console.log(`- Time Efficiency: ${metrics.timeEfficiency}%`);
  console.log(`- Average Time per Question: ${metrics.averageTimePerQuestion} seconds`);
  
  if (metrics.strongDomains.length > 0) {
    console.log(`- Strong Domains: ${metrics.strongDomains.join(', ')}`);
  }
  
  if (metrics.weakDomains.length > 0) {
    console.log(`- Weak Domains: ${metrics.weakDomains.join(', ')}`);
  }
  
  console.log('- Recommendations:');
  metrics.recommendations.forEach(rec => {
    console.log(`  * ${rec}`);
  });
  console.log('\n');

  // Time metrics
  console.log('6. Time Analysis:');
  const timeMetrics = scoringService.calculateTimeMetrics(examSession, results);
  console.log(`- Total Time: ${Math.floor(timeMetrics.totalTime / 60)} minutes`);
  console.log(`- Average Time per Question: ${timeMetrics.averageTimePerQuestion} seconds`);
  console.log(`- Time Efficiency: ${timeMetrics.timeEfficiency}%`);
  
  if (timeMetrics.timeWarnings.length > 0) {
    console.log('- Time Warnings:');
    timeMetrics.timeWarnings.forEach(warning => {
      console.log(`  * ${warning}`);
    });
  }
  console.log('\n');

  // Validate results
  console.log('7. Results Validation:');
  const validation = scoringService.validateResults(results, examSession, sampleQuestions);
  console.log(`- Valid: ${validation.isValid}`);
  
  if (validation.errors.length > 0) {
    console.log('- Errors:');
    validation.errors.forEach(error => {
      console.log(`  * ${error}`);
    });
  }
  console.log('\n');

  console.log('=== Demo Complete ===');
  
  return {
    results,
    passFailResult,
    metrics,
    timeMetrics,
    validation
  };
}

/**
 * Example of custom certification requirements
 */
export function demonstrateCustomRequirements() {
  console.log('=== Custom Requirements Demo ===\n');

  // Create service with custom requirements
  const customRequirements = {
    passingScore: 80, // Higher passing score
    domainRequirements: new Map([
      ['Storage', 75],
      ['Compute', 70],
      ['Management', 65]
    ]),
    minimumQuestions: 3
  };

  const scoringService = createExamScoringService(examConfig, customRequirements);
  
  console.log('Custom Requirements:');
  console.log(JSON.stringify(scoringService.getCertificationRequirements(), null, 2));
  console.log('\n');

  // Score with custom requirements
  const results = scoringService.scoreExam(examSession, sampleQuestions);
  const passFailResult = scoringService.determinePassFail(results, sampleQuestions);
  
  console.log('Pass/Fail with Custom Requirements:');
  console.log(`- Passed: ${passFailResult.passed}`);
  console.log(`- Score: ${passFailResult.overallScore}% (Required: ${passFailResult.requiredScore}%)`);
  
  console.log('- Domain Results:');
  passFailResult.domainResults.forEach(domain => {
    console.log(`  * ${domain.domain}: ${domain.score}% (Required: ${domain.required}%) - ${domain.passed ? 'PASS' : 'FAIL'}`);
  });
  
  if (passFailResult.failureReasons.length > 0) {
    console.log('- Failure Reasons:');
    passFailResult.failureReasons.forEach(reason => {
      console.log(`  * ${reason}`);
    });
  }
  
  console.log('\n=== Custom Requirements Demo Complete ===');
  
  return { results, passFailResult };
}

// Export for use in other files
export {
  examConfig,
  sampleQuestions,
  examSession
};