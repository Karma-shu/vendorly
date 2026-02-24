import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui'
import type { Challenge, LoyaltyUser } from '../../types/loyalty'
import { mockChallenges, mockLoyaltyUsers } from '../../data/loyaltyData'
import { Trophy, Users, Calendar, Target, Gift, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface ChallengeSystemProps {
  userId: string
}

interface UserProgress {
  challengeId: string
  progress: number
  completed: boolean
  completedAt?: string
}

export const ChallengeSystem: React.FC<ChallengeSystemProps> = ({ userId }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loyaltyUser, setLoyaltyUser] = useState<LoyaltyUser | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'special'>('all')

  useEffect(() => {
    // Load challenges and user data
    setChallenges(mockChallenges.filter(c => c.isActive))
    setLoyaltyUser(mockLoyaltyUsers.find(u => u.userId === userId) || null)
    
    // Mock user progress for demonstration
    setUserProgress([
      { challengeId: 'challenge-1', progress: 2, completed: false },
      { challengeId: 'challenge-2', progress: 3, completed: false },
      { challengeId: 'challenge-3', progress: 4, completed: false }
    ])
  }, [userId])

  const getProgress = (challengeId: string) => {
    return userProgress.find(p => p.challengeId === challengeId) || { challengeId, progress: 0, completed: false }
  }

  const getProgressPercentage = (challenge: Challenge, progress: UserProgress) => {
    const target = challenge.requirements[0]?.target || 1
    return Math.min((progress.progress / target) * 100, 100)
  }

  const handleJoinChallenge = (challengeId: string) => {
    const existingProgress = userProgress.find(p => p.challengeId === challengeId)
    if (!existingProgress) {
      setUserProgress(prev => [...prev, { challengeId, progress: 0, completed: false }])
      alert('Challenge joined! Start working towards your goal.')
    }
  }

  const filteredChallenges = challenges.filter(challenge => 
    activeFilter === 'all' || challenge.type === activeFilter
  )

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Calendar className="w-5 h-5" />
      case 'weekly': return <TrendingUp className="w-5 h-5" />
      case 'monthly': return <Target className="w-5 h-5" />
      case 'special': return <Trophy className="w-5 h-5" />
      default: return <Gift className="w-5 h-5" />
    }
  }

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500'
      case 'weekly': return 'bg-green-500'
      case 'monthly': return 'bg-purple-500'
      case 'special': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Challenges & Rewards</h1>
        <p className="text-gray-600">Complete challenges to earn extra points and unlock special badges</p>
      </div>

      {/* Stats Overview */}
      {loyaltyUser && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{userProgress.filter(p => p.completed).length}</h3>
              <p className="text-gray-600">Completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{userProgress.filter(p => !p.completed).length}</h3>
              <p className="text-gray-600">In Progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{filteredChallenges.length}</h3>
              <p className="text-gray-600">Available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{userProgress.filter(p => p.completed).length * 500}</h3>
              <p className="text-gray-600">Points Earned</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {(['all', 'daily', 'weekly', 'monthly', 'special'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 border-b-2 font-medium capitalize ${
              activeFilter === filter 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {getChallengeIcon(filter)}
            <span className="ml-2">{filter}</span>
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => {
          const progress = getProgress(challenge.id)
          const progressPercentage = getProgressPercentage(challenge, progress)
          const isJoined = userProgress.some(p => p.challengeId === challenge.id)
          const timeRemaining = getTimeRemaining(challenge.endDate)
          
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getChallengeColor(challenge.type)} text-white`}>
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-sm text-gray-500 capitalize">{challenge.type} Challenge</p>
                    </div>
                  </div>
                  {progress.completed && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600">{challenge.description}</p>
                
                {/* Requirements */}
                <div>
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  {challenge.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{req.description}</span>
                      <span className="font-medium">
                        {isJoined ? `${progress.progress}/${req.target}` : `0/${req.target}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                {isJoined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Rewards */}
                <div>
                  <h4 className="font-medium mb-2">Rewards:</h4>
                  <div className="space-y-1">
                    {challenge.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4 text-primary" />
                        <span>{reward.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Challenge Stats */}
                <div className="flex justify-between text-sm text-gray-500 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants.toLocaleString()} joined</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{timeRemaining}</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="pt-2">
                  {progress.completed ? (
                    <Button disabled className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </Button>
                  ) : isJoined ? (
                    <Button variant="outline" className="w-full" disabled>
                      <Clock className="w-4 h-4 mr-2" />
                      In Progress
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="w-full"
                    >
                      Join Challenge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No Challenges Message */}
      {filteredChallenges.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {activeFilter === 'all' ? '' : activeFilter} challenges available
            </h3>
            <p className="text-gray-500">
              Check back soon for new challenges to earn extra points and rewards!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}