'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { preparePieChartData, getPieChartColors, formatPercentage } from '@/lib/sentiment-utils';
import { CurrentSentiment } from '@/types/sentiment';

interface SentimentDistributionProps {
  currentSentiment: CurrentSentiment;
  theme: 'light' | 'dark';
  translations: any;
}

export function SentimentDistribution({ currentSentiment, theme, translations: t }: SentimentDistributionProps) {
  const pieData = preparePieChartData(currentSentiment, t);
  const pieColors = getPieChartColors(theme);

  return (
    <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t.currentDistribution}</h2>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const { name, percent }: { name: string; percent: number } = props;
              return `${name}: ${(percent * 100).toFixed(0)}%`;
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#282828' : '#f8f6f3',
              border: '1px solid ' + (theme === 'dark' ? '#ffffff20' : '#00000020'),
              borderRadius: '12px'
            }}
            formatter={(value: number) => formatPercentage(value)} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}






