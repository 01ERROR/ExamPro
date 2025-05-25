import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, Award } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ExamCard from '../components/exam/ExamCard';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { exams, results } = useExam();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  // Stats
  const completedExams = results.length;
  const upcomingExams = exams.filter(exam => new Date(exam.startTime) > new Date()).length;
  const passedExams = results.filter(result => result.passed).length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, result) => acc + (result.score / result.totalMarks) * 100, 0) / results.length)
    : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Here's an overview of your exams and performance.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="h-full">
            <CardContent className="flex items-center p-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Exams</p>
                <p className="text-2xl font-bold text-gray-900">{completedExams}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardContent className="flex items-center p-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Exams Passed</p>
                <p className="text-2xl font-bold text-gray-900">{passedExams}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardContent className="flex items-center p-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingExams}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardContent className="flex items-center p-6">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {results.length > 0 && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Results</h2>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.examId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.examTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.score} / {result.totalMarks} ({Math.round((result.score / result.totalMarks) * 100)}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          result.passed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <motion.div 
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ExamCard exam={exam} />
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;