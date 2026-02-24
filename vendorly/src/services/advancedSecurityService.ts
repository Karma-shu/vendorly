/**
 * Advanced Security Service
 * Implements rate limiting, fraud detection, data encryption, and compliance features
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (identifier: string) => string
}

interface SecurityEvent {
  type: 'login_attempt' | 'payment_attempt' | 'api_request' | 'suspicious_activity'
  userId?: string
  ip: string
  userAgent: string
  timestamp: Date
  metadata: Record<string, unknown>
}

interface FraudScore {
  score: number // 0-100, higher = more suspicious
  reasons: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  blocked: boolean
}

interface EncryptionOptions {
  algorithm?: string
  encoding?: 'hex' | 'base64'
}

class AdvancedSecurityService {
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>()
  private suspiciousActivities = new Map<string, SecurityEvent[]>()
  private blockedIPs = new Set<string>()
  private encryptionKey: string

  constructor() {
    this.encryptionKey = this.generateEncryptionKey()
    this.initializeSecurityMonitoring()
  }

  /**
   * Rate Limiting Implementation
   */
  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = config.keyGenerator ? config.keyGenerator(identifier) : identifier
    const now = Date.now()
    
    // Get or create rate limit entry
    let entry = this.rateLimitStore.get(key)
    
    if (!entry || now > entry.resetTime) {
      // Create new window
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      }
    }
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }
    
    // Increment counter
    entry.count++
    this.rateLimitStore.set(key, entry)
    
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  /**
   * API Rate Limiting Middleware
   */
  createRateLimitMiddleware(config: RateLimitConfig) {
    return async (req: { ip?: string; connection?: { remoteAddress?: string }; headers?: Record<string, string> }, res: { setHeader: (name: string, value: string | number) => void; status: (code: number) => { json: (obj: unknown) => void }; json: (obj: unknown) => void }, next: () => void) => {
      const identifier = this.getClientIdentifier(req)
      const result = await this.checkRateLimit(identifier, config)
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests)
      res.setHeader('X-RateLimit-Remaining', result.remaining)
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000))
      
      if (!result.allowed) {
        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        })
        return
      }
      
      next()
    }
  }

  /**
   * Fraud Detection System
   */
  async detectFraud(event: SecurityEvent): Promise<FraudScore> {
    let score = 0
    const reasons: string[] = []
    
    // Check IP reputation
    if (await this.isKnownMaliciousIP(event.ip)) {
      score += 40
      reasons.push('Known malicious IP address')
    }
    
    // Check for suspicious patterns
    const userEvents = this.getUserEvents(event.userId || event.ip)
    
    // Rapid requests detection
    const recentEvents = userEvents.filter(
      e => Date.now() - e.timestamp.getTime() < 60000 // Last minute
    )
    if (recentEvents.length > 10) {
      score += 25
      reasons.push('Unusually high request frequency')
    }
    
    // Location-based anomaly detection
    if (event.type === 'login_attempt' && event.userId) {
      const locationAnomaly = await this.detectLocationAnomaly(event.userId, event.ip)
      if (locationAnomaly.suspicious) {
        score += 20
        reasons.push(`Login from unusual location: ${locationAnomaly.location}`)
      }
    }
    
    // Payment fraud detection
    if (event.type === 'payment_attempt') {
      const paymentScore = this.analyzePaymentFraud(event)
      score += paymentScore.score
      reasons.push(...paymentScore.reasons)
    }
    
    // Device fingerprinting
    const deviceRisk = this.analyzeDeviceFingerprint(event.userAgent, event.ip)
    score += deviceRisk.score
    reasons.push(...deviceRisk.reasons)
    
    // Time-based analysis
    const timeRisk = this.analyzeTimePattern(userEvents)
    score += timeRisk.score
    reasons.push(...timeRisk.reasons)
    
    // Determine risk level and action
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
    let blocked = false
    
    if (score >= 80) {
      riskLevel = 'critical'
      blocked = true
    } else if (score >= 60) {
      riskLevel = 'high'
      blocked = true
    } else if (score >= 40) {
      riskLevel = 'medium'
    } else if (score >= 20) {
      riskLevel = 'medium'
    }
    
    // Store security event
    this.storeSecurityEvent(event)
    
    return { score, reasons, riskLevel, blocked }
  }

  /**
   * Data Encryption
   */
  async encryptSensitiveData(
    data: string,
    options: EncryptionOptions = {}
  ): Promise<string> {
    const { encoding = 'base64' } = options
    
    try {
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(16))
      
      // Create key from stored encryption key
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.encryptionKey),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      )
      
      // Encrypt data
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(data)
      )
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)
      
      // Return encoded result
      if (encoding === 'base64') {
        return btoa(String.fromCharCode(...combined))
      } else {
        return Array.from(combined, byte => byte.toString(16).padStart(2, '0')).join('')
      }
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Data Decryption
   */
  async decryptSensitiveData(
    encryptedData: string,
    options: EncryptionOptions = {}
  ): Promise<string> {
    const { encoding = 'base64' } = options
    
    try {
      // Decode encrypted data
      let combined: Uint8Array
      if (encoding === 'base64') {
        const binaryString = atob(encryptedData)
        combined = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          combined[i] = binaryString.charCodeAt(i)
        }
      } else {
        const bytes = encryptedData.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
        combined = new Uint8Array(bytes)
      }
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 16)
      const encrypted = combined.slice(16)
      
      // Create key
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.encryptionKey),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )
      
      // Decrypt data
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      )
      
      return new TextDecoder().decode(decrypted)
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  /**
   * Input Sanitization
   */
  sanitizeInput(input: string, type: 'html' | 'sql' | 'xss' = 'xss'): string {
    if (!input) return ''
    
    switch (type) {
      case 'html':
        return input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;')
      
      case 'sql':
        return input.replace(/['";\\]/g, '\\$&')
      
      case 'xss':
      default:
        return input
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
    }
  }

  /**
   * GDPR Compliance Features
   */
  async handleDataPortabilityRequest(userId: string): Promise<Record<string, unknown>> {
    // Collect all user data from various sources
    const userData = {
      profile: await this.getUserProfile(userId),
      orders: await this.getUserOrders(userId),
      preferences: await this.getUserPreferences(userId),
      activity: await this.getUserActivity(userId)
    }
    
    // Encrypt sensitive data for export
    const encryptedData = await this.encryptSensitiveData(JSON.stringify(userData))
    
    return {
      data: encryptedData,
      format: 'JSON',
      exportDate: new Date().toISOString(),
      dataTypes: ['profile', 'orders', 'preferences', 'activity']
    }
  }

  async handleDataDeletionRequest(userId: string): Promise<void> {
    // Mark user for deletion (soft delete)
    await this.markUserForDeletion(userId)
    
    // Anonymize data where deletion is not possible
    await this.anonymizeUserData(userId)
    
    // Log deletion request for compliance
    this.logComplianceEvent('data_deletion', userId)
  }

  /**
   * Content Security Policy
   */
  generateCSPHeader(): string {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://api.supabase.co https://api.razorpay.com wss:",
      "frame-src 'self' https://api.razorpay.com",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    
    return csp
  }

  /**
   * Security Headers
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': this.generateCSPHeader(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }
  }

  // Private helper methods
  private generateEncryptionKey(): string {
    // In production, this should come from secure environment variables
    return import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production'
  }

  private initializeSecurityMonitoring(): void {
    // Set up periodic cleanup of rate limit store
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.rateLimitStore.entries()) {
        if (now > entry.resetTime) {
          this.rateLimitStore.delete(key)
        }
      }
    }, 60000) // Cleanup every minute
  }

  private getClientIdentifier(req: { ip?: string; connection?: { remoteAddress?: string }; headers?: Record<string, string> }): string {
    // Combine IP and user agent for more accurate identification
    const ip = req.ip || req.connection?.remoteAddress || 'unknown'
    const userAgent = req.headers?.['user-agent'] || 'unknown'
    return `${ip}:${btoa(userAgent).slice(0, 10)}`
  }

  private async isKnownMaliciousIP(ip: string): Promise<boolean> {
    // Check against known malicious IP databases
    // This would integrate with external threat intelligence services
    return this.blockedIPs.has(ip)
  }

  private getUserEvents(identifier: string): SecurityEvent[] {
    return this.suspiciousActivities.get(identifier) || []
  }

  private async detectLocationAnomaly(userId: string, ip: string): Promise<{
    suspicious: boolean
    location: string
  }> {
    // Implement geolocation-based anomaly detection
    // This would integrate with IP geolocation services
    
    // Basic implementation: check if IP belongs to known regions
    // In a real implementation, this would call a geolocation API
    const isSuspicious = await this.isKnownMaliciousIP(ip);
    
    return { 
      suspicious: isSuspicious, 
      location: isSuspicious ? 'Suspicious Location' : 'Normal Location' 
    };
  }

  private analyzePaymentFraud(event: SecurityEvent): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []
    
    const { amount } = event.metadata as { amount?: number; paymentMethod?: string; cardBin?: string }
    
    // High amount transactions
    if (amount && amount > 50000) {
      score += 15
      reasons.push('High value transaction')
    }
    
    // Multiple payment methods in short time
    // This would require tracking user payment history
    
    return { score, reasons }
  }

  private analyzeDeviceFingerprint(userAgent: string, ip: string): {
    score: number
    reasons: string[]
  } {
    let score = 0
    const reasons: string[] = []
    
    // Check for bot-like user agents
    if (/bot|crawler|spider/i.test(userAgent)) {
      score += 30
      reasons.push('Bot-like user agent detected')
    }
    
    // Check IP reputation
    if (this.blockedIPs.has(ip)) {
      score += 25
      reasons.push('IP address flagged for suspicious activity')
    }
    
    // Check for missing or suspicious user agent
    if (!userAgent || userAgent === 'unknown') {
      score += 20
      reasons.push('Missing or suspicious user agent')
    }
    
    return { score, reasons }
  }

  private analyzeTimePattern(events: SecurityEvent[]): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []
    
    // Check for activity during unusual hours (2 AM - 6 AM)
    const recentEvents = events.filter(e => 
      Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
    )
    
    const unusualHourEvents = recentEvents.filter(e => {
      const hour = e.timestamp.getHours()
      return hour >= 2 && hour <= 6
    })
    
    if (unusualHourEvents.length > recentEvents.length * 0.5) {
      score += 15
      reasons.push('Unusual activity hours')
    }
    
    return { score, reasons }
  }

  private storeSecurityEvent(event: SecurityEvent): void {
    const identifier = event.userId || event.ip
    const events = this.suspiciousActivities.get(identifier) || []
    events.push(event)
    
    // Keep only last 100 events per identifier
    if (events.length > 100) {
      events.splice(0, events.length - 100)
    }
    
    this.suspiciousActivities.set(identifier, events)
  }

  private async getUserProfile(userId: string): Promise<Record<string, unknown>> {
    // Implementation would fetch user profile data
    // Placeholder implementation
    return {
      userId,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
  }

  private async getUserOrders(userId: string): Promise<unknown[]> {
    // Implementation would fetch user order data
    // Placeholder implementation
    return [
      {
        orderId: 'order_' + userId,
        userId,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private async getUserPreferences(userId: string): Promise<Record<string, unknown>> {
    // Implementation would fetch user preferences
    // Placeholder implementation
    return {
      userId,
      notificationPreferences: {
        email: true,
        push: true
      }
    };
  }

  private async getUserActivity(userId: string): Promise<unknown[]> {
    // Implementation would fetch user activity logs
    // Placeholder implementation
    return [
      {
        userId,
        activityType: 'login',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private async markUserForDeletion(userId: string): Promise<void> {
    // Implementation would mark user account for deletion
    // Placeholder implementation
    console.log(`Marking user ${userId} for deletion`);
    // In real implementation, this would update database records
  }

  private async anonymizeUserData(userId: string): Promise<void> {
    // Implementation would anonymize user data
    // Placeholder implementation
    console.log(`Anonymizing data for user ${userId}`);
    // In real implementation, this would:
    // - Remove personally identifiable information
    // - Hash sensitive data
    // - Update related records
  }

  private logComplianceEvent(eventType: string, userId: string): void {
    console.log(`Compliance event: ${eventType} for user ${userId}`);
    // In real implementation, this would log to a compliance audit trail
    // with timestamps, event details, and user identifiers
  }
}

export const advancedSecurityService = new AdvancedSecurityService()
export type { RateLimitConfig, SecurityEvent, FraudScore, EncryptionOptions }