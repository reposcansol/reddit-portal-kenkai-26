
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useFilterPreferences } from './useFilterPreferences';

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  score: number;
  author: string;
  created_utc: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
  selftext?: string;
  link_flair_text?: string;
  link_flair_css_class?: string;
  link_flair_background_color?: string;
  link_flair_text_color?: string;
  author_flair_text?: string;
}

const fetchRedditPosts = async (subreddits: string[], redditLimit: number): Promise<RedditPost[]> => {
  try {
    const allPosts: RedditPost[] = [];
    
    console.log('📡 [REDDIT] Fetching from subreddits:', subreddits);
    console.log('📡 [REDDIT] API limit per subreddit:', redditLimit);
    
    for (const subreddit of subreddits) {
      try {
        const response = await axios.get(
          `https://www.reddit.com/r/${subreddit}/hot.json?limit=${redditLimit}`,
          {
            headers: {
              'User-Agent': 'AI-News-Aggregator/1.0'
            }
          }
        );
        
        const posts = response.data.data.children
          .map((child: any) => ({
            id: child.data.id,
            title: child.data.title,
            url: child.data.url,
            score: child.data.score,
            author: child.data.author,
            created_utc: child.data.created_utc,
            num_comments: child.data.num_comments,
            subreddit: child.data.subreddit,
            permalink: `https://reddit.com${child.data.permalink}`,
            selftext: child.data.selftext,
            link_flair_text: child.data.link_flair_text,
            link_flair_css_class: child.data.link_flair_css_class,
            link_flair_background_color: child.data.link_flair_background_color,
            link_flair_text_color: child.data.link_flair_text_color,
            author_flair_text: child.data.author_flair_text
          }));
        
        console.log(`📡 [REDDIT] r/${subreddit}: ${posts.length} raw posts fetched`);
        allPosts.push(...posts);
      } catch (error) {
        console.error(`❌ [REDDIT] Error fetching posts from r/${subreddit}:`, error);
      }
    }
    
    console.log(`📡 [REDDIT] Total raw posts fetched: ${allPosts.length}`);
    return allPosts;
  } catch (error) {
    console.error('❌ [REDDIT] Error fetching Reddit posts:', error);
    throw new Error('Failed to fetch Reddit posts');
  }
};

export const useReddit = (subreddits: string[]) => {
  const queryClient = useQueryClient();
  const { preferences } = useFilterPreferences();
  
  // Create a stable cache key using sorted subreddits
  const stableKey = [...subreddits].sort().join(',');
  
  console.log('🔄 useReddit called with subreddits:', subreddits);
  console.log('🔄 Cache key:', stableKey);
  
  // Invalidate old queries when subreddits change
  useEffect(() => {
    console.log('🔄 Invalidating old reddit queries due to subreddit change');
    queryClient.invalidateQueries({ 
      queryKey: ['reddit'],
      exact: false 
    });
  }, [stableKey, queryClient]);

  return useQuery({
    queryKey: ['reddit', stableKey],
    queryFn: () => fetchRedditPosts(subreddits, preferences.redditLimit),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};
