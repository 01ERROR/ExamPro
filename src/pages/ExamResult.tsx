import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award, Clock, BarChart3, Home } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { motion } from 'framer-motion';

const ExamResult: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { results } = useExam();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const result = results.find((r) => r.examId === examId);

  if (!result) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Result Not Found</h2>
          <p className="text-gray-600 mb-6">The exam result you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  const scorePercentage = Math.round((result.score / result.totalMarks) * 100);
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-600';
    if (scorePercentage >= 60) return 'text-blue-600';
    if (scorePercentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = () => {
    if (scorePercentage >= 80) return 'bg-green-100';
    if (scorePercentage >= 60) return 'bg-blue-100';
    if (scorePercentage >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Layout>
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Results</h1>
          <p className="text-gray-600">{result.examTitle}</p>
        </div>

        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={`rounded-full ${getScoreBackground()} p-8 text-center`}>
            <div className={`text-5xl font-bold ${getScoreColor()}`}>
              {scorePercentage}%
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
              {result.score} / {result.totalMarks} points
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center mb-8">
          {result.passed ? (
            <motion.div 
              className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Congratulations! You passed the exam.</span>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <XCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">You did not pass the exam. Try again later.</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Score Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Score:</span>
                    <span className="font-medium">{result.score} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-medium">{result.totalMarks} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passing Marks:</span>
                    <span className="font-medium">{result.passingMarks} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Percentage:</span>
                    <span className="font-medium">{scorePercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Result:</span>
                    <span className={`font-medium ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Exam Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exam Title:</span>
                    <span className="font-medium">{result.examTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Completed:</span>
                    <span className="font-medium">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="font-medium">{result.timeTaken} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Score</span>
                    <span className="text-sm font-medium text-gray-700">{scorePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        result.passed ? 'bg-green-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${scorePercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Passing Threshold</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round((result.passingMarks / result.totalMarks) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{
                        width: `${Math.round(
                          (result.passingMarks / result.totalMarks) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Feedback</h4>
                <p className="text-gray-600">
                  {result.passed
                    ? 'Great job! You have successfully passed this exam. Your understanding of the subject matter is good.'
                    : 'You did not pass this exam. We recommend reviewing the material and trying again. Focus on improving your understanding of the core concepts.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="flex justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Home className="h-5 w-5" />}
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default ExamResult;