import type { LoyaltyUser, LoyaltyTier, LoyaltyTransaction, Reward, Badge, Referral, Challenge } from '../types/loyalty'

// Loyalty Tiers Configuration
export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Explorer',
    minPoints: 0,
    maxPoints: 999,
    color: '#CD7F32',
    icon: '🥉',
    benefits: [
      {
        id: 'bronze-1',
        type: 'cashback',
        title: '1% Cashback',
        description: 'Earn 1% cashback on all orders',
        value: 1,
        isActive: true
      },
      {
        id: 'bronze-2',
        type: 'freeDelivery',
        title: 'Free Delivery',
        description: 'Free delivery on orders above ₹500',
        value: 500,
        isActive: true
      }
    ]
  },
  {
    id: 'silver',
    name: 'Silver Shopper',
    minPoints: 1000,
    maxPoints: 4999,
    color: '#C0C0C0',
    icon: '🥈',
    benefits: [
      {
        id: 'silver-1',
        type: 'cashback',
        title: '2% Cashback',
        description: 'Earn 2% cashback on all orders',
        value: 2,
        isActive: true
      },
      {
        id: 'silver-2',
        type: 'freeDelivery',
        title: 'Free Delivery',
        description: 'Free delivery on orders above ₹300',
        value: 300,
        isActive: true
      },
      {
        id: 'silver-3',
        type: 'priority',
        title: 'Priority Support',
        description: 'Priority customer support',
        value: 1,
        isActive: true
      }
    ]
  },
  {
    id: 'gold',
    name: 'Gold VIP',
    minPoints: 5000,
    maxPoints: 14999,
    color: '#FFD700',
    icon: '🥇',
    benefits: [
      {
        id: 'gold-1',
        type: 'cashback',
        title: '3% Cashback',
        description: 'Earn 3% cashback on all orders',
        value: 3,
        isActive: true
      },
      {
        id: 'gold-2',
        type: 'freeDelivery',
        title: 'Always Free Delivery',
        description: 'Free delivery on all orders',
        value: 0,
        isActive: true
      },
      {
        id: 'gold-3',
        type: 'priority',
        title: 'VIP Support',
        description: 'Dedicated VIP customer support',
        value: 1,
        isActive: true
      },
      {
        id: 'gold-4',
        type: 'exclusive',
        title: 'Exclusive Deals',
        description: 'Access to exclusive deals and offers',
        value: 1,
        isActive: true
      }
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Elite',
    minPoints: 15000,
    maxPoints: 999999,
    color: '#E5E4E2',
    icon: '💎',
    benefits: [
      {
        id: 'platinum-1',
        type: 'cashback',
        title: '5% Cashback',
        description: 'Earn 5% cashback on all orders',
        value: 5,
        isActive: true
      },
      {
        id: 'platinum-2',
        type: 'freeDelivery',
        title: 'Premium Delivery',
        description: 'Free premium delivery on all orders',
        value: 0,
        isActive: true
      },
      {
        id: 'platinum-3',
        type: 'priority',
        title: 'Elite Support',
        description: 'Personal account manager',
        value: 1,
        isActive: true
      },
      {
        id: 'platinum-4',
        type: 'exclusive',
        title: 'Elite Access',
        description: 'Early access to new products and sales',
        value: 1,
        isActive: true
      },
      {
        id: 'platinum-5',
        type: 'discount',
        title: 'Elite Discount',
        description: 'Additional 10% discount on premium brands',
        value: 10,
        isActive: true
      }
    ]
  }
]

// Points earning rules
export const POINTS_EARNING_RULES = {
  ORDER_COMPLETE: 10, // Points per ₹100 spent
  REVIEW_WRITTEN: 50,
  PHOTO_REVIEW: 25,
  FIRST_ORDER: 200,
  REFERRAL_SIGNUP: 500,
  REFERRAL_FIRST_ORDER: 1000,
  DAILY_LOGIN: 10,
  SOCIAL_SHARE: 25,
  BIRTHDAY_BONUS: 500,
  MONTHLY_CHALLENGE: 1000
}

