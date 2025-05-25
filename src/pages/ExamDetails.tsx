import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Award, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { motion } from 'framer-motion';

const ExamDetails: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const { exams, startExam } = useExam();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const exam = exams.find((e) => e.id === examId);

  if (!exam) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h2>
          <p className="text-gray-600 mb-6">The exam you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  const handleStartExam = () => {
    startExam(exam.id, user.id);
    navigate(`/exam/${exam.id}/take`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAvailable = 
    new Date() >= new Date(exam.startTime) && 
    new Date() <= new Date(exam.endTime);

  return (
    <Layout>
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
          <div>
            {isAvailable ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Available Now
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Not Available
              </span>
            )}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{exam.duration} minutes</span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Questions</h3>
                <p className="mt-1">{exam.questions.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Marks</h3>
                <p className="mt-1">{exam.totalMarks}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Passing Marks</h3>
                <p className="flex items-center mt-1">
                  <Award className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{exam.passingMarks} ({Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)</span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Available From</h3>
                <p className="mt-1">{formatDate(exam.startTime)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Available Until</h3>
                <p className="mt-1">{formatDate(exam.endTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">1</span>
                <span>The exam has a time limit of {exam.duration} minutes.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">2</span>
                <span>You must complete the exam in one session. If you close the browser, your progress may be lost.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">3</span>
                <span>The exam consists of multiple types of questions: multiple choice, single choice, true/false, and short answer.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">4</span>
                <span>You can navigate between questions using the question navigator or the next/previous buttons.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">5</span>
                <span>Your answers are automatically saved as you progress through the exam.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">6</span>
                <span>To pass the exam, you need to score at least {exam.passingMarks} marks out of {exam.totalMarks}.</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Once you start the exam, the timer will begin and cannot be paused. Make sure you have a stable internet connection and enough time to complete the exam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            disabled={!isAvailable}
            onClick={handleStartExam}
          >
            Start Exam
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ExamDetails;