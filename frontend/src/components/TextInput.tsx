import React, { useState, useEffect } from 'react';
import { Play, Loader2, Wand2 } from 'lucide-react';
import { clsx } from 'clsx';
import { ModuleType, Language } from '../types';
import { useTranslation } from '../utils/translations';
import { MAX_CHARACTERS } from '../utils/constants';
import ModelSelector from './ModelSelector';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  module: ModuleType;
  language: Language;
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onAnalyze,
  isLoading,
  isDisabled,
  module,
  language,
  selectedModel,
  onModelChange
}) => {
  const t = useTranslation(language);
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const canAnalyze = value.trim() && !isOverLimit && !isLoading && !isDisabled;

  const isGenerationModule = module === 'contentGeneration';
  const placeholder = isGenerationModule 
    ? t('promptInputPlaceholder')
    : module === 'ragPlayground'
    ? t('ragQueryPlaceholder')
    : t('textInputPlaceholder');

  const buttonText = isGenerationModule ? t('generate') : t('analyze');
  const loadingText = isGenerationModule ? t('generating') : t('analyzing');
  const ButtonIcon = isGenerationModule ? Wand2 : Play;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter' && canAnalyze) {
        e.preventDefault();
        onAnalyze();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canAnalyze, onAnalyze]);

  return (
    <div className="space-y-4">
      {isGenerationModule && selectedModel && onModelChange && (
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          type="text"
          language={language}
        />
      )}
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={clsx(
            "w-full min-h-[150px] p-4 bg-gray-800 border rounded-lg text-white placeholder-gray-400 resize-y transition-all",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            isFocused ? "border-blue-500" : "border-gray-600",
            isOverLimit && "border-red-500 focus:ring-red-500"
          )}
          disabled={isLoading}
        />
        
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <div className={clsx(
            "text-sm font-medium",
            isOverLimit ? "text-red-400" : characterCount > MAX_CHARACTERS * 0.8 ? "text-yellow-400" : "text-gray-400"
          )}>
            {characterCount.toLocaleString()}/{MAX_CHARACTERS.toLocaleString()}
          </div>
          
          <button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
              canAnalyze
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <ButtonIcon className="w-4 h-4" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {isOverLimit && (
        <div className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          <span>Text exceeds maximum length of {MAX_CHARACTERS.toLocaleString()} characters</span>
        </div>
      )}
    </div>
  );
};

export default TextInput;