// Mock Loyalty Users
export const mockLoyaltyUsers: LoyaltyUser[] = [
  {
    id: 'luser-1',
    userId: 'user-1',
    totalPoints: 2580,
    availablePoints: 1580,
    tier: LOYALTY_TIERS[1], // Silver
    joinDate: '2024-03-15',
    lastActivity: '2024-12-26',
    lifetimeSpent: 15800,
    referralCode: 'PRIYA2580',
    referredUsers: 3
  },
  {
    id: 'luser-2',
    userId: 'user-2',
    totalPoints: 7250,
    availablePoints: 3250,
    tier: LOYALTY_TIERS[2], // Gold
    joinDate: '2024-01-20',
    lastActivity: '2024-12-25',
    lifetimeSpent: 45600,
    referralCode: 'RAHUL7250',
    referredUsers: 8
  },
  {
    id: 'luser-3',
    userId: 'user-3',
    totalPoints: 1500,
    availablePoints: 1500,
    tier: LOYALTY_TIERS[0], // Bronze
    joinDate: '2024-06-10',
    lastActivity: '2024-12-20',
    lifetimeSpent: 8500,
    referralCode: 'AMIT1500',
    referredUsers: 1
  },
  {
    id: 'luser-4',
    userId: 'user-4',
    totalPoints: 18500,
    availablePoints: 8500,
    tier: LOYALTY_TIERS[3], // Platinum
    joinDate: '2023-11-05',
    lastActivity: '2024-12-27',
    lifetimeSpent: 89200,
    referralCode: 'KIRAN18500',
    referredUsers: 12
  },
  {
    id: 'luser-5',
    userId: 'user-5',
    totalPoints: 450,
    availablePoints: 450,
    tier: LOYALTY_TIERS[0], // Bronze
    joinDate: '2024-09-18',
    lastActivity: '2024-12-15',
    lifetimeSpent: 3200,
    referralCode: 'NEHA450',
    referredUsers: 0
  },
  {
    id: 'luser-6',
    userId: 'user-6',
    totalPoints: 12500,
    availablePoints: 7500,
    tier: LOYALTY_TIERS[2], // Gold
    joinDate: '2024-02-28',
    lastActivity: '2024-12-24',
    lifetimeSpent: 67400,
    referralCode: 'VIKASH12500',
    referredUsers: 5
  },
  {
    id: 'luser-7',
    userId: 'user-7',
    totalPoints: 850,
    availablePoints: 350,
    tier: LOYALTY_TIERS[0], // Bronze
    joinDate: '2024-07-22',
    lastActivity: '2024-12-10',
    lifetimeSpent: 5600,
    referralCode: 'POOJA850',
    referredUsers: 2
  },
  {
    id: 'luser-8',
    userId: 'user-8',
    totalPoints: 5500,
    availablePoints: 2000,
    tier: LOYALTY_TIERS[2], // Gold
    joinDate: '2024-04-03',
    lastActivity: '2024-12-22',
    lifetimeSpent: 32100,
    referralCode: 'SUNITA5500',
    referredUsers: 4
  },
  {
    id: 'luser-9',
    userId: 'user-9',
    totalPoints: 3200,
    availablePoints: 2200,
    tier: LOYALTY_TIERS[1], // Silver
    joinDate: '2024-05-12',
    lastActivity: '2024-12-18',
    lifetimeSpent: 19800,
    referralCode: 'VIVEK3200',
    referredUsers: 2
  },
  {
    id: 'luser-10',
    userId: 'user-10',
    totalPoints: 21000,
    availablePoints: 11000,
    tier: LOYALTY_TIERS[3], // Platinum
    joinDate: '2023-10-15',
    lastActivity: '2024-12-27',
    lifetimeSpent: 125000,
    referralCode: 'DIVYA21000',
    referredUsers: 15
  },
  {
    id: 'luser-11',
    userId: 'user-11',
    totalPoints: 950,
    availablePoints: 950,
    tier: LOYALTY_TIERS[0], // Bronze
    joinDate: '2024-08-07',
    lastActivity: '2024-12-05',
    lifetimeSpent: 6700,
    referralCode: 'ARJUN950',
    referredUsers: 1
  },
  {
    id: 'luser-12',
    userId: 'user-12',
    totalPoints: 16800,
    availablePoints: 11800,
    tier: LOYALTY_TIERS[3], // Platinum
    joinDate: '2024-01-08',
    lastActivity: '2024-12-26',
    lifetimeSpent: 98700,
    referralCode: 'MEERA16800',
    referredUsers: 10
  }
]

