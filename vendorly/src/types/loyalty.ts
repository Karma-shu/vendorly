// Loyalty Program Types
export interface LoyaltyUser {
  id: string
  userId: string
  totalPoints: number
  availablePoints: number
  tier: LoyaltyTier
  joinDate: string
  lastActivity: string
  lifetimeSpent: number
  referralCode: string
  referredUsers: number
}

export interface LoyaltyTier {
  id: string
  name: string
  minPoints: number
  maxPoints: number
  benefits: TierBenefit[]
  color: string
  icon: string
}

export interface TierBenefit {
  id: string
  type: 'discount' | 'cashback' | 'freeDelivery' | 'priority' | 'exclusive'
  title: string
  description: string
  value: number
  isActive: boolean
}

export interface LoyaltyTransaction {
  id: string
  userId: string
  type: 'earn' | 'redeem' | 'expire' | 'bonus'
  points: number
  reason: string
  description: string
  orderId?: string
  rewardId?: string
  createdAt: string
  expiresAt?: string
}

export interface Reward {
  id: string
  title: string
  description: string
  category: 'discount' | 'cashback' | 'product' | 'experience' | 'charity'
  pointsCost: number
  value: number
  maxRedemptions?: number
  currentRedemptions: number
  validUntil: string
  isActive: boolean
  image: string
  terms: string[]
  eligibleTiers: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'shopping' | 'social' | 'loyalty' | 'achievement'
  requirements: BadgeRequirement[]
  isUnlocked: boolean
  unlockedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface BadgeRequirement {
  type: 'orders' | 'spent' | 'reviews' | 'referrals' | 'points' | 'consecutive'
  value: number
  description: string
}

export interface Referral {
  id: string
  referrerId: string
  refereeId?: string
  refereeEmail?: string
  refereePhone?: string
  status: 'pending' | 'registered' | 'qualified' | 'rewarded'
  referrerReward: number
  refereeReward: number
  createdAt: string
  qualifiedAt?: string
  rewardedAt?: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  category: 'shopping' | 'social' | 'engagement'
  requirements: ChallengeRequirement[]
  rewards: ChallengeReward[]
  startDate: string
  endDate: string
  isActive: boolean
  participants: number
  completions: number
}

export interface ChallengeRequirement {
  type: 'orders' | 'spent' | 'categories' | 'vendors' | 'reviews' | 'referrals'
  target: number
  description: string
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'discount' | 'freeDelivery'
  value: number | string
  description: string
}

export interface LoyaltyStats {
  totalUsers: number
  activeUsers: number
  totalPointsIssued: number
  totalPointsRedeemed: number
  averagePointsPerUser: number
  topSpenders: LoyaltyUser[]
  recentActivity: LoyaltyTransaction[]
  tierDistribution: {
    tier: string
    count: number
    percentage: number
  }[]
}