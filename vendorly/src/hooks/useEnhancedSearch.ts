import { useState } from 'react';

// Enhanced Search Hook with Voice Integration
export const useEnhancedSearch = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [voiceSearchCount, setVoiceSearchCount] = useState(0)

  const addToHistory = (query: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query)
      return [query, ...filtered].slice(0, 10) // Keep last 10 searches
    })
  }

  const handleVoiceSearch = (query: string) => {
    addToHistory(query)
    setVoiceSearchCount(prev => prev + 1)
    
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'voice_search', {
        search_term: query,
        voice_search_count: voiceSearchCount + 1
      })
    }
    
    return query
  }

  const getSearchSuggestions = (query: string): string[] => {
    // Simple suggestions based on common patterns
    const suggestions = [
      `${query} near me`,
      `${query} delivery`,
      `${query} under ₹500`,
      `best ${query}`,
      `cheap ${query}`
    ].filter(suggestion => suggestion !== query)
    
    return suggestions.slice(0, 3)
  }

  return {
    searchHistory,
    voiceSearchCount,
    handleVoiceSearch,
    addToHistory,
    getSearchSuggestions
  }
}