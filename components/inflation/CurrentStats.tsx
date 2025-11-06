'use client';

import { Language } from '@/data/translations';

interface CurrentStats {
  current_monthly: number;
  current_annual: number;
  avg_last_12_months: number;
  total_inflation_since_start: number;
  last_updated: string;
}

interface CurrentStatsProps {
  stats: CurrentStats | null;
  language: Language;
  translations: any;
}

export function CurrentStats({ stats, language, translations: t }: CurrentStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.monthlyRate}</h3>
        <p className="text-4xl font-bold">{stats.current_monthly != null ? stats.current_monthly.toFixed(2) : '0.00'}%</p>
      </div>
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.annualRate}</h3>
        <p className="text-4xl font-bold">{stats.current_annual != null ? stats.current_annual.toFixed(2) : '0.00'}%</p>
      </div>
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.avg12Months}</h3>
        <p className="text-4xl font-bold">{stats.avg_last_12_months != null ? stats.avg_last_12_months.toFixed(2) : '0.00'}%</p>
      </div>
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">{t.totalSince1995}</h3>
        <p className="text-4xl font-bold">{stats.total_inflation_since_start != null ? stats.total_inflation_since_start.toFixed(0) : '0'}%</p>
      </div>
    </div>
  );
}


