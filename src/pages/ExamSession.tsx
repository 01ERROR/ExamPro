import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import QuestionComponent from '../components/exam/QuestionTypes';
import QuestionNavigator from '../components/exam/QuestionNavigator';
import Timer from '../components/exam/Timer';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { motion, AnimatePresence } from 'framer-motion';

const ExamSession: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentExam, currentAttempt, submitAnswer, completeExam } = useExam();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!currentExam || !currentAttempt || currentExam.id !== examId) {
      navigate(`/exam/${examId}`);
      return;
    }
  }, [user, currentExam, currentAttempt, examId, navigate]);

  if (!currentExam || !currentAttempt) {
    return null;
  }

  const currentQuestion = currentExam.questions[currentQuestionIndex];
  
  const answeredQuestionIds = currentAttempt.answers.map(a => a.questionId);
  
  const currentAnswer = currentAttempt.answers.find(
    (a) => a.questionId === currentQuestion.id
  )?.answer;

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    submitAnswer(questionId, answer);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentExam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionChange = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const handleSubmitExam = () => {
    setIsSubmitting(true);
    const result = completeExam();
    if (result) {
      navigate(`/exam/${examId}/result`);
    }
  };

  const handleTimeEnd = () => {
    handleSubmitExam();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentExam.title}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{currentQuestionIndex + 1}</span> of{' '}
                <span className="font-medium">{currentExam.questions.length}</span> questions
              </div>
              <Timer 
                duration={currentExam.duration} 
                onTimeEnd={handleTimeEnd} 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3">
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="mb-4 flex justify-between">
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} • {currentQuestion.marks} marks
              </div>
              <div className="text-sm font-medium">
                {currentQuestion.type === 'multiple-choice' 
                  ? 'Multiple Choice Question' 
                  : currentQuestion.type === 'single-choice'
                  ? 'Single Choice Question'
                  : currentQuestion.type === 'true-false'
                  ? 'True or False'
                  : 'Short Answer Question'}
              </div>
            </div>
            
            <QuestionComponent
              questionId={currentQuestion.id}
              questionText={currentQuestion.text}
              questionType={currentQuestion.type}
              options={currentQuestion.options}
              currentAnswer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />
            
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                leftIcon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              
              {currentQuestionIndex === currentExam.questions.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleConfirmSubmit}
                >
                  Submit Exam
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={goToNextQuestion}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <QuestionNavigator
              questions={currentExam.questions}
              currentQuestionIndex={currentQuestionIndex}
              answeredQuestions={answeredQuestionIds}
              onQuestionChange={handleQuestionChange}
            />
            
            <div className="mt-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleConfirmSubmit}
              >
                Submit Exam
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
              <div className="flex">
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5 mr-2" />
                <div>
                  <span className="font-medium">Note:</span> You have answered{' '}
                  <span className="font-medium">{answeredQuestionIds.length}</span> out of{' '}
                  <span className="font-medium">{currentExam.questions.length}</span> questions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showConfirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Submission
              </h3>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to submit your exam? You've answered{' '}
                <span className="font-medium">{answeredQuestionIds.length}</span> out of{' '}
                <span className="font-medium">{currentExam.questions.length}</span> questions.
              </p>
              
              {answeredQuestionIds.length < currentExam.questions.length && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mr-2" />
                    <div className="text-sm text-yellow-700">
                      You have unanswered questions. Are you sure you want to proceed?
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmSubmit(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitExam}
                  isLoading={isSubmitting}
                >
                  Submit Exam
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamSession;