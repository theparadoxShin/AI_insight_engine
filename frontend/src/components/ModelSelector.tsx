import React from 'react';
import { clsx } from 'clsx';
import { GenerationModel, Language } from '../types';
import { GENERATION_MODELS } from '../utils/constants';
import { useTranslation } from '../utils/translations';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  type: 'text' | 'image';
  language: Language;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  type,
  language
}) => {
  const t = useTranslation(language);
  const availableModels = GENERATION_MODELS.filter(model => model.type === type);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Modèle de génération
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {availableModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;