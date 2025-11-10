import { SentimentTrend, TimeRange } from '@/types/sentiment';
import { Language } from '@/data/sentiment-translations';

// Get sentiment color
export function getSentimentColor(sentiment: string, theme: 'light' | 'dark' = 'dark'): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return theme === 'dark' ? '#10b981' : '#059669';
    case 'negative':
      return theme === 'dark' ? '#ef4444' : '#dc2626';
    case 'neutral':
      return theme === 'dark' ? '#9ca3af' : '#6b7280';
    default:
      return theme === 'dark' ? '#9ca3af' : '#6b7280';
  }
}

// Get sentiment emoji
export function getSentimentEmoji(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
      return '😐';
    default:
      return '😐';
  }
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Get days from time range
export function getDaysFromTimeRange(range: TimeRange): number {
  switch (range) {
    case 'weekly':
      return 7;
    case 'monthly':
      return 30;
    case 'yearly':
      return 365;
  }
}

// Format date for display based on time range
export function formatDate(dateString: string, language: Language, timeRange: TimeRange): string {
  const date = new Date(dateString);
  
  if (timeRange === 'yearly') {
    // Show month and year: "Jan '25"
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
  } else if (timeRange === 'monthly') {
    // Show month and day: "Jan 15"
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } else {
    // Weekly: Show day and date: "Mon 15"
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  }
}

// Format full date with day, month, and year
export function formatFullDate(dateString: string, language: Language): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
    weekday: 'short',
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
}

// Calculate average sentiment
export function calculateAverageSentiment(posts: { score: number }[]): number {
  if (posts.length === 0) return 0;
  const sum = posts.reduce((acc, post) => acc + post.score, 0);
  return sum / posts.length;
}

// Get pie chart colors
export function getPieChartColors(theme: 'light' | 'dark'): string[] {
  return theme === 'dark' 
    ? ['#10b981', '#ef4444', '#9ca3af']
    : ['#059669', '#dc2626', '#6b7280'];
}

// Prepare pie chart data
export function preparePieChartData(currentSentiment: {
  sentiment: { positive: number; negative: number; neutral: number };
}, translations: any) {
  return [
    { name: translations.positive, value: currentSentiment.sentiment.positive },
    { name: translations.negative, value: currentSentiment.sentiment.negative },
    { name: translations.neutral, value: currentSentiment.sentiment.neutral }
  ];
}

// Apply moving average smoothing for better visualization
export function smoothData(data: SentimentTrend[], windowSize: number = 3): SentimentTrend[] {
  if (data.length < windowSize) return data;
  
  const smoothed: SentimentTrend[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
    const window = data.slice(start, end);
    
    const avgPositive = window.reduce((sum, d) => sum + d.positive, 0) / window.length;
    const avgNegative = window.reduce((sum, d) => sum + d.negative, 0) / window.length;
    const avgNeutral = window.reduce((sum, d) => sum + d.neutral, 0) / window.length;
    
    smoothed.push({
      date: data[i].date,
      positive: avgPositive,
      negative: avgNegative,
      neutral: avgNeutral,
      total_posts: data[i].total_posts
    });
  }
  
  return smoothed;
}

// Get smoothed trend data based on time range
export function getSmoothedTrendData(sentimentTrend: SentimentTrend[], timeRange: TimeRange): SentimentTrend[] {
  if (sentimentTrend.length === 0) return [];
  
  // Use larger smoothing window for longer time periods
  const windowSize = timeRange === 'yearly' ? 7 : timeRange === 'monthly' ? 3 : 1;
  return windowSize > 1 ? smoothData(sentimentTrend, windowSize) : sentimentTrend;
}

// Check if a date matches a political event (flexible date matching)
export function getEventForDate(dateStr: string, politicalEvents: Array<{ date: string; label: { en: string; es: string } }>): { date: string; label: { en: string; es: string } } | undefined {
  if (!dateStr) return undefined;
  // Normalize the date to YYYY-MM-DD format
  const normalizedDate = dateStr.split('T')[0]; // Remove time component if present
  return politicalEvents.find(event => {
    const eventDate = event.date.split('T')[0];
    return eventDate === normalizedDate;
  });
}

// Get visible events for the current time range
export function getVisibleEvents(
  sentimentTrend: SentimentTrend[],
  politicalEvents: Array<{ date: string; label: { en: string; es: string } }>
): Array<{ date: string; label: { en: string; es: string } }> {
  if (sentimentTrend.length === 0) return [];
  
  const visibleDates = new Set(sentimentTrend.map(d => d.date.split('T')[0]));
  return politicalEvents.filter(event => {
    const eventDate = event.date.split('T')[0];
    return visibleDates.has(eventDate);
  });
}




