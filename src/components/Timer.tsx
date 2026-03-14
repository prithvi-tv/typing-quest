import React from 'react';

interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  isActive,
  totalTime,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const getTimerColor = (): string => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage <= 10) return 'text-red-600';
    if (percentage <= 25) return 'text-orange-600';
    return 'text-gray-900';
  };

  const getProgressColor = (): string => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage <= 10) return 'bg-red-500';
    if (percentage <= 25) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="text-center">
        <div className="mb-4">
          <div className={`text-4xl font-mono font-bold ${getTimerColor()}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {isActive ? 'Time remaining' : timeRemaining === 0 ? 'Time up!' : 'Ready to start'}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>0:00</span>
          <div className="flex items-center space-x-2">
            {isActive && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Active</span>
              </div>
            )}
          </div>
          <span>{formatTime(totalTime)}</span>
        </div>
      </div>
    </div>
  );
};