'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react';
import { ExamResults as ExamResultsType } from '@/lib/exam/types';

interface ExamResultsProps {
  results: ExamResultsType;
  onRetakeExam?: () => void;
  onViewAnalytics?: () => void;
  onBackToDashboard?: () => void;
  className?: string;
}

export function ExamResults({ 
  results, 
  onRetakeExam, 
  onViewAnalytics, 
  onBackToDashboard,
  className 
}: ExamResultsProps) {
  // Convert Map to Array for easier processing
  const domainScores = Array.from(results.domainScores.entries()).map(([, score]) => score);

  // Calculate time statistics
  const averageTimePerQuestion = results.timeSpent / results.totalQuestions;
  const timeInMinutes = Math.floor(results.timeSpent / 60);
  const timeInSeconds = results.timeSpent % 60;

  // Calculate performance metrics
  const completionRate = (results.answeredQuestions / results.totalQuestions) * 100;
  const accuracyRate = results.answeredQuestions > 0 
    ? (results.correctAnswers / results.answeredQuestions) * 100 
    : 0;

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header Section with Overall Score */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            {results.passed ? (
              <Award className="w-16 h-16 text-green-500" />
            ) : (
              <Target className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {results.passed ? 'Congratulations!' : 'Keep Studying!'}
          </CardTitle>
          <div className="text-6xl font-bold mt-4 mb-2">
            {Math.round(results.score)}%
          </div>
          <Badge 
            variant={results.passed ? 'default' : 'destructive'}
            className="text-lg px-4 py-2"
          >
            {results.passed ? 'PASSED' : 'FAILED'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {results.correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {results.answeredQuestions - results.correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-600">
                {results.totalQuestions - results.answeredQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Unanswered</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {results.totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {results.answeredQuestions} of {results.totalQuestions} questions answered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(accuracyRate)}%</div>
            <Progress value={accuracyRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Of answered questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeInMinutes}:{timeInSeconds.toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Avg: {Math.round(averageTimePerQuestion)}s per question
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Domain Performance Breakdown */}
      {domainScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance by Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {domainScores.map((domainScore) => (
                <div key={domainScore.domain} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{domainScore.domain}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {domainScore.correctAnswers}/{domainScore.totalQuestions}
                      </span>
                      <Badge variant={domainScore.score >= 70 ? 'default' : 'secondary'}>
                        {Math.round(domainScore.score)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={domainScore.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onViewAnalytics && (
          <Button variant="outline" onClick={onViewAnalytics} className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View Detailed Analytics
          </Button>
        )}
        {onRetakeExam && (
          <Button onClick={onRetakeExam} className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Retake Exam
          </Button>
        )}
        {onBackToDashboard && (
          <Button variant="outline" onClick={onBackToDashboard}>
            Back to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}