// Mock Rewards Catalog
export const mockRewards: Reward[] = [
  {
    id: 'reward-1',
    title: '₹100 Off Next Order',
    description: 'Get ₹100 discount on your next order of ₹500 or more',
    category: 'discount',
    pointsCost: 500,
    value: 100,
    maxRedemptions: 1000,
    currentRedemptions: 245,
    validUntil: '2025-03-31',
    isActive: true,
    image: '/rewards/discount-100.jpg',
    terms: ['Valid on orders above ₹500', 'Cannot be combined with other offers', 'Valid for 30 days'],
    eligibleTiers: ['bronze', 'silver', 'gold', 'platinum']
  },
  {
    id: 'reward-2',
    title: 'Free Premium Delivery',
    description: 'Get free premium delivery for next 5 orders',
    category: 'discount',
    pointsCost: 300,
    value: 500,
    maxRedemptions: 500,
    currentRedemptions: 89,
    validUntil: '2025-02-28',
    isActive: true,
    image: '/rewards/free-delivery.jpg',
    terms: ['Valid for next 5 orders', 'Applies to premium delivery only', 'Valid for 60 days'],
    eligibleTiers: ['silver', 'gold', 'platinum']
  },
  {
    id: 'reward-3',
    title: '₹50 Cashback',
    description: 'Get ₹50 cashback in your wallet',
    category: 'cashback',
    pointsCost: 250,
    value: 50,
    currentRedemptions: 567,
    validUntil: '2025-12-31',
    isActive: true,
    image: '/rewards/cashback-50.jpg',
    terms: ['Instant cashback to wallet', 'No minimum order value', 'Valid immediately'],
    eligibleTiers: ['bronze', 'silver', 'gold', 'platinum']
  },
  {
    id: 'reward-4',
    title: 'Premium Brand 20% Off',
    description: 'Get 20% off on premium brand products',
    category: 'discount',
    pointsCost: 800,
    value: 200,
    maxRedemptions: 200,
    currentRedemptions: 34,
    validUntil: '2025-01-31',
    isActive: true,
    image: '/rewards/premium-discount.jpg',
    terms: ['Valid on premium brands only', 'Maximum discount ₹500', 'Valid for 15 days'],
    eligibleTiers: ['gold', 'platinum']
  },
  {
    id: 'reward-5',
    title: 'Plant a Tree Donation',
    description: 'Donate to plant a tree in your name',
    category: 'charity',
    pointsCost: 100,
    value: 50,
    currentRedemptions: 1234,
    validUntil: '2025-12-31',
    isActive: true,
    image: '/rewards/plant-tree.jpg',
    terms: ['Certificate will be emailed', 'Tree planted within 30 days', 'Location updates provided'],
    eligibleTiers: ['bronze', 'silver', 'gold', 'platinum']
  }
]

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'First Order',
    description: 'Completed your first order on Vendorly',
    icon: '🎉',
    color: '#4CAF50',
    category: 'shopping',
    requirements: [
      { type: 'orders', value: 1, description: 'Complete 1 order' }
    ],
    isUnlocked: true,
    unlockedAt: '2024-03-15',
    rarity: 'common'
  },
  {
    id: 'badge-2',
    name: 'Review Master',
    description: 'Written 10 helpful reviews',
    icon: '⭐',
    color: '#FF9800',
    category: 'social',
    requirements: [
      { type: 'reviews', value: 10, description: 'Write 10 reviews' }
    ],
    isUnlocked: true,
    unlockedAt: '2024-05-22',
    rarity: 'rare'
  },
  {
    id: 'badge-3',
    name: 'Big Spender',
    description: 'Spent over ₹10,000 on Vendorly',
    icon: '💰',
    color: '#9C27B0',
    category: 'shopping',
    requirements: [
      { type: 'spent', value: 10000, description: 'Spend ₹10,000 total' }
    ],
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'badge-4',
    name: 'Referral Champion',
    description: 'Referred 5 friends who placed orders',
    icon: '👥',
    color: '#2196F3',
    category: 'social',
    requirements: [
      { type: 'referrals', value: 5, description: 'Refer 5 friends who order' }
    ],
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'badge-5',
    name: 'Loyalty Legend',
    description: 'Reached Platinum tier',
    icon: '👑',
    color: '#E5E4E2',
    category: 'loyalty',
    requirements: [
      { type: 'points', value: 15000, description: 'Earn 15,000 points' }
    ],
    isUnlocked: false,
    rarity: 'legendary'
  }
]

