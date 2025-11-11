'use client';

import { Post } from '@/types/sentiment';
import { getSentimentColor, getSentimentEmoji } from '@/lib/sentiment-utils';

interface RecentPostsProps {
  posts: Post[];
  theme: 'light' | 'dark';
  translations: any;
}

export function RecentPosts({ posts, theme, translations: t }: RecentPostsProps) {
  return (
    <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t.recentPosts}</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border border-[rgb(var(--foreground))]/10 rounded-xl p-4 hover:border-[rgb(var(--foreground))]/20 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getSentimentEmoji(post.sentiment)}</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      borderColor: `${getSentimentColor(post.sentiment, theme)}40`,
                      color: getSentimentColor(post.sentiment, theme)
                    }}
                  >
                    {post.sentiment.toUpperCase()}
                  </span>
                  <span className="text-xs opacity-60">r/{post.subreddit}</span>
                </div>
                <h3 className="font-semibold mb-2">{post.title}</h3>
                {post.text && (
                  <p className="opacity-60 text-sm mb-2 line-clamp-2">{post.text}</p>
                )}
                {post.topics.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.topics.slice(0, 5).map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 border border-[rgb(var(--foreground))]/20 rounded-full text-xs opacity-70"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: getSentimentColor(post.sentiment, theme) }}>
                  {post.score.toFixed(2)}
                </div>
                <div className="text-xs opacity-60">{t.score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





