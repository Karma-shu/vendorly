// PerformanceMonitor class - moved from performanceMonitor.tsx to satisfy react-refresh rules
import React from 'react'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  id?: string
  metadata?: Record<string, unknown>
}

interface WebVitalsMetric extends PerformanceMetric {
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  entries?: PerformanceEntry[]
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private isEnabled: boolean
  private observer?: PerformanceObserver

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true'
    
    if (this.isEnabled) {
      this.initializeWebVitals()
      this.initializeResourceTiming()
      this.initializeUserTiming()
    }
  }

  // Initialize Web Vitals monitoring
  private initializeWebVitals() {
    // First Contentful Paint (FCP)
    this.observePerformanceEntries('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordWebVital('FCP', entry.startTime, this.getRating('FCP', entry.startTime))
        }
      })
    })

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntries('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        this.recordWebVital('LCP', lastEntry.startTime, this.getRating('LCP', lastEntry.startTime))
      }
    })

    // First Input Delay (FID) - approximation using event timing
    this.observePerformanceEntries('first-input', (entries) => {
      entries.forEach((entry) => {
        const fid = (entry as PerformanceEventTiming).processingStart - (entry as PerformanceEntry).startTime
        this.recordWebVital('FID', fid, this.getRating('FID', fid))
      })
    })

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntries('layout-shift', (entries) => {
      let clsValue = 0
      entries.forEach((entry) => {
        if ('hadRecentInput' in entry && (entry as unknown as { hadRecentInput: boolean }).hadRecentInput === false) {
          clsValue += (entry as unknown as { value: number }).value
        }
      })
      this.recordWebVital('CLS', clsValue, this.getRating('CLS', clsValue))
    })
  }

  // Initialize resource timing monitoring
  private initializeResourceTiming() {
    this.observePerformanceEntries('resource', (entries) => {
      entries.forEach((entry) => {
        const loadTime = (entry as PerformanceResourceTiming).responseEnd - (entry as PerformanceEntry).startTime
        this.recordMetric('resource-load', loadTime, {
          name: entry.name,
          type: (entry as PerformanceResourceTiming).initiatorType,
          size: (entry as PerformanceResourceTiming).transferSize,
          cached: (entry as PerformanceResourceTiming).transferSize === 0
        })
      })
    })
  }

  // Initialize user timing monitoring
  private initializeUserTiming() {
    this.observePerformanceEntries('measure', (entries) => {
      entries.forEach((entry) => {
        this.recordMetric('user-timing', entry.duration, {
          name: entry.name,
          type: 'measure'
        })
      })
    })
  }

  private observePerformanceEntries(
    entryType: string, 
    callback: (entries: PerformanceEntry[]) => void
  ) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      observer.observe({ entryTypes: [entryType] })
    } catch (_error: unknown) {
      console.warn(`Performance observer for ${entryType} not supported`)
    }
  }

  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 }
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private recordWebVital(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
    const metric: WebVitalsMetric = {
      name,
      value,
      rating,
      timestamp: Date.now()
    }
    
    this.metrics.push(metric)
    this.sendToAnalytics(metric)
    
    // Log poor performance in development
    if (import.meta.env.DEV && rating === 'poor') {
      console.warn(`Poor ${name} performance: ${value}ms`)
    }
  }

  public recordMetric(name: string, value: number, metadata?: Record<string, unknown>) {
    if (!this.isEnabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    }
    
    this.metrics.push(metric)
    this.sendToAnalytics(metric)
  }

  // Custom timing measurements
  public startTiming(name: string): () => void {
    if (!this.isEnabled) return () => {}

    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      this.recordMetric(`timing-${name}`, duration)
    }
  }

  // Mark important events
  public markEvent(name: string, metadata?: Record<string, unknown>) {
    if (!this.isEnabled) return

    performance.mark(name)
    this.recordMetric(`event-${name}`, performance.now(), metadata)
  }

  // Measure between two marks
  public measureBetween(name: string, startMark: string, endMark?: string) {
    if (!this.isEnabled) return

    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name, 'measure')[0]
      if (measure) {
        this.recordMetric(`measure-${name}`, measure.duration)
      }
    } catch (_error: unknown) {
      console.warn(`Could not measure between ${startMark} and ${endMark}`)
    }
  }

  // Get performance summary
  public getPerformanceSummary() {
    const summary = {
      webVitals: {} as Record<string, WebVitalsMetric>,
      resourceTiming: [] as PerformanceMetric[],
      userTiming: [] as PerformanceMetric[],
      customMetrics: [] as PerformanceMetric[]
    }

    this.metrics.forEach(metric => {
      if (['FCP', 'LCP', 'FID', 'CLS'].includes(metric.name)) {
        summary.webVitals[metric.name] = metric as WebVitalsMetric
      } else if (metric.name.startsWith('resource-')) {
        summary.resourceTiming.push(metric)
      } else if (metric.name.startsWith('timing-') || metric.name.startsWith('measure-')) {
        summary.userTiming.push(metric)
      } else {
        summary.customMetrics.push(metric)
      }
    })

    return summary
  }

  // Send metrics to analytics service
  private sendToAnalytics(metric: PerformanceMetric | WebVitalsMetric) {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        custom_map: { metric_value: 'value' },
        value: Math.round(metric.value),
        metric_value: metric.value
      })
    }

    // Send to Sentry (if available)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.addBreadcrumb({
        category: 'performance',
        message: `${metric.name}: ${metric.value}`,
        level: 'info',
        data: metric
      })
    }

    // Send to custom analytics endpoint
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      }).catch(() => {
        // Fail silently for analytics
      })
    }
  }

  // Monitor route changes
  public trackRouteChange(from: string, to: string) {
    this.markEvent('route-change', { from, to })
    
    // Measure route transition time
    const endTiming = this.startTiming('route-transition')
    
    // Clean up previous route timing
    setTimeout(() => {
      endTiming()
    }, 100) // Small delay to account for component mounting
  }

  // Monitor user interactions
  public trackInteraction(type: string, target: string) {
    this.markEvent(`interaction-${type}`, { target })
  }

  // Monitor error boundaries
  public trackError(error: Error, errorInfo?: React.ErrorInfo) {
    this.recordMetric('error', 1, {
      message: error.message,
      stack: error.stack,
      errorInfo
    })
  }

  // Clean up old metrics to prevent memory leaks
  public cleanup() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    this.metrics = this.metrics.filter(metric => metric.timestamp > oneHourAgo)
  }
}