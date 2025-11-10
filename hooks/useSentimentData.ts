'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchData = useCallback(async (isRefresh = false, errorMessage?: string) => {
    try {
      if (isRefresh) {
        setRefreshLoading(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const days = getDaysFromTimeRange(timeRange);
      
      // Fetch all data in parallel
      const [trendRes, currentRes, topicsRes, postsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/sentiment/trend?days=${days}`),
        fetch(`${apiBaseUrl}/sentiment/current`),
        fetch(`${apiBaseUrl}/topics/trending?limit=8`),
        fetch(`${apiBaseUrl}/posts/recent?limit=10`)
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
      
      console.log('📈 Trend data points:', trendData.length);
      console.log('📊 Current sentiment:', currentData);
      console.log('🔥 Topics:', topicsData.length);
      console.log('📝 Recent posts:', postsData.length);
      
      // Debug: Log dates to help find political events
      if (trendData.length > 0) {
        console.log('📅 Date range in data:', {
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
  }, [apiBaseUrl, timeRange]);

  const refreshData = useCallback(async () => {
    try {
      setRefreshLoading(true);
      setIsCollecting(true);
      
      // Step 1: Trigger Reddit data collection
      console.log('Triggering Reddit data collection...');
      const collectResponse = await fetch(`${apiBaseUrl}/collect/refresh`, {
        method: 'POST',
      });
      
      if (!collectResponse.ok) {
        throw new Error('Failed to collect data from Reddit');
      }
      
      const collectResult = await collectResponse.json();
      console.log('✅ Collection result:', collectResult);
      console.log(`📊 Collected ${collectResult.posts_collected} new posts`);
      
      // Step 2: Now fetch the updated data
      setIsCollecting(false);
      console.log('🔄 Fetching updated data...');
      await fetchData(true, 'Failed to refresh data. Make sure the API is running.');
      console.log('✅ Data refreshed!');
      
    } catch (error) {
      console.error('Error during refresh:', error);
      setError('Failed to refresh data. Make sure the API is running.');
      setRefreshLoading(false);
      setIsCollecting(false);
    }
  }, [apiBaseUrl, fetchData]);

  // Fetch on mount and when timeRange changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check if collecting is in progress
  useEffect(() => {
    const checkCollecting = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/status`);
        if (res.ok) {
          const data = await res.json();
          setIsCollecting(data.is_collecting || false);
        }
      } catch (err) {
        // Silently fail - not critical
      }
    };
    
    checkCollecting();
    const interval = setInterval(checkCollecting, 5000);
    
    return () => clearInterval(interval);
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




