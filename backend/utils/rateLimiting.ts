export const LIMITS_CONFIG = {
  // === TOKENS (Generative AI) ===
  TOKENS: {
    // Conversion : 1 token ≈ 0.75 worlds (approximation)
    WORDS_TO_TOKENS_RATIO: 0.75,
    
    // Limits per hour (resets each hour)
    MAX_INPUT_TOKENS_PER_HOUR: 50000,    // ~37,500 words input/hour
    MAX_OUTPUT_TOKENS_PER_HOUR: 50000,   // ~37,500 words output/hour

    // Limits per day (resets at midnight UTC)
    MAX_TOTAL_TOKENS_PER_DAY: 200000,    // ~150,000 words/day

    // Limits per individual request
    MAX_INPUT_TOKENS_PER_REQUEST: 4000,  // ~3,000 words
    MAX_OUTPUT_TOKENS_PER_REQUEST: 2000, // ~1,500 words
  },
  
  // === TEXT ANALYSIS (NLP) ===
  TEXT: {
    MIN_LENGTH: 10,        // Minimum 10 characters
    MAX_LENGTH: 5000,      // Maximum 5000 characters
    MAX_REQUESTS_PER_HOUR: 50,
    MAX_REQUESTS_PER_DAY: 200,
  },
  
  // === FILES (Document Analysis) ===
  FILES: {
    MAX_FILE_SIZE_MB: 10,              // Max size per file
    MAX_FILES_PER_REQUEST: 5,          // Max number of files
    MAX_TOTAL_SIZE_MB_PER_REQUEST: 25, // Max total size per request
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
    ],
  },
  
  // === IMAGES (Module 3 & 4: Generation & Vision) ===
  IMAGES: {
    MAX_IMAGE_SIZE_MB: 5,
    MAX_IMAGES_PER_REQUEST: 3,
    MAX_GENERATIONS_PER_HOUR: 20,   // costly generation
    ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  },
  
  // === GENERAL ===
  GENERAL: {
    COOLDOWN_SECONDS: 3,          // Pause between requests
    CACHE_DURATION_MINUTES: 5,    // Cache duration
    CLEANUP_INTERVAL_MINUTES: 10, // Automatic cleanup
  },
};

/**
 * Structure pour stocker l'usage d'un utilisateur
 */
interface UserUsage {
  // Identification
  ip: string;
  sessionId: string;
  
  tokens: {
    inputToday: number;
    outputToday: number;
    inputThisHour: number;
    outputThisHour: number;
    lastHourReset: number;  // Timestamp
    lastDayReset: number;   // Timestamp
  };
  
  requests: {
    countThisHour: number;
    countToday: number;
    timestamps: number[];
  };
  
  files: {
    totalSizeMbToday: number;
    countToday: number;
  };
  
  images: {
    generationsThisHour: number;
    countToday: number;
  };
  
  lastRequest: number;
}


const usageStore = new Map<string, UserUsage>();

export function wordsToTokens(wordCount: number): number {
  return Math.ceil(wordCount * LIMITS_CONFIG.TOKENS.WORDS_TO_TOKENS_RATIO);
}


export function estimateTokens(text: string): number {
  // Estimation simple : nombre de mots = texte.split(' ').length
  const wordCount = text.trim().split(/\s+/).length;
  return wordsToTokens(wordCount);
}


function getOrCreateUsage(ip: string, sessionId: string): UserUsage {
  const key = `${ip}-${sessionId}`;
  
  if (!usageStore.has(key)) {
    const now = Date.now();
    usageStore.set(key, {
      ip,
      sessionId,
      tokens: {
        inputToday: 0,
        outputToday: 0,
        inputThisHour: 0,
        outputThisHour: 0,
        lastHourReset: now,
        lastDayReset: now,
      },
      requests: {
        countThisHour: 0,
        countToday: 0,
        timestamps: [],
      },
      files: {
        totalSizeMbToday: 0,
        countToday: 0,
      },
      images: {
        generationsThisHour: 0,
        countToday: 0,
      },
      lastRequest: now,
    });
  }
  
  return usageStore.get(key)!;
}


