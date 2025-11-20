'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import type { CommodityData } from '@/hooks/useAgriculturalData';

interface ForecastChartProps {
  data: CommodityData | null;
  theme: 'light' | 'dark';
  translations: any;
  language: 'en' | 'es';
}

export function ForecastChart({ data, theme, translations: t, language }: ForecastChartProps) {
  // Helper function to format dates based on language
  const formatDate = (dateStr: string, language: 'en' | 'es') => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return language === 'es' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
  };

  const chartData = useMemo(() => {
    if (!data) return [];

    const { historical, forecast } = data;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Combine historical and forecast data
    const combined = [];
    
    // Add last 90 days of historical data
    const startIndex = Math.max(0, historical.dates.length - 90);
    for (let i = startIndex; i < historical.dates.length; i++) {
      combined.push({
        date: historical.dates[i],
        actual: historical.prices[i],
        predicted: null,
        future: null,
        lower: null,
        upper: null,
      });
    }
    
    // Add a bridge point to connect historical and forecast
    // This prevents the gap in the chart
    if (historical.dates.length > 0) {
      combined.push({
        date: historical.dates[historical.dates.length - 1],
        actual: null,  // Don't show as historical (green line)
        predicted: null,
        future: historical.prices[historical.prices.length - 1], // Start future line here
        lower: null,
        upper: null,
      });
    }
    
    // Include forecast data from today onwards (>= instead of >)
    // This includes today's forecast to prevent gap
    for (let i = 0; i < forecast.dates.length; i++) {
      const forecastDate = new Date(forecast.dates[i]);
      forecastDate.setHours(0, 0, 0, 0);
      
      // Changed from > to >= to include today
      if (forecastDate >= today) {
        combined.push({
          date: forecast.dates[i],
          actual: null,
          predicted: null,
          future: forecast.predicted[i],
          lower: forecast.lower ? forecast.lower[i] : null,
          upper: forecast.upper ? forecast.upper[i] : null,
        });
      }
    }
    
    return combined;
  }, [data]);

  if (!data || chartData.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        {t.noDataAvailable || 'No data available'}
      </div>
    );
  }

  const hasConfidenceIntervals = data.model === 'prophet';

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            return language === 'es' ? `${day}/${month}` : `${month}/${day}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            border: '1px solid',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            borderRadius: '8px',
          }}
          labelFormatter={(label) => formatDate(label, language)}
          formatter={(value: any, name: string) => {
            if (value === null) return [null, name];
            return [`$${value.toFixed(2)}`, name];
          }}
        />
        <Legend />
        
        {/* Confidence interval area (only for Prophet) */}
        {hasConfidenceIntervals && (
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="#f97316"
            fillOpacity={0.1}
            name={t.upperBound || 'Upper bound'}
          />
        )}
        {hasConfidenceIntervals && (
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#f97316"
            fillOpacity={0.1}
            name={t.lowerBound || 'Lower bound'}
          />
        )}
        
        {/* Actual historical prices */}
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          name={t.actualPrices || 'Actual prices'}
        />
        
        {/* Future Predictions */}
        <Line
          type="monotone"
          dataKey="future"
          stroke="#f97316"
          strokeWidth={2}
          dot={false}
          name={t.futurePredictions || 'Future Predictions'}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}


