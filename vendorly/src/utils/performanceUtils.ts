// Performance utilities - moved from performance.tsx to satisfy react-refresh rules

// Performance utilities object
export const performanceUtils = {
  // Measure function execution time
  measure: <T extends (...args: unknown[]) => unknown>(
    name: string,
    func: T
  ): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now()
      const result = func(...args)
      const end = performance.now()
      
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
      
      return result
    }) as T
  },
  
  // Batch DOM updates
  batchUpdate: (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback)
    } else {
      setTimeout(callback, 0)
    }
  },
  
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Get device memory information
  getDeviceMemory: () => {
    return (navigator as { deviceMemory?: number }).deviceMemory || 4 // Default to 4GB
  },
  
  // Get connection information
  getConnectionType: () => {
    const connection = (navigator as { connection?: { effectiveType: string } }).connection
    return connection ? connection.effectiveType : 'unknown'
  }
}