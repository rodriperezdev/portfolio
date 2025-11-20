'use client';

import { TrendingUp, TrendingDown, DollarSign, Calendar, Activity } from 'lucide-react';
import type { CommodityData } from '@/hooks/useAgriculturalData';

interface StatsDisplayProps {
  data: CommodityData | null;
  translations: any;
  language: 'en' | 'es';
}

export function StatsDisplay({ data, translations: t, language }: StatsDisplayProps) {
  if (!data) return null;

  const { historical, forecast } = data;
  
  // Helper function to format dates based on language
  const formatDate = (dateStr: string, language: 'en' | 'es') => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return language === 'es' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
  };
  
  // Calculate current price (last historical price)
  const currentPrice = historical.prices[historical.prices.length - 1];
  
  // Filter forecast dates that are from today onwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureForecast = forecast.dates
    .map((date, idx) => ({ date, predicted: forecast.predicted[idx] }))
    .filter(item => {
      const forecastDate = new Date(item.date);
      forecastDate.setHours(0, 0, 0, 0);
      return forecastDate >= today; // Include today
    });
  
  // Calculate forecast average for future predictions
  const forecastAvg = futureForecast.length > 0
    ? futureForecast.reduce((sum, item) => sum + item.predicted, 0) / futureForecast.length
    : currentPrice;
  
  // Calculate trend
  const priceDiff = forecastAvg - currentPrice;
  const percentChange = (priceDiff / currentPrice) * 100;
  const isPositive = priceDiff > 0;
  
  // Get forecast end date (last future date)
  const forecastEndDate = futureForecast.length > 0 
    ? new Date(futureForecast[futureForecast.length - 1].date)
    : new Date();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Price */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 bg-[rgb(var(--card))]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <DollarSign className="h-4 w-4" />
          <span>{t.currentPrice || 'Current Price'}</span>
        </div>
        <div className="text-2xl font-bold">
          ${currentPrice.toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {t.currencyUnit || 'USD per ton'}
        </div>
      </div>

      {/* Forecast Trend */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 bg-[rgb(var(--card))]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span>{t.forecastTrend || 'Forecast Trend'}</span>
        </div>
        <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
        </div>
      </div>

      {/* Forecast Period */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 bg-[rgb(var(--card))]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{t.forecastPeriod || 'Forecast Period'}</span>
        </div>
        <div className="text-2xl font-bold">
          {futureForecast.length} {t.days || 'days'}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {t.until || 'Until'} {formatDate(futureForecast[futureForecast.length - 1]?.date || new Date().toISOString(), language)}
        </div>
      </div>

      {/* Model Accuracy */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 bg-[rgb(var(--card))]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Activity className="h-4 w-4" />
          <span>{t.modelAccuracy || 'Model Accuracy'}</span>
        </div>
        <div className="text-2xl font-bold">
          {data.forecast.accuracy ? `${data.forecast.accuracy}%` : 'N/A'}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {t.validationScore || 'Validation score'}
        </div>
      </div>
    </div>
  );
}

