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
// Inflation API
const getInflationApiUrl = () => {
  // Remove _URL suffix to match Vercel
  if (process.env.NEXT_PUBLIC_INFLATION_API) {
    return process.env.NEXT_PUBLIC_INFLATION_API;
  }
  // Default to localhost for development
  return 'http://localhost:8002';
};

export const INFLATION_API_URL = getInflationApiUrl();

// Sentiment Analysis API
const getSentimentApiUrl = () => {
  // Remove _URL suffix to match Vercel
  if (process.env.NEXT_PUBLIC_SENTIMENT_API) {
    return process.env.NEXT_PUBLIC_SENTIMENT_API;
  }
  // Default to localhost for development
  return 'http://localhost:8000';
};

export const SENTIMENT_API_URL = getSentimentApiUrl();

// Match Predictor API
const getMatchPredictorApiUrl = () => {
  // Remove _URL suffix to match Vercel
  if (process.env.NEXT_PUBLIC_MATCH_PREDICTOR_API) {
    return process.env.NEXT_PUBLIC_MATCH_PREDICTOR_API;
  }
  // Default to localhost for development
  return 'http://localhost:8003';
};

export const MATCH_PREDICTOR_API_URL = getMatchPredictorApiUrl();

// Business Analysis API
const getBusinessAnalysisApiUrl = () => {
  // Changed to ANALYTICS (not ANALYSIS) and removed _URL suffix to match Vercel
  if (process.env.NEXT_PUBLIC_BUSINESS_ANALYTICS_API) {
    return process.env.NEXT_PUBLIC_BUSINESS_ANALYTICS_API;
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
    console.log(`[INFO] ${project.toUpperCase()} API URL:`, url);
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
  // Updated to match actual Vercel variable names (no _URL suffix)
  if (!process.env.NEXT_PUBLIC_INFLATION_API) {
    console.warn('[WARNING] NEXT_PUBLIC_INFLATION_API not set, using default: http://localhost:8002');
  }
  if (!process.env.NEXT_PUBLIC_SENTIMENT_API) {
    console.warn('[WARNING] NEXT_PUBLIC_SENTIMENT_API not set, using default: http://localhost:8000');
  }
  if (!process.env.NEXT_PUBLIC_MATCH_PREDICTOR_API) {
    console.warn('[WARNING] NEXT_PUBLIC_MATCH_PREDICTOR_API not set, using default: http://localhost:8003');
  }
  // Changed to ANALYTICS to match Vercel
  if (!process.env.NEXT_PUBLIC_BUSINESS_ANALYTICS_API) {
    console.warn('[WARNING] NEXT_PUBLIC_BUSINESS_ANALYTICS_API not set, using default: http://localhost:8004');
  }
}