import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal } from '../ui'
import type { LoyaltyUser, LoyaltyTransaction, Reward, Badge, Referral } from '../../types/loyalty'
import { mockLoyaltyUsers, mockLoyaltyTransactions, mockRewards, mockBadges, mockReferrals, calculateTier, getPointsToNextTier } from '../../data/loyaltyData'
import { Gift, Trophy, Users, Coins, Share2, Copy, Crown, TrendingUp, CheckCircle } from 'lucide-react'

interface LoyaltyDashboardProps {
  userId: string
}

export const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({ userId }) => {
  const [loyaltyUser, setLoyaltyUser] = useState<LoyaltyUser | null>(null)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'badges' | 'referrals'>('overview')
  const [showRedeemModal, setShowRedeemModal] = useState<string | null>(null)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [referralEmail, setReferralEmail] = useState('')
  const [referralPhone, setReferralPhone] = useState('')

  useEffect(() => {
    // Load loyalty data
    const user = mockLoyaltyUsers.find(u => u.userId === userId)
    if (user) {
      setLoyaltyUser(user)
      setTransactions(mockLoyaltyTransactions.filter(t => t.userId === userId))
      setReferrals(mockReferrals.filter(r => r.referrerId === userId))
    }
    setRewards(mockRewards.filter(r => r.isActive))
    setBadges(mockBadges)
  }, [userId])

  const handleRedeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (!reward || !loyaltyUser) return

    if (loyaltyUser.availablePoints >= reward.pointsCost) {
      // Create redemption transaction
      const newTransaction: LoyaltyTransaction = {
        id: `ltrans-${Date.now()}`,
        userId: loyaltyUser.userId,
        type: 'redeem',
        points: -reward.pointsCost,
        reason: 'REWARD_REDEEMED',
        description: `${reward.title} redeemed`,
        rewardId: reward.id,
        createdAt: new Date().toISOString()
      }

      // Update user points
      const updatedUser = {
        ...loyaltyUser,
        availablePoints: loyaltyUser.availablePoints - reward.pointsCost
      }

      setLoyaltyUser(updatedUser)
      setTransactions(prev => [newTransaction, ...prev])
      setShowRedeemModal(null)

      alert(`${reward.title} redeemed successfully! Check your rewards section.`)
    }
  }

  const handleReferralInvite = () => {
    if (!loyaltyUser || (!referralEmail && !referralPhone)) return

    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      referrerId: loyaltyUser.userId,
      refereeEmail: referralEmail || undefined,
      refereePhone: referralPhone || undefined,
      status: 'pending',
      referrerReward: 1000,
      refereeReward: 500,
      createdAt: new Date().toISOString()
    }

    setReferrals(prev => [newReferral, ...prev])
    setReferralEmail('')
    setReferralPhone('')
    setShowReferralModal(false)

    alert('Referral invitation sent successfully!')
  }

  const copyReferralCode = () => {
    if (loyaltyUser) {
      navigator.clipboard.writeText(loyaltyUser.referralCode)
      alert('Referral code copied to clipboard!')
    }
  }

  if (!loyaltyUser) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Join Vendorly Loyalty Program</h2>
            <p className="text-gray-600 mb-6">
              Earn points on every order and unlock exclusive rewards!
            </p>
            <Button onClick={() => setLoyaltyUser(mockLoyaltyUsers[0])}>
              Join Now - It's Free!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentTier = calculateTier(loyaltyUser.totalPoints)
  const pointsToNext = getPointsToNextTier(loyaltyUser.totalPoints)
  const unlockedBadges = badges.filter(b => b.isUnlocked)
  const availableBadges = badges.filter(b => !b.isUnlocked)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Dashboard</h1>
        <p className="text-gray-600">Earn points, unlock rewards, and level up your shopping experience</p>
      </div>

      {/* Tier Status Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{currentTier.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold">{currentTier.name}</h2>
                  <p className="text-purple-100">Member since {new Date(loyaltyUser.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-4">
                <div>
                  <p className="text-purple-100">Available Points</p>
                  <p className="text-2xl font-bold">{loyaltyUser.availablePoints.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-purple-100">Total Earned</p>
                  <p className="text-2xl font-bold">{loyaltyUser.totalPoints.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-purple-100">Lifetime Spent</p>
                  <p className="text-2xl font-bold">₹{loyaltyUser.lifetimeSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Crown className="w-16 h-16 mx-auto mb-2" />
              {pointsToNext > 0 ? (
                <div>
                  <p className="text-purple-100">Points to next tier</p>
                  <p className="text-xl font-bold">{pointsToNext.toLocaleString()}</p>
                </div>
              ) : (
                <div>
                  <p className="text-purple-100">Highest Tier</p>
                  <p className="text-xl font-bold">Achieved!</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === 'overview' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === 'rewards' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Gift className="w-4 h-4 inline mr-2" />
          Rewards ({rewards.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === 'badges' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-2" />
          Badges ({unlockedBadges.length}/{badges.length})
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === 'referrals' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Referrals ({referrals.length})
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`font-bold ${
                      transaction.type === 'earn' || transaction.type === 'bonus' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'earn' || transaction.type === 'bonus' ? '+' : ''}
                      {transaction.points}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tier Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Your Tier Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentTier.benefits.map((benefit) => (
                  <div key={benefit.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">{benefit.title}</p>
                      <p className="text-sm text-gray-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{reward.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{reward.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Points Required</span>
                    <span className="font-bold text-primary">{reward.pointsCost.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Value</span>
                    <span className="font-bold">₹{reward.value}</span>
                  </div>

                  <Button
                    onClick={() => setShowRedeemModal(reward.id)}
                    disabled={loyaltyUser.availablePoints < reward.pointsCost}
                    className="w-full"
                  >
                    {loyaltyUser.availablePoints >= reward.pointsCost ? 'Redeem Now' : 'Insufficient Points'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* Unlocked Badges */}
          <div>
            <h3 className="text-xl font-bold mb-4">Your Badges ({unlockedBadges.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {unlockedBadges.map((badge) => (
                <Card key={badge.id} className="text-center p-4 bg-gradient-to-b from-yellow-50 to-yellow-100">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="font-bold text-sm">{badge.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      badge.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                      badge.rarity === 'epic' ? 'bg-orange-100 text-orange-800' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {badge.rarity}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Badges */}
          <div>
            <h3 className="text-xl font-bold mb-4">Available Badges ({availableBadges.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBadges.map((badge) => (
                <Card key={badge.id} className="p-4 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                      <div className="mt-2">
                        {badge.requirements.map((req, index) => (
                          <p key={index} className="text-xs text-gray-500">
                            • {req.description}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{loyaltyUser.referredUsers}</h3>
                <p className="text-gray-600">Friends Referred</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Coins className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{referrals.filter(r => r.status === 'rewarded').length * 1000}</h3>
                <p className="text-gray-600">Points Earned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Share2 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{loyaltyUser.referralCode}</h3>
                <p className="text-gray-600">Your Referral Code</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyReferralCode}
                  className="mt-2"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Invite Friends */}
          <Card>
            <CardHeader>
              <CardTitle>Invite Friends & Earn Rewards</CardTitle>
              <p className="text-gray-600">
                Invite friends and earn 1000 points when they place their first order. They get 500 points too!
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowReferralModal(true)}>
                <Share2 className="w-4 h-4 mr-2" />
                Invite Friends
              </Button>
            </CardContent>
          </Card>

          {/* Referral History */}
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {referral.refereeEmail || referral.refereePhone || 'Pending'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Invited on {new Date(referral.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        referral.status === 'rewarded' ? 'bg-green-100 text-green-800' :
                        referral.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                        referral.status === 'registered' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {referral.status === 'rewarded' ? 'Rewarded' :
                         referral.status === 'qualified' ? 'Qualified' :
                         referral.status === 'registered' ? 'Registered' :
                         'Pending'}
                      </div>
                      {referral.status === 'rewarded' && (
                        <p className="text-sm text-green-600 mt-1">
                          +{referral.referrerReward} points
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Redeem Reward Modal */}
      {showRedeemModal && (
        <Modal isOpen={!!showRedeemModal} onClose={() => setShowRedeemModal(null)}>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Redeem Reward</h3>
            {(() => {
              const reward = rewards.find(r => r.id === showRedeemModal)
              if (!reward) return null
              
              return (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-lg">{reward.title}</h4>
                    <p className="text-gray-600">{reward.description}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Points Required:</span>
                      <span className="font-bold">{reward.pointsCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Available Points:</span>
                      <span className="font-bold">{loyaltyUser.availablePoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Points After Redemption:</span>
                      <span className="font-bold">
                        {(loyaltyUser.availablePoints - reward.pointsCost).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h5 className="font-medium">Terms & Conditions:</h5>
                    {reward.terms.map((term, index) => (
                      <p key={index} className="text-sm text-gray-600">• {term}</p>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowRedeemModal(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleRedeemReward(reward.id)}
                      className="flex-1"
                    >
                      Confirm Redemption
                    </Button>
                  </div>
                </div>
              )
            })()}
          </div>
        </Modal>
      )}

      {/* Referral Modal */}
      {showReferralModal && (
        <Modal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)}>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Invite Friends</h3>
            <p className="text-gray-600 mb-6">
              Invite your friends to join Vendorly. You'll earn 1000 points when they place their first order!
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                />
              </div>
              
              <div className="text-center text-gray-500">or</div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+91-9876543210"
                  value={referralPhone}
                  onChange={(e) => setReferralPhone(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowReferralModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReferralInvite}
                disabled={!referralEmail && !referralPhone}
                className="flex-1"
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}