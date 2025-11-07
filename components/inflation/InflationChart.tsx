'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { TooltipProps } from 'recharts';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Customized
} from 'recharts';
import { Button } from '@/components/ui/button';
import { debounce, getOptimalTooltipPosition, getTermForDate, getEconomicEventForDate, isInManipulationPeriod } from '@/lib/inflation-utils';
import { presidentialTerms, economicEvents, indecManipulationPeriod, deflationPeriod } from '@/data/argentina-data';
import { Language, Translations } from '@/data/translations';

interface InflationData {
  date: string;
  monthly_rate: number;
  annual_rate: number;
  disputed_annual_rate?: number | null;
}

interface InflationChartProps {
  data: InflationData[];
  language: Language;
  theme: 'light' | 'dark';
  translations: Translations;
  loading: boolean;
}

export function InflationChart({ data, language, theme, translations: t, loading }: InflationChartProps) {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [graphScrollPosition, setGraphScrollPosition] = useState(0);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseOverGraph, setIsMouseOverGraph] = useState(false);
  
  // Event marker states
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [eventCoordinates, setEventCoordinates] = useState<Record<string, { cx: number; cy: number }>>({});
  
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

  // Filter data to start from 1991 (Convertibility Plan)
  const filteredInflationData = useMemo(() => {
    return data.filter(d => {
      if (!d.date) return false;
      const date = new Date(d.date);
      return date.getFullYear() >= 1991;
    }).map(d => {
      // Add computed field for disputed period overlay
      const date = new Date(d.date);
      const year = date.getFullYear();
      const disputedAnnualRate = (year >= 2007 && year <= 2015) ? d.annual_rate : null;
      return {
        ...d,
        disputed_annual_rate: disputedAnnualRate
      };
    });
  }, [data]);

  // Initialize scroll to recent years after data loads
  useEffect(() => {
    if (filteredInflationData.length > 0 && graphContainerRef.current) {
      const container = graphContainerRef.current;
      setTimeout(() => {
        container.scrollLeft = container.scrollWidth - container.clientWidth;
        setGraphScrollPosition(container.scrollLeft);
      }, 100);
    }
  }, [filteredInflationData.length]);

  // Calculate Y-axis domain
  const getYAxisDomain = useCallback(() => {
    const dataToUse = filteredInflationData.length > 0 ? filteredInflationData : data;
    if (dataToUse.length === 0) return ['auto', 'auto'];
    
    const allValues = dataToUse.map(d => d.annual_rate).filter(v => v != null && !isNaN(v));
    if (allValues.length === 0) return ['auto', 'auto'];
    
    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);
    
    return [
      Math.max(dataMin - 50, dataMin - 10),
      Math.min(dataMax + 50, dataMax + 10)
    ];
  }, [filteredInflationData, data]);

  // Lock/unlock page scroll when mouse enters/leaves graph
  const handleMouseEnterGraph = useCallback(() => {
    setIsMouseOverGraph(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleMouseLeaveGraph = useCallback(() => {
    setIsMouseOverGraph(false);
    document.body.style.overflow = 'auto';
    setIsDragging(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Update scroll position when container scrolls
  useEffect(() => {
    const container = graphContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setGraphScrollPosition(container.scrollLeft);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Tooltip with smart positioning that flips to right in rightmost zone
  const CustomTooltip = ({ active, payload, label, coordinate }: TooltipProps<number, string>) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [tooltipSide, setTooltipSide] = useState<'left' | 'right'>('left');
    
    // Track tooltip position and determine which side to show it on
    useEffect(() => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      if (active && coordinate && tooltipRef.current && graphContainerRef.current) {
        updateTimeoutRef.current = setTimeout(() => {
          if (tooltipRef.current && graphContainerRef.current) {
            const rect = tooltipRef.current.getBoundingClientRect();
            const containerRect = graphContainerRef.current.getBoundingClientRect();
            
            if (containerRect) {
              const graphWidth = containerRect.width;
              const relativeX = coordinate.x / graphWidth;
              const shouldBeOnRight = relativeX > 0.75;
              const newSide = shouldBeOnRight ? 'right' : 'left';
              
              if (newSide !== tooltipSide) {
                setTooltipSide(newSide);
              }
              
              debouncedSetLineTooltipPosition({
                centerX: coordinate.x,
                side: newSide
              });
            }
          }
        }, 100);
      } else {
        debouncedSetLineTooltipPosition(null);
      }
      
      return () => {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
      };
    }, [active, coordinate, debouncedSetLineTooltipPosition, tooltipSide]);
    
    if (!active || !payload || !payload.length || !coordinate) return null;
    
    const tooltipStyle: React.CSSProperties = {
      backgroundColor: theme === 'dark' ? '#282828' : '#f8f6f3',
      border: '1px solid ' + (theme === 'dark' ? '#ffffff20' : '#00000020'),
      borderRadius: '12px',
      fontSize: '14px',
      padding: '12px',
      margin: 0,
    };
    
    const tooltipWidth = 180;
    const tooltipHeight = 120;
    const chartWidth = graphContainerRef.current?.clientWidth || 800;
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
    
    const formatFullDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
        weekday: 'short',
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    };
    
    const isDisputedPeriod = isInManipulationPeriod(label);
    
    return (
      <div ref={tooltipRef} style={tooltipStyle}>
        <p style={{ marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>
          {formatFullDate(label)}
        </p>
        {payload?.map((entry, index: number) => {
          const value = entry.value ?? 0;
          const sign = value >= 0 ? '+' : '';
          return (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {`${entry.name}: ${sign}${value.toFixed(2)}%`}
            </p>
          );
        })}
        {isDisputedPeriod && (
          <p style={{ marginTop: '8px', fontSize: '11px', opacity: 0.7, fontStyle: 'italic' }}>
            {language === 'es' 
              ? 'Nota: Datos de 2007-2015 pueden tener limitaciones de calidad debido a desafíos institucionales en la agencia de estadísticas.'
              : 'Note: Data from 2007-2015 may have quality limitations due to institutional challenges at the statistics agency.'}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold">{t.inflationTrend}</h2>
        
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTimeout(() => {
                if (graphContainerRef.current) {
                  const container = graphContainerRef.current;
                  container.scrollLeft = container.scrollWidth - container.clientWidth;
                  setGraphScrollPosition(container.scrollLeft);
                }
              }, 100);
            }}
            className="h-11 sm:h-10 px-4 text-sm min-h-[44px]"
          >
            {language === 'es' ? 'Ir a Reciente' : 'Go to Recent'}
          </Button>
        </div>
      </div>
      
      {/* Hyperinflation Note */}
      <div className="mb-4 p-3 border-l-4 border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--card))] text-sm">
        <p className="text-xs opacity-80 leading-relaxed">
          {t.hyperinflationNote}
        </p>
      </div>
      
      {/* Scrollable Graph Container */}
      {filteredInflationData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-[rgb(var(--foreground))] opacity-60">
          <p>{filteredInflationData.length === 0 && !loading ? 'No data available' : t.loading}</p>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={graphContainerRef}
            className={`overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-[rgb(var(--foreground))]/20 scrollbar-track-transparent ${isMouseOverGraph ? 'graph-active' : ''}`}
            onMouseEnter={handleMouseEnterGraph}
            onMouseLeave={handleMouseLeaveGraph}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,0,0,0.2) transparent',
              cursor: isDragging ? 'grabbing' : 'grab',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              if (graphContainerRef.current) {
                const container = graphContainerRef.current;
                const scrollAmount = e.deltaY;
                container.scrollLeft += scrollAmount;
                setGraphScrollPosition(container.scrollLeft);
              }
            }}
          >
            <div
              style={{
                width: `${Math.max((filteredInflationData.length * 8), graphContainerRef.current?.clientWidth || 0)}px`,
                minWidth: '100%',
                height: '300px',
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart 
                  data={filteredInflationData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAnnual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme === 'dark' ? '#ef4444' : '#dc2626'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme === 'dark' ? '#ef4444' : '#dc2626'} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme === 'dark' ? '#9ca3af' : '#6b7280'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme === 'dark' ? '#9ca3af' : '#6b7280'} stopOpacity={0}/>
                    </linearGradient>
                    <pattern id="disputedPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 0 10 L 10 0" stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'} strokeWidth="1" opacity="0.5"/>
                    </pattern>
                  </defs>
                  
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={theme === 'dark' ? '#ffffff10' : '#00000010'}
                  />
                  
                  {/* Reference lines for data quality period */}
                  <ReferenceLine 
                    x={indecManipulationPeriod.startDate}
                    stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                  <ReferenceLine 
                    x={indecManipulationPeriod.endDate}
                    stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                  
                  {/* Reference lines for deflation period */}
                  <ReferenceLine 
                    x={deflationPeriod.startDate}
                    stroke={theme === 'dark' ? '#60a5fa' : '#3b82f6'}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                  <ReferenceLine 
                    x={deflationPeriod.endDate}
                    stroke={theme === 'dark' ? '#60a5fa' : '#3b82f6'}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                  
                  <XAxis 
                    dataKey="date" 
                    stroke={theme === 'dark' ? '#ffffff60' : '#00000060'}
                    style={{ fontSize: '11px' }}
                    interval={Math.max(0, Math.floor(filteredInflationData.length / 10))}
                    tickFormatter={(value: string) => {
                      if (!value) return '';
                      try {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) return '';
                        return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        });
                      } catch (e) {
                        return '';
                      }
                    }}
                  />
                  <YAxis 
                    stroke={theme === 'dark' ? '#ffffff60' : '#00000060'}
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value: number) => {
                      const sign = value >= 0 ? '+' : '';
                      return `${sign}${value.toFixed(0)}%`;
                    }}
                    domain={getYAxisDomain()}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    trigger="hover"
                    shared={false}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  
                  {/* Main Area for all data */}
                  <Area 
                    type="monotone" 
                    dataKey="annual_rate" 
                    stroke={theme === 'dark' ? '#ef4444' : '#dc2626'}
                    fillOpacity={1}
                    fill="url(#colorAnnual)"
                    name={t.annual}
                    dot={(dotProps: { cx?: number; cy?: number; payload?: InflationData }) => {
                      const term = getTermForDate(dotProps.payload?.date);
                      const economicEvent = getEconomicEventForDate(dotProps.payload?.date);
                      const event = term || economicEvent;
                      
                      if (event && dotProps.cx != null && dotProps.cy != null) {
                        const dotY = dotProps.cy;
                        const xAxisLineY = 280;
                        const eventDate = term ? term.date : economicEvent?.date;
                        
                        const handleMouseEnter = (e: React.MouseEvent) => {
                          e.stopPropagation();
                          const coords = { cx: dotProps.cx, cy: dotY };
                          setHoveredEvent(eventDate || '');
                          setEventCoordinates(prev => ({
                            ...prev,
                            [eventDate || '']: coords
                          }));
                        };
                        
                        const handleMouseLeave = (e: React.MouseEvent) => {
                          e.stopPropagation();
                          setHoveredEvent(null);
                        };
                        
                        return (
                          <g
                            key={`event-${eventDate}`}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            {/* Invisible wider line for easier hover detection */}
                            <line
                              x1={dotProps.cx}
                              y1={0}
                              x2={dotProps.cx}
                              y2={xAxisLineY}
                              stroke="transparent"
                              strokeWidth={30}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              pointerEvents="stroke"
                            />
                            {/* Grey dashed lines */}
                            <line
                              x1={dotProps.cx}
                              y1={0}
                              x2={dotProps.cx}
                              y2={dotY}
                              stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                              strokeWidth={1.5}
                              strokeDasharray="4,4"
                              opacity={hoveredEvent === eventDate ? 0.9 : 0.6}
                              style={{ pointerEvents: 'none' }}
                            />
                            <line
                              x1={dotProps.cx}
                              y1={dotY}
                              x2={dotProps.cx}
                              y2={xAxisLineY}
                              stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                              strokeWidth={1.5}
                              strokeDasharray="4,4"
                              opacity={hoveredEvent === eventDate ? 0.9 : 0.6}
                              style={{ pointerEvents: 'none' }}
                            />
                            {/* Event dot */}
                            <circle
                              cx={dotProps.cx}
                              cy={dotY}
                              r={7}
                              fill={economicEvent ? "#f59e0b" : "#3b82f6"}
                              stroke={theme === 'dark' ? '#ffffff' : '#1e293b'}
                              strokeWidth={2.5}
                              style={{ cursor: 'pointer' }}
                              opacity={hoveredEvent === eventDate ? 1 : 0.9}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            />
                            {/* Glow effect on hover */}
                            {hoveredEvent === eventDate && (
                              <circle
                                cx={dotProps.cx}
                                cy={dotY}
                                r={12}
                                fill={economicEvent ? "#f59e0b" : "#3b82f6"}
                                opacity={0.2}
                                style={{ pointerEvents: 'none' }}
                              />
                            )}
                          </g>
                        );
                      }
                      return <circle key={`dot-${dotProps.payload?.date || 'unknown'}`} cx={dotProps.cx} cy={dotProps.cy} r={0} fill="transparent" />;
                    }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                  
                  {/* Overlay Area for disputed data (2007-2015) */}
                  <Area 
                    type="monotone" 
                    dataKey="disputed_annual_rate"
                    stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'}
                    strokeDasharray="5,5"
                    fill="url(#disputedPattern)"
                    fillOpacity={0.3}
                    name="Official Data (Disputed)"
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                  
                  {/* Monthly rate area */}
                  <Area 
                    type="monotone" 
                    dataKey="monthly_rate" 
                    stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                    fillOpacity={1}
                    fill="url(#colorMonthly)"
                    name={t.monthly}
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                  
                  {/* Customized component to render event labels */}
                  <Customized
                    component={(props: { width?: number; height?: number }) => {
                      const chartWidth = props.width || 600;
                      const fontSize = 13;
                      const padding = 10;
                      const minWidth = 70;
                      const rectHeight = 32;
                      
                      return (
                        <g>
                          {hoveredEvent && (() => {
                            const coords = eventCoordinates[hoveredEvent];
                            if (!coords) return null;
                            
                            const term = presidentialTerms.find(t => t.date === hoveredEvent);
                            const economicEvent = economicEvents.find(e => e.date === hoveredEvent);
                            const event = term || economicEvent;
                            
                            if (!event) return null;
                            
                            const labelText = event.label[language];
                            const isEconomicEvent = !!economicEvent;
                            const charWidth = fontSize * 0.55;
                            const estimatedTextWidth = labelText.length * charWidth;
                            const rectWidth = Math.max(estimatedTextWidth + (padding * 2), minWidth);
                            
                            const chartHeight = 300;
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
                            
                            if (rectX < padding) rectX = padding;
                            if (rectX + rectWidth > chartWidth - padding) {
                              rectX = chartWidth - rectWidth - padding;
                            }
                            if (rectY < padding) rectY = padding;
                            if (rectY + rectHeight > chartHeight - padding) {
                              rectY = chartHeight - rectHeight - padding;
                            }
                            
                            return (
                              <g key={`event-${hoveredEvent}`}>
                                <rect
                                  x={rectX}
                                  y={rectY}
                                  width={rectWidth}
                                  height={rectHeight}
                                  fill={isEconomicEvent ? "#f59e0b" : "#3b82f6"}
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
                                  fontWeight={600}
                                  pointerEvents="none"
                                >
                                  {labelText}
                                </text>
                              </g>
                            );
                          })()}
                        </g>
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scroll position indicator and Jump to Year */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-xs opacity-60 text-center sm:text-left">
              {(() => {
                if (!filteredInflationData.length) return '';
                const container = graphContainerRef.current;
                if (!container) return '';
                
                const containerWidth = container.clientWidth;
                const scrollLeft = container.scrollLeft;
                const scrollWidth = container.scrollWidth;
                const scrollRatio = scrollLeft / Math.max(scrollWidth - containerWidth, 1);
                
                const totalDataPoints = filteredInflationData.length;
                const visibleStart = Math.max(0, Math.floor(scrollRatio * totalDataPoints));
                const visibleEnd = Math.min(totalDataPoints - 1, Math.ceil((scrollRatio + (containerWidth / Math.max(scrollWidth, 1))) * totalDataPoints));
                
                const startDate = filteredInflationData[visibleStart]?.date;
                const endDate = filteredInflationData[visibleEnd]?.date;
                
                if (startDate && endDate) {
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  const startYear = start.getFullYear();
                  const endYear = end.getFullYear();
                  const startMonth = start.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short' });
                  const endMonth = end.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short' });
                  
                  if (startYear === endYear) {
                    return `${startMonth} - ${endMonth} ${startYear}`;
                  }
                  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
                }
                return '';
              })()}
            </div>
            
            {/* Jump to Year Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs opacity-60">{t.jumpToYear}:</label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  const year = e.target.value;
                  setSelectedYear(year);
                  if (year && graphContainerRef.current && filteredInflationData.length > 0) {
                    const yearIndex = filteredInflationData.findIndex(d => {
                      const date = new Date(d.date);
                      return date.getFullYear().toString() === year;
                    });
                    
                    if (yearIndex !== -1) {
                      const container = graphContainerRef.current;
                      const scrollWidth = container.scrollWidth;
                      const containerWidth = container.clientWidth;
                      const totalDataPoints = filteredInflationData.length;
                      const targetRatio = yearIndex / totalDataPoints;
                      const maxScroll = scrollWidth - containerWidth;
                      container.scrollLeft = targetRatio * maxScroll;
                      setGraphScrollPosition(container.scrollLeft);
                    }
                  }
                }}
                className="px-3 py-2 text-xs border border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]/40 transition min-h-[44px]"
              >
                <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                {(() => {
                  if (!filteredInflationData.length) return null;
                  const years = new Set<number>();
                  filteredInflationData.forEach(d => {
                    const date = new Date(d.date);
                    years.add(date.getFullYear());
                  });
                  return Array.from(years).sort((a, b) => a - b).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ));
                })()}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



