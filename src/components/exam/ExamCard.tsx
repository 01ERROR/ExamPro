import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import Card, { CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { Exam } from '../../types';

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const navigate = useNavigate();
  
  const startDate = new Date(exam.startTime);
  const endDate = new Date(exam.endTime);
  
  const isAvailable = new Date() >= startDate && new Date() <= endDate;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="h-full flex flex-col" hover>
      <CardHeader>
        <CardTitle>{exam.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600 mb-4">{exam.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Duration: {exam.duration} minutes</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Total Questions: {exam.questions.length}</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Total Marks: {exam.totalMarks}</p>
            <p>Passing Marks: {exam.passingMarks}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-2">
            Available: {formatDate(startDate)} - {formatDate(endDate)}
          </p>
          <Button
            variant={isAvailable ? 'primary' : 'outline'}
            fullWidth
            disabled={!isAvailable}
            onClick={() => navigate(`/exam/${exam.id}`)}
          >
            {isAvailable ? 'Start Exam' : 'Not Available Yet'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExamCard;