'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MetricsChartProps {
  metrics: Record<string, number>;
  translations: any;
}

export function MetricsChart({ metrics, translations: t }: MetricsChartProps) {
  // Color palette that works in both dark and light themes
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
  ];

  // Prepare data for margin metrics with colors
  const marginData = [
    {
      name: t.chart.grossMargin,
      value: metrics.gross_margin || 0,
      color: colors[0],
    },
    {
      name: t.chart.netMargin,
      value: metrics.net_margin || 0,
      color: colors[1],
    },
    {
      name: t.chart.ebitdaMargin,
      value: metrics.ebitda_margin || 0,
      color: colors[2],
    },
  ].filter(item => item.value > 0);

  // Prepare data for customer metrics with colors
  const customerData = [
    metrics.cac && { name: t.chart.cac, value: metrics.cac, color: colors[0] },
    metrics.ltv && { name: t.chart.ltv, value: metrics.ltv, color: colors[1] },
    metrics.ltv_cac_ratio && { name: t.chart.ltvCacRatio, value: metrics.ltv_cac_ratio * 10, color: colors[2] }, // Scale for visibility
  ].filter(Boolean) as Array<{ name: string; value: number; color: string }>;

  if (marginData.length === 0 && customerData.length === 0) {
    return null;
  }

  // Custom tooltip with better styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPercentage = data.name.includes('Margin');
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {data.name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {isPercentage ? `${data.value.toFixed(2)}%` : `$${data.value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {marginData.length > 0 && (
        <Card className="p-6 border-2 border-black dark:border-white">
          <h3 className="text-xl font-bold mb-4 text-[rgb(var(--foreground))]">{t.chart.marginMetrics}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marginData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--foreground))" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: 'rgb(var(--foreground))', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: 'rgb(var(--foreground))', fontSize: 12 }}
                label={{ value: '%', angle: -90, position: 'insideLeft', fill: 'rgb(var(--foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {marginData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 italic">
            {t.chart.marginMetricsExplanation}
          </p>
        </Card>
      )}

      {customerData.length > 0 && (
        <Card className="p-6 border-2 border-black dark:border-white">
          <h3 className="text-xl font-bold mb-4 text-[rgb(var(--foreground))]">{t.chart.customerMetrics}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--foreground))" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: 'rgb(var(--foreground))', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: 'rgb(var(--foreground))', fontSize: 12 }}
                label={{ value: '$', angle: -90, position: 'insideLeft', fill: 'rgb(var(--foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 italic">
            {t.chart.customerMetricsExplanation}
          </p>
        </Card>
      )}
    </div>
  );
}

