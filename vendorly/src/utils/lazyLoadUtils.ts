// Lazy loading utility functions
import React from 'react';

// Preload utility for improved UX
export const preloadComponent = (importFunc: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) => {
  // Start loading the component immediately
  importFunc()
}

// Resource preloader for critical resources
export const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    
    // Determine resource type
    if (resource.endsWith('.js')) {
      link.as = 'script'
    } else if (resource.endsWith('.css')) {
      link.as = 'style'
    } else if (resource.match(/\.(png|jpg|jpeg|webp|svg)$/)) {
      link.as = 'image'
    } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = 'font'
      link.crossOrigin = 'anonymous'
    }
    
    link.href = resource
    document.head.appendChild(link)
  })
}

// Lazy load with retry mechanism
export const withRetryLazyLoad = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  maxRetries: number = 3,
  fallbackMessage?: string
) => {
  const LazyComponent = React.lazy(() => {
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
  
  return (props: P) => {
    const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    )
    
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
    
    return (
      <LazyLoadErrorBoundary>
        <React.Suspense fallback={<LoadingFallback message={fallbackMessage || 'Loading component...'} />}>
          <LazyComponent {...props} />
        </React.Suspense>
      </LazyLoadErrorBoundary>
    )
  }
}