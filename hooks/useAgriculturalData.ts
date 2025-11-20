'use client';

import { useState, useEffect } from 'react';

export interface CommodityData {
  commodity: string;
  model: string;
  historical: {
    dates: string[];
    prices: number[];
  };
  forecast: {
    dates: string[];
    predicted: number[];
    lower?: number[];
    upper?: number[];
    accuracy?: number;
  };
  cached?: boolean;
}

export interface ScenarioParams {
  temperature_change: number;
  precipitation_change: number;
}

export interface ScenarioResult {
  commodity: string;
  scenario: ScenarioParams;
  forecast: {
    dates: string[];
    predicted: number[];
    lower: number[];
    upper: number[];
  };
}

export function useAgriculturalData(apiUrl: string) {
  const [commodities, setCommodities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommodities() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/commodities`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCommodities(data.commodities || []);
      } catch (err) {
        console.error('Error fetching commodities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch commodities');
      } finally {
        setLoading(false);
      }
    }

    if (apiUrl) {
      fetchCommodities();
    }
  }, [apiUrl]);

  const fetchForecast = async (
    commodity: string,
    modelType: 'prophet' | 'lstm' = 'prophet',
    periods: number = 30
  ): Promise<CommodityData | null> => {
    try {
      const response = await fetch(
        `${apiUrl}/forecast/${commodity}?model_type=${modelType}&periods=${periods}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching forecast:', err);
      throw err;
    }
  };

  const runScenario = async (
    commodity: string,
    params: ScenarioParams
  ): Promise<ScenarioResult | null> => {
    try {
      const response = await fetch(`${apiUrl}/scenario/${commodity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error running scenario:', err);
      throw err;
    }
  };

  return {
    commodities,
    loading,
    error,
    fetchForecast,
    runScenario,
  };
}

