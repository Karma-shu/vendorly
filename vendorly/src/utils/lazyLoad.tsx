import React, { Suspense, lazy } from 'react'

// Loading fallback component
const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
)

// Error boundary for lazy loaded components
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy load error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600">Please refresh the page to try again</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for lazy loading with error boundary
export const withLazyLoad = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallbackMessage?: string,
  errorFallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc)
  
  return (props: P) => (
    <LazyLoadErrorBoundary fallback={errorFallback}>
      <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyLoadErrorBoundary>
  )
}

// Lazy load with retry mechanism
export const withRetryLazyLoad = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  maxRetries: number = 3,
  fallbackMessage?: string
) => {
  const LazyComponent = lazy(() => {
    return new Promise<{ default: React.ComponentType<P> }>((resolve, reject) => {
      let retries = 0
      
      const attemptLoad = () => {
        importFunc()
          .then(resolve)
          .catch((error) => {
            retries++
            if (retries <= maxRetries) {
              console.warn(`Lazy load failed, retrying... (${retries}/${maxRetries})`)
              setTimeout(attemptLoad, 1000 * retries) // Exponential backoff
            } else {
              reject(error)
            }
          })
      }
      
      attemptLoad()
    })
  })
  
  return (props: P) => (
    <LazyLoadErrorBoundary fallback={null}>
      <Suspense fallback={<LoadingFallback message={fallbackMessage || 'Loading component...'} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyLoadErrorBoundary>
  )
}

// Route-based lazy loading helpers
export const LazyRoute: React.FC<{ component: React.ComponentType<Record<string, unknown>>
  fallbackMessage?: string
  errorFallback?: React.ReactNode
}> = ({ component: Component, fallbackMessage, errorFallback }) => (
  <LazyLoadErrorBoundary fallback={errorFallback}>
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      <Component />
    </Suspense>
  </LazyLoadErrorBoundary>
)

// Component visibility observer for progressive loading
export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return isVisible
}

// Lazy image component with intersection observer
export const LazyImage: React.FC<{
  src: string
  alt: string
  className?: string
  placeholder?: string
}> = ({ src, alt, className = '', placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=' }) => {
  const imgRef = React.useRef<HTMLImageElement>(null)
  const isVisible = useIntersectionObserver(imgRef, { threshold: 0.1 })
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(placeholder)

  React.useEffect(() => {
    if (isVisible && !isLoaded) {
      setImageSrc(src)
    }
  }, [isVisible, isLoaded, src])

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-60'} ${className}`}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
    />
  )
}