// Mock Challenges
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Weekend Warrior',
    description: 'Place 3 orders this weekend and earn bonus points',
    type: 'weekly',
    category: 'shopping',
    requirements: [
      { type: 'orders', target: 3, description: 'Place 3 orders this weekend' }
    ],
    rewards: [
      { type: 'points', value: 300, description: '300 bonus points' },
      { type: 'badge', value: 'weekend-warrior', description: 'Weekend Warrior badge' }
    ],
    startDate: '2024-12-21',
    endDate: '2024-12-22',
    isActive: true,
    participants: 1247,
    completions: 89
  },
  {
    id: 'challenge-2',
    title: 'Review Streak',
    description: 'Write reviews for 5 orders in a row',
    type: 'monthly',
    category: 'social',
    requirements: [
      { type: 'reviews', target: 5, description: 'Write 5 consecutive order reviews' }
    ],
    rewards: [
      { type: 'points', value: 500, description: '500 points' },
      { type: 'discount', value: '10%', description: '10% off next order' }
    ],
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    isActive: true,
    participants: 2156,
    completions: 234
  },
  {
    id: 'challenge-3',
    title: 'New Year Resolution',
    description: 'Try 10 different vendors this month',
    type: 'monthly',
    category: 'engagement',
    requirements: [
      { type: 'vendors', target: 10, description: 'Order from 10 different vendors' }
    ],
    rewards: [
      { type: 'points', value: 1000, description: '1000 points' },
      { type: 'freeDelivery', value: '5', description: 'Free delivery for 5 orders' }
    ],
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    isActive: true,
    participants: 3420,
    completions: 12
  }
]

// Mock Loyalty Transactions
export const mockLoyaltyTransactions: LoyaltyTransaction[] = [
  {
    id: 'ltrans-1',
    userId: 'user-1',
    type: 'earn',
    points: 158,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-001 completed',
    orderId: 'ORD-2024-001',
    createdAt: '2024-12-26T10:30:00Z'
  },
  {
    id: 'ltrans-2',
    userId: 'user-1',
    type: 'earn',
    points: 50,
    reason: 'REVIEW_WRITTEN',
    description: 'Review written for Biryani order',
    orderId: 'ORD-2024-001',
    createdAt: '2024-12-26T15:45:00Z'
  },
  {
    id: 'ltrans-3',
    userId: 'user-1',
    type: 'redeem',
    points: -500,
    reason: 'REWARD_REDEEMED',
    description: '₹100 discount voucher redeemed',
    rewardId: 'reward-1',
    createdAt: '2024-12-25T09:15:00Z'
  },
  {
    id: 'ltrans-4',
    userId: 'user-1',
    type: 'bonus',
    points: 300,
    reason: 'CHALLENGE_COMPLETED',
    description: 'Weekend Warrior challenge completed',
    createdAt: '2024-12-22T20:00:00Z'
  },
  {
    id: 'ltrans-5',
    userId: 'user-2',
    type: 'earn',
    points: 245,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-002 completed',
    orderId: 'ORD-2024-002',
    createdAt: '2024-12-25T11:20:00Z'
  },
  {
    id: 'ltrans-6',
    userId: 'user-2',
    type: 'redeem',
    points: -1000,
    reason: 'REWARD_REDEEMED',
    description: '₹500 cashback redeemed',
    rewardId: 'reward-3',
    createdAt: '2024-12-24T14:30:00Z'
  },
  {
    id: 'ltrans-7',
    userId: 'user-3',
    type: 'earn',
    points: 89,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-003 completed',
    orderId: 'ORD-2024-003',
    createdAt: '2024-12-20T16:45:00Z'
  },
  {
    id: 'ltrans-8',
    userId: 'user-4',
    type: 'earn',
    points: 320,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-004 completed',
    orderId: 'ORD-2024-004',
    createdAt: '2024-12-27T09:15:00Z'
  },
  {
    id: 'ltrans-9',
    userId: 'user-4',
    type: 'redeem',
    points: -800,
    reason: 'REWARD_REDEEMED',
    description: 'Premium brand 20% discount redeemed',
    rewardId: 'reward-4',
    createdAt: '2024-12-26T12:30:00Z'
  },
  {
    id: 'ltrans-10',
    userId: 'user-5',
    type: 'earn',
    points: 45,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-005 completed',
    orderId: 'ORD-2024-005',
    createdAt: '2024-12-15T13:20:00Z'
  },
  {
    id: 'ltrans-11',
    userId: 'user-6',
    type: 'earn',
    points: 560,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-006 completed',
    orderId: 'ORD-2024-006',
    createdAt: '2024-12-24T17:45:00Z'
  },
  {
    id: 'ltrans-12',
    userId: 'user-6',
    type: 'redeem',
    points: -300,
    reason: 'REWARD_REDEEMED',
    description: 'Free Premium Delivery voucher redeemed',
    rewardId: 'reward-2',
    createdAt: '2024-12-23T10:15:00Z'
  },
  {
    id: 'ltrans-13',
    userId: 'user-7',
    type: 'earn',
    points: 56,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-007 completed',
    orderId: 'ORD-2024-007',
    createdAt: '2024-12-10T14:30:00Z'
  },
  {
    id: 'ltrans-14',
    userId: 'user-8',
    type: 'earn',
    points: 320,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-008 completed',
    orderId: 'ORD-2024-008',
    createdAt: '2024-12-22T18:20:00Z'
  },
  {
    id: 'ltrans-15',
    userId: 'user-8',
    type: 'redeem',
    points: -250,
    reason: 'REWARD_REDEEMED',
    description: '₹50 cashback redeemed',
    rewardId: 'reward-3',
    createdAt: '2024-12-21T11:45:00Z'
  },
  {
    id: 'ltrans-16',
    userId: 'user-9',
    type: 'earn',
    points: 198,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-009 completed',
    orderId: 'ORD-2024-009',
    createdAt: '2024-12-18T15:10:00Z'
  },
  {
    id: 'ltrans-17',
    userId: 'user-10',
    type: 'earn',
    points: 1250,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-010 completed',
    orderId: 'ORD-2024-010',
    createdAt: '2024-12-27T20:30:00Z'
  },
  {
    id: 'ltrans-18',
    userId: 'user-10',
    type: 'redeem',
    points: -500,
    reason: 'REWARD_REDEEMED',
    description: '₹100 discount voucher redeemed',
    rewardId: 'reward-1',
    createdAt: '2024-12-26T16:00:00Z'
  },
  {
    id: 'ltrans-19',
    userId: 'user-11',
    type: 'earn',
    points: 67,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-011 completed',
    orderId: 'ORD-2024-011',
    createdAt: '2024-12-05T12:15:00Z'
  },
  {
    id: 'ltrans-20',
    userId: 'user-12',
    type: 'earn',
    points: 987,
    reason: 'ORDER_COMPLETE',
    description: 'Order #ORD-2024-012 completed',
    orderId: 'ORD-2024-012',
    createdAt: '2024-12-26T19:45:00Z'
  },
  {
    id: 'ltrans-21',
    userId: 'user-12',
    type: 'redeem',
    points: -100,
    reason: 'REWARD_REDEEMED',
    description: 'Plant a tree donation',
    rewardId: 'reward-5',
    createdAt: '2024-12-25T13:30:00Z'
  }
]

// Mock Referrals
export const mockReferrals: Referral[] = [
  {
    id: 'ref-1',
    referrerId: 'user-1',
    refereeId: 'user-3',
    refereeEmail: 'amit@example.com',
    status: 'rewarded',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-11-15T10:00:00Z',
    qualifiedAt: '2024-11-16T14:30:00Z',
    rewardedAt: '2024-11-16T14:35:00Z'
  },
  {
    id: 'ref-2',
    referrerId: 'user-1',
    refereeEmail: 'neha@example.com',
    status: 'pending',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-12-20T16:45:00Z'
  },
  {
    id: 'ref-3',
    referrerId: 'user-2',
    refereeId: 'user-4',
    refereePhone: '+91-9876543210',
    status: 'qualified',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-12-18T11:20:00Z',
    qualifiedAt: '2024-12-19T09:45:00Z'
  },
  {
    id: 'ref-4',
    referrerId: 'user-4',
    refereeId: 'user-13',
    refereeEmail: 'rajesh@example.com',
    status: 'rewarded',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-10-10T14:20:00Z',
    qualifiedAt: '2024-10-12T11:30:00Z',
    rewardedAt: '2024-10-12T11:35:00Z'
  },
  {
    id: 'ref-5',
    referrerId: 'user-6',
    refereeId: 'user-14',
    refereeEmail: 'shilpa@example.com',
    status: 'rewarded',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-11-25T09:15:00Z',
    qualifiedAt: '2024-11-26T16:45:00Z',
    rewardedAt: '2024-11-26T16:50:00Z'
  },
  {
    id: 'ref-6',
    referrerId: 'user-8',
    refereeId: 'user-15',
    refereePhone: '+91-9876543211',
    status: 'pending',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-12-22T13:30:00Z'
  },
  {
    id: 'ref-7',
    referrerId: 'user-10',
    refereeId: 'user-16',
    refereeEmail: 'tanvi@example.com',
    status: 'rewarded',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-09-05T17:45:00Z',
    qualifiedAt: '2024-09-06T10:15:00Z',
    rewardedAt: '2024-09-06T10:20:00Z'
  },
  {
    id: 'ref-8',
    referrerId: 'user-12',
    refereeId: 'user-17',
    refereePhone: '+91-9876543212',
    status: 'qualified',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-12-15T12:00:00Z',
    qualifiedAt: '2024-12-16T14:20:00Z'
  },
  {
    id: 'ref-9',
    referrerId: 'user-3',
    refereeId: 'user-18',
    refereeEmail: 'karan@example.com',
    status: 'pending',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-12-18T15:30:00Z'
  },
  {
    id: 'ref-10',
    referrerId: 'user-5',
    refereeId: 'user-19',
    refereeEmail: 'nishu@example.com',
    status: 'rewarded',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-11-30T11:45:00Z',
    qualifiedAt: '2024-12-01T09:30:00Z',
    rewardedAt: '2024-12-01T09:35:00Z'
  },
  {
    id: 'ref-11',
    referrerId: 'user-7',
    refereeId: 'user-20',
    refereePhone: '+91-9876543213',
    status: 'pending',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-12-21T16:20:00Z'
  },
  {
    id: 'ref-12',
    referrerId: 'user-9',
    refereeId: 'user-21',
    refereeEmail: 'alok@example.com',
    status: 'rewarded',
    referrerReward: 1000,
    refereeReward: 500,
    createdAt: '2024-10-28T10:10:00Z',
    qualifiedAt: '2024-10-29T13:45:00Z',
    rewardedAt: '2024-10-29T13:50:00Z'
  }
]

// Utility Functions
export const calculateTier = (totalPoints: number): LoyaltyTier => {
  return LOYALTY_TIERS.find(tier => 
    totalPoints >= tier.minPoints && totalPoints <= tier.maxPoints
  ) || LOYALTY_TIERS[0]
}

export const getPointsToNextTier = (currentPoints: number): number => {
  const currentTier = calculateTier(currentPoints)
  const nextTierIndex = LOYALTY_TIERS.findIndex(tier => tier.id === currentTier.id) + 1
  
  if (nextTierIndex >= LOYALTY_TIERS.length) {
    return 0 // Already at highest tier
  }
  
  return LOYALTY_TIERS[nextTierIndex].minPoints - currentPoints
}

export const calculateEarnedPoints = (orderValue: number): number => {
  return Math.floor(orderValue / 100) * POINTS_EARNING_RULES.ORDER_COMPLETE
}

export const generateReferralCode = (name: string, points: number): string => {
  const namePrefix = name.toUpperCase().substring(0, 4)
  return `${namePrefix}${points}`
}