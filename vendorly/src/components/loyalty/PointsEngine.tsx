import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../ui'
import type { LoyaltyUser } from '../../types/loyalty'
import { mockLoyaltyUsers, POINTS_EARNING_RULES, calculateEarnedPoints } from '../../data/loyaltyData'
import { Coins, TrendingUp, Users, ShoppingBag, Star, Gift, Calendar, Target, Crown, Medal, Award } from 'lucide-react'

interface PointsEngineProps {
  userId: string
}

interface PointsActivity {
  id: string
  type: 'order' | 'review' | 'referral' | 'daily' | 'social' | 'bonus'
  description: string
  points: number
  multiplier?: number
  timestamp: string
  metadata?: Record<string, unknown>
}

export const PointsEngine: React.FC<PointsEngineProps> = ({ userId }) => {
  const [loyaltyUser, setLoyaltyUser] = useState<LoyaltyUser | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pointsActivities, setPointsActivities] = useState<PointsActivity[]>([])
  const [simulationAmount, setSimulationAmount] = useState('')
  const [recentEarnings, setRecentEarnings] = useState<PointsActivity[]>([])

  useEffect(() => {
    // Load user data
    const user = mockLoyaltyUsers.find(u => u.userId === userId)
    setLoyaltyUser(user || null)

    // Mock recent activities
    setRecentEarnings([
      {
        id: 'act-1',
        type: 'order',
        description: 'Order #ORD-001 completed',
        points: 158,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: { orderValue: 1580, orderId: 'ORD-001' }
      },
      {
        id: 'act-2',
        type: 'review',
        description: 'Review written for Biryani Palace',
        points: 50,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        metadata: { vendorName: 'Biryani Palace', rating: 5 }
      },
      {
        id: 'act-3',
        type: 'daily',
        description: 'Daily login bonus',
        points: 10,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act-4',
        type: 'social',
        description: 'Shared order on social media',
        points: 25,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        metadata: { platform: 'WhatsApp' }
      },
      {
        id: 'act-5',
        type: 'referral',
        description: 'Friend Amit placed first order',
        points: 1000,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        metadata: { refereeId: 'user-3', refereeName: 'Amit' }
      }
    ])
  }, [userId])

  const simulateOrderPoints = () => {
    const amount = parseFloat(simulationAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid order amount')
      return
    }

    const points = calculateEarnedPoints(amount)
    const newActivity: PointsActivity = {
      id: `sim-${Date.now()}`,
      type: 'order',
      description: `Simulated order of ₹${amount}`,
      points,
      timestamp: new Date().toISOString(),
      metadata: { orderValue: amount, simulated: true }
    }

    setRecentEarnings(prev => [newActivity, ...prev])
    
    if (loyaltyUser) {
      setLoyaltyUser(prev => prev ? {
        ...prev,
        totalPoints: prev.totalPoints + points,
        availablePoints: prev.availablePoints + points
      } : null)
    }

    setSimulationAmount('')
    alert(`Earned ${points} points for ₹${amount} order!`)
  }

  const simulateActivity = (type: keyof typeof POINTS_EARNING_RULES, description: string) => {
    const points = POINTS_EARNING_RULES[type]
    const newActivity: PointsActivity = {
      id: `sim-${Date.now()}`,
      type: type === 'ORDER_COMPLETE' ? 'order' : 
           type === 'REVIEW_WRITTEN' ? 'review' :
           type === 'REFERRAL_SIGNUP' ? 'referral' :
           type === 'DAILY_LOGIN' ? 'daily' :
           type === 'SOCIAL_SHARE' ? 'social' : 'bonus',
      description,
      points,
      timestamp: new Date().toISOString(),
      metadata: { simulated: true, ruleType: type }
    }

    setRecentEarnings(prev => [newActivity, ...prev])
    
    if (loyaltyUser) {
      setLoyaltyUser(prev => prev ? {
        ...prev,
        totalPoints: prev.totalPoints + points,
        availablePoints: prev.availablePoints + points
      } : null)
    }

    alert(`Earned ${points} points for ${description}!`)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-blue-500" />
      case 'review': return <Star className="w-5 h-5 text-yellow-500" />
      case 'referral': return <Users className="w-5 h-5 text-green-500" />
      case 'daily': return <Calendar className="w-5 h-5 text-purple-500" />
      case 'social': return <TrendingUp className="w-5 h-5 text-pink-500" />
      case 'bonus': return <Gift className="w-5 h-5 text-orange-500" />
      default: return <Coins className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Points Engine</h1>
        <p className="text-gray-600">Track your points earning activities and see how to earn more</p>
      </div>

      {/* Points Overview */}
      {loyaltyUser && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{loyaltyUser.availablePoints.toLocaleString()}</h3>
              <p>Available Points</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{loyaltyUser.totalPoints.toLocaleString()}</h3>
              <p>Total Earned</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{loyaltyUser.tier.name}</h3>
              <p>Current Tier</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{loyaltyUser.referredUsers}</h3>
              <p>Friends Referred</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points Earning Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              How to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Complete Orders</p>
                    <p className="text-sm text-gray-500">₹100 spent = {POINTS_EARNING_RULES.ORDER_COMPLETE} points</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => simulateActivity('ORDER_COMPLETE', 'Order completion bonus')}
                >
                  Test
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Write Reviews</p>
                    <p className="text-sm text-gray-500">{POINTS_EARNING_RULES.REVIEW_WRITTEN} points per review</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => simulateActivity('REVIEW_WRITTEN', 'Review written')}
                >
                  Test
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Refer Friends</p>
                    <p className="text-sm text-gray-500">{POINTS_EARNING_RULES.REFERRAL_FIRST_ORDER} points when they order</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => simulateActivity('REFERRAL_FIRST_ORDER', 'Friend first order')}
                >
                  Test
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Daily Login</p>
                    <p className="text-sm text-gray-500">{POINTS_EARNING_RULES.DAILY_LOGIN} points per day</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => simulateActivity('DAILY_LOGIN', 'Daily login bonus')}
                >
                  Test
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="font-medium">Social Sharing</p>
                    <p className="text-sm text-gray-500">{POINTS_EARNING_RULES.SOCIAL_SHARE} points per share</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => simulateActivity('SOCIAL_SHARE', 'Social media share')}
                >
                  Test
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Special Occasions</p>
                    <p className="text-sm text-gray-500">{POINTS_EARNING_RULES.BIRTHDAY_BONUS} points on birthday</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => simulateActivity('BIRTHDAY_BONUS', 'Birthday bonus')}
                >
                  Test
                </Button>
              </div>
            </div>

            {/* Order Simulation */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Simulate Order Points</h4>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Order amount (₹)"
                  value={simulationAmount}
                  onChange={(e) => setSimulationAmount(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={simulateOrderPoints}>
                  Calculate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentEarnings.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      {(activity.metadata as { simulated?: boolean })?.simulated && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                          Simulated
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+{activity.points}</div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>
                </div>
              ))}
              
              {recentEarnings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Coins className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activities</p>
                  <p className="text-sm">Start shopping to earn points!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Multipliers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Bonus Point Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-bold">Weekend Bonus</h4>
              <p className="text-sm text-gray-600 mb-2">2x points on weekend orders</p>
              <p className="text-xs text-green-600">Active until Sunday</p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">📸</div>
              <h4 className="font-bold">Photo Reviews</h4>
              <p className="text-sm text-gray-600 mb-2">+25 extra points with photos</p>
              <p className="text-xs text-green-600">Always active</p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">🎂</div>
              <h4 className="font-bold">Birthday Month</h4>
              <p className="text-sm text-gray-600 mb-2">3x points all month long</p>
              <p className="text-xs text-gray-500">Set birthday in profile</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}