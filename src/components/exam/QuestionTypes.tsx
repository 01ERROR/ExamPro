import React from 'react';
import { QuestionType } from '../../types';

interface BaseQuestionProps {
  questionId: string;
  questionText: string;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

interface MultipleChoiceProps extends BaseQuestionProps {
  options: string[];
  selectedAnswers: string[];
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceProps> = ({
  questionId,
  questionText,
  options,
  selectedAnswers,
  onAnswerChange,
}) => {
  const handleCheckboxChange = (option: string) => {
    let newAnswers;
    
    if (selectedAnswers.includes(option)) {
      newAnswers = selectedAnswers.filter((item) => item !== option);
    } else {
      newAnswers = [...selectedAnswers, option];
    }
    
    onAnswerChange(questionId, newAnswers);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{questionText}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              className="h-5 w-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={selectedAnswers.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Select all that apply.
      </p>
    </div>
  );
};

interface SingleChoiceProps extends BaseQuestionProps {
  options: string[];
  selectedAnswer: string;
}

export const SingleChoiceQuestion: React.FC<SingleChoiceProps> = ({
  questionId,
  questionText,
  options,
  selectedAnswer,
  onAnswerChange,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{questionText}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <label
            key={index}
            className={`
              flex items-start space-x-3 p-3 border rounded-md cursor-pointer transition-colors
              ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              className="h-5 w-5 mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500"
              checked={selectedAnswer === option}
              onChange={() => onAnswerChange(questionId, option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

interface TrueFalseProps extends BaseQuestionProps {
  selectedAnswer: string;
}

export const TrueFalseQuestion: React.FC<TrueFalseProps> = ({
  questionId,
  questionText,
  selectedAnswer,
  onAnswerChange,
}) => {
  const options = ['True', 'False'];
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{questionText}</h3>
      <div className="flex space-x-4">
        {options.map((option) => (
          <label
            key={option}
            className={`
              flex-1 flex items-center justify-center p-4 border rounded-md cursor-pointer transition-colors
              ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              className="sr-only"
              checked={selectedAnswer === option}
              onChange={() => onAnswerChange(questionId, option)}
            />
            <span className="font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

interface ShortAnswerProps extends BaseQuestionProps {
  answer: string;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerProps> = ({
  questionId,
  questionText,
  answer,
  onAnswerChange,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{questionText}</h3>
      <textarea
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={6}
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => onAnswerChange(questionId, e.target.value)}
      />
    </div>
  );
};

interface QuestionComponentProps {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  currentAnswer: string | string[] | undefined;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  questionId,
  questionText,
  questionType,
  options = [],
  currentAnswer,
  onAnswerChange,
}) => {
  switch (questionType) {
    case 'multiple-choice':
      return (
        <MultipleChoiceQuestion
          questionId={questionId}
          questionText={questionText}
          options={options}
          selectedAnswers={(currentAnswer as string[]) || []}
          onAnswerChange={onAnswerChange}
        />
      );
    case 'single-choice':
      return (
        <SingleChoiceQuestion
          questionId={questionId}
          questionText={questionText}
          options={options}
          selectedAnswer={(currentAnswer as string) || ''}
          onAnswerChange={onAnswerChange}
        />
      );
    case 'true-false':
      return (
        <TrueFalseQuestion
          questionId={questionId}
          questionText={questionText}
          selectedAnswer={(currentAnswer as string) || ''}
          onAnswerChange={onAnswerChange}
        />
      );
    case 'short-answer':
      return (
        <ShortAnswerQuestion
          questionId={questionId}
          questionText={questionText}
          answer={(currentAnswer as string) || ''}
          onAnswerChange={onAnswerChange}
        />
      );
    default:
      return <div>Unknown question type</div>;
  }
};

export default QuestionComponent;