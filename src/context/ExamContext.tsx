import React, { createContext, useContext, useState } from 'react';
import { Exam, ExamAttempt, ExamResult, Question } from '../types';

// Mock data for exams
const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Test your knowledge of React fundamentals',
    duration: 30,
    totalMarks: 50,
    passingMarks: 25,
    startTime: new Date(Date.now()).toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    isActive: true,
    questions: [
      {
        id: '1',
        text: 'What is React?',
        type: 'single-choice',
        marks: 10,
        options: [
          'A JavaScript library for building user interfaces',
          'A programming language',
          'A database management system',
          'A server-side framework',
        ],
        correctAnswer: 'A JavaScript library for building user interfaces',
      },
      {
        id: '2',
        text: 'Which of the following are React hooks? (Select all that apply)',
        type: 'multiple-choice',
        marks: 10,
        options: ['useState', 'useEffect', 'useContext', 'useReactState'],
        correctAnswer: ['useState', 'useEffect', 'useContext'],
      },
      {
        id: '3',
        text: 'React uses a virtual DOM.',
        type: 'true-false',
        marks: 10,
        options: ['True', 'False'],
        correctAnswer: 'True',
      },
      {
        id: '4',
        text: 'Explain the concept of React components in your own words.',
        type: 'short-answer',
        marks: 20,
      },
    ],
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics',
    duration: 45,
    totalMarks: 100,
    passingMarks: 60,
    startTime: new Date(Date.now()).toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    questions: [
      {
        id: '1',
        text: 'Which of the following is not a JavaScript data type?',
        type: 'single-choice',
        marks: 10,
        options: ['String', 'Number', 'Boolean', 'Character'],
        correctAnswer: 'Character',
      },
      {
        id: '2',
        text: 'What will console.log(typeof []); output?',
        type: 'single-choice',
        marks: 10,
        options: ['array', 'object', 'undefined', 'null'],
        correctAnswer: 'object',
      },
      {
        id: '3',
        text: 'JavaScript is a statically typed language.',
        type: 'true-false',
        marks: 10,
        options: ['True', 'False'],
        correctAnswer: 'False',
      },
      {
        id: '4',
        text: 'Explain the difference between let, const, and var in JavaScript.',
        type: 'short-answer',
        marks: 20,
      },
    ],
  },
];

// Mock exam results
const MOCK_RESULTS: ExamResult[] = [
  {
    examId: '3',
    examTitle: 'CSS Fundamentals',
    score: 75,
    totalMarks: 100,
    passingMarks: 60,
    timeTaken: 40,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    passed: true,
  },
];

interface ExamContextType {
  exams: Exam[];
  currentExam: Exam | null;
  currentAttempt: ExamAttempt | null;
  results: ExamResult[];
  setCurrentExam: (exam: Exam | null) => void;
  startExam: (examId: string, userId: string) => void;
  submitAnswer: (questionId: string, answer: string | string[]) => void;
  completeExam: () => ExamResult | null;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [results, setResults] = useState<ExamResult[]>(MOCK_RESULTS);

  const startExam = (examId: string, userId: string) => {
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;

    setCurrentExam(exam);
    
    const newAttempt: ExamAttempt = {
      id: Math.random().toString(36).substring(2, 9),
      examId,
      userId,
      startedAt: new Date().toISOString(),
      answers: [],
      status: 'in-progress',
    };
    
    setCurrentAttempt(newAttempt);
  };

  const submitAnswer = (questionId: string, answer: string | string[]) => {
    if (!currentAttempt) return;
    
    const answerIndex = currentAttempt.answers.findIndex(
      (a) => a.questionId === questionId
    );
    
    const newAnswers = [...currentAttempt.answers];
    
    if (answerIndex >= 0) {
      newAnswers[answerIndex] = { questionId, answer };
    } else {
      newAnswers.push({ questionId, answer });
    }
    
    setCurrentAttempt({
      ...currentAttempt,
      answers: newAnswers,
    });
  };

  const calculateScore = () => {
    if (!currentExam || !currentAttempt) return 0;
    
    let totalScore = 0;
    
    currentExam.questions.forEach((question) => {
      const answer = currentAttempt.answers.find(
        (a) => a.questionId === question.id
      );
      
      if (!answer) return;
      
      // Skip manual grading for short answers in this demo
      if (question.type === 'short-answer') return;
      
      if (question.type === 'multiple-choice') {
        const correctAnswers = question.correctAnswer as string[];
        const userAnswers = answer.answer as string[];
        
        // Calculate partial credit for multiple-choice
        const correctCount = userAnswers.filter(a => 
          correctAnswers.includes(a)
        ).length;
        
        const incorrectCount = userAnswers.filter(a => 
          !correctAnswers.includes(a)
        ).length;
        
        // Award points based on correct selections, penalize incorrect ones
        const score = Math.max(
          0,
          (correctCount / correctAnswers.length) * question.marks - 
            (incorrectCount * (question.marks / correctAnswers.length))
        );
        
        totalScore += score;
      } else {
        // For single-choice and true-false
        if (answer.answer === question.correctAnswer) {
          totalScore += question.marks;
        }
      }
    });
    
    return totalScore;
  };

  const completeExam = () => {
    if (!currentExam || !currentAttempt) return null;
    
    const score = calculateScore();
    const timeTaken = Math.round(
      (new Date().getTime() - new Date(currentAttempt.startedAt).getTime()) / 
      (1000 * 60)
    );
    
    const result: ExamResult = {
      examId: currentExam.id,
      examTitle: currentExam.title,
      score,
      totalMarks: currentExam.totalMarks,
      passingMarks: currentExam.passingMarks,
      timeTaken,
      submittedAt: new Date().toISOString(),
      passed: score >= currentExam.passingMarks,
    };
    
    setResults((prev) => [...prev, result]);
    
    setCurrentAttempt({
      ...currentAttempt,
      completedAt: new Date().toISOString(),
      score,
      status: 'completed',
    });
    
    return result;
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        currentExam,
        currentAttempt,
        results,
        setCurrentExam,
        startExam,
        submitAnswer,
        completeExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};