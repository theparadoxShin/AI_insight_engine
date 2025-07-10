import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { AnalysisType, Language } from '../types';
import { useTranslation } from '../utils/translations';
import { getCodeExample, getInstallInstructions } from '../utils/codeExamples';

interface CodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  provider: string;
  analysisType: AnalysisType;
  language: Language;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  isOpen,
  onClose,
  provider,
  analysisType,
  language
}) => {
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState(provider);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);

  const providers = ['aws', 'azure', 'google'];

  const handleCopyCode = async () => {
    const code = getCodeExample(activeTab, analysisType);
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInstructions = async () => {
    const instructions = getInstallInstructions(activeTab);
    await navigator.clipboard.writeText(instructions);
    setCopiedInstructions(true);
    setTimeout(() => setCopiedInstructions(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {language === 'fr' ? 'Exemples de Code' : 'Code Examples'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex border-b border-gray-700">
          {providers.map((prov) => (
            <button
              key={prov}
              onClick={() => setActiveTab(prov)}
              className={clsx(
                "px-4 py-2 font-medium capitalize transition-colors",
                activeTab === prov
                  ? "bg-blue-600 text-white border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              {prov === 'aws' ? 'AWS' : prov === 'azure' ? 'Azure' : 'Google Cloud'}
            </button>
          ))}
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">{t('installation')}</h3>
              <button
                onClick={handleCopyInstructions}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                {copiedInstructions ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedInstructions ? t('copied') : t('copy')}
              </button>
            </div>
            <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
              <code>{getInstallInstructions(activeTab)}</code>
            </pre>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">{t('codeExample')}</h3>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCode ? t('copied') : t('copy')}
              </button>
            </div>
            <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
              <code>{getCodeExample(activeTab, analysisType)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;