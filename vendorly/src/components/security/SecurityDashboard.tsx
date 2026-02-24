import React, { useState, useEffect } from 'react'
import { Card, Button, Badge } from '../ui'
import { Shield, AlertTriangle, Lock, Ban, Clock, Eye, TrendingUp } from 'lucide-react'

interface SecurityAlert {
  id: string
  type: 'fraud_attempt' | 'rate_limit_exceeded' | 'suspicious_login' | 'data_breach'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  userId?: string
  ip: string
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
}

export const SecurityDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [metrics, setMetrics] = useState({
    blockedRequests: 1247,
    fraudAttempts: 23,
    rateLimitHits: 456,
    suspiciousActivities: 89,
    dataEncrypted: 15678,
    complianceScore: 94
  })

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = () => {
    const mockAlerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'fraud_attempt',
        severity: 'high',
        message: 'Multiple failed payment attempts detected',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        userId: 'user123',
        ip: '192.168.1.100',
        status: 'open'
      },
      {
        id: '2',
        type: 'rate_limit_exceeded',
        severity: 'medium',
        message: 'API rate limit exceeded for user session',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        ip: '10.0.0.1',
        status: 'resolved'
      }
    ]
    setAlerts(mockAlerts)
  }

  const getSeverityBadge = (severity: string) => {
    const config = {
      low: { color: 'bg-green-100 text-green-800', text: 'Low' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      high: { color: 'bg-orange-100 text-orange-800', text: 'High' },
      critical: { color: 'bg-red-100 text-red-800', text: 'Critical' }
    }
    const severityConfig = config[severity as keyof typeof config]
    return <Badge className={severityConfig.color}>{severityConfig.text}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Monitor security threats and compliance</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <Shield className="w-3 h-3 mr-1" />
          Security Active
        </Badge>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blocked Requests</p>
              <p className="text-2xl font-bold text-red-600">{metrics.blockedRequests.toLocaleString()}</p>
            </div>
            <Ban className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fraud Attempts</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.fraudAttempts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rate Limit Hits</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.rateLimitHits}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspicious Activities</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.suspiciousActivities}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data Encrypted</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.dataEncrypted.toLocaleString()}</p>
            </div>
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-green-600">{metrics.complianceScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Security Alerts</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-500">
                    IP: {alert.ip} • {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSeverityBadge(alert.severity)}
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Rate Limiting
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>API Requests</span>
              <Badge className="bg-green-100 text-green-800">100/min</Badge>
            </div>
            <div className="flex justify-between">
              <span>Login Attempts</span>
              <Badge className="bg-green-100 text-green-800">5/min</Badge>
            </div>
            <div className="flex justify-between">
              <span>Payment Attempts</span>
              <Badge className="bg-green-100 text-green-800">3/min</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" />
            Data Protection
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Encryption</span>
              <Badge className="bg-green-100 text-green-800">AES-256</Badge>
            </div>
            <div className="flex justify-between">
              <span>HTTPS</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex justify-between">
              <span>Data Masking</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}