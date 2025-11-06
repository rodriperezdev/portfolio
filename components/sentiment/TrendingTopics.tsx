'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Topic } from '@/types/sentiment';

interface TrendingTopicsProps {
  topics: Topic[];
  theme: 'light' | 'dark';
  translations: any;
}

export function TrendingTopics({ topics, theme, translations: t }: TrendingTopicsProps) {
  return (
    <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm mb-8 sm:mb-12">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t.trendingTopics}</h2>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <BarChart data={topics} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff10' : '#00000010'} />
          <XAxis type="number" stroke={theme === 'dark' ? '#ffffff60' : '#00000060'} style={{ fontSize: '12px' }} />
          <YAxis
            dataKey="topic"
            type="category"
            stroke={theme === 'dark' ? '#ffffff60' : '#00000060'}
            width={100}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#282828' : '#f8f6f3',
              border: '1px solid ' + (theme === 'dark' ? '#ffffff20' : '#00000020'),
              borderRadius: '12px'
            }}
          />
          <Bar
            dataKey="mentions"
            fill={theme === 'dark' ? '#a78bfa' : '#7c3aed'}
            name={t.mentions}
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

