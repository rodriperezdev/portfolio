export interface SentimentTrend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  total_posts: number;
}

export interface Topic {
  topic: string;
  mentions: number;
  avg_sentiment: number;
}

export interface Post {
  id: string;
  title: string;
  text: string;
  sentiment: string;
  score: number;
  created_at: string;
  subreddit: string;
  topics: string[];
}

export interface CurrentSentiment {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  total_analyzed: number;
}

export type TimeRange = 'weekly' | 'monthly' | 'yearly';




