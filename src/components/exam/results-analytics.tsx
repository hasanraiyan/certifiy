'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { ExamResults } from '@/lib/exam/types';

interface ResultsAnalyticsProps {
  results: ExamResults;
  previousAttempts?: ExamResults[];
  onBackToResults?: () => void;
  className?: string;
}

interface ChartData {
  domain: string;
  score: number;
  correct: number;
  total: number;
  improvement?: number;
}

interface TimeAnalysisData {
  domain: string;
  averageTime: number;
  totalQuestions: number;
}

interface DifficultyAnalysisData {
  difficulty: string;
  correct: number;
  total: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ResultsAnalytics({ 
  results, 
  previousAttempts = [], 
  onBackToResults,
  className 
}: ResultsAnalyticsProps) {
  // Convert domain scores to chart data
  const domainChartData: ChartData[] = Array.from(results.domainScores.entries()).map(([domain, score]) => {
    // Calculate improvement from previous attempts
    let improvement = 0;
    if (previousAttempts.length > 0) {
      const lastAttempt = previousAttempts[previousAttempts.length - 1];
      const previousScore = lastAttempt.domainScores.get(domain);
      if (previousScore) {
        improvement = score.score - previousScore.score;
      }
    }

    return {
      domain,
      score: Math.round(score.score),
      correct: score.correctAnswers,
      total: score.totalQuestions,
      improvement
    };
  });

  // Time analysis data
  const timeAnalysisData: TimeAnalysisData[] = Array.from(results.domainScores.entries()).map(([domain, score]) => {
    const domainQuestions = results.questionResults.filter(q => q.domain === domain);
    const totalTime = domainQuestions.reduce((sum, q) => sum + q.timeSpent, 0);
    const averageTime = domainQuestions.length > 0 ? totalTime / domainQuestions.length : 0;

    return {
      domain,
      averageTime: Math.round(averageTime),
      totalQuestions: score.totalQuestions
    };
  });

  // Difficulty analysis
  const difficultyAnalysis: DifficultyAnalysisData[] = [
    { difficulty: 'Easy', correct: 0, total: 0, percentage: 0 },
    { difficulty: 'Medium', correct: 0, total: 0, percentage: 0 },
    { difficulty: 'Hard', correct: 0, total: 0, percentage: 0 }
  ];

  // Note: Since we don't have difficulty data in QuestionResult, we'll simulate it
  // In a real implementation, this would come from the question data
  results.questionResults.forEach((result, index) => {
    const difficultyIndex = index % 3; // Simulate difficulty distribution
    difficultyAnalysis[difficultyIndex].total++;
    if (result.correct) {
      difficultyAnalysis[difficultyIndex].correct++;
    }
  });

  difficultyAnalysis.forEach(item => {
    item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });

  // Performance trend data (if previous attempts exist)
  const performanceTrendData = previousAttempts.length > 0 
    ? [...previousAttempts, results].map((attempt, index) => ({
        attempt: `Attempt ${index + 1}`,
        score: Math.round(attempt.score),
        timeSpent: Math.round(attempt.timeSpent / 60) // Convert to minutes
      }))
    : [];

  // Recommendations based on performance
  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    // Domain-specific recommendations
    domainChartData.forEach(domain => {
      if (domain.score < 70) {
        recommendations.push(`Focus on ${domain.domain} - scored ${domain.score}%`);
      }
    });

    // Time management recommendations
    const avgTimePerQuestion = results.timeSpent / results.totalQuestions;
    if (avgTimePerQuestion > 120) { // More than 2 minutes per question
      recommendations.push('Work on time management - spending too much time per question');
    }

    // Accuracy recommendations
    const accuracyRate = (results.correctAnswers / results.answeredQuestions) * 100;
    if (accuracyRate < 80) {
      recommendations.push('Review fundamental concepts to improve accuracy');
    }

    // Completion recommendations
    if (results.answeredQuestions < results.totalQuestions) {
      recommendations.push('Practice completing all questions within time limit');
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Detailed Analytics</h2>
          <p className="text-muted-foreground">Deep dive into your exam performance</p>
        </div>
        {onBackToResults && (
          <Button variant="outline" onClick={onBackToResults}>
            Back to Results
          </Button>
        )}
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recommendations">Insights</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domain Performance Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Domain Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Score (%)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart data={domainChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="domain" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [
                        `${value}%`,
                        name === 'score' ? 'Score' : name
                      ]}
                    />
                    <Bar dataKey="score" fill="var(--color-score)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Score Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    correct: {
                      label: "Correct",
                      color: "hsl(142, 76%, 36%)",
                    },
                    incorrect: {
                      label: "Incorrect", 
                      color: "hsl(0, 84%, 60%)",
                    },
                    unanswered: {
                      label: "Unanswered",
                      color: "hsl(0, 0%, 60%)",
                    },
                  }}
                  className="h-[300px]"
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Correct', value: results.correctAnswers, fill: 'hsl(142, 76%, 36%)' },
                        { name: 'Incorrect', value: results.answeredQuestions - results.correctAnswers, fill: 'hsl(0, 84%, 60%)' },
                        { name: 'Unanswered', value: results.totalQuestions - results.answeredQuestions, fill: 'hsl(0, 0%, 60%)' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    />
                    <ChartTooltip />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Difficulty Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficultyAnalysis.map((item, index) => (
                  <div key={item.difficulty} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold mb-2" style={{ color: COLORS[index] }}>
                      {item.percentage}%
                    </div>
                    <div className="font-medium">{item.difficulty}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.correct}/{item.total} correct
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Analysis Tab */}
        <TabsContent value="time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Spent by Domain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  averageTime: {
                    label: "Average Time (seconds)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={timeAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="domain" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}s`, 'Average Time']}
                  />
                  <Bar dataKey="averageTime" fill="var(--color-averageTime)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Time Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Minutes:Seconds
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average per Question</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(results.timeSpent / results.totalQuestions)}s
                </div>
                <p className="text-xs text-muted-foreground">
                  Per question
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.timeSpent / results.totalQuestions < 90 ? 'Good' : 'Slow'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Time management
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {performanceTrendData.length > 1 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Score (%)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <LineChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="attempt" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="var(--color-score)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-score)' }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Trend Data Available</h3>
                <p className="text-muted-foreground">
                  Take more exams to see your performance trends over time.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Improvement Indicators */}
          {previousAttempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Domain Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {domainChartData.map((domain) => (
                    <div key={domain.domain} className="flex items-center justify-between">
                      <span className="font-medium">{domain.domain}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{domain.score}%</span>
                        {domain.improvement !== undefined && domain.improvement !== 0 && (
                          <Badge variant={domain.improvement > 0 ? 'default' : 'destructive'}>
                            {domain.improvement > 0 ? '+' : ''}{Math.round(domain.improvement)}%
                            {domain.improvement > 0 ? (
                              <TrendingUp className="h-3 w-3 ml-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Study Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Excellent Performance!</h3>
                  <p className="text-muted-foreground">
                    You&apos;re performing well across all areas. Keep up the great work!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Strengths</h4>
                  <div className="space-y-2">
                    {domainChartData
                      .filter(d => d.score >= 80)
                      .map(domain => (
                        <div key={domain.domain} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{domain.domain} ({domain.score}%)</span>
                        </div>
                      ))}
                    {domainChartData.filter(d => d.score >= 80).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Focus on improving scores to identify strengths
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Areas for Improvement</h4>
                  <div className="space-y-2">
                    {domainChartData
                      .filter(d => d.score < 70)
                      .map(domain => (
                        <div key={domain.domain} className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{domain.domain} ({domain.score}%)</span>
                        </div>
                      ))}
                    {domainChartData.filter(d => d.score < 70).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Great job! All domains are performing well.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}