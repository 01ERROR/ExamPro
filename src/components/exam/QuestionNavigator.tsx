import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: Array<{ id: string }>;
  currentQuestionIndex: number;
  answeredQuestions: Array<string>;
  onQuestionChange: (index: number) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h3 className="font-medium text-gray-900 mb-4">Question Navigator</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const isActive = index === currentQuestionIndex;
          const isAnswered = answeredQuestions.includes(question.id);
          
          return (
            <button
              key={question.id}
              className={`
                flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium
                transition duration-150 ease-in-out
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isAnswered
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              onClick={() => onQuestionChange(index)}
            >
              <span className="sr-only">{`Question ${index + 1}`}</span>
              <span className="md:hidden">{index + 1}</span>
              <span className="hidden md:flex items-center">
                {isAnswered ? (
                  <CheckCircle className="h-4 w-4 md:mr-1" />
                ) : (
                  <Circle className="h-4 w-4 md:mr-1" />
                )}
                <span>{index + 1}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;