'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Customized } from 'recharts';
import { SentimentTrend, TimeRange } from '@/types/sentiment';
import { Language } from '@/data/sentiment-translations';
import { formatDate, formatFullDate, formatPercentage, getSentimentColor, getSmoothedTrendData, getEventForDate, getVisibleEvents, getOptimalTooltipPosition, debounce } from '@/lib/sentiment-utils';

interface SentimentTrendChartProps {
  data: SentimentTrend[];
  politicalEvents: Array<{ date: string; label: { en: string; es: string } }>;
  timeRange: TimeRange;
  language: Language;
  theme: 'light' | 'dark';
  translations: any;
  onTimeRangeChange?: (range: TimeRange) => void;
}

// Custom Event Marker Component
const EventMarker = ({ 
  cx, 
  cy, 
  eventDate, 
  eventLabel, 
  payload, 
  theme, 
  timeRange, 
  onHover, 
  onLeave,
  isHovered
}: any) => {
  const xAxisHeight = timeRange === 'yearly' ? 60 : 30;
  const plotAreaHeight = 300 - xAxisHeight;
  const xAxisLineY = plotAreaHeight;
  const dotY = cy;
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHover(eventDate, cx, dotY);
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLeave();
  };
  
  return (
    <g>
      {/* Invisible wider line for easier hover detection */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={xAxisLineY}
        stroke="transparent"
        strokeWidth={30}
        style={{ cursor: 'pointer' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        pointerEvents="stroke"
      />
      {/* Grey dashed line from top of chart (y=0) down to dot */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={dotY}
        stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
        strokeWidth={1.5}
        strokeDasharray="4,4"
        opacity={isHovered ? 0.9 : 0.6}
        style={{ pointerEvents: 'none' }}
      />
      {/* Grey dashed line from dot down to x-axis - stops exactly at x-axis line */}
      <line
        x1={cx}
        y1={dotY}
        x2={cx}
        y2={xAxisLineY}
        stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
        strokeWidth={1.5}
        strokeDasharray="4,4"
        opacity={isHovered ? 0.9 : 0.6}
        style={{ pointerEvents: 'none' }}
      />
      {/* Blue dot on negative line */}
      <circle
        cx={cx}
        cy={dotY}
        r={7}
        fill="#3b82f6"
        stroke={theme === 'dark' ? '#ffffff' : '#1e293b'}
        strokeWidth={2.5}
        style={{ cursor: 'pointer' }}
        opacity={isHovered ? 1 : 0.9}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {/* Glow effect on hover */}
      {isHovered && (
        <circle
          cx={cx}
          cy={dotY}
          r={12}
          fill="#3b82f6"
          opacity={0.2}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
};

// Custom Tooltip that positions itself to avoid event labels
const CustomTooltip = ({ active, payload, label, coordinate, theme, language, debouncedSetLineTooltipPosition }: any) => {
  const [tooltipSide, setTooltipSide] = React.useState<'left' | 'right'>('left');
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  
  // Track tooltip position and determine which side to show it on
  React.useEffect(() => {
    if (active && coordinate && tooltipRef.current) {
      const chartWidth = 600; // Approximate chart width
      const relativeX = coordinate.x / chartWidth;
      const shouldBeOnRight = relativeX > 0.75;
      const newSide = shouldBeOnRight ? 'right' : 'left';
      
      if (newSide !== tooltipSide) {
        setTooltipSide(newSide);
      }
      
      debouncedSetLineTooltipPosition({
        centerX: coordinate.x,
        side: newSide
      });
    } else {
      debouncedSetLineTooltipPosition(null);
    }
  }, [active, coordinate, tooltipSide, debouncedSetLineTooltipPosition]);
  
  if (!active || !payload || !payload.length || !coordinate) return null;
  
  const tooltipStyle: any = {
    backgroundColor: theme === 'dark' ? '#282828' : '#f8f6f3',
    border: '1px solid ' + (theme === 'dark' ? '#ffffff20' : '#00000020'),
    borderRadius: '12px',
    fontSize: '14px',
    padding: '12px',
    margin: 0,
  };
  
  const tooltipWidth = 180;
  const tooltipHeight = 120;
  const chartWidth = 600;
  const chartHeight = 300;
  const edgePadding = 10;
  
  // Smart positioning based on which side the tooltip should be on
  let tooltipX: number;
  let tooltipY = coordinate.y - 40;
  
  if (tooltipSide === 'right') {
    tooltipX = coordinate.x + 15;
  } else {
    tooltipX = coordinate.x - tooltipWidth - 15;
  }
  
  // Boundary checks
  if (tooltipX + tooltipWidth > chartWidth - edgePadding) {
    tooltipX = coordinate.x - tooltipWidth - 20;
  }
  if (tooltipX < edgePadding) {
    tooltipX = edgePadding;
  }
  if (tooltipY < edgePadding) {
    tooltipY = edgePadding;
  }
  if (tooltipY + tooltipHeight > chartHeight - edgePadding) {
    tooltipY = chartHeight - tooltipHeight - edgePadding;
  }
  
  tooltipStyle.position = 'absolute';
  tooltipStyle.left = `${tooltipX}px`;
  tooltipStyle.top = `${tooltipY}px`;
  tooltipStyle.zIndex = 50;
  tooltipStyle.minWidth = '160px';
  tooltipStyle.transition = 'left 0.15s ease-out';
  
  return (
    <div ref={tooltipRef} style={tooltipStyle}>
      <p style={{ marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>
        {formatFullDate(label, language)}
      </p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ margin: '4px 0', color: entry.color }}>
          {`${entry.name}: ${formatPercentage(entry.value)}`}
        </p>
      ))}
    </div>
  );
};

export function SentimentTrendChart({
  data,
  politicalEvents,
  timeRange,
  language,
  theme,
  translations: t,
  onTimeRangeChange
}: SentimentTrendChartProps) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [eventCoordinates, setEventCoordinates] = useState<{ [key: string]: { cx: number; cy: number } }>({});
  
  // Track line tooltip position for collision detection
  const [lineTooltipPosition, setLineTooltipPosition] = useState<{
    centerX: number;
    side?: 'left' | 'right';
  } | null>(null);
  
  // Debounced setter for line tooltip position
  const debouncedSetLineTooltipPosition = useMemo(
    () => debounce((position: { centerX: number; side?: 'left' | 'right' } | null) => {
      setLineTooltipPosition(position);
    }, 50),
    []
  );

  // Force re-render when data changes by using the latest date as a dependency
  const dataKey = data.length > 0 ? `${data.length}-${data[data.length - 1]?.date || ''}` : 'empty';
  const smoothedData = getSmoothedTrendData(data, timeRange);
  
  // Log visible events for debugging
  if (smoothedData.length > 0) {
    getVisibleEvents(smoothedData, politicalEvents);
  }

  const handleEventHover = (eventDate: string, cx: number, cy: number) => {
    setHoveredEvent(eventDate);
    setEventCoordinates(prev => ({
      ...prev,
      [eventDate]: { cx, cy }
    }));
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  return (
    <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold">{t.sentimentTrend}</h2>
        {onTimeRangeChange && (
          <div className="flex gap-2 w-full sm:w-auto">
            {(['weekly', 'monthly', 'yearly'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range)}
                className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-md transition-all min-h-[44px] sm:min-h-0 flex-1 sm:flex-none cursor-pointer ${
                  timeRange === range
                    ? theme === 'dark'
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                    : theme === 'dark'
                      ? 'border border-white/20 hover:bg-white/10 text-white'
                      : 'border border-black/20 hover:bg-black/5 text-black'
                }`}
              >
                {t[range]}
              </button>
            ))}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300} key={dataKey}>
        <LineChart data={smoothedData} key={dataKey}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff10' : '#00000010'} />
          <XAxis 
            dataKey="date" 
            stroke={theme === 'dark' ? '#ffffff60' : '#00000060'} 
            style={{ fontSize: '11px' }}
            tickFormatter={(value) => formatDate(value, language, timeRange)}
            interval={timeRange === 'yearly' ? Math.floor(data.length / 8) : timeRange === 'monthly' ? Math.floor(data.length / 6) : 0}
            angle={timeRange === 'yearly' ? -45 : 0}
            textAnchor={timeRange === 'yearly' ? 'end' : 'middle'}
            height={timeRange === 'yearly' ? 60 : 30}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#ffffff60' : '#00000060'} 
            style={{ fontSize: '12px' }}
            domain={[0, 0.8]}
            tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
            ticks={[0, 0.2, 0.4, 0.6, 0.8]}
          />
          <Tooltip 
            content={
              <CustomTooltip 
                theme={theme}
                language={language}
                debouncedSetLineTooltipPosition={debouncedSetLineTooltipPosition}
              />
            }
            wrapperStyle={{ 
              pointerEvents: 'none'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          
          <Line 
            type="monotone" 
            dataKey="positive" 
            stroke={getSentimentColor('positive', theme)} 
            strokeWidth={2.5} 
            name={t.positive} 
            dot={false}
            animationDuration={500}
          />
          <Line 
            type="monotone" 
            dataKey="negative" 
            stroke={getSentimentColor('negative', theme)} 
            strokeWidth={2.5} 
            name={t.negative} 
            dot={(dotProps: any) => {
              const event = getEventForDate(dotProps.payload?.date, politicalEvents);
              if (event) {
                const { key, ...restProps } = dotProps;
                const isHovered = hoveredEvent === event.date;
                return (
                  <EventMarker 
                    key={`event-${event.date}`}
                    {...restProps} 
                    eventDate={event.date}
                    eventLabel={event.label[language]}
                    payload={dotProps.payload}
                    theme={theme}
                    timeRange={timeRange}
                    onHover={handleEventHover}
                    onLeave={handleEventLeave}
                    isHovered={isHovered}
                  />
                );
              }
              return <circle key={`dot-${dotProps.payload?.date}`} cx={dotProps.cx} cy={dotProps.cy} r={0} fill="transparent" />;
            }}
            animationDuration={500}
          />
          <Line 
            type="monotone" 
            dataKey="neutral" 
            stroke={getSentimentColor('neutral', theme)} 
            strokeWidth={2.5} 
            name={t.neutral} 
            dot={false}
            animationDuration={500}
          />
          
          {/* Custom overlay component to render event labels AFTER all lines */}
          <Customized
            component={(props: any) => {
              if (!hoveredEvent) return null;
              
              const coords = eventCoordinates[hoveredEvent];
              if (!coords) return null;
              
              const event = politicalEvents.find(e => e.date === hoveredEvent);
              if (!event) return null;
              
              const labelText = event.label[language];
              const fontSize = 13;
              const fontWeight = 600;
              const charWidth = fontSize * 0.55;
              const estimatedTextWidth = labelText.length * charWidth;
              const padding = 10;
              const minWidth = 70;
              const rectWidth = Math.max(estimatedTextWidth + (padding * 2), minWidth);
              const rectHeight = 32;
              
              const chartWidth = props.width || 600;
              const chartHeight = 300;
              
              // Use collision detection to position label
              const tooltipPos = getOptimalTooltipPosition(
                coords.cx,
                coords.cy,
                rectWidth,
                rectHeight,
                chartWidth,
                chartHeight,
                lineTooltipPosition
              );
              
              let rectX = tooltipPos.x;
              let rectY = tooltipPos.y;
              
              // Final boundary checks
              const margin = 10;
              if (rectX < margin) rectX = margin;
              if (rectX + rectWidth > chartWidth - margin) {
                rectX = chartWidth - rectWidth - margin;
              }
              if (rectY < margin) rectY = margin;
              if (rectY + rectHeight > chartHeight - margin) {
                rectY = chartHeight - rectHeight - margin;
              }
              
              return (
                <g pointerEvents="none">
                  <rect
                    x={rectX}
                    y={rectY}
                    width={rectWidth}
                    height={rectHeight}
                    fill="#3b82f6"
                    fillOpacity={1}
                    rx={8}
                    stroke={theme === 'dark' ? '#ffffff' : '#1e293b'}
                    strokeWidth={2}
                  />
                  <text
                    x={rectX + rectWidth / 2}
                    y={rectY + rectHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    style={{ pointerEvents: 'none' }}
                  >
                    {labelText}
                  </text>
                </g>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