function resetCountersIfNeeded(usage: UserUsage): void {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;
  
  // Reset horaire
  if (now - usage.tokens.lastHourReset > oneHour) {
    usage.tokens.inputThisHour = 0;
    usage.tokens.outputThisHour = 0;
    usage.tokens.lastHourReset = now;
    usage.requests.countThisHour = 0;
    usage.images.generationsThisHour = 0;
  }
  
  // Reset quotidien
  if (now - usage.tokens.lastDayReset > oneDay) {
    usage.tokens.inputToday = 0;
    usage.tokens.outputToday = 0;
    usage.tokens.lastDayReset = now;
    usage.requests.countToday = 0;
    usage.files.totalSizeMbToday = 0;
    usage.files.countToday = 0;
    usage.images.countToday = 0;
  }
}


export function checkTokenLimits(
  ip: string,
  sessionId: string,
  estimatedInputTokens: number,
  estimatedOutputTokens: number = 1000
): {
  allowed: boolean;
  reason?: string;
  usage?: {
    inputUsedToday: number;
    outputUsedToday: number;
    inputUsedThisHour: number;
    outputUsedThisHour: number;
  };
} {
  const usage = getOrCreateUsage(ip, sessionId);
  resetCountersIfNeeded(usage);
  
  const limits = LIMITS_CONFIG.TOKENS;
  
  // Vérification : Token per request limits
  if (estimatedInputTokens > limits.MAX_INPUT_TOKENS_PER_REQUEST) {
    return {
      allowed: false,
      reason: `Input trop long. Max: ${limits.MAX_INPUT_TOKENS_PER_REQUEST} tokens (~${Math.floor(limits.MAX_INPUT_TOKENS_PER_REQUEST / limits.WORDS_TO_TOKENS_RATIO)} mots)`,
    };
  }
  
  if (estimatedOutputTokens > limits.MAX_OUTPUT_TOKENS_PER_REQUEST) {
    return {
      allowed: false,
      reason: `Output demandé trop long. Max: ${limits.MAX_OUTPUT_TOKENS_PER_REQUEST} tokens`,
    };
  }
  
// Check 2: Hourly limits
  if (usage.tokens.inputThisHour + estimatedInputTokens > limits.MAX_INPUT_TOKENS_PER_HOUR) {
    return {
      allowed: false,
      reason: `Limite horaire d'input atteinte (${limits.MAX_INPUT_TOKENS_PER_HOUR} tokens/heure). Réessayez dans 1 heure.`,
      usage: {
        inputUsedToday: usage.tokens.inputToday,
        outputUsedToday: usage.tokens.outputToday,
        inputUsedThisHour: usage.tokens.inputThisHour,
        outputUsedThisHour: usage.tokens.outputThisHour,
      },
    };
  }
  
  if (usage.tokens.outputThisHour + estimatedOutputTokens > limits.MAX_OUTPUT_TOKENS_PER_HOUR) {
    return {
      allowed: false,
      reason: `Limite horaire d'output atteinte (${limits.MAX_OUTPUT_TOKENS_PER_HOUR} tokens/heure). Réessayez dans 1 heure.`,
      usage: {
        inputUsedToday: usage.tokens.inputToday,
        outputUsedToday: usage.tokens.outputToday,
        inputUsedThisHour: usage.tokens.inputThisHour,
        outputUsedThisHour: usage.tokens.outputThisHour,
      },
    };
  }
  
// Check 3: Total daily limit
  const totalTokensToday = usage.tokens.inputToday + usage.tokens.outputToday;
  const newTotalTokens = totalTokensToday + estimatedInputTokens + estimatedOutputTokens;
  
  if (newTotalTokens > limits.MAX_TOTAL_TOKENS_PER_DAY) {
    return {
      allowed: false,
      reason: `Limite quotidienne atteinte (${limits.MAX_TOTAL_TOKENS_PER_DAY} tokens/jour). Réessayez demain.`,
      usage: {
        inputUsedToday: usage.tokens.inputToday,
        outputUsedToday: usage.tokens.outputToday,
        inputUsedThisHour: usage.tokens.inputThisHour,
        outputUsedThisHour: usage.tokens.outputThisHour,
      },
    };
  }
  
  return {
    allowed: true,
    usage: {
      inputUsedToday: usage.tokens.inputToday,
      outputUsedToday: usage.tokens.outputToday,
      inputUsedThisHour: usage.tokens.inputThisHour,
      outputUsedThisHour: usage.tokens.outputThisHour,
    },
  };
}


