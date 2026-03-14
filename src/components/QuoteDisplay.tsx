import React from 'react';

interface QuoteDisplayProps {
  quote: string;
  typedText: string;
  currentIndex: number;
  isActive: boolean;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  quote,
  typedText,
  currentIndex,
  isActive,
}) => {
  const renderCharacter = (char: string, index: number) => {
    let className = 'relative';
    
    if (index < typedText.length) {
      if (typedText[index] === char) {
        className += ' text-green-600 bg-green-50';
      } else {
        className += ' text-red-600 bg-red-50';
      }
    } else if (index === currentIndex && isActive) {
      className += ' text-gray-900 bg-blue-200 animate-pulse';
    } else {
      className += ' text-gray-400';
    }

    if (char === ' ') {
      return (
        <span key={index} className={className}>
          {index === currentIndex && isActive ? (
            <span className="inline-block w-2 h-6 bg-blue-500 animate-pulse"></span>
          ) : (
            '\u00A0'
          )}
        </span>
      );
    }

    return (
      <span key={index} className={className}>
        {char}
        {index === currentIndex && isActive && (
          <span className="absolute -right-0.5 top-0 w-0.5 h-full bg-blue-500 animate-pulse"></span>
        )}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="text-lg leading-relaxed font-mono tracking-wide select-none">
        {quote.split('').map((char, index) => renderCharacter(char, index))}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>
            {typedText.length} / {quote.length} characters
          </span>
          <span>
            {Math.round((typedText.length / quote.length) * 100)}% complete
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-xs">Correct</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-xs">Incorrect</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-xs">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};