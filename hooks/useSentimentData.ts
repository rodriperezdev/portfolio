'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SentimentTrend, CurrentSentiment, Topic, Post, TimeRange } from '@/types/sentiment';
import { getDaysFromTimeRange } from '@/lib/sentiment-utils';

interface UseSentimentDataResult {
  sentimentTrend: SentimentTrend[];
  currentSentiment: CurrentSentiment | null;
  topics: Topic[];
  recentPosts: Post[];
  loading: boolean;
  refreshLoading: boolean;
  isCollecting: boolean;
  error: string | null;
  refreshData: () => void;
}

export function useSentimentData(apiBaseUrl: string, timeRange: TimeRange): UseSentimentDataResult {
  const [sentimentTrend, setSentimentTrend] = useState<SentimentTrend[]>([]);
  const [currentSentiment, setCurrentSentiment] = useState<CurrentSentiment | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrlRef = useRef(apiBaseUrl);
  const timeRangeRef = useRef(timeRange);
  const fetchDataRef = useRef<(isRefresh?: boolean, errorMessage?: string) => Promise<void>>();
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    apiBaseUrlRef.current = apiBaseUrl;
  }, [apiBaseUrl]);

  useEffect(() => {
    timeRangeRef.current = timeRange;
    fetchDataRef.current?.();
  }, [timeRange]);

  const fetchData = useCallback(async (isRefresh = false, errorMessage?: string) => {
    try {
      if (isRefresh) {
        setRefreshLoading(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const activeApiBaseUrl = apiBaseUrlRef.current;
      const days = getDaysFromTimeRange(timeRangeRef.current);
      
      console.log(`[INFO] Fetching sentiment data for timeRange: ${timeRangeRef.current} (${days} days)`);
      
      // Fetch all data in parallel
      const [trendRes, currentRes, topicsRes, postsRes] = await Promise.all([
        fetch(`${activeApiBaseUrl}/sentiment/trend?days=${days}`),
        fetch(`${activeApiBaseUrl}/sentiment/current`),
        fetch(`${activeApiBaseUrl}/topics/trending?limit=8`),
        fetch(`${activeApiBaseUrl}/posts/recent?limit=10`)
      ]);
      
      if (!trendRes.ok || !currentRes.ok || !topicsRes.ok || !postsRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [trendData, currentData, topicsData, postsData] = await Promise.all([
        trendRes.json(),
        currentRes.json(),
        topicsRes.json(),
        postsRes.json()
      ]);
      
      console.log('[INFO] Trend data points:', trendData.length);
      console.log('[INFO] Current sentiment:', currentData);
      console.log('[INFO] Topics:', topicsData.length);
      console.log('[INFO] Recent posts:', postsData.length);
      
      // Debug: Log dates to help find political events
      if (trendData.length > 0) {
        console.log('[INFO] Date range in data:', {
          first: trendData[0].date,
          last: trendData[trendData.length - 1].date,
          allDates: trendData.map((d: any) => d.date)
        });
      }

      setSentimentTrend(trendData);
      setCurrentSentiment(currentData);
      setTopics(topicsData);
      setRecentPosts(postsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching sentiment data:', err);
      setError(errorMessage || (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchDataRef.current?.();
  }, [apiBaseUrl]);

  const refreshData = useCallback(async () => {
    try {
      setRefreshLoading(true);
      setIsCollecting(true);
      
      const activeApiBaseUrl = apiBaseUrlRef.current;

      // Step 1: Trigger Reddit data collection
      console.log('Triggering Reddit data collection...');
      const collectResponse = await fetch(`${activeApiBaseUrl}/collect/refresh`, {
        method: 'POST',
      });
      
      if (!collectResponse.ok) {
        throw new Error('Failed to collect data from Reddit');
      }
      
      const collectResult = await collectResponse.json();
      console.log('[OK] Collection result:', collectResult);
      console.log(`[OK] Collected ${collectResult.posts_collected} new posts`);
      
      // Step 2: Now fetch the updated data
      setIsCollecting(false);
      console.log('[INFO] Fetching updated data...');
      await fetchDataRef.current?.(true, 'Failed to refresh data. Make sure the API is running.');
      console.log('[OK] Data refreshed!');
      
    } catch (error) {
      console.error('Error during refresh:', error);
      setError('Failed to refresh data. Make sure the API is running.');
      setRefreshLoading(false);
      setIsCollecting(false);
    }
  }, []);

  // Fetch on mount and when timeRange changes
  useEffect(() => {
    const checkCollecting = async () => {
      try {
        const res = await fetch(`${apiBaseUrlRef.current}/status`);
        if (res.ok) {
          const data = await res.json();
          // Check both old is_collecting field and new backfill status
          const isBackfilling = data.backfill?.in_progress || false;
          const isScheduledCollection = data.is_collecting || false;
          setIsCollecting(isBackfilling || isScheduledCollection);
          
          // Log backfill status for debugging
          if (isBackfilling) {
            console.log('[INFO] Historical backfill in progress...');
            if (data.backfill?.posts_collected) {
              console.log(`[INFO] Posts collected so far: ${data.backfill.posts_collected}`);
            }
          }
        }
      } catch (err) {
        // Silently fail - not critical
      }
    };
    
    checkCollecting();
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }
    statusIntervalRef.current = setInterval(checkCollecting, 30000);

    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
    };
  }, [apiBaseUrl]);

  return {
    sentimentTrend,
    currentSentiment,
    topics,
    recentPosts,
    loading,
    refreshLoading,
    isCollecting,
    error,
    refreshData
  };
}





