import React from 'react'
import { PerformanceMonitor } from './performanceMonitorClass'

// Performance Monitoring Utilities for Production
// Tracks Core Web Vitals, user interactions, and application performance

// Singleton instance
const performanceMonitor = new PerformanceMonitor()

// Hook for React components
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState(() => performanceMonitor.getPerformanceSummary())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getPerformanceSummary())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    metrics,
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    startTiming: performanceMonitor.startTiming.bind(performanceMonitor),
    markEvent: performanceMonitor.markEvent.bind(performanceMonitor),
    trackRouteChange: performanceMonitor.trackRouteChange.bind(performanceMonitor),
    trackInteraction: performanceMonitor.trackInteraction.bind(performanceMonitor)
  }
}

// React component for development performance overlay
export const PerformanceOverlay: React.FC = () => {
  const { metrics } = usePerformanceMonitor()

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono max-w-md">
      <h3 className="font-bold mb-2">Performance Metrics</h3>
      <div className="space-y-1">
        {Object.entries(metrics.webVitals).map(([name, metric]) => (
          <div key={name} className="flex justify-between">
            <span>{name}:</span>
            <span className={
              metric.rating === 'good' ? 'text-green-400' :
              metric.rating === 'needs-improvement' ? 'text-yellow-400' : 'text-red-400'
            }>
              {Math.round(metric.value)}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Global performance monitor export
export default performanceMonitor

// Type declarations for global objects
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    Sentry?: {
      addBreadcrumb: (breadcrumb: unknown) => void
      captureException: (error: Error) => void
    }
  }
}