'use client';

import { useState, useEffect } from 'react';

interface RecentMatch {
  date: string;
  opponent: string;
  is_home: boolean;
  team_goals: number;
  opponent_goals: number;
  result: 'W' | 'L' | 'D';
}

interface RecentMatchesProps {
  apiUrl: string;
  teamName: string;
  translations: any;
  language?: 'en' | 'es';
}

export function RecentMatches({ apiUrl, teamName, translations: t, language = 'en' }: RecentMatchesProps) {
  const [matches, setMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamName) {
      setMatches([]);
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/recent-matches/${encodeURIComponent(teamName)}?limit=5`);
        if (response.ok) {
          const data = await response.json();
          setMatches(data.matches || []);
        } else {
          setMatches([]);
        }
      } catch (error) {
        console.error('Error fetching recent matches:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [apiUrl, teamName]);

  if (!teamName) return null;

  const getResultColor = (result: string) => {
    if (result === 'W') return 'text-green-600 dark:text-green-400';
    if (result === 'L') return 'text-red-600 dark:text-red-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getResultBadge = (result: string) => {
    if (result === 'W') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (result === 'L') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
  };

  if (loading) {
    return (
      <div className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 bg-[rgb(var(--card))]">
        <div className="text-sm opacity-60 mb-2">{teamName}</div>
        <div className="text-xs opacity-40">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 bg-[rgb(var(--card))]">
        <div className="text-sm opacity-60 mb-2">{teamName}</div>
        <div className="text-xs opacity-40">{t.noRecentMatches || 'No recent matches found'}</div>
      </div>
    );
  }

  return (
    <div className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 bg-[rgb(var(--card))]">
      <div className="text-sm font-semibold mb-3">{teamName}</div>
      <div className="space-y-2">
        {matches.map((match, idx) => {
          // Ensure is_home is a proper boolean - handle various input types
          let isHome: boolean;
          if (typeof match.is_home === 'boolean') {
            isHome = match.is_home;
          } else if (typeof match.is_home === 'string') {
            isHome = match.is_home.toLowerCase() === 'true' || match.is_home === '1';
          } else if (typeof match.is_home === 'number') {
            isHome = match.is_home === 1 || match.is_home === 2; // 2 = home team
          } else {
            // Default to false if unclear
            isHome = false;
          }
          
          // Ensure we have valid data
          const opponent = match.opponent || 'Unknown';
          const teamGoals = match.team_goals ?? 0;
          const opponentGoals = match.opponent_goals ?? 0;
          const result = match.result || 'D';
          
          // Map result to Spanish letters if needed
          const getResultLetter = (result: string) => {
            if (language === 'es') {
              if (result === 'W') return 'V'; // Victoria
              if (result === 'L') return 'D'; // Derrota
              if (result === 'D') return 'E'; // Empate
            }
            return result; // Keep W/L/D for English
          };

          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium w-5 text-center flex-shrink-0 ${getResultBadge(result)}`}>
                  {getResultLetter(result)}
                </span>
                <span className="opacity-60 truncate">
                  vs {opponent}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className={teamGoals > opponentGoals ? 'font-semibold' : ''}>
                  {teamGoals}
                </span>
                <span className="opacity-40">-</span>
                <span className={opponentGoals > teamGoals ? 'font-semibold' : ''}>
                  {opponentGoals}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

