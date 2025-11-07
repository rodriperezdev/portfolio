import { presidentialTerms, economicEvents, indecManipulationPeriod } from '@/data/argentina-data';

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format currency
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Format percentage
export function formatPercent(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '+0.00%';
  return `${value >= 0 ? '+' : ''}${(value ?? 0).toFixed(2)}%`;
}

// Get presidential term for a date
export function getTermForDate(dateStr: string) {
  if (!dateStr) return undefined;
  const normalizedDate = dateStr.split('T')[0];
  // Try exact match first
  let term = presidentialTerms.find(term => {
    const termDate = term.date.split('T')[0];
    return termDate === normalizedDate;
  });
  
  // If no exact match, try to find the closest term (within same month)
  if (!term) {
    const date = new Date(normalizedDate);
    if (!isNaN(date.getTime())) {
      term = presidentialTerms.find(term => {
        const termDate = new Date(term.date);
        if (isNaN(termDate.getTime())) return false;
        // Check if date is in the same month and year as term start
        return date.getFullYear() === termDate.getFullYear() && 
               date.getMonth() === termDate.getMonth();
      });
    }
  }
  
  return term;
}

// Get economic event for a date
export function getEconomicEventForDate(dateStr: string) {
  if (!dateStr) return undefined;
  const normalizedDate = dateStr.split('T')[0];
  // Try exact match first
  let event = economicEvents.find(event => {
    const eventDate = event.date.split('T')[0];
    return eventDate === normalizedDate;
  });
  
  // If no exact match, try to find the closest event (within same month)
  if (!event) {
    const date = new Date(normalizedDate);
    if (!isNaN(date.getTime())) {
      event = economicEvents.find(event => {
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) return false;
        // Check if date is in the same month and year as event
        return date.getFullYear() === eventDate.getFullYear() && 
               date.getMonth() === eventDate.getMonth();
      });
    }
  }
  
  return event;
}

// Check if date is within manipulation period
export function isInManipulationPeriod(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const startDate = new Date(indecManipulationPeriod.startDate);
  const endDate = new Date(indecManipulationPeriod.endDate);
  return date >= startDate && date <= endDate;
}

// Get optimal tooltip position to avoid collisions
export function getOptimalTooltipPosition(
  dotX: number,
  dotY: number,
  tooltipWidth: number,
  tooltipHeight: number,
  graphWidth: number,
  graphHeight: number,
  lineTooltipPosition: { centerX: number; side?: 'left' | 'right' } | null
): { x: number; y: number } {
  const margin = 20;
  const safeDistance = 280;

  // Check if we're in the rightmost zone (75-100%)
  const isRightmostZone = dotX > (graphWidth * 0.75);

  let x: number, y: number;

  if (isRightmostZone && lineTooltipPosition) {
    // SPECIAL HANDLING: We're in the rightmost zone
    // Date tooltip should be on the RIGHT (if our implementation is correct)
    // So position dot tooltip on the LEFT
    
    const dateTooltipIsOnRight = lineTooltipPosition.side === 'right';
    
    if (dateTooltipIsOnRight) {
      // Perfect! Date is on right, we can safely position on left
      x = dotX - tooltipWidth - margin;
      y = dotY - tooltipHeight / 2;
      
      // Make sure we don't go off left edge
      if (x < 10) {
        // If too far left, position above instead
        x = Math.max(dotX - tooltipWidth / 2, 10);
        y = dotY - tooltipHeight - margin;
      }
    } else {
      // Date tooltip hasn't flipped yet or something went wrong
      // Position above to avoid collision
      x = Math.max(dotX - tooltipWidth / 2, 10);
      y = Math.max(dotY - tooltipHeight - margin - 10, 10);
    }
  } else if (lineTooltipPosition) {
    // Standard positioning for dots in left/middle of graph
    const lineTooltipX = lineTooltipPosition.centerX;
    
    if (Math.abs(dotX - lineTooltipX) < safeDistance) {
      // Close to line tooltip - avoid collision
      const lineIsOnLeft = lineTooltipPosition.side === 'left' || lineTooltipX < graphWidth / 2;
      
      if (lineIsOnLeft) {
        // Line tooltip on left, position dot tooltip on right
        x = Math.min(dotX + margin, graphWidth - tooltipWidth - 10);
        y = dotY + margin;
      } else {
        // Line tooltip on right, position dot tooltip on left
        x = Math.max(dotX - tooltipWidth - margin, 10);
        y = dotY + margin;
      }
    } else {
      // Far from line tooltip - use standard positioning
      const shouldPositionRight = dotX < graphWidth / 2;
      
      if (shouldPositionRight) {
        x = dotX + margin;
        y = dotY - tooltipHeight / 2;
      } else {
        x = dotX - tooltipWidth - margin;
        y = dotY - tooltipHeight / 2;
      }
    }
  } else {
    // No line tooltip - use standard positioning
    if (dotX > graphWidth - 250) {
      // Dot near right edge - position to the left
      x = Math.max(10, dotX - tooltipWidth - margin);
      y = Math.max(10, Math.min(dotY - tooltipHeight / 2, graphHeight - tooltipHeight - 10));
    } else if (dotX < 250) {
      // Dot near left edge - position to the right
      x = Math.min(dotX + margin, graphWidth - tooltipWidth - 10);
      y = Math.max(10, Math.min(dotY - tooltipHeight / 2, graphHeight - tooltipHeight - 10));
    } else {
      // Dot in middle - position to the right by default
      x = Math.min(dotX + margin, graphWidth - tooltipWidth - 10);
      y = Math.max(10, Math.min(dotY - tooltipHeight / 2, graphHeight - tooltipHeight - 10));
    }
  }

  // Clamp to graph bounds
  x = Math.max(10, Math.min(x, graphWidth - tooltipWidth - 10));
  y = Math.max(10, Math.min(y, graphHeight - tooltipHeight - 10));

  return { x, y };
}

// Format date for display
export function formatDate(date: Date, language: 'en' | 'es'): string {
  return date.toLocaleDateString(language === 'es' ? 'es-AR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}



