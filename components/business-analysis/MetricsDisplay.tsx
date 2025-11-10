'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CurrencyInfo } from '@/hooks/useBusinessAnalysisData';
import { formatCurrency, formatPercent, formatNumber, getCurrencySymbol } from '@/lib/business-analysis-utils';

interface MetricsDisplayProps {
  metrics: Record<string, number>;
  metricsLocal?: Record<string, number>;
  benchmarks?: Record<string, any>;
  currencyInfo?: CurrencyInfo;
  translations: any;
}

export function MetricsDisplay({ 
  metrics, 
  metricsLocal, 
  benchmarks, 
  currencyInfo,
  translations: t 
}: MetricsDisplayProps) {

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'needs_improvement':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatusLabel = (status?: string) => {
    if (!status) return '';
    const statusMap: Record<string, string> = {
      'excellent': t.metricsDisplay.status.excellent,
      'good': t.metricsDisplay.status.good,
      'needs_improvement': t.metricsDisplay.status.needsImprovement,
    };
    return statusMap[status] || status.replace('_', ' ');
  };

  const metricCategories = [
    {
      title: t.metricsDisplay.profitability,
      metrics: ['gross_profit', 'gross_margin', 'net_profit', 'net_margin', 'ebitda', 'ebitda_margin'],
    },
    {
      title: t.metricsDisplay.customerEconomics,
      metrics: ['cac', 'ltv', 'ltv_cac_ratio', 'cac_payback_months', 'churn_rate'],
    },
    {
      title: t.metricsDisplay.financialHealth,
      metrics: ['runway_months', 'burn_multiple'],
    },
  ];

  return (
    <div className="space-y-6">
      {metricCategories.map((category) => {
        const categoryMetrics = category.metrics.filter(key => metrics[key] !== undefined);
        if (categoryMetrics.length === 0) return null;

        return (
          <Card key={category.title} className="p-6 border-2 border-black">
            <h3 className="text-xl font-bold mb-4">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryMetrics.map((key) => {
                const value = metrics[key];
                const benchmark = benchmarks?.[key];
                const isPercent = key.includes('margin') || key.includes('rate') || key.includes('ratio');
                const isCurrency = key.includes('profit') || key.includes('cac') || key.includes('ltv');
                const isMonths = key.includes('months') || key.includes('runway');

                let displayValue: string;
                if (isPercent) {
                  displayValue = formatPercent(value);
                } else if (isCurrency) {
                  displayValue = formatCurrency(value);
                } else if (isMonths) {
                  displayValue = `${formatNumber(value)} ${t.metricsDisplay.months}`;
                } else {
                  displayValue = formatNumber(value);
                }

                // Get local currency value if available
                const localValue = metricsLocal?.[key];
                const showDualCurrency = localValue !== undefined && 
                                       !isPercent && 
                                       !isMonths && 
                                       currencyInfo && 
                                       currencyInfo.input_currency !== 'USD';

                return (
                  <div key={key} className="p-4 border border-black/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {t.metricsDisplay.labels[key] || key}
                      </span>
                      {benchmark && (
                        <Badge className={getStatusColor(benchmark.status)}>
                          {formatStatusLabel(benchmark.status)}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {showDualCurrency ? (
                        <>
                          <div className="text-2xl font-bold">
                            {getCurrencySymbol(currencyInfo.input_currency)}{formatNumber(localValue)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(value, 'USD')} USD
                          </div>
                        </>
                      ) : (
                        <div className="text-2xl font-bold">{displayValue}</div>
                      )}
                    </div>
                    {benchmark && (
                      <div className="text-xs text-gray-500 mt-1">
                        {benchmark.message}
                      </div>
                    )}
                    {(key === 'runway_months' || key === 'burn_multiple') && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                        {key === 'runway_months' 
                          ? t.metricsDisplay.explanations.runwayMonths
                          : t.metricsDisplay.explanations.burnMultiple}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

