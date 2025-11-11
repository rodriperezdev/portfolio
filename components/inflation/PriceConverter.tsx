'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercent } from '@/lib/inflation-utils';
import { Language, Translations } from '@/data/translations';

interface ConversionResult {
  original_amount: number;
  converted_amount: number;
  inflation_rate: number;
  percentage_change: number;
  original_date: string;
  target_date: string;
}

interface PriceConverterProps {
  apiUrl: string;
  language: Language;
  theme: 'light' | 'dark';
  translations: Translations;
}

export function PriceConverter({ apiUrl, language: _language, theme, translations: t }: PriceConverterProps) {
  const [amount, setAmount] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!amount || !fromDate || !toDate) return;
    
    try {
      setConverting(true);
      setConversion(null);
      setError(null);
      
      const response = await fetch(
        `${apiUrl}/inflation/convert?amount=${amount}&from_date=${fromDate}&to_date=${toDate}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Validate result
      if (!result || result.converted_amount === undefined || result.converted_amount === null) {
        throw new Error('Invalid conversion result received from API');
      }
      
      setConversion(result);
    } catch (err) {
      console.error('[ERROR] Conversion error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert price';
      setError(errorMessage);
      setConversion(null);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="mb-8 sm:mb-12 border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t.priceConverter}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6">
        <div>
          <label className="block text-sm opacity-60 mb-2">{t.amount}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 border border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]/40 focus:ring-2 focus:ring-[rgb(var(--foreground))]/10 transition"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="block text-sm opacity-60 mb-2">{t.fromDate}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={`w-full px-4 py-3 sm:py-2.5 border border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))] text-base focus:outline-none focus:border-[rgb(var(--foreground))]/40 focus:ring-2 focus:ring-[rgb(var(--foreground))]/10 transition min-h-[44px] ${
              theme === 'dark' 
                ? '[color-scheme:dark]' 
                : '[color-scheme:light]'
            }`}
            style={{
              colorScheme: theme === 'dark' ? 'dark' : 'light'
            }}
          />
        </div>
        <div>
          <label className="block text-sm opacity-60 mb-2">{t.toDate}</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={`w-full px-4 py-3 sm:py-2.5 border border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))] text-base focus:outline-none focus:border-[rgb(var(--foreground))]/40 focus:ring-2 focus:ring-[rgb(var(--foreground))]/10 transition min-h-[44px] ${
              theme === 'dark' 
                ? '[color-scheme:dark]' 
                : '[color-scheme:light]'
            }`}
            style={{
              colorScheme: theme === 'dark' ? 'dark' : 'light'
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={handleConvert}
        disabled={converting || !amount || !fromDate || !toDate}
        size="lg"
        className="border-black text-sm sm:text-base min-h-[44px] w-full sm:w-auto"
      >
        {converting ? t.loading : t.convert}
      </Button>

      {conversion && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
            <div className="text-sm opacity-60 mb-2">{t.originalValue}</div>
            <div className="text-2xl font-bold">{formatCurrency(conversion?.original_amount)}</div>
            <div className="text-xs opacity-60 mt-2">{conversion?.original_date ?? ''}</div>
          </div>
          <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
            <div className="text-sm opacity-60 mb-2">{t.convertedValue}</div>
            <div className="text-2xl font-bold">
              {formatCurrency(conversion?.converted_amount)}
            </div>
            <div className="text-xs opacity-60 mt-2">{conversion?.target_date ?? ''}</div>
          </div>
          <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
            <div className="text-sm opacity-60 mb-2">{t.inflationChange}</div>
            <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ef4444' : '#dc2626' }}>
              {formatPercent(conversion?.percentage_change)}
            </div>
            <div className="text-xs opacity-60 mt-2">
              x{conversion?.inflation_rate?.toFixed(2) ?? '0.00'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


