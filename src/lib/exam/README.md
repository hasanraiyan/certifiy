# Exam Engine Scoring System

This module provides comprehensive answer validation and scoring functionality for the exam engine system.

## Features

### Answer Validation
- **Format Validation**: Validates answer structure and data types
- **Question Type Validation**: Ensures answers match question type requirements
- **Option Index Validation**: Verifies selected options are valid indices
- **Answer Sanitization**: Cleans and normalizes answer data
- **Completeness Validation**: Checks if all required questions are answered

### Scoring Algorithms
- **Binary Scoring**: All-or-nothing scoring for single-answer questions
- **Partial Credit**: Proportional scoring for multiple-select questions
- **Question Type Support**: Multiple choice, multiple select, and true/false questions
- **Configurable Scoring**: Customizable scoring rules and penalties

### Exam Scoring Service
- **Comprehensive Scoring**: Complete exam session scoring with analytics
- **Pass/Fail Determination**: Certification requirement validation
- **Performance Metrics**: Detailed performance analysis and recommendations
- **Time Analysis**: Time-based performance metrics and warnings
- **Domain Analysis**: Subject area performance breakdown

## Core Components

### 1. Answer Validation (`validation.ts`)

```typescript
import { validateAnswerForQuestionType, sanitizeAnswer } from '@/lib/exam';

// Validate answer format
const validation = validateAnswerForQuestionType(answer, question);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}

// Sanitize answer data
const cleanAnswer = sanitizeAnswer(answer);
```

### 2. Scoring Utilities (`utils.ts`, `scoring.ts`)

```typescript
import { calculateQuestionScore, scoreAnswer } from '@/lib/exam';

// Score individual question
const score = calculateQuestionScore(answer, question);

// Score with validation
const result = scoreAnswer(answer, question, scoringConfig);
```

### 3. Exam Scoring Service (`exam-scoring-service.ts`)

```typescript
import { createExamScoringService } from '@/lib/exam';

// Create scoring service
const scoringService = createExamScoringService(examConfig);

// Score complete exam
const results = scoringService.scoreExam(session, questions);

// Determine pass/fail
const passResult = scoringService.determinePassFail(results, questions);

// Get performance metrics
const metrics = scoringService.calculatePerformanceMetrics(results, questions, session);
```

## Question Types

### Multiple Choice
- **Format**: Single selection from options
- **Scoring**: Binary (1 for correct, 0 for incorrect)
- **Validation**: Must have exactly one selected option

```typescript
const question: Question = {
  type: 'multiple-choice',
  options: ['Option A', 'Option B', 'Option C'],
  correctAnswer: 1, // Index of correct option
  // ...
};

const answer: Answer = {
  selectedOptions: [1], // Single selection
  // ...
};
```

### Multiple Select
- **Format**: Multiple selections from options
- **Scoring**: Partial credit based on correct/incorrect selections
- **Validation**: Must have at least one selected option

```typescript
const question: Question = {
  type: 'multiple-select',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: [0, 2, 3], // Indices of correct options
  // ...
};

const answer: Answer = {
  selectedOptions: [0, 2], // Multiple selections (partial credit)
  // ...
};
```

### True/False
- **Format**: Single selection from two options
- **Scoring**: Binary (1 for correct, 0 for incorrect)
- **Validation**: Must have exactly one selected option

```typescript
const question: Question = {
  type: 'true-false',
  options: ['True', 'False'],
  correctAnswer: 0, // Index of correct option
  // ...
};

const answer: Answer = {
  selectedOptions: [0], // Single selection
  // ...
};
```

## Scoring Configuration

### Basic Configuration

```typescript
const scoringConfig: ScoringConfig = {
  passingThreshold: 70,           // Minimum percentage to pass
  partialCreditEnabled: true,     // Enable partial credit for multiple select
  penalizeIncorrect: false,       // Penalize incorrect selections
  timeBonus: false,              // Award time-based bonus points
  domainWeighting: new Map()     // Weight domains differently
};
```

### Certification Requirements

