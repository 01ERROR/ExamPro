import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in minutes
  onTimeEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeEnd();
      return;
    }

    // Set warning state when less than 5 minutes remain
    if (timeLeft <= 300 && !isWarning) {
      setIsWarning(true);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeEnd, isWarning]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div
      className={`
        flex items-center space-x-2 text-sm font-medium rounded-full px-3 py-1
        transition-colors duration-300
        ${
          isWarning
            ? 'bg-red-100 text-red-800 animate-pulse'
            : 'bg-blue-100 text-blue-800'
        }
      `}
    >
      <Clock className="h-4 w-4" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;