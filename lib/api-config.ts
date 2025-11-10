/**
 * API Configuration for all projects
 * 
 * Each project should use its own environment variable to avoid conflicts.
 * Environment variables are prefixed with NEXT_PUBLIC_ to be available in the browser.
 * 
 * For local development:
 * - Create a .env.local file in the portfolio root
 * - Add: NEXT_PUBLIC_INFLATION_API_URL=http://localhost:8002
 * - Add: NEXT_PUBLIC_SENTIMENT_API_URL=http://localhost:8000
 * - Add: NEXT_PUBLIC_MATCH_PREDICTOR_API_URL=http://localhost:8003
 * - Add: NEXT_PUBLIC_BUSINESS_ANALYSIS_API_URL=http://localhost:8004
 * 
 * For production:
 * - Set these in your hosting platform's environment variables
 * - Example: NEXT_PUBLIC_INFLATION_API_URL=https://api.yourdomain.com
 */

// Inflation Tracker API
// Always prioritize environment variable, fallback based on NODE_ENV
const getInflationApiUrl = () => {
  if (process.env.NEXT_PUBLIC_INFLATION_API_URL) {
    return process.env.NEXT_PUBLIC_INFLATION_API_URL;
  }
  // Only use production URL if explicitly in production mode
  if (process.env.NODE_ENV === 'production') {
    return 'https://inflation-api.yourdomain.com'; // Update with your production URL
  }
  // Default to localhost for development
  return 'http://localhost:8002';
};

export const INFLATION_API_URL = getInflationApiUrl();

// Sentiment Analysis API
const getSentimentApiUrl = () => {
  if (process.env.NEXT_PUBLIC_SENTIMENT_API_URL) {
    return process.env.NEXT_PUBLIC_SENTIMENT_API_URL;
  }
  // Only use production URL if explicitly in production mode
  if (process.env.NODE_ENV === 'production') {
    return 'https://sentiment-api.yourdomain.com'; // Update with your production URL
  }
  // Default to localhost for development
  return 'http://localhost:8000';
};

export const SENTIMENT_API_URL = getSentimentApiUrl();

// Match Predictor API
const getMatchPredictorApiUrl = () => {
  if (process.env.NEXT_PUBLIC_MATCH_PREDICTOR_API_URL) {
    return process.env.NEXT_PUBLIC_MATCH_PREDICTOR_API_URL;
  }
  // Only use production URL if explicitly in production mode
  if (process.env.NODE_ENV === 'production') {
    return 'https://match-predictor-api.yourdomain.com'; // Update with your production URL
  }
  // Default to localhost for development
  return 'http://localhost:8003';
};

export const MATCH_PREDICTOR_API_URL = getMatchPredictorApiUrl();

// Business Analysis API
const getBusinessAnalysisApiUrl = () => {
  if (process.env.NEXT_PUBLIC_BUSINESS_ANALYSIS_API_URL) {
    return process.env.NEXT_PUBLIC_BUSINESS_ANALYSIS_API_URL;
  }
  // Only use production URL if explicitly in production mode
  if (process.env.NODE_ENV === 'production') {
    return 'https://business-analysis-api.yourdomain.com'; // Update with your production URL
  }
  // Default to localhost for development
  return 'http://localhost:8004';
};

export const BUSINESS_ANALYSIS_API_URL = getBusinessAnalysisApiUrl();

// Helper to get API URL with validation
export function getApiUrl(project: 'inflation' | 'sentiment' | 'match-predictor' | 'business-analysis'): string {
  let url: string;
  if (project === 'inflation') {
    url = INFLATION_API_URL;
  } else if (project === 'sentiment') {
    url = SENTIMENT_API_URL;
  } else if (project === 'match-predictor') {
    url = MATCH_PREDICTOR_API_URL;
  } else {
    url = BUSINESS_ANALYSIS_API_URL;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔧 ${project.toUpperCase()} API URL:`, url);
  }
  
  return url;
}

// Type-safe project names
export type ApiProject = 'inflation' | 'sentiment' | 'match-predictor' | 'business-analysis';

// Export all API URLs for convenience
export const API_URLS = {
  inflation: INFLATION_API_URL,
  sentiment: SENTIMENT_API_URL,
  'match-predictor': MATCH_PREDICTOR_API_URL,
  'business-analysis': BUSINESS_ANALYSIS_API_URL,
} as const;

// Validate API URLs in development
if (process.env.NODE_ENV === 'development') {
  if (!process.env.NEXT_PUBLIC_INFLATION_API_URL) {
    console.warn('⚠️ NEXT_PUBLIC_INFLATION_API_URL not set, using default: http://localhost:8002');
  }
  if (!process.env.NEXT_PUBLIC_SENTIMENT_API_URL) {
    console.warn('⚠️ NEXT_PUBLIC_SENTIMENT_API_URL not set, using default: http://localhost:8000');
  }
  if (!process.env.NEXT_PUBLIC_MATCH_PREDICTOR_API_URL) {
    console.warn('⚠️ NEXT_PUBLIC_MATCH_PREDICTOR_API_URL not set, using default: http://localhost:8003');
  }
  if (!process.env.NEXT_PUBLIC_BUSINESS_ANALYSIS_API_URL) {
    console.warn('⚠️ NEXT_PUBLIC_BUSINESS_ANALYSIS_API_URL not set, using default: http://localhost:8004');
  }
}