export function recordTokenUsage(
  ip: string,
  sessionId: string,
  actualInputTokens: number,
  actualOutputTokens: number
): void {
  const usage = getOrCreateUsage(ip, sessionId);
  resetCountersIfNeeded(usage);
  
// Update counters
  usage.tokens.inputThisHour += actualInputTokens;
  usage.tokens.outputThisHour += actualOutputTokens;
  usage.tokens.inputToday += actualInputTokens;
  usage.tokens.outputToday += actualOutputTokens;
  usage.lastRequest = Date.now();
}



export function checkFileLimits(
  ip: string,
  sessionId: string,
  fileSizeMb: number,
  fileCount: number = 1
): {
  allowed: boolean;
  reason?: string;
} {
  const usage = getOrCreateUsage(ip, sessionId);
  resetCountersIfNeeded(usage);
  
  const limits = LIMITS_CONFIG.FILES;
  
  if (fileSizeMb > limits.MAX_FILE_SIZE_MB) {
    return {
      allowed: false,
      reason: `Fichier trop gros. Max: ${limits.MAX_FILE_SIZE_MB} MB`,
    };
  }
  
  if (fileCount > limits.MAX_FILES_PER_REQUEST) {
    return {
      allowed: false,
      reason: `Trop de fichiers. Max: ${limits.MAX_FILES_PER_REQUEST} fichiers/requête`,
    };
  }
  
  if (usage.files.totalSizeMbToday + fileSizeMb > limits.MAX_TOTAL_SIZE_MB_PER_REQUEST * 10) {
    return {
      allowed: false,
      reason: `Limite quotidienne de fichiers atteinte. Réessayez demain.`,
    };
  }
  
  return { allowed: true };
}



export function checkImageGenerationLimits(
  ip: string,
  sessionId: string,
  imageCount: number = 1
): {
  allowed: boolean;
  reason?: string;
} {
  const usage = getOrCreateUsage(ip, sessionId);
  resetCountersIfNeeded(usage);
  
  const limits = LIMITS_CONFIG.IMAGES;
  
  if (imageCount > limits.MAX_IMAGES_PER_REQUEST) {
    return {
      allowed: false,
      reason: `Trop d'images demandées. Max: ${limits.MAX_IMAGES_PER_REQUEST} images/requête`,
    };
  }
  
  if (usage.images.generationsThisHour >= limits.MAX_GENERATIONS_PER_HOUR) {
    return {
      allowed: false,
      reason: `Limite horaire de génération d'images atteinte (${limits.MAX_GENERATIONS_PER_HOUR}/heure). Réessayez dans 1 heure.`,
    };
  }
  
  return { allowed: true };
}



export function cleanupOldEntries(): void {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (const [key, usage] of usageStore.entries()) {
    // Delete entries inactive for over a day
    if (now - usage.lastRequest > oneDay) {
      usageStore.delete(key);
    }
  }
}


setInterval(cleanupOldEntries, LIMITS_CONFIG.GENERAL.CLEANUP_INTERVAL_MINUTES * 60 * 1000);