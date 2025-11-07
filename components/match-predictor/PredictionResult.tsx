'use client';

interface PredictionResultProps {
  prediction: {
    prediction: string;
    probabilities: {
      away_win: number;
      draw: number;
      home_win: number;
    };
    confidence: number;
  };
  homeTeam: string;
  awayTeam: string;
  translations: any;
}

export function PredictionResult({ prediction, homeTeam, awayTeam, translations: t }: PredictionResultProps) {
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getPredictionColor = (pred: string) => {
    if (pred === 'Home Win') return 'text-green-600 dark:text-green-400';
    if (pred === 'Away Win') return 'text-blue-600 dark:text-blue-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  // Map prediction to dynamic team names
  const getPredictionText = (pred: string) => {
    if (pred === 'Home Win') return `${homeTeam} ${t.win || 'Win'}`;
    if (pred === 'Away Win') return `${awayTeam} ${t.win || 'Win'}`;
    return pred; // Keep "Draw" as is
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <div className="text-sm opacity-60 mb-2">{t.prediction || 'Prediction'}</div>
        <div className={`text-3xl font-bold ${getPredictionColor(prediction.prediction)}`}>
          {getPredictionText(prediction.prediction)}
        </div>
        <div className="text-sm opacity-60 mt-2">
          {t.confidence || 'Confidence'}: {formatPercent(prediction.confidence)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
          <div className="text-sm opacity-60 mb-2">{homeTeam} {t.win || 'Win'}</div>
          <div className="text-2xl font-bold">{formatPercent(prediction.probabilities.home_win)}</div>
        </div>
        <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
          <div className="text-sm opacity-60 mb-2">{t.draw || 'Draw'}</div>
          <div className="text-2xl font-bold">{formatPercent(prediction.probabilities.draw)}</div>
        </div>
        <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
          <div className="text-sm opacity-60 mb-2">{awayTeam} {t.win || 'Win'}</div>
          <div className="text-2xl font-bold">{formatPercent(prediction.probabilities.away_win)}</div>
        </div>
      </div>
    </div>
  );
}

