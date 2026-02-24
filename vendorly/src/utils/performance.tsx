// Performance optimization utilities
import React from 'react'

// Intersection Observer for lazy loading
export const useLazyLoading = (threshold = 0.1) => {
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  
  const createObserver = React.useCallback((callback: IntersectionObserverCallback) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    
    observerRef.current = new IntersectionObserver(callback, {
      threshold,
      rootMargin: '50px'
    })
    
    return observerRef.current
  }, [threshold])
  
  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
  
  return createObserver
}

// Image lazy loading hook
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '')
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)
  const createObserver = useLazyLoading()
  
  React.useEffect(() => {
    if (!imgRef.current || !src) return
    
    const observer = createObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = new Image()
          img.onload = () => {
            setImageSrc(src)
            setIsLoaded(true)
            setIsError(false)
          }
          img.onerror = () => {
            setIsError(true)
            setIsLoaded(false)
          }
          img.src = src
          observer.unobserve(entry.target)
        }
      })
    })
    
    observer.observe(imgRef.current)
    
    return () => observer.disconnect()
  }, [src, createObserver])
  
  return { imgRef, imageSrc, isLoaded, isError }
}

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 3
) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  
  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight
  
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll
  }
}

// Memory optimization hook
export const useMemoryOptimization = () => {
  const cleanupFunctions = React.useRef<(() => void)[]>([])
  
  const addCleanup = React.useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup)
  }, [])
  
  const cleanup = React.useCallback(() => {
    cleanupFunctions.current.forEach(fn => fn())
    cleanupFunctions.current = []
  }, [])
  
  React.useEffect(() => {
    return cleanup
  }, [cleanup])
  
  return { addCleanup, cleanup }
}

// Performance monitoring hook
export const usePerformanceMonitoring = (componentName: string) => {
  const mountTime = React.useRef<number>(Date.now())
  const renderCount = React.useRef<number>(0)
  
  React.useEffect(() => {
    renderCount.current += 1
    
    // Log performance metrics in development
    if (import.meta.env.DEV) {
      const mountDuration = Date.now() - mountTime.current
      console.log(`[Performance] ${componentName}:`, {
        mountDuration: `${mountDuration}ms`,
        renderCount: renderCount.current,
        timestamp: new Date().toISOString()
      })
    }
  })
  
  React.useEffect(() => {
    // Performance observer for monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name.includes(componentName)) {
            console.log(`[Performance Entry] ${entry.name}:`, {
              duration: entry.duration,
              startTime: entry.startTime,
              type: entry.entryType
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['measure', 'mark'] })
      
      return () => observer.disconnect()
    }
  }, [componentName])
  
  return {
    markStart: () => performance.mark(`${componentName}-start`),
    markEnd: () => performance.mark(`${componentName}-end`),
    measure: () => performance.measure(componentName, `${componentName}-start`, `${componentName}-end`)
  }
}

// Debounce hook for performance optimization
export const useDebounce = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: unknown[]) => unknown>(func: T, delay: number) => {
  const timeoutRef = React.useRef<number | null>(null)
  const lastExecRef = React.useRef(0)
  
  const throttledFunc = React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastExecRef.current > delay) {
        func(...args)
        lastExecRef.current = now
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          func(...args)
          lastExecRef.current = Date.now()
        }, delay - (now - lastExecRef.current))
      }
    },
    [func, delay]
  )
  
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return throttledFunc
}

// Optimized image component with lazy loading
export interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  fallback?: string
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmJmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTJweCIgZmlsbD0iI2VmNDQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIGZhaWxlZDwvdGV4dD48L3N2Zz4=',
  onLoad,
  onError
}) => {
  const { imgRef, imageSrc, isLoaded, isError } = useLazyImage(src, placeholder)
  
  React.useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad()
    }
  }, [isLoaded, onLoad])
  
  React.useEffect(() => {
    if (isError && onError) {
      onError()
    }
  }, [isError, onError])
  
  return (
    <img
      ref={imgRef}
      src={isError ? fallback : imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
    />
  )
}

// Virtual list component for large datasets
export interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  height: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
}

export const VirtualList = <T,>({
  items,
  itemHeight,
  height,
  renderItem,
  className = '',
  overscan = 3
}: VirtualListProps<T>) => {
  const {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    handleScroll
  } = useVirtualScrolling(items, itemHeight, height, overscan)
  
  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

