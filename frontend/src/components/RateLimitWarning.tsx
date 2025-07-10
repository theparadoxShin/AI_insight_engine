import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { RateLimitInfo, Language } from '../types';
import { useTranslation } from '../utils/translations';

interface RateLimitWarningProps {
  rateLimitInfo: RateLimitInfo;
  language: Language;
}

const RateLimitWarning: React.FC<RateLimitWarningProps> = ({ 
  rateLimitInfo, 
  language 
}) => {
  const t = useTranslation(language);

  if (!rateLimitInfo.isLimited) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Clock className="w-4 h-4" />
        <span>
          {t('usageRemaining')} {rateLimitInfo.remainingRequests} {t('requestsRemaining')}
        </span>
      </div>
    );
  }

  const timeUntilReset = Math.max(0, rateLimitInfo.resetTime - Date.now());
  const secondsUntilReset = Math.ceil(timeUntilReset / 1000);

  return (
    <div className="flex items-center gap-2 text-sm text-yellow-400 mb-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
      <AlertTriangle className="w-4 h-4" />
      <span>
        {t('rateLimitExceeded')} {secondsUntilReset} {t('secondsBeforeRetry')}
      </span>
    </div>
  );
};

export default RateLimitWarning;