/**
 * Comprehensive exam scoring service
 * Provides high-level interface for exam scoring and analytics
 */

import {
  Question,
  Answer,
  ExamSession,
  ExamConfig,
  ExamResults,
  QuestionResult,
  DomainScore
} from './types';
import {
  scoreAnswer,
  scoreExamSession,
  calculatePerformanceAnalytics,
  validateExamResults,
  createScoringConfig,
  DEFAULT_SCORING_CONFIG,
  type ScoringConfig
} from './scoring';
import { calculateDomainScores } from './utils';

/**
 * Certification requirements interface
 */
export interface CertificationRequirements {
  passingScore: number; // Minimum percentage to pass
  domainRequirements?: Map<string, number>; // Minimum scores per domain
  timeLimit?: number; // Maximum time allowed in seconds
  minimumQuestions?: number; // Minimum questions that must be answered
  allowPartialCredit?: boolean; // Whether partial credit is allowed
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  overallScore: number;
  domainScores: Map<string, DomainScore>;
  timeEfficiency: number; // Percentage of time used
  accuracyRate: number; // Percentage of answered questions correct
  completionRate: number; // Percentage of questions answered
  averageTimePerQuestion: number;
  strongDomains: string[]; // Domains with scores above average
  weakDomains: string[]; // Domains with scores below average
  recommendations: string[]; // Study recommendations
}

/**
 * Pass/fail determination result
 */
export interface PassFailResult {
  passed: boolean;
  overallScore: number;
  requiredScore: number;
  domainResults: Array<{
    domain: string;
    score: number;
    required: number;
    passed: boolean;
  }>;
  failureReasons: string[];
}

/**
 * Default certification requirements for different exam types
 */
export const CERTIFICATION_REQUIREMENTS: Record<string, CertificationRequirements> = {
  'full-mock': {
    passingScore: 70,
    timeLimit: 10800, // 3 hours
    minimumQuestions: 150,
    allowPartialCredit: false
  },
  'domain-quiz': {
    passingScore: 60,
    timeLimit: 3600, // 1 hour
    minimumQuestions: 20,
    allowPartialCredit: true
  },
  'knowledge-area': {
    passingScore: 65,
    timeLimit: 1800, // 30 minutes
    minimumQuestions: 10,
    allowPartialCredit: true
  }
};

/**
 * Comprehensive exam scoring service
 */
export class ExamScoringService {
  private scoringConfig: ScoringConfig;
  private certificationRequirements: CertificationRequirements;

  constructor(
    examConfig: ExamConfig,
    customRequirements?: Partial<CertificationRequirements>
  ) {
    this.scoringConfig = createScoringConfig(examConfig);
    
    // Get base requirements for exam type
    const baseRequirements = CERTIFICATION_REQUIREMENTS[examConfig.examType] || 
                           CERTIFICATION_REQUIREMENTS['full-mock'];
    
    // Merge with custom requirements
    this.certificationRequirements = {
      ...baseRequirements,
      ...customRequirements
    };
  }

  /**
   * Scores a complete exam session
   */
  public scoreExam(
    session: ExamSession,
    questions: Question[]
  ): ExamResults {
    return scoreExamSession(session, questions, this.scoringConfig);
  }

  /**
   * Determines pass/fail status based on certification requirements
   */
  public determinePassFail(
    results: ExamResults,
    questions: Question[]
  ): PassFailResult {
    const failureReasons: string[] = [];
    let passed = true;

    // Check overall score
    const overallPassed = results.score >= this.certificationRequirements.passingScore;
    if (!overallPassed) {
      passed = false;
      failureReasons.push(
        `Overall score ${results.score}% is below required ${this.certificationRequirements.passingScore}%`
      );
    }

    // Check minimum questions requirement
    if (this.certificationRequirements.minimumQuestions && 
        results.answeredQuestions < this.certificationRequirements.minimumQuestions) {
      passed = false;
      failureReasons.push(
        `Only ${results.answeredQuestions} questions answered, minimum ${this.certificationRequirements.minimumQuestions} required`
      );
    }

    // Check domain-specific requirements
    const domainResults: Array<{
      domain: string;
      score: number;
      required: number;
      passed: boolean;
    }> = [];

    if (this.certificationRequirements.domainRequirements) {
      const domainReqEntries = Array.from(this.certificationRequirements.domainRequirements.entries());
      for (let i = 0; i < domainReqEntries.length; i++) {
        const [domain, requiredScore] = domainReqEntries[i];
        const domainScore = results.domainScores.get(domain);
        
        if (domainScore) {
          const domainPassed = domainScore.score >= requiredScore;
          domainResults.push({
            domain,
            score: domainScore.score,
            required: requiredScore,
            passed: domainPassed
          });

          if (!domainPassed) {
            passed = false;
            failureReasons.push(
              `Domain "${domain}" score ${domainScore.score}% is below required ${requiredScore}%`
            );
          }
        }
      }
    }

    return {
      passed,
      overallScore: results.score,
      requiredScore: this.certificationRequirements.passingScore,
      domainResults,
      failureReasons
    };
  }

