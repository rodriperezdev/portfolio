'use client';

import { useState, useEffect } from 'react';

interface InflationData {
  date: string;
  monthly_rate: number;
  annual_rate: number;
  cpi_index?: number;
}

interface CurrentStats {
  current_monthly: number;
  current_annual: number;
  avg_last_12_months: number;
  total_inflation_since_start: number;
  last_updated: string;
}

export function useInflationData(apiUrl: string) {
  const [inflationData, setInflationData] = useState<InflationData[]>([]);
  const [currentStats, setCurrentStats] = useState<CurrentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all available data from 1990 to present
        const dataUrl = `${apiUrl}/inflation/data?start_year=1990&limit=1000`;
        const statsUrl = `${apiUrl}/inflation/current`;
        
        // First, try to ping the root endpoint to check if server is running
        try {
          const healthCheck = await fetch(`${apiUrl}/`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          if (!healthCheck.ok) {
            console.warn('[WARNING] Health check failed:', healthCheck.status);
          }
        } catch (healthErr) {
          console.error('[ERROR] Backend server is not reachable.');
          throw new Error(`Cannot connect to backend server at ${apiUrl}. Please make sure the inflation-tracker-backend server is running.`);
        }
        
        // Create abort controllers for timeout
        const controller1 = new AbortController();
        const controller2 = new AbortController();
        const timeoutId1 = setTimeout(() => controller1.abort(), 10000);
        const timeoutId2 = setTimeout(() => controller2.abort(), 10000);
        
        const [dataRes, statsRes] = await Promise.all([
          fetch(dataUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller1.signal
          }).catch((err) => {
            clearTimeout(timeoutId1);
            if (err.name === 'AbortError') {
              throw new Error('Request timeout: The server took too long to respond');
            }
            throw new Error(`Failed to fetch inflation data: ${err.message}`);
          }).finally(() => {
            clearTimeout(timeoutId1);
          }),
          fetch(statsUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller2.signal
          }).catch((err) => {
            clearTimeout(timeoutId2);
            if (err.name === 'AbortError') {
              throw new Error('Request timeout: The server took too long to respond');
            }
            throw new Error(`Failed to fetch current stats: ${err.message}`);
          }).finally(() => {
            clearTimeout(timeoutId2);
          })
        ]);
        
        if (!dataRes.ok) {
          throw new Error(`HTTP error! status: ${dataRes.status}`);
        }
        
        if (!statsRes.ok) {
          throw new Error(`HTTP error! status: ${statsRes.status}`);
        }
        
        const data = await dataRes.json();
        const stats = await statsRes.json();
        
        // Sort data by date ascending (oldest first)
        const sortedData = data.sort((a: InflationData, b: InflationData) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        setInflationData(sortedData);
        setCurrentStats(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching inflation data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [apiUrl]);
  
  return { inflationData, currentStats, loading, error };
}






