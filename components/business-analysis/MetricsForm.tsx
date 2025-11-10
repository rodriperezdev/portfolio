'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { BusinessMetrics } from '@/hooks/useBusinessAnalysisData';
import { NumberInput } from './NumberInput';

interface MetricsFormProps {
  onSubmit: (metrics: BusinessMetrics & { market: string }) => void;
  loading: boolean;
  translations: any;
}

export function MetricsForm({ onSubmit, loading, translations: t }: MetricsFormProps) {
  const [formData, setFormData] = useState<Partial<BusinessMetrics & { market: string }>>({
    revenue: 0,
    cogs: 0,
    operating_expenses: 0,
    sales_marketing_expense: 0,
    industry: 'saas',
    market: 'usa',
    time_period_months: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.revenue && formData.revenue > 0 && formData.market) {
      // Ensure time_period_months has a default value of 1 if not set
      const submitData = {
        ...formData,
        time_period_months: formData.time_period_months ?? 1,
      };
      onSubmit(submitData as BusinessMetrics & { market: string });
    }
  };

  const updateField = (field: keyof (BusinessMetrics & { market: string }), value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 border-2 border-black">
      <h2 className="text-2xl font-bold mb-6">{t.metricsForm.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Market and Industry Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="market">{t.metricsForm.market}</Label>
            <Select
              value={formData.market || 'usa'}
              onValueChange={(value) => updateField('market', value)}
            >
              <SelectTrigger id="market">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usa">{t.metricsForm.markets.usa}</SelectItem>
                <SelectItem value="argentina">{t.metricsForm.markets.argentina}</SelectItem>
                <SelectItem value="brazil">{t.metricsForm.markets.brazil}</SelectItem>
                <SelectItem value="chile">{t.metricsForm.markets.chile}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">{t.metricsForm.industry}</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => updateField('industry', value)}
            >
              <SelectTrigger id="industry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time Period */}
        <div className="space-y-2">
          <Label htmlFor="time_period">{t.metricsForm.timePeriod}</Label>
          <NumberInput
            id="time_period"
            min={1}
            max={12}
            value={formData.time_period_months === undefined || formData.time_period_months === null ? '' : formData.time_period_months}
            onChange={(value) => {
              if (value === '') {
                updateField('time_period_months', undefined);
              } else {
                updateField('time_period_months', Math.max(1, Math.min(12, value)));
              }
            }}
            onBlur={() => {
              if (formData.time_period_months === undefined || formData.time_period_months === null) {
                updateField('time_period_months', 1);
              }
            }}
            allowDecimals={false}
            placeholder="1"
          />
        </div>

        {/* Revenue & Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">{t.metricsForm.revenue} *</Label>
            <NumberInput
              id="revenue"
              min={0.01}
              required
              value={formData.revenue || ''}
              onChange={(value) => updateField('revenue', value === '' ? 0 : value)}
              allowDecimals={true}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cogs">{t.metricsForm.cogs}</Label>
            <NumberInput
              id="cogs"
              min={0}
              value={formData.cogs || ''}
              onChange={(value) => updateField('cogs', value === '' ? 0 : value)}
              allowDecimals={true}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="operating_expenses">{t.metricsForm.operatingExpenses}</Label>
            <NumberInput
              id="operating_expenses"
              min={0}
              value={formData.operating_expenses || ''}
              onChange={(value) => updateField('operating_expenses', value === '' ? 0 : value)}
              allowDecimals={true}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sales_marketing">{t.metricsForm.salesMarketing}</Label>
            <NumberInput
              id="sales_marketing"
              min={0}
              value={formData.sales_marketing_expense || ''}
              onChange={(value) => updateField('sales_marketing_expense', value === '' ? 0 : value)}
              allowDecimals={true}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t.metricsForm.customerMetrics}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_customers">{t.metricsForm.newCustomers}</Label>
              <NumberInput
                id="new_customers"
                min={0}
                value={formData.new_customers || ''}
                onChange={(value) => updateField('new_customers', value === '' ? undefined : value)}
                allowDecimals={false}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_customers">{t.metricsForm.totalCustomers}</Label>
              <NumberInput
                id="total_customers"
                min={0}
                value={formData.total_customers || ''}
                onChange={(value) => updateField('total_customers', value === '' ? undefined : value)}
                allowDecimals={false}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="churned_customers">{t.metricsForm.churnedCustomers}</Label>
              <NumberInput
                id="churned_customers"
                min={0}
                value={formData.churned_customers || ''}
                onChange={(value) => updateField('churned_customers', value === '' ? undefined : value)}
                allowDecimals={false}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Financial Health */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t.metricsForm.financialHealth}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cash_balance">{t.metricsForm.cashBalance}</Label>
              <NumberInput
                id="cash_balance"
                min={0}
                value={formData.cash_balance || ''}
                onChange={(value) => updateField('cash_balance', value === '' ? undefined : value)}
                allowDecimals={true}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_burn">{t.metricsForm.monthlyBurn}</Label>
              <NumberInput
                id="monthly_burn"
                min={0}
                value={formData.monthly_burn || ''}
                onChange={(value) => updateField('monthly_burn', value === '' ? undefined : value)}
                allowDecimals={true}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.revenue || formData.revenue <= 0}
          className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 border-2 border-black dark:border-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
              {t.analyzing}
            </span>
          ) : (
            t.metricsForm.analyze
          )}
        </Button>
      </form>
    </Card>
  );
}

