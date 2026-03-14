import React from 'react';

interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  totalTime: number;
  isCompleted?: boolean;
  elapsedTime?: number;
}

export const Timer: React.FC<TimerProps> = ({
  isCompleted = false,
  elapsedTime = 0,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isCompleted) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="text-center">
        <div className="mb-4">
          <div className="text-4xl font-mono font-bold text-green-600">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Completion time
          </div>
        </div>
      </div>
    </div>
  );
};