'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Customized } from 'recharts';
import { SentimentTrend, TimeRange } from '@/types/sentiment';
import { Language } from '@/data/sentiment-translations';
import { formatDate, formatFullDate, formatPercentage, getSentimentColor, getSmoothedTrendData, getEventForDate, getVisibleEvents } from '@/lib/sentiment-utils';

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
  onLeave 
}: any) => {
  const xAxisHeight = timeRange === 'yearly' ? 60 : 30;
  const plotAreaHeight = 300 - xAxisHeight;
  const xAxisLineY = plotAreaHeight;
  const dotY = cy;
  
  return (
    <g
      onMouseEnter={() => onHover(eventDate, cx, dotY)}
      onMouseLeave={onLeave}
    >
      {/* Grey dashed line from top of chart (y=0) down to dot */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={dotY}
        stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
        strokeWidth={1.5}
        strokeDasharray="4,4"
        opacity={0.6}
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
        opacity={0.6}
      />
      {/* Blue dot on negative line */}
      <circle
        cx={cx}
        cy={dotY}
        r={7}
        fill="#3b82f6"
        stroke={theme === 'dark' ? '#ffffff' : '#1e293b'}
        strokeWidth={2.5}
        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
      />
    </g>
  );
};

// Custom Tooltip that positions itself to avoid event labels
const CustomTooltip = ({ active, payload, label, coordinate, theme, language, hoveredEvent, eventCoordinates, politicalEvents, formatPercentage, formatFullDate }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const event = getEventForDate(label, politicalEvents);
  const isEventHovered = hoveredEvent && hoveredEvent === label;
  
  const tooltipStyle: any = {
    backgroundColor: theme === 'dark' ? '#282828' : '#f8f6f3',
    border: '1px solid ' + (theme === 'dark' ? '#ffffff20' : '#00000020'),
    borderRadius: '12px',
    fontSize: '14px',
    padding: '12px',
    margin: 0,
  };
  
  // If hovering over event, check for collision and reposition tooltip
  if (isEventHovered && coordinate && event) {
    const eventCoords = eventCoordinates[hoveredEvent];
    if (eventCoords) {
      const labelText = event.label[language];
      const fontSize = 13;
      const charWidth = fontSize * 0.55;
      const estimatedTextWidth = labelText.length * charWidth;
      const padding = 10;
      const eventLabelWidth = Math.max(estimatedTextWidth + (padding * 2), 70);
      const eventLabelHeight = 32;
      
      const eventLabelX = eventCoords.cx - eventLabelWidth / 2;
      const eventLabelY = eventCoords.cy - 50;
      const eventLabelRight = eventLabelX + eventLabelWidth;
      const eventLabelBottom = eventLabelY + eventLabelHeight;
      
      const tooltipWidth = 150;
      const tooltipHeight = 100;
      
      let tooltipX = coordinate.x + 80;
      let tooltipY = coordinate.y - 40;
      
      const tooltipRight = tooltipX + tooltipWidth;
      const tooltipBottom = tooltipY + tooltipHeight;
      
      const horizontalOverlap = !(tooltipRight < eventLabelX || tooltipX > eventLabelRight);
      const verticalOverlap = !(tooltipBottom < eventLabelY || tooltipY > eventLabelBottom);
      
      if (horizontalOverlap && verticalOverlap) {
        if (eventLabelBottom + tooltipHeight < 300) {
          tooltipY = eventLabelBottom + 10;
          tooltipX = eventCoords.cx - tooltipWidth / 2;
        } else {
          tooltipX = eventLabelRight + 20;
          tooltipY = eventCoords.cy - tooltipHeight / 2;
        }
      }
      
      tooltipStyle.position = 'absolute';
      tooltipStyle.left = `${tooltipX}px`;
      tooltipStyle.top = `${tooltipY}px`;
      tooltipStyle.zIndex = 999;
      tooltipStyle.minWidth = '140px';
    }
  }
  
  return (
    <div style={tooltipStyle}>
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
                className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-md transition-all min-h-[44px] sm:min-h-0 flex-1 sm:flex-none ${
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={smoothedData}>
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
                hoveredEvent={hoveredEvent}
                eventCoordinates={eventCoordinates}
                politicalEvents={politicalEvents}
                formatPercentage={formatPercentage}
                formatFullDate={formatFullDate}
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
              const margin = 10;
              
              let rectX = coords.cx - rectWidth / 2;
              
              if (rectX < margin) {
                rectX = margin;
              } else if (rectX + rectWidth > chartWidth - margin) {
                rectX = chartWidth - rectWidth - margin;
              }
              
              const topMargin = 10;
              let rectY = coords.cy - 50;
              if (rectY < topMargin) {
                rectY = topMargin;
              }
              
              return (
                <g pointerEvents="none">
                  <rect
                    x={rectX}
                    y={rectY}
                    width={rectWidth}
                    height={rectHeight}
                    fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    rx={8}
                    opacity={1}
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                  />
                  <text
                    x={rectX + rectWidth / 2}
                    y={rectY + 20}
                    textAnchor="middle"
                    fill={theme === 'dark' ? '#ffffff' : '#000000'}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    dominantBaseline="middle"
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