  /**
   * Calculates comprehensive performance metrics
   */
  public calculatePerformanceMetrics(
    results: ExamResults,
    questions: Question[],
    session: ExamSession
  ): PerformanceMetrics {
    const analytics = calculatePerformanceAnalytics(results, questions);
    
    // Calculate time efficiency
    let timeEfficiency = 0;
    if (session.endTime && session.startTime && this.certificationRequirements.timeLimit) {
      const timeUsed = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
      timeEfficiency = Math.max(0, (this.certificationRequirements.timeLimit - timeUsed) / 
                               this.certificationRequirements.timeLimit * 100);
    }

    // Identify strong and weak domains
    const domainScores = Array.from(results.domainScores.values());
    const averageScore = domainScores.length > 0 
      ? domainScores.reduce((sum, domain) => sum + domain.score, 0) / domainScores.length 
      : 0;

    const strongDomains = domainScores
      .filter(domain => domain.score > averageScore + 10)
      .map(domain => domain.domain);

    const weakDomains = domainScores
      .filter(domain => domain.score < averageScore - 10)
      .map(domain => domain.domain);

    // Generate recommendations
    const recommendations = this.generateRecommendations(results, analytics, weakDomains);

    return {
      overallScore: results.score,
      domainScores: results.domainScores,
      timeEfficiency,
      accuracyRate: analytics.overallPerformance.accuracy,
      completionRate: analytics.overallPerformance.completionRate,
      averageTimePerQuestion: analytics.timeAnalytics.averageTimePerQuestion,
      strongDomains,
      weakDomains,
      recommendations
    };
  }

  /**
   * Validates exam results integrity
   */
  public validateResults(
    results: ExamResults,
    session: ExamSession,
    questions: Question[]
  ): { isValid: boolean; errors: string[] } {
    return validateExamResults(results, session, questions);
  }

  /**
   * Calculates time-based performance metrics
   */
  public calculateTimeMetrics(
    session: ExamSession,
    results: ExamResults
  ): {
    totalTime: number;
    averageTimePerQuestion: number;
    timeEfficiency: number;
    timeWarnings: string[];
  } {
    const timeWarnings: string[] = [];
    let totalTime = 0;
    let timeEfficiency = 0;

    if (session.endTime && session.startTime) {
      totalTime = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
      
      // Check against time limit
      if (this.certificationRequirements.timeLimit) {
        if (totalTime > this.certificationRequirements.timeLimit) {
          timeWarnings.push('Exam exceeded time limit');
        }
        
        timeEfficiency = Math.max(0, 
          (this.certificationRequirements.timeLimit - totalTime) / 
          this.certificationRequirements.timeLimit * 100
        );
      }
    }

    const averageTimePerQuestion = results.totalQuestions > 0 
      ? totalTime / results.totalQuestions 
      : 0;

    // Check for unusually fast completion
    if (averageTimePerQuestion < 30) { // Less than 30 seconds per question
      timeWarnings.push('Unusually fast completion time detected');
    }

    // Check for unusually slow completion
    if (averageTimePerQuestion > 300) { // More than 5 minutes per question
      timeWarnings.push('Slow completion time may indicate difficulty');
    }

    return {
      totalTime,
      averageTimePerQuestion: Math.round(averageTimePerQuestion),
      timeEfficiency: Math.round(timeEfficiency * 100) / 100,
      timeWarnings
    };
  }

  /**
   * Generates study recommendations based on performance
   */
  private generateRecommendations(
    results: ExamResults,
    analytics: ReturnType<typeof calculatePerformanceAnalytics>,
    weakDomains: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Overall score recommendations
    if (results.score < 50) {
      recommendations.push('Consider reviewing fundamental concepts before retaking');
    } else if (results.score < 70) {
      recommendations.push('Focus on practice questions and weak areas');
    } else if (results.score < 85) {
      recommendations.push('Review specific weak domains to improve score');
    }

    // Domain-specific recommendations
    if (weakDomains.length > 0) {
      recommendations.push(`Focus additional study on: ${weakDomains.join(', ')}`);
    }

    // Time management recommendations
    if (analytics.timeAnalytics.averageTimePerQuestion > 180) {
      recommendations.push('Practice time management - aim for faster question completion');
    } else if (analytics.timeAnalytics.averageTimePerQuestion < 60) {
      recommendations.push('Consider spending more time reading questions carefully');
    }

    // Completion rate recommendations
    if (analytics.overallPerformance.completionRate < 90) {
      recommendations.push('Ensure all questions are answered before submission');
    }

    // Difficulty-based recommendations
    const easyPerformance = analytics.difficultyPerformance.find(d => d.difficulty === 'easy');
    const hardPerformance = analytics.difficultyPerformance.find(d => d.difficulty === 'hard');

    if (easyPerformance && easyPerformance.accuracy < 80) {
      recommendations.push('Review basic concepts - easy questions should have higher accuracy');
    }

    if (hardPerformance && hardPerformance.accuracy > 70) {
      recommendations.push('Strong performance on difficult questions - consider advanced topics');
    }

    return recommendations;
  }

  /**
   * Updates scoring configuration
   */
  public updateScoringConfig(newConfig: Partial<ScoringConfig>): void {
    this.scoringConfig = { ...this.scoringConfig, ...newConfig };
  }

  /**
   * Updates certification requirements
   */
  public updateCertificationRequirements(
    newRequirements: Partial<CertificationRequirements>
  ): void {
    this.certificationRequirements = { ...this.certificationRequirements, ...newRequirements };
  }

  /**
   * Gets current scoring configuration
   */
  public getScoringConfig(): ScoringConfig {
    return { ...this.scoringConfig };
  }

  /**
   * Gets current certification requirements
   */
  public getCertificationRequirements(): CertificationRequirements {
    return { ...this.certificationRequirements };
  }
}

/**
 * Factory function to create exam scoring service
 */
export function createExamScoringService(
  examConfig: ExamConfig,
  customRequirements?: Partial<CertificationRequirements>
): ExamScoringService {
  return new ExamScoringService(examConfig, customRequirements);
}

/**
 * Utility function to get default requirements for exam type
 */
export function getDefaultRequirements(examType: string): CertificationRequirements {
  return CERTIFICATION_REQUIREMENTS[examType] || CERTIFICATION_REQUIREMENTS['full-mock'];
}