```typescript
const requirements: CertificationRequirements = {
  passingScore: 70,              // Overall passing percentage
  domainRequirements: new Map([  // Per-domain requirements
    ['Domain A', 65],
    ['Domain B', 70]
  ]),
  timeLimit: 10800,             // Time limit in seconds
  minimumQuestions: 150,        // Minimum questions to answer
  allowPartialCredit: true      // Allow partial credit
};
```

## Performance Metrics

The scoring service provides comprehensive performance analytics:

### Overall Performance
- Overall score percentage
- Pass/fail status
- Accuracy rate (correct answers / answered questions)
- Completion rate (answered questions / total questions)

### Domain Performance
- Score breakdown by subject domain
- Strong and weak domain identification
- Domain-specific recommendations

### Time Analysis
- Total time spent
- Average time per question
- Time efficiency metrics
- Time-based warnings

### Difficulty Analysis
- Performance by question difficulty level
- Easy/medium/hard question accuracy

## Usage Examples

### Basic Exam Scoring

```typescript
import { createExamScoringService } from '@/lib/exam';

// Create service
const scoringService = createExamScoringService(examConfig);

// Score exam
const results = scoringService.scoreExam(examSession, questions);

console.log(`Score: ${results.score}%`);
console.log(`Passed: ${results.passed}`);
```

### Custom Requirements

```typescript
const customRequirements = {
  passingScore: 80,
  domainRequirements: new Map([
    ['Security', 75],
    ['Networking', 70]
  ])
};

const scoringService = createExamScoringService(examConfig, customRequirements);
const passResult = scoringService.determinePassFail(results, questions);
```

### Performance Analysis

```typescript
const metrics = scoringService.calculatePerformanceMetrics(
  results, 
  questions, 
  examSession
);

console.log(`Accuracy: ${metrics.accuracyRate}%`);
console.log(`Strong domains: ${metrics.strongDomains.join(', ')}`);
console.log(`Recommendations: ${metrics.recommendations.join('; ')}`);
```

## Validation and Error Handling

### Answer Validation

```typescript
import { validateAnswerForQuestionType } from '@/lib/exam';

const validation = validateAnswerForQuestionType(answer, question);

if (!validation.isValid) {
  validation.errors.forEach(error => {
    console.error('Validation error:', error);
  });
}
```

### Results Validation

```typescript
const validation = scoringService.validateResults(results, session, questions);

if (!validation.isValid) {
  console.error('Results validation failed:', validation.errors);
}
```

## Best Practices

### 1. Always Validate Answers
```typescript
// Validate before scoring
const validation = validateAnswerForQuestionType(answer, question);
if (validation.isValid) {
  const score = calculateQuestionScore(answer, question);
}
```

### 2. Sanitize User Input
```typescript
// Clean answer data before processing
const cleanAnswer = sanitizeAnswer(userAnswer);
```

### 3. Use Appropriate Scoring Configuration
```typescript
// Different configs for practice vs test
const config = examConfig.type === 'practice' 
  ? { ...DEFAULT_SCORING_CONFIG, partialCreditEnabled: true }
  : { ...DEFAULT_SCORING_CONFIG, partialCreditEnabled: false };
```

### 4. Validate Results Integrity
```typescript
// Always validate results after scoring
const validation = scoringService.validateResults(results, session, questions);
if (!validation.isValid) {
  throw new Error('Results validation failed');
}
```

## Error Handling

The scoring system includes comprehensive error handling:

- **ValidationError**: Thrown for invalid data structures
- **Scoring Errors**: Graceful handling of invalid answers
- **Results Validation**: Integrity checks for calculated results
- **Time Validation**: Handling of invalid time values

## Performance Considerations

- **Efficient Algorithms**: Optimized scoring calculations
- **Memory Management**: Proper cleanup of large data structures
- **Batch Processing**: Support for scoring multiple questions efficiently
- **Caching**: Results caching for repeated calculations

## Testing

The scoring system includes comprehensive validation:

- **Unit Tests**: Individual function testing
- **Integration Tests**: Complete workflow testing
- **Edge Case Testing**: Boundary condition validation
- **Performance Tests**: Large dataset handling

For examples and demonstrations, see `examples/scoring-example.ts`.