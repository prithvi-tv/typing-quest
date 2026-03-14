import React, { useRef, useEffect } from 'react';

interface TypingInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const TypingInput: React.FC<TypingInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Start typing when ready...",
  autoFocus = false,
  onFocus,
  onBlur,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4">
        <label htmlFor="typing-input" className="block text-sm font-medium text-gray-700 mb-2">
          Your typing
        </label>
        <textarea
          ref={inputRef}
          id="typing-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md font-mono text-lg leading-relaxed tracking-wide resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{value.length} characters typed</span>
            <span>{value.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
          </div>
          
          {!disabled && (
            <div className="text-xs text-gray-400">
              Press Tab to focus • No autocorrect
            </div>
          )}
        </div>
      </div>
    </div>
  );
};