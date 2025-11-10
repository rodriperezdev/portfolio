/**
 * Utility functions for business analysis components
 */

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'BRL': 'R$',
    'ARS': '$',
    'MXN': '$',
    'COP': '$',
    'CLP': '$',
  };
  return symbols[currency] || currency;
}

/**
 * Format date based on language preference
 * Spanish: dd/MM/YYYY
 * English: MM/DD/YYYY
 */
export function formatDate(dateString: string, language: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  if (language === 'es') {
    return `${day}/${month}/${year}`;
  }
  
  // English format: MM/DD/YYYY
  return `${month}/${day}/${year}`;
}

/**
 * Format currency conversion note with translation
 */
export function formatCurrencyNote(currencyInfo: { note?: string; input_currency: string }, language: string): string {
  const note = currencyInfo.note;
  
  if (!note) {
    return '';
  }
  
  if (language === 'en') {
    return note;
  }
  
  // Parse the note to extract values
  // Pattern: "Your {currency} {amount} revenue ≈ ${usdAmount} USD (at rate {rate})"
  // Handle both = and ≈ symbols
  const match = note.match(/Your (\w+) ([\d,]+) revenue (?:≈|=) \$([\d,]+) USD \(at rate ([\d.]+)\)/);
  
  if (match) {
    const [, currency, originalAmount, usdAmount, rate] = match;
    return `Tus ingresos de ${currency} ${originalAmount} ≈ $${usdAmount} USD (a tasa ${rate})`;
  }
  
  // Fallback: try to translate common phrases
  return note
    .replace(/Your /g, 'Tus ')
    .replace(/ revenue /g, ' ingresos ')
    .replace(/at rate/g, 'a tasa')
    .replace(/ = /g, ' ≈ ');
}

