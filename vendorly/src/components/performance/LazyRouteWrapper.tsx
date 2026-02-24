import React, { Suspense } from 'react'
import { lazy } from 'react'
import { LoadingPage } from '../ui/Loading'
import { usePerformanceMonitoring } from '../../utils/performance'

// Create a performance-aware lazy component wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createLazyRoute = (importFn: () => Promise<any>, componentName: string) => {
  const LazyComponent = lazy(importFn)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { markStart, markEnd, measure } = usePerformanceMonitoring(componentName)
    
    React.useEffect(() => {
      markStart()
      return () => {
        markEnd()
        measure()
      }
    }, [markStart, markEnd, measure])

    return (
      <Suspense fallback={<LoadingPage />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}