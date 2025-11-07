'use client';

import { useState, useEffect } from 'react';

interface MatchPredictorData {
  teams: string[];
  stats: {
    total_matches: number;
    seasons: number[];
    home_wins: number;
    draws: number;
    away_wins: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export function useMatchPredictorData(apiUrl: string): MatchPredictorData {
  const [teams, setTeams] = useState<string[]>([]);
  const [stats, setStats] = useState<MatchPredictorData['stats']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch teams
        const teamsResponse = await fetch(`${apiUrl}/teams`);
        if (!teamsResponse.ok) {
          throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
        }
        const teamsData = await teamsResponse.json();
        setTeams(teamsData.teams || []);

        // Fetch stats
        const statsResponse = await fetch(`${apiUrl}/stats`);
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch stats: ${statsResponse.statusText}`);
        }
        const statsData = await statsResponse.json();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching match predictor data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return { teams, stats, loading, error };
}

