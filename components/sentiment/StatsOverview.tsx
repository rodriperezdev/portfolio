'use client';

import { CurrentSentiment } from '@/types/sentiment';
import { formatPercentage } from '@/lib/sentiment-utils';

interface StatsOverviewProps {
  currentSentiment: CurrentSentiment;
  translations: any;
  onRefresh?: () => void;
  refreshLoading?: boolean;
  isCollecting?: boolean;
}

export function StatsOverview({ 
  currentSentiment, 
  translations: t,
  onRefresh,
  refreshLoading = false,
  isCollecting = false
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {/* Total Analyzed */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm opacity-60">{t.totalAnalyzed}</h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                'border-white/20 hover:bg-white/10 text-white' 
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg className={`h-3 w-3 ${refreshLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>
                {isCollecting ? t.collectingData : refreshLoading ? t.refreshing : t.refresh}
              </span>
            </button>
          )}
        </div>
        <p className="text-4xl font-bold mb-1">{currentSentiment.total_analyzed.toLocaleString()}</p>
        <p className="text-sm opacity-60">{t.postsLast24h}</p>
      </div>

      {/* Positive */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">😊 {t.positive}</h3>
        <p className="text-3xl sm:text-4xl font-bold text-green-500">
          {formatPercentage(currentSentiment.sentiment.positive)}
        </p>
      </div>

      {/* Negative */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">😞 {t.negative}</h3>
        <p className="text-3xl sm:text-4xl font-bold text-red-500">
          {formatPercentage(currentSentiment.sentiment.negative)}
        </p>
      </div>

      {/* Neutral */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-sm opacity-60 mb-2">😐 {t.neutral}</h3>
        <p className="text-3xl sm:text-4xl font-bold text-gray-500">
          {formatPercentage(currentSentiment.sentiment.neutral)}
        </p>
      </div>
    </div>
  );
}

