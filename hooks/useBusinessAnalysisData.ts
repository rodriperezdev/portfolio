'use client';

import { useState } from 'react';

export interface BusinessMetrics {
  revenue: number;
  cogs: number;
  operating_expenses: number;
  sales_marketing_expense: number;
  new_customers?: number;
  total_customers?: number;
  churned_customers?: number;
  cash_balance?: number;
  monthly_burn?: number;
  industry: 'saas' | 'ecommerce' | 'retail' | 'manufacturing' | 'services';
  market?: string;
  time_period_months: number;
}

export interface CurrencyInfo {
  input_currency: string;
  benchmark_currency: string;
  exchange_rate: number;
  rate_date?: string;
  note?: string;
}

export interface AnalysisResponse {
  metrics: Record<string, number>;
  metrics_local?: Record<string, number>;
  benchmarks: Record<string, {
    status: string;
    message: string;
    your_value: number;
    benchmark_good: number;
    benchmark_acceptable: number;
  }>;
  insights: Array<{
    priority: string;
    category: string;
    title: string;
    description: string;
    recommendations: string[];
  }>;
  industry: string;
  market?: string;
  currency_info?: CurrencyInfo;
}

export interface ScenarioResponse {
  base_metrics: Record<string, number>;
  new_metrics: Record<string, number>;
  changes_applied: Record<string, number>;
  impact: Record<string, {
    absolute: number;
    percentage: number;
  }>;
}

export function useBusinessAnalysisData(apiUrl: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResponse | null>(null);

  const analyzeBusiness = async (metrics: BusinessMetrics) => {
    try {
      setLoading(true);
      setError(null);
      
      // Health check
      try {
        const healthCheck = await fetch(`${apiUrl}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!healthCheck.ok) {
          throw new Error(`Cannot connect to backend server at ${apiUrl}`);
        }
      } catch (healthErr) {
        throw new Error(`Cannot connect to backend server at ${apiUrl}. Please make sure the business-analysis-backend server is running.`);
      }

      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const runScenario = async (
    baseMetrics: BusinessMetrics,
    changes: Record<string, number>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_metrics: baseMetrics,
          changes: changes
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setScenarioResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBenchmarks = async (industry: string) => {
    try {
      const response = await fetch(`${apiUrl}/benchmarks/${industry}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    loading,
    error,
    analysisResult,
    scenarioResult,
    analyzeBusiness,
    runScenario,
    getBenchmarks,
    clearError: () => setError(null),
    clearResults: () => {
      setAnalysisResult(null);
      setScenarioResult(null);
    }
  };
}

