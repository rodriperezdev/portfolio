'use client';

interface StatsDisplayProps {
  stats: {
    total_matches: number;
    seasons: number[];
    home_wins: number;
    draws: number;
    away_wins: number;
  } | null;
  translations: any;
}

export function StatsDisplay({ stats, translations: t }: StatsDisplayProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.totalMatches || 'Total Matches'}</h3>
        <p className="text-4xl font-bold">{stats.total_matches}</p>
      </div>
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.homeWins || 'Home Wins'}</h3>
        <p className="text-4xl font-bold">{stats.home_wins}</p>
      </div>
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.draws || 'Draws'}</h3>
        <p className="text-4xl font-bold">{stats.draws}</p>
      </div>
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.awayWins || 'Away Wins'}</h3>
        <p className="text-4xl font-bold">{stats.away_wins}</p>
      </div>
    </div>
  );
}

