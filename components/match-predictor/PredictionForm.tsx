'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TeamSelector } from './TeamSelector';
import { PredictionResult } from './PredictionResult';

interface PredictionFormProps {
  apiUrl: string;
  teams: string[];
  translations: any;
  language?: 'en' | 'es';
}

interface PredictionResponse {
  prediction: string;
  probabilities: {
    away_win: number;
    draw: number;
    home_win: number;
  };
  confidence: number;
}

export function PredictionForm({ apiUrl, teams, translations: t, language = 'en' }: PredictionFormProps) {
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    console.log('Button clicked!', { homeTeam, awayTeam, apiUrl });
    
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
      console.log('Validation failed:', { homeTeam, awayTeam, sameTeam: homeTeam === awayTeam });
      setError(t.selectDifferentTeams || 'Please select two different teams');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log('Making prediction request to:', `${apiUrl}/predict`);
      console.log('Request body:', { home_team: homeTeam, away_team: awayTeam });
      
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          home_team: homeTeam,
          away_team: awayTeam,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Prediction result:', result);
      setPrediction(result);
    } catch (err) {
      console.error('[ERROR] Prediction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get prediction';
      setError(errorMessage);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 sm:mb-12 border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t.makePrediction || 'Make a Prediction'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
        <TeamSelector
          teams={teams}
          value={homeTeam}
          onChange={setHomeTeam}
          label={t.homeTeam || 'Home Team'}
          placeholder={t.selectHomeTeam || 'Select home team'}
        />
        <TeamSelector
          teams={teams}
          value={awayTeam}
          onChange={setAwayTeam}
          label={t.awayTeam || 'Away Team'}
          placeholder={t.selectAwayTeam || 'Select away team'}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <Button
        type="button"
        onClick={handlePredict}
        disabled={loading || !homeTeam || !awayTeam || homeTeam === awayTeam}
        size="lg"
        className="border-2 border-red-600 dark:border-red-500 text-red-700 dark:text-red-500 bg-white dark:bg-transparent hover:bg-red-600 dark:hover:bg-red-600 hover:border-red-600 dark:hover:border-red-600 hover:text-white dark:hover:text-white text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full sm:w-auto"
      >
        {loading ? (t.loading || 'Loading...') : (t.predict || 'Predict')}
      </Button>

      {prediction && <PredictionResult prediction={prediction} homeTeam={homeTeam} awayTeam={awayTeam} apiUrl={apiUrl} translations={t} language={language} />}
    </div>
  );
}

