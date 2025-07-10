const getEnvVar = (name: keyof ImportMetaEnv, defaultValue?: string): string => {
  const value = import.meta.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue || '';
};

export const config = {
  // API Configuration
  API_BASE_URL: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  USE_MOCK_DATA: getEnvVar('VITE_USE_MOCK_DATA', 'false') === 'false',
  
  // App Configuration
  APP_NAME: getEnvVar('VITE_APP_NAME', 'AI Insight Engine'),
  
  // Social Links
  GITHUB_URL: getEnvVar('VITE_GITHUB_URL', 'https://github.com'),
  LINKEDIN_URL: getEnvVar('VITE_LINKEDIN_URL', 'https://linkedin.com'),
  PORTFOLIO_URL: getEnvVar('VITE_PORTFOLIO_URL', 'https://example.com'),
  
  // Development
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Debugging
  enableLogs: import.meta.env.DEV || getEnvVar('VITE_USE_MOCK_DATA', 'false') === 'true',
} as const;

// Log configuration in development
if (config.isDevelopment) {
  console.log('🔧 App Configuration:', config);
}

export default config;