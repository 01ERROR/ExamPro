export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isActive: boolean;
  questions: Question[];
}

export type QuestionType = 'multiple-choice' | 'single-choice' | 'true-false' | 'short-answer';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  marks: number;
  options?: string[];
  correctAnswer?: string | string[];
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  status: 'in-progress' | 'completed' | 'abandoned';
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  score: number;
  totalMarks: number;
  passingMarks: number;
  timeTaken: number; // in minutes
  submittedAt: string;
  passed: boolean;
}