
import { useState, useCallback } from 'react';
import { 
  getStorageItem, 
  setStorageItem 
} from '@/utils/localStorage';

const STORAGE_KEY_2 = 'selected-subreddits-2';
const DEFAULT_SUBREDDITS_2 = ['programming', 'MachineLearning', 'artificial', 'singularity'];

export const useSubredditState2 = () => {
  console.log('🚀 useSubredditState2 hook initializing at', new Date().toISOString());
  
  // Initialize with stored value or default
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 Initializing subreddits state 2...');
    const stored = getStorageItem(STORAGE_KEY_2);
    
    // If nothing is stored at all, use defaults
    if (stored === null) {
      console.log('🏁 No stored data found, using default subreddits 2:', DEFAULT_SUBREDDITS_2);
      return DEFAULT_SUBREDDITS_2;
    }
    
    // If something is stored, parse it (even if it's an empty array)
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        console.log('🏁 Initial subreddits 2 loaded (including empty arrays):', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing stored subreddits 2:', error);
    }
    
    // Only fall back to defaults if parsing failed
    console.log('🏁 Parsing failed, using default subreddits 2:', DEFAULT_SUBREDDITS_2);
    return DEFAULT_SUBREDDITS_2;
  });

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    console.log('🔄 updateSubreddits2 called with:', newSubreddits);
    console.log('🔄 Current subreddits 2 before update:', subreddits);
    
    // Clean the input but don't enforce minimums
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    console.log('🔄 Filtered subreddits 2 (allowing empty):', filtered);
    
    // Use the filtered array as-is, even if empty
    console.log('🔄 Setting new subreddits 2:', filtered);
    setSubreddits(filtered);
    
    // Save immediately, even if empty
    console.log('💾 Saving subreddits 2 immediately (even if empty):', filtered);
    setStorageItem(STORAGE_KEY_2, JSON.stringify(filtered));
  }, [subreddits]);

  // Debug current state every render
  console.log('📊 useSubredditState2 render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    timestamp: new Date().toISOString